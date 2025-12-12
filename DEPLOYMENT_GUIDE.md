# ScireCount Deployment Guide

This guide describes how to deploy the ScireCount platform to production using **Vercel** (Frontend), **Render** (Backend), and **PostgreSQL** (Database).

## Prerequisites
- A GitHub account.
- Accounts on [Vercel](https://vercel.com) and [Render](https://render.com).

---

## Part 1: Separate the Repositories (Optional but Recommended)
For easiest deployment, push this entire project to GitHub. Vercel and Render can both deploy from the same repository (Monorepo).

1. Initialize Git if you haven't:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub (e.g., `scirecount-platform`).
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USER/scirecount-platform.git
   git push -u origin main
   ```

---

## Part 2: Database (PostgreSQL)
We need a cloud database. Render offers a free PostgreSQL database.

1. Go to **Render Dashboard** -> **New +** -> **PostgreSQL**.
2. Name: `scirecount-db`.
3. Region: Choose one close to you (e.g., Frankfurt for EU).
4. Plan: **Free**.
5. Click **Create Database**.
6. Wait for it to be created.
7. **Copy the "Internal Connection URL"** (starts with `postgres://...`). You will need this for the Backend.

---

## Part 3: Backend (Render)
1. Go to **Render Dashboard** -> **New +** -> **Web Service**.
2. Connect your GitHub repository (`scirecount-platform`).
3. **Root Directory**: `backend` (Important!).
4. **Build Command**: `npm install`.
5. **Start Command**: `npm start`.
6. Plane: **Free**.
7. **Environment Variables** (Advanced):
   - Key: `DATABASE_URL`
   - Value: Paste the **Internal Connection URL** you copied from the Database step.
8. Click **Create Web Service**.
9. Wait for deployment to finish.
10. **Copy your Backend URL** (e.g., `https://scirecount-backend.onrender.com`).

---

## Part 4: Frontend (Vercel)
1. Go to **Vercel Dashboard** -> **Add New...** -> **Project**.
2. Import your GitHub repository (`scirecount-platform`).
3. **Build Output Settings**: Vercel usually detects Vite automatically.
   - Framework Preset: `Vite`
   - Root Directory: `./` (default is fine if package.json is in root).
4. **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: Paste your **Backend URL** from Part 3 (e.g., `https://scirecount-backend.onrender.com`).
   - *Note: Do not add a trailing slash `/`.*
5. Click **Deploy**.

---

## Part 5: Verify
1. Open your new Vercel URL.
2. The dashboard should load.
3. Because the production database is empty, you need to Seed it.
   - You can run the seed script locally pointing to the remote DB, OR
   - Connect to your Render backend terminal (via Render dashboard "Shell" tab) and run:
     ```bash
     node seed.js
     ```
4. Refresh your Vercel app. You should see the data!
