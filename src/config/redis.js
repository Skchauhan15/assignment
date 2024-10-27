const redis = require("redis");

// Create Redis client and set up event listeners
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
});

// Event listener for a successful connection
redisClient.on("ready", () => {
  console.log("Redis client is ready and connected.");
});

// Event listener for connection success (alternative to 'ready')
redisClient.on("connect", () => {
  console.log("Connected to Redis server.");
});

// Event listener for connection errors
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Ensure Redis connects successfully
redisClient.connect().catch((err) => console.error("Error connecting to Redis:", err));

module.exports = redisClient;
