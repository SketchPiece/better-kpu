/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { kv } from "@vercel/kv";

export default async function cache<T extends () => any>(
  key: string,
  fn: T,
): Promise<ReturnType<T>> {
  const cached = await kv.get(key);
  if (cached) return cached as unknown as ReturnType<T>;
  const result = await fn();
  await kv.set(key, result, {
    ex: 60 * 60 * 24,
  });
  return result;
}
