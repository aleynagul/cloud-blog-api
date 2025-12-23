const cache = new Map();
const timestamps = new Map();

const DEFAULT_TTL = 60 * 1000; 

export function getCache(key) {
  const cachedValue = cache.get(key);
  const cachedTime = timestamps.get(key);

  if (!cachedValue || !cachedTime) return null;

  const isExpired = Date.now() - cachedTime > DEFAULT_TTL;
  if (isExpired) {
    cache.delete(key);
    timestamps.delete(key);
    return null;
  }

  return cachedValue;
}

export function setCache(key, value) {
  cache.set(key, value);
  timestamps.set(key, Date.now());
}

export function clearCache(key) {
  cache.delete(key);
  timestamps.delete(key);
}
