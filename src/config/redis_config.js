const Redis = require("ioredis");

const RedisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null
});

RedisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

RedisClient.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});

module.exports = RedisClient;