const reminderQueue = require("../queue/reminder-queue.js");

const scheduleReminder = async (task) => {

    const delay = new Date(task.reminderAt).getTime() - Date.now();
    console.log(delay)
    if (delay <= 0) {
        throw new Error("Reminder time must be in the future.");
    }

    const job = await reminderQueue.add(
        "sendReminder",
        {
            taskId: task._id,
        },
        {
    delay,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  }
    );

    task.jobId = job.id;

    await task.save();
};

const updateReminder = async (task) => {
  console.log("Updating reminder...");

  const oldJob = await reminderQueue.getJob(task.jobId);

  if (oldJob) {
    console.log("Old Job Found:", oldJob.id);
    await oldJob.remove();
  } else {
    console.log("Old Job NOT Found");
  }

  await scheduleReminder(task);
};

const removeReminder = async (jobId) => {
    if (!jobId) {
        return;
    }
        const job = await reminderQueue.getJob(jobId);
    if (job) {
        await job.remove();
    }
};

module.exports =  {scheduleReminder ,
    updateReminder,
    removeReminder,
}