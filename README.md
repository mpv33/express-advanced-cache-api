
# 🚀 Express User API (TypeScript)

A high-performance **Express.js + TypeScript API** that simulates user data retrieval with advanced caching, rate limiting, and async processing.

---

## ✨ Features

* **⚡ High-Performance API** built with Express.js + TypeScript.
* **🧠 LRU In-Memory Cache (60s TTL)** using `lru-cache` with:

  * Auto-purging of stale entries.
  * Real-time stats (hits, misses, average response time).
* **🔄 Concurrent Request Deduplication** — multiple requests for the same user share one in-flight DB call.
* **🧵 Async DB Simulation** — a simple queue mimics database fetch latency (200ms delay).
* **🚦 Rate Limiting** — per-IP limit of **10 requests/min** with **burst capacity** of 5 requests in 10 seconds.
* **🧰 Developer Friendly**

  * Fully typed with TypeScript (`strict` mode).
  * Modular and maintainable folder structure.
  * Ready-to-run with a single command.

---

## 🧭 API Endpoints

| Method     | Endpoint        | Description                                                      |
| :--------- | :-------------- | :--------------------------------------------------------------- |
| **GET**    | `/`             | Landing route showing available endpoints and usage instructions |
| **GET**    | `/users/:id`    | Fetch user by ID — cached for 60s; simulated DB delay of 200ms   |
| **POST**   | `/users`        | Create new mock user (JSON: `{ name, email }`); adds to cache    |
| **DELETE** | `/cache`        | Manually clear the entire cache                                  |
| **GET**    | `/cache-status` | View cache stats (hits, misses, size, avg response time)         |

---

## 🧑‍💻 Quick Start

### 1️⃣ Install Dependencies

```bash
git clone https://github.com/your-username/express-user-api.git
cd express-user-api
pnpm install   # or npm install
```

### 2️⃣ Run the Server

```bash
pnpm dev
```

The server starts at 👉 **[http://localhost:8000](http://localhost:8000)**

---

## 🧪 Test the API

### Fetch a user (first = DB, next = cache)

```bash
curl http://localhost:8000/users/1
```

### Create a new user

```bash
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@example.com"}'
```

### View cache statistics

```bash
curl http://localhost:8000/cache-status
```

### Clear the cache

```bash
curl -X DELETE http://localhost:8000/cache
```

---

## ⚙️ How It Works

* **Caching Layer:**
  Uses `lru-cache` with a 60s TTL and `setInterval()` background cleanup to remove stale entries.

* **Asynchronous Processing:**
  Each DB fetch is simulated with a 200ms delay via a simple queue abstraction.

* **Concurrent Requests:**
  In-flight requests for the same user are tracked in a `Map<string, Promise<User | null>>` — preventing redundant fetches.

* **Rate Limiting:**
  Implements a timestamp-based sliding window limiter allowing:

  * 10 requests per minute per IP
  * 5-request burst within 10 seconds
    Returns `429 Too Many Requests` if exceeded.

---

## 🧩 Project Structure

```
express-user-api/
├─ src/
│  ├─ index.ts               # Main Express app
│  └─ services/
│     ├─ cache.ts            # LRU cache with stats
│     ├─ mockData.ts         # Mock user data & DB simulation
│     ├─ queue.ts            # Async queue abstraction
│     └─ rateLimiter.ts      # In-memory rate limiter
├─ package.json
├─ tsconfig.json
├─ .gitignore
└─ README.md
```

---

## 🧱 Technical Notes

* Built with **TypeScript strict mode** enabled for reliability.
* `lru-cache` provides **LRU eviction** + **TTL expiration**.
* Rate limiting is **in-memory** (suitable for single-instance apps).
  Use Redis + `rate-limiter-flexible` for distributed environments.
* Async flow ensures non-blocking request handling.
* Ready for monitoring expansion (e.g., Prometheus metrics).

---

## 🧠 Example Landing Route

When visiting the root route `/`, you’ll see:

```json
{
  "message": "👋 Welcome to Express User API",
  "instructions": "Use the listed endpoints to test functionality.",
  "endpoints": {
    "GET /users/:id": "Fetch a user by ID (cached, DB simulated).",
    "POST /users": "Create new user (name, email).",
    "DELETE /cache": "Clear cache.",
    "GET /cache-status": "View cache stats."
  },
  "notes": {
    "rateLimiting": "10 req/min with burst of 5 per 10s.",
    "cache": "LRU cache (TTL 60s).",
    "concurrent": "Same ID requests are deduplicated."
  }
}
```

---

## 🧾 License

MIT License © 2025 Mateshwari

# express-advanced-cache-api
