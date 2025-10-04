
// ✅ correct
import { LRUCache } from "lru-cache";

import { User } from "./mockData";

export class Cache {
  private cache: LRUCache<string, User>;
  private hits = 0;
  private misses = 0;
  private totalResponseTime = 0;
  private responseCount = 0;

  constructor(ttlMs: number) {
    this.cache = new LRUCache({ ttl: ttlMs, ttlAutopurge: false, max: 10000 });
    // background task to purge stale entries
    setInterval(() => {
      try { this.cache.purgeStale(); } catch (e) {}
    }, 5000);
  }

  get(key: string): User | undefined {
    const v = this.cache.get(key);
    if (v) this.hits++;
    else this.misses++;
    return v;
  }

  set(key: string, val: User) {
    this.cache.set(key, val);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  stats() {
    return { hits: this.hits, misses: this.misses, size: this.size() };
  }

  status() {
    const avg = this.responseCount ? (this.totalResponseTime / this.responseCount) : 0;
    return { hits: this.hits, misses: this.misses, size: this.size(), avgResponseTimeMs: avg.toFixed(2) };
  }

  recordResponseTime(ms: number) {
    this.totalResponseTime += ms;
    this.responseCount++;
  }
}
