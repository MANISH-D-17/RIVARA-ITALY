
# RIVARA ITALY - Production Backend

## 🚀 Setup & Installation
1. `npm install`
2. Create `.env` file based on `.env.example`.
3. Ensure `MONGODB_URI` is correct.
4. Set `JWT_SECRET` to a long random string.
5. Run `npm run start` or `npm run dev`.

## 👑 Sovereign Credentials
- Email: `manishishaa17@gmail.com`
- Any user registering with this email automatically inherits the `admin` role and `Sovereign` tier.

## 🔐 Security Protocols
- **JWT Protection**: All sensitive routes require a Bearer token.
- **Admin Lock**: Product creation, editing, and deletion are restricted to users with `role: admin`.
- **Input Validation**: NoSQL injection protection and body size limiting implemented.

## 📦 Deployment Instructions (Render / Railway)
1. Link your GitHub repository.
2. Set Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `NODE_ENV=production`
3. Root Directory: `.`
4. Build Command: `npm install`
5. Start Command: `node server.js`

## 🚨 Google Auth Fix
If you see `origin_mismatch`:
1. Go to Google Cloud Console.
2. Add your frontend URL (e.g., `http://localhost:5173`) to **Authorized JavaScript Origins**.
