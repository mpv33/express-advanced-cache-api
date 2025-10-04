# 🚀 Express Advanced Cache API (TypeScript)

A high-performance **Express.js + TypeScript API** that simulates user data retrieval with advanced caching, rate limiting, and asynchronous processing.
Now live at 👉 **[https://express-advanced-cache-api.vercel.app](https://express-advanced-cache-api.vercel.app/)**

---

## ✨ Features

* **⚡ High-Performance API** built with Express.js + TypeScript.
* **🧠 LRU In-Memory Cache (60s TTL)** with:

  * Auto-purging of stale entries.
  * Real-time stats (hits, misses, average response time).
* **🔄 Concurrent Request Deduplication** — multiple requests for the same user share a single in-flight DB fetch.
* **🧵 Async DB Simulation** — a simple queue mimics database fetch latency (200ms delay).
* **🚦 Rate Limiting** — per-IP limit of **10 requests/minute** with a **burst capacity** of 5 requests per 10 seconds.
* **🧰 Developer Friendly**

  * Fully typed with TypeScript (`strict` mode).
  * Modular, readable structure.
  * Ready-to-run locally or deploy to Vercel.

---

## 🌐 Live Demo

🔗 **Production URL:**
👉 [https://express-advanced-cache-api.vercel.app](https://express-advanced-cache-api.vercel.app/)

You can open the link above in your browser — it shows a **landing route** with all API endpoints and testing instructions.

---

## 🧭 API Endpoints

| Method     | Endpoint        | Description                                                    |
| :--------- | :-------------- | :------------------------------------------------------------- |
| **GET**    | `/`             | Landing route showing available endpoints and usage examples   |
| **GET**    | `/users/:id`    | Fetch user by ID — cached for 60s; simulated DB delay of 200ms |
| **POST**   | `/users`        | Create new mock user (`{ name, email }`) and cache it          |
| **DELETE** | `/cache`        | Clear the entire cache                                         |
| **GET**    | `/cache-status` | View cache stats (hits, misses, size, avg response time)       |

---

## 🧑‍💻 Quick Start (Local Setup)

### 1️⃣ Install Dependencies

```bash
git clone https://github.com/your-username/express-advanced-cache-api.git
cd express-advanced-cache-api
pnpm install   # or npm install
```

### 2️⃣ Run the Server

```bash
pnpm dev
```

Server starts at 👉 **[http://localhost:8000](http://localhost:8000)**

---

## 🧪 Testing the API (curl / Postman)

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
  Uses `lru-cache` with 60s TTL + background cleanup for expired entries.

* **Asynchronous Queue:**
  Simulates a 200ms database delay using a simple promise-based queue.

* **Concurrent Requests:**
  All requests for the same user ID share one in-flight Promise to avoid duplicate DB fetches.

* **Rate Limiting:**
  Timestamp-based sliding window limiter:

  * 10 requests/min per IP
  * 5-request burst every 10 seconds
    Returns `429 Too Many Requests` when exceeded.

---

## 🧩 Project Structure

```
express-advanced-cache-api/
├─ src/
│  ├─ index.ts               # Main Express app and routes
│  └─ services/
│     ├─ cache.ts            # LRU cache + TTL logic
│     ├─ mockData.ts         # Mock user data & simulated DB
│     ├─ queue.ts            # Async queue abstraction
│     └─ rateLimiter.ts      # In-memory rate limiter
├─ package.json
├─ tsconfig.json
├─ .gitignore
└─ README.md
```

---

## 🧱 Technical Notes

* Built with **TypeScript strict mode** for reliability.
* `lru-cache` handles TTL + least-recently-used eviction efficiently.
* In-memory rate limiter — perfect for single-instance use.
* Easily extendable for:

  * Redis-based distributed caching
  * `rate-limiter-flexible` for global throttling
  * Prometheus or Grafana monitoring

---

## 🧠 Example Landing Route

When visiting the root route `/`, you’ll see a helpful API guide like this:

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

MIT License © 2025 Mateshwari verma
Live Demo: [https://express-advanced-cache-api.vercel.app](https://express-advanced-cache-api.vercel.app/)

