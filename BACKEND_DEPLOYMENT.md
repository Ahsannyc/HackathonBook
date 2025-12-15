# HackathonBook Backend Deployment Guide

This guide explains how to deploy the backend server for the HackathonBook authentication system.

## Deployment Options

### Option 1: Deploy to Railway (Recommended)

1. Sign up at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Create a new project and select this repository
4. Railway will automatically detect the `railway.toml` configuration
5. Add the required environment variables:
   - `GITHUB_PAGES_URL`: Your GitHub Pages URL (e.g., `https://your-username.github.io/HackathonBook`)
   - `FRONTEND_URL`: Your frontend URL (if different from GitHub Pages)
   - `NODE_ENV`: `production`
6. Deploy the project

### Option 2: Deploy to Render

1. Sign up at [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Use the Dockerfile in this repository
5. Set the environment variables:
   - `GITHUB_PAGES_URL`: Your GitHub Pages URL
   - `FRONTEND_URL`: Your frontend URL
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or as required by Render)
6. Deploy the service

### Option 3: Manual Deployment

1. Build the backend:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. Set environment variables:
   ```bash
   export GITHUB_PAGES_URL=https://your-username.github.io/HackathonBook
   export FRONTEND_URL=https://your-frontend-domain.com
   export NODE_ENV=production
   export PORT=8080
   ```

3. Start the server:
   ```bash
   node backend/dist/server.js
   ```

## Frontend Configuration

After deploying the backend, update your frontend to point to the deployed backend:

1. In your GitHub Pages deployment, set the environment variable:
   ```
   REACT_APP_API_BASE_URL=https://your-deployed-backend-url.onrender.com
   ```

Or update your Docusaurus configuration to set this as a global variable.

## Environment Variables

Required environment variables for the backend:

- `NODE_ENV`: Set to `production` for production deployments
- `PORT`: Port number for the server (default: 3000)
- `GITHUB_PAGES_URL`: The URL of your GitHub Pages site
- `FRONTEND_URL`: The URL of your frontend (if different from GitHub Pages)
- `CORS_ORIGIN`: Additional CORS origin if needed
- `DATABASE_URL`: Database URL (default: `:memory:` for in-memory database)

## Testing the Deployment

After deployment, you can test the backend by visiting:
- `https://your-deployed-backend-url/health` - Should return a health check response
- `https://your-deployed-backend-url/api/auth/` - Should return available endpoints

## Troubleshooting

If authentication still doesn't work after deployment:

1. Check that CORS is properly configured with your frontend URL
2. Verify that the API calls from the frontend are pointing to the correct backend URL
3. Ensure cookies are being set with the proper domain and security settings
4. Check the browser console for any CORS or network errors