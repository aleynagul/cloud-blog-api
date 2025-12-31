import redisClient from "../config/redis.js";

export const blacklistToken = async (token, expSeconds) => {
  await redisClient.setEx(
    `blacklist:${token}`,
    expSeconds,
    "true"
  );
};

export const isTokenBlacklisted = async (token) => {
  const exists = await redisClient.exists(`blacklist:${token}`);
  return exists === 1;
};
