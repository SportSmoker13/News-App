// lib/utils/search.js
import Fuse from "fuse.js";

// Create a cache for search indices
const searchCache = new Map();

export function fuzzySearch(items, keys, query) {
  if (!query) return items;
  
  // Create cache key
  const cacheKey = `${keys.join('-')}-${items.length}`;
  
  // Get or create index
  let fuse = searchCache.get(cacheKey);
  if (!fuse) {
    fuse = new Fuse(items, {
      keys,
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });
    searchCache.set(cacheKey, fuse);
  }
  
  return fuse.search(query).map(r => r.item);
}