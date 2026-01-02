# Deploying MERN Contact App

## 1. Backend Deployment (Render)

1.  Push your code to GitHub (ensure `backend` and `frontend` folders are in the repo).
2.  Go to [Render](https://render.com) and create a new **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Root Directory:** `backend`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
5.  Add Environment Variables:
    *   `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
    *   `PORT`: `5000` (Render might override this, which is fine as our code uses `process.env.PORT`).
6.  Deploy! Once successful, copy the **Render URL** (e.g., `https://your-app.onrender.com`).

## 2. Frontend Deployment (Vercel)

1.  Push your code to GitHub (same repo).
2.  Go to [Vercel](https://vercel.com) and add a **New Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Root Directory:** `frontend`
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build` (default)
    *   **Output Directory:** `dist` (default)
5.  **Important:** Add Environment Variable:
    *   `VITE_API_BASE_URL`: Paste your Render Backend URL here + `/api` (e.g., `https://your-app.onrender.com/api`).
    *   Note: Do not include a trailing slash unless your code expects it (our code handles it, but `.../api` is best).
6.  Deploy!

## 3. Local Development

1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  Create `.env` in `backend` with `MONGO_URI`.
4.  Create `.env` in `frontend` with `VITE_API_BASE_URL=http://localhost:5000/api`.
