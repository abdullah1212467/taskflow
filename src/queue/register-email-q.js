const { Queue } = require("bullmq");
const redisConnection = require("../config/redis_config.js");

const emailQueue = new Queue("emailQueue", {
    connection: redisConnection,
});

module.exports = emailQueue;