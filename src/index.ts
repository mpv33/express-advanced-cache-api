import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Cache } from "./services/cache";
import { createRateLimiter } from "./services/rateLimiter";
import { createQueue } from "./services/queue";
import { mockUsers, User, addMockUser } from "./services/mockData";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

// setup cache (60s TTL)
const cache = new Cache(60_000);

// setup queue and in-flight map
const queue = createQueue();
const inFlight = new Map<string, Promise<User | null>>();

// rate limiter middleware
const rateLimiter = createRateLimiter();

app.use(rateLimiter);

// Landing route - shows all API endpoints
app.get("/", (req, res) => {
  res.json({
    message: "👋 Welcome to Express User API",
    instructions: "Use the following endpoints to test functionality.",
    endpoints: {
      "GET /users/:id": "Fetch a user by ID (cached, DB simulated with 200ms delay).",
      "POST /users": "Create a new user (JSON body: { name, email }) and cache it.",
      "DELETE /cache": "Clear the entire cache.",
      "GET /cache-status": "View cache hits, misses, size, and average response time.",
    },
    notes: {
      rateLimiting: "10 requests per minute per IP, with burst of 5 per 10s window.",
      cache: "LRU in-memory cache, TTL = 60s, with background cleanup.",
      concurrent: "Concurrent requests for the same user ID are deduplicated (first fetch is shared)."
    },
    quickTest: {
      fetchUser: "curl http://localhost:8000/users/1",
      createUser: 'curl -X POST http://localhost:8000/users -H "Content-Type: application/json" -d \'{"name":"Bob","email":"bob@example.com"}\'',
      cacheStatus: "curl http://localhost:8000/cache-status",
      clearCache: "curl -X DELETE http://localhost:8000/cache"
    }
  });
});


// GET /users/:id
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const start = Date.now();

  // check cache
  const cached = cache.get(id);
  if (cached) {
    cache.recordResponseTime(Date.now() - start);
    return res.json({ source: "cache", user: cached });
  }

  // if fetch already in-flight, wait for it
  let promise = inFlight.get(id);
  if (!promise) {
    promise = (async () => {
      try {
        // push to queue (simulated async DB)
        const user = await queue.fetchUser(id);
        if (!user) {
          return null;
        }
        // only set cache if not present (race avoidance)
        if (!cache.get(id)) cache.set(id, user);
        return user;
      } finally {
        inFlight.delete(id);
      }
    })();
    inFlight.set(id, promise);
  }

  try {
    const user = await promise;
    cache.recordResponseTime(Date.now() - start);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ source: "db", user });
  } catch (err) {
    return res.status(500).json({ error: "Internal error" });
  }
});

// POST /users
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email required" });
  const user = addMockUser(name, email);
  cache.set(String(user.id), user);
  return res.status(201).json({ user });
});

// DELETE /cache
app.delete("/cache", (req, res) => {
  cache.clear();
  return res.json({ ok: true });
});

// GET /cache-status
app.get("/cache-status", (req, res) => {
  const status = cache.status();
  return res.json(status);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
