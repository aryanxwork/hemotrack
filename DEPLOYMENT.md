# HemoTrack Deployment Guide

Follow these steps to take your application from your local PC to the internet.

## 1. Push Code to GitHub
1. Create a new **Private** repository on GitHub named `hemotrack`.
2. In your local terminal (root directory):
   ```bash
   git init
   git add .
   git commit -m "Prepare for deployment"
   git remote add origin https://github.com/YOUR_USERNAME/hemotrack.git
   git push -u origin main
   ```

## 2. Deploy the Backend (Render.com)
1. Sign up at [Render.com](https://render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository.
4. Render will detect the `render.yaml` file and automatically:
   - Create a **PostgreSQL** database.
   - Deploy your **Node.js** API.
5. Once deployed, copy your Service URL (e.g., `https://hemotrack-api.onrender.com`).
6. Go to the "Environment" tab of your service and add:
   - `JWT_SECRET`: (Your secret key)
   - `CORS_ORIGIN`: `https://your-frontend-url.vercel.app` (You'll get this in the next step)

## 3. Deploy the Frontend (Vercel)
1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. In the "Environment Variables" section, add:
   - `VITE_API_URL`: `https://hemotrack-api.onrender.com/api` (The URL from Step 2)
5. Click **Deploy**.

## 4. Final Sync
1. Once Vercel gives you your frontend URL (e.g., `https://hemotrack.vercel.app`), go back to Render.
2. Update the `CORS_ORIGIN` environment variable in Render with your new Vercel URL.
3. Your app is now live!

## Database Migration (One-time)
To seed your production database with initial data:
1. On Render, go to your Shell tab.
2. Run: `npm run seed`
