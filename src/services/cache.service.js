import redisClient from "../config/redis.js";

//cache'den geri getirme
export const getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

//cache'ye veri yazma
export const setCache = async (key, value, ttl = 120) => {
  await redisClient.setEx(
    key,
    ttl,
    JSON.stringify(value)
  );
};

//cache'e temizleme
export const deleteCache = async (key) => {
  await redisClient.del(key);
};
