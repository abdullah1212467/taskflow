const { Worker } = require("bullmq");
const redisConnection = require("../config/redis_config.js");
const Task = require("../models/task_model.js")
const User = require("../models/user_Model.js")
const sendEmail = require("../utils/sendEmail.js")

const reminderWorker = new Worker(
  "reminderQueue",
  async (job) => {
    try {
      const taskId = job.data.taskId;

      const task = await Task.findById(taskId);

      if (!task || task.isDeleted) {
        return;
      }
      if (task.status === "Completed") {
    return;
}
      const user = await User.findById(task.createdBy);

      if (!user) {
        return;
      }

      await sendEmail({
        to: user.email,
        subject: "Task Reminder",
       html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Task Reminder</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 0 15px rgba(0,0,0,.08);">

<div style="background:#2563eb;padding:25px;text-align:center;">
<h1 style="color:white;margin:0;">TaskFlow</h1>
</div>

<div style="padding:35px;">

<h2 style="color:#333;">⏰ Task Reminder</h2>

<p style="color:#555;font-size:16px;">
This is a friendly reminder that one of your tasks is due soon.
</p>

<div
style="
margin:30px auto;
padding:20px;
background:#f8f9fa;
border-left:5px solid #2563eb;
border-radius:8px;
">

<h3 style="margin:0;color:#2563eb;">
${task.title}
</h3>

${
  task.description
    ? `<p style="margin-top:12px;color:#555;">
        ${task.description}
      </p>`
    : ""
}

${
  task.dueDate
    ? `<p style="margin-top:15px;color:#555;">
        <strong>📅 Due Date:</strong>
        ${new Date(task.dueDate).toLocaleString()}
      </p>`
    : ""
}

${
  task.priority
    ? `<p style="color:#555;">
        <strong>🚩 Priority:</strong>
        ${task.priority}
      </p>`
    : ""
}

${
  task.category
    ? `<p style="color:#555;">
        <strong>📂 Category:</strong>
        ${task.category}
      </p>`
    : ""
}

</div>

<p style="color:#555;">
Stay productive and complete your task on time. 🚀
</p>

</div>

<div style="background:#f8f9fa;padding:20px;text-align:center;color:#777;font-size:13px;">
© ${new Date().getFullYear()} TaskFlow. All rights reserved.
</div>

</div>

</body>
</html>
`
      });

      task.jobId = null;
      await task.save();

      console.log("✅ Reminder Email Sent");
    } catch (error) {
      console.log("❌ Worker Error:", error.message);
    }
  },
  {
    connection: redisConnection,
  }
);

reminderWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

reminderWorker.on("failed", (job, err) => {
  console.log(`❌ Job ${job.id} failed`);
  console.log(err);
});