const Redis = require("ioredis");

const cacheInstance = new Redis({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD, 
});

cacheInstance.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

cacheInstance.on("error", (error) => {
  console.error("❌ Error connecting to Redis:", error);
});

module.exports = cacheInstance;
