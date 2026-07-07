const Redis = require("ioredis");

const RedisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

RedisClient.on("connect", () => {
  console.log("✅ Upstash Redis Connected");
});



RedisClient.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});

module.exports = RedisClient;