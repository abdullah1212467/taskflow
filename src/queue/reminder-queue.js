const { Queue } = require("bullmq");
const redisConnection = require("../config/redis_config.js");

const reminderQueue = new Queue("reminderQueue", {
  connection: redisConnection,
});

module.exports = reminderQueue;