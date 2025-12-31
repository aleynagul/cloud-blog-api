import redisClient from "./src/config/redis.js";

await redisClient.set("test", "Merhaba Redis");
const value = await redisClient.get("test");

console.log(value); 
process.exit(0);