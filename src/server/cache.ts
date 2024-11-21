/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */

const cacheMap = new Map<string, any>();

export default async function cache<T extends () => any>(
  key: string,
  fn: T,
): Promise<ReturnType<T>> {
  const cached = cacheMap.get(key);
  if (cached) return cached as unknown as ReturnType<T>;
  const result = await fn();
  cacheMap.set(key, result);
  return result;
}
