const  RedisClient = require("../config/redis_config.js");

const clearTaskCache = async (userId) => {
  try {
    const keys = await RedisClient.keys(`tasks:${userId}:*`);


      if (keys.length > 0) {
    await RedisClient.del(...keys);
}


    console.log("✅ Task cache cleared");
  } catch (err) {
    console.log("Cache Error:", err.message);
  }
};

module.exports = {
  clearTaskCache,
};