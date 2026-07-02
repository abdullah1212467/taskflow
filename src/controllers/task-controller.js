const Task = require("../models//task_model.js");
const reminderQueue = require("../queue/reminder-queue.js");
const  {scheduleReminder ,updateReminder , removeReminder} = require("../services/reminder-service.js");
const RedisClient = require("../config/redis_config.js")
const { clearTaskCache } = require("../utils/cache.js");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      reminderAt,
      priority,
      category,
      repeat,
    } = req.body;

   if (!title || !dueDate || !reminderAt) {
  return res.status(400).json({
    success: false,
    message: "Title, Due Date and Reminder Date are required",
  });
}

    const task = await Task.create({
      title,
      description,
      dueDate,
      reminderAt,
      priority,
      category,
      repeat,
      createdBy: req.user._id,
    });

    
await scheduleReminder(task);
await clearTaskCache(req.user._id);

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyTasks = async (req, res) => {
  try {

    const {
  page = 1,
  status,
  priority,
  category,
  search,
  sort = "-createdAt"
} = req.query;

      const filter = {
  createdBy: req.user._id,
  isDeleted: false,
};

    if(status){
        filter.status = status
    }
    if(priority){
        filter.priority = priority
    }
    if (category) {
  filter.category = category;
}
    if (search) {
  filter.$or = [
    {
      title: {
        $regex: search,
        $options: "i",
      },
    },
    {
      description: {
        $regex: search,
        $options: "i",
      },
    },
  ];
}
  
    const limit = 10;
    const skip = (page - 1) * limit;
// cashing
const cacheKey = `tasks:${req.user._id}:${JSON.stringify(req.query)}`;
const cachedTasks = await RedisClient.get(cacheKey);
    if (cachedTasks) {
    return res.status(200).json({
        success: true,
        tasks: JSON.parse(cachedTasks),
        source: "Redis Cache"
    });
}

  const tasks = await Task.find(filter)
  .sort(sort)
  .skip(skip)
  .limit(limit);

   const totalTasks = await Task.countDocuments(filter);
 const response = {
      success: true,
      totalTasks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTasks / limit),
      count: tasks.length,
      tasks,
    };

    // Store in Redis for 60 seconds
    await RedisClient.set(
      cacheKey,
      JSON.stringify(response),
      "EX",
      60
    );


return res.status(200).json({
    source: "mongoDb",
...response
});
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `task:${req.user._id}:${id}`;

    // 1. Check Redis
    const cachedTask = await RedisClient.get(cacheKey);

    if (cachedTask) {
      return res.status(200).json({
        success: true,
        task: JSON.parse(cachedTask),
        source: "Redis Cache",
      });
    }

    // 2. Check MongoDB
    const task = await Task.findOne({
      _id: id,
      createdBy: req.user._id,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 3. Store in Redis
   await RedisClient.set(
  cacheKey,
  JSON.stringify(task),
  "EX",
  60
);

    // 4. Return response
    return res.status(200).json({
      success: true,
      task,
      source: "MongoDB",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      createdBy: req.user._id,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const {
      title,
      description,
      dueDate,
      reminderAt,
      priority,
      category,
      repeat,
      status,
    } = req.body;

    // Update only allowed fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (reminderAt !== undefined) task.reminderAt = reminderAt;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (repeat !== undefined) task.repeat = repeat;
    if (status !== undefined) task.status = status;

    await task.save();
    await clearTaskCache(req.user._id);
    if (task.reminderAt) {
    await updateReminder(task);
}
    return res.status(201).json({
      success: true,
      message: "Task updated successfully.",
      task,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      createdBy: req.user._id,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

   await  removeReminder(task.jobId)
   await clearTaskCache(req.user._id);
    task.isDeleted = true;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: task
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user._id,
      isDeleted: true,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const restoreTask = async (req, res) => {
  try {

    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      createdBy: req.user._id,
      isDeleted: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.isDeleted = false;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task restored successfully.",
      task,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
  createTask,
  getMyTasks,
  getSingleTask,
updateTask,
deleteTask,
getDeletedTasks,
restoreTask,

};