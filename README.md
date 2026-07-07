# Mini ERP — Backend (Server)

A REST API backend for a Mini Inventory & Sales Management System, built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**. It provides JWT-based authentication, role-based access control, product and sales management with atomic stock handling, and a dashboard summary endpoint.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Query Features (Filtering, Sorting, Pagination)](#query-features-filtering-sorting-pagination)
- [Error Handling](#error-handling)
- [Deployment (Vercel)](#deployment-vercel)
- [Image Uploads](#image-uploads)
- [Seed Data](#seed-data)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Token (JWT) + bcrypt |
| Validation | Zod |
| File Handling | Multer (legacy/local dev only) |
| Deployment | Vercel (serverless functions) |

---

## Project Structure

```
server/
├── api/
│   └── index.ts              # Vercel serverless entry point
├── src/
│   ├── app.ts                 # Express app, middleware, route mounting
│   ├── server.ts               # Local dev server bootstrap (app.listen)
│   ├── db.ts                   # MongoDB connection logic
│   ├── seed.ts                 # Admin user / sample data seeding
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # JWT verification
│   │   ├── role.middleware.ts       # Role-based access control
│   │   ├── error.middleware.ts      # Global error handler
│   │   ├── notFound.middleware.ts   # 404 handler
│   │   └── upload.middleware.ts     # Multer config (local dev)
│   │
│   ├── modules/
│   │   ├── auth/          # login, JWT issuance
│   │   ├── user/           # user model & interface
│   │   ├── product/         # product CRUD, stock management
│   │   ├── sale/            # sales CRUD, atomic stock deduction
│   │   └── dashboard/       # summary/statistics endpoint
│   │
│   ├── routes/
│   │   └── index.ts          # central route registrar (/api/v1)
│   │
│   └── utils/
│       ├── ApiError.ts        # custom error class
│       ├── ApiResponse.ts     # standard success response shape
│       ├── catchAsync.ts      # async error wrapper
│       └── QueryBuilder.ts     # reusable filter/sort/paginate/search builder
│
├── vercel.json
├── package.json
├── tsconfig.json
└── .env
```

Each feature module follows a consistent pattern:
`*.route.ts` → `*.controller.ts` → `*.service.ts` → `*.model.ts` / `*.interface.ts`

---

## Prerequisites

- Node.js v18+ 
- npm
- A MongoDB database (local or MongoDB Atlas)

---

## Installation & Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd server

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# then fill in the actual values (see Environment Variables below)

# 4. (Optional) Seed the database with a default admin user
npm run seed

# 5. Run the development server
npm run dev
```

The API will be available at:
```
http://localhost:5000/api/v1
```

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for local dev server | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key used to sign JWTs | a long random string |
| `JWT_EXPIRES_IN` | JWT token expiry duration | `7d` |

> ⚠️ Never commit `.env` to version control. Confirm it is listed in `.gitignore`. If a secret is ever accidentally exposed (e.g. shared, committed, or pasted somewhere public), rotate it immediately in MongoDB Atlas / regenerate the JWT secret.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Runs the server locally with hot-reload (`ts-node-dev`) |
| `build` | `npm run build` | Compiles TypeScript to `dist/` |
| `start` | `npm start` | Runs the compiled build (`dist/server.js`) |
| `seed` | `npm run seed` | Seeds an initial admin user into the database |

---

## Authentication & Authorization

**Authentication** is JWT-based. On successful login, the API returns a signed token containing the user's `id` and `role`.

Include the token on protected routes via the `Authorization` header:
```
Authorization: Bearer <token>
```

**Authorization** is role-based, enforced via `role.middleware.ts`. Supported roles:
- `admin`
- `manager`
- `employee`

Routes are protected using a combination of:
```ts
router.use(authenticate);                 // requires valid JWT
router.use(authorize("admin", "manager")); // requires specific role(s)
```

---

## API Documentation

**Base URL:** `/api/v1`

### Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Returns API status |

**Response**
```json
{ "success": true, "message": "Mini ERP API is running" }
```

---

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Authenticates a user, returns JWT + user info |

**Request Body**
```json
{
  "email": "admin@mini-erp.com",
  "password": "admin123"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "665f1c2e8a1b2c0012345678",
      "name": "Admin User",
      "email": "admin@mini-erp.com",
      "role": "admin"
    }
  }
}
```

---

### Products

> ℹ️ The exact route handlers live in `modules/product/`. Endpoints below follow the standard CRUD pattern used throughout the codebase — verify against `product.route.ts` for exact paths/permissions.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Authenticated | List all products (supports filter/sort/paginate/search — see below) |
| GET | `/products/:id` | Authenticated | Get a single product by ID |
| POST | `/products` | admin, manager | Create a new product |
| PATCH | `/products/:id` | admin, manager | Update a product |
| DELETE | `/products/:id` | admin | Delete a product |

**Sample Product Body**
```json
{
  "name": "Wireless Mouse",
  "sku": "WM-1001",
  "price": 550,
  "stock": 100,
  "category": "Electronics"
}
```

---

### Sales

> ℹ️ Verify exact paths/permissions against `sale.route.ts`. Sales creation deducts stock atomically from the linked product.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/sales` | Authenticated | List all sales (supports filter/sort/paginate) |
| GET | `/sales/:id` | Authenticated | Get a single sale by ID |
| POST | `/sales` | admin, manager, employee | Record a new sale (atomically decrements product stock) |
| DELETE | `/sales/:id` | admin | Delete/void a sale record |

**Sample Sale Body**
```json
{
  "product": "665f1c2e8a1b2c0012345678",
  "quantity": 2,
  "unitPrice": 550
}
```

---

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Authenticated | Returns summary statistics (e.g. total products, total sales, revenue, low-stock alerts) |

---

## Query Features (Filtering, Sorting, Pagination)

List endpoints (`/products`, `/sales`) support query parameters via the shared `QueryBuilder` utility:

| Param | Example | Description |
|---|---|---|
| `search` | `?search=mouse` | Text search across configured fields |
| `sort` | `?sort=-price` | Sort ascending (`price`) or descending (`-price`) |
| `page` | `?page=2` | Pagination page number |
| `limit` | `?limit=10` | Results per page |
| field filters | `?category=Electronics` | Filter by any indexed field directly |

Example:
```
GET /api/v1/products?search=mouse&sort=-price&page=1&limit=10
```

---

## Error Handling

All errors are returned in a consistent shape via the global error handler:

```json
{
  "success": false,
  "message": "Invalid credentials",
  "stack": "... (only present when NODE_ENV=development)"
}
```

| Status | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Missing/invalid/expired token, invalid credentials |
| 403 | Insufficient role permissions |
| 404 | Route or resource not found |
| 409 | Duplicate field (e.g. email already exists) |
| 500 | Unhandled server error |

---

## Deployment (Vercel)

This project deploys as a **Vercel Serverless Function**, not a long-running server.

- Entry point: `api/index.ts` — wraps the Express `app` with `serverless-http` and lazily connects to MongoDB (connection is cached across warm invocations).
- `vercel.json` routes all traffic to `api/index.ts`.
- **Vercel Project Root Directory** must point to the `server/` folder (not `dist`).
- Environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`) must be set directly in the Vercel dashboard/CLI — the local `.env` file is never deployed.
- MongoDB Atlas **Network Access** must allow `0.0.0.0/0`, since Vercel functions run on dynamic IPs.

```bash
vercel env add MONGO_URI production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel --prod
```

---

## Image Uploads

> Local `multer` disk storage (`upload.middleware.ts`) was used during early development but is **not compatible with Vercel's serverless filesystem** (read-only, ephemeral). The current flow instead uploads images directly from the client to **ImgBB**, and only the returned image URL is saved on the product document — no server-side file handling in production.

---

## Seed Data

Run once after setting up your database to create a default admin account:

```bash
npm run seed
```

Creates:
```
email: admin@mini-erp.com
password: ************
role: admin
```

> ⚠️ Change this password immediately after first login in any real deployment.

---

## License

ISC