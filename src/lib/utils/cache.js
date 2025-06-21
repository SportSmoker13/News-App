// lib/utils/cache.js
import { unstable_cache } from "next/cache";

export function createCachedQuery(queryFn, keyParts, options = {}) {
  return unstable_cache(
    queryFn,
    keyParts,
    {
      tags: keyParts,
      revalidate: 3600, // 1 hour
      ...options
    }
  );
}