import { Request, Response, NextFunction } from "express";

/**
 * In-memory rate limiter with:
 * - 10 requests per 60 seconds
 * - burst allowance: 5 requests per 10 seconds
 *
 * This uses timestamp arrays per IP. This is simple and suitable only for single-instance apps.
 */

type Timestamps = number[];

const WINDOW_MS = 60_000;
const WINDOW_LIMIT = 10;
const BURST_MS = 10_000;
const BURST_LIMIT = 5;

const store = new Map<string, Timestamps>();

export function createRateLimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.ip || (req.connection && (req.connection as any).remoteAddress) || "global") as string;
    const now = Date.now();
    let arr = store.get(ip);
    if (!arr) { arr = []; store.set(ip, arr); }

    // remove old timestamps beyond WINDOW_MS
    while (arr.length && arr[0] <= now - WINDOW_MS) arr.shift();

    // count in burst window
    const recentBurst = arr.filter(t => t > now - BURST_MS).length;

    if (arr.length >= WINDOW_LIMIT && recentBurst >= BURST_LIMIT) {
      res.status(429).json({ error: "Too many requests. Rate limit exceeded." });
      return;
    }

    // allow and record
    arr.push(now);
    // keep store bounded
    if (arr.length > WINDOW_LIMIT * 2) arr.splice(0, arr.length - WINDOW_LIMIT*2);
    next();
  };
}
