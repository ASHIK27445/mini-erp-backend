# Project Setup & Installation Guide — Backend (server)

This document explains how to set up and run the backend locally.

Prerequisites
- Node.js (v16+) and npm/yarn
- MongoDB (local or remote)
- Git

Install
1. Open a terminal and change to the server folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
# or
# yarn
```

Environment
- Create a `.env` file in the `server` folder with the following values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini-erp
JWT_SECRET=your_jwt_secret_here
```

Run
- Start the server in development:

```bash
npm run dev
# or
# yarn dev
```

Notes
- The server exposes API endpoints under `/api/v1`.
- Static uploads are served from `/uploads` (if local multer storage used).
- For production, use a managed DB, secure JWT secrets, and set `NODE_ENV=production`.

Troubleshooting
- `npm run dev` failing with exit code 127 usually indicates an environment/command issue — ensure `node` and `npm` are present in PATH.
- Check `server/src/app.ts` for middleware and routes.

Contact
- Share server logs (stderr/stdout) when reporting issues.
