# Article Hub

A full-stack article management system with admin panel and student portal.

## 🚀 Deployment Guide

### Frontend (Vercel)

1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

3. **Environment Variables:**
   Add these in Vercel dashboard:
   ```
   VITE_GEMINI_API_KEY=AIzaSyDfO3oWskF7Pj99ua_72pZxEDQgfGEl8Fo
   ```

4. **Update API URL:**
   After deploying backend, update `frontend/src/config/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.PROD 
     ? 'https://your-actual-backend-url.onrender.com' 
     : 'http://localhost:8080';
   ```

### Backend (Render)

1. **Push your code to GitHub**
2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Select the `articlehub-backend-master` folder as the root directory

3. **Build Settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 18 or higher

4. **Environment Variables:**
   Add these in Render dashboard:
   ```
   PORT=8080
   MONGODB_URI=your_mongodb_atlas_connection_string
   ACCESS_TOKEN=your_jwt_secret_key_here
   NODE_ENV=production
   ```

5. **MongoDB Setup:**
   - Create a MongoDB Atlas account
   - Create a cluster and get connection string
   - Add your Render IP to MongoDB whitelist (or use 0.0.0.0/0 for all IPs)

## 🔧 Local Development

### Backend
```bash
cd articlehub-backend-master
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Features

- **Admin Panel:** User management, categories, branches, articles
- **Student Portal:** View articles by branch, download PDFs
- **AI Integration:** Gemini API for content generation
- **Rich Text Editor:** With image upload and link support
- **Real-time Chat:** Between students and admin
- **Authentication:** JWT-based auth system

## 🔐 Default Admin Credentials

- **Email:** admin@gmail.com
- **Password:** admin

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB
- **AI:** Google Gemini API
- **Deployment:** Vercel (Frontend) + Render (Backend)