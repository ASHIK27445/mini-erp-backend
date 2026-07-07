# Mini ERP — Backend (server)

This is the backend API built with Node.js, Express and Mongoose. It provides product, sale, user and dashboard endpoints.

Quick Start

```bash
cd server
npm install
npm run dev
```

API Base URL
- Default: `http://localhost:5000/api/v1`

Important files
- `src/server.ts` — server bootstrap
- `src/app.ts` — express app and middleware
- `src/routes/index.ts` — route registration
- `src/modules/` — feature modules (auth, product, sale, dashboard, user)

Image uploads
- The app previously used `multer` for local uploads; current flow uploads images to ImgBB from the client and saves the image URL in the product document.

Testing & Seed Data
- `src/seed.ts` contains sample data seeding routines; run as needed.

Security
- Protect routes using JWT (`auth.middleware.ts`) and role checks (`role.middleware.ts`).

Deployment
- Use environment variables for DB URI and JWT secrets; store uploads in cloud storage for production.
