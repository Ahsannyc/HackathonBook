# HackathonBook

Physical AI & Humanoid Robotics - An AI-native textbook for the future of robotics

## Overview

This project combines a Docusaurus-based textbook with an authentication system and RAG chatbot for personalized learning experiences. The application is designed as a full-stack system with:

- **Frontend**: Docusaurus-based textbook deployed to GitHub Pages
- **Backend**: Express server with Better Auth for authentication
- **Database**: SQLite (in-memory for GitHub Pages compatibility)

## Architecture

The application follows a decoupled architecture:

- The frontend (book) is served as static files via GitHub Pages
- The backend (authentication API) must be deployed separately to handle user authentication
- API calls from the frontend are directed to the backend server

## Deployment

### Frontend (GitHub Pages)

The frontend textbook is deployed to GitHub Pages using the existing workflow.

### Backend (Authentication Server)

The backend server needs to be deployed separately to handle authentication requests. See `BACKEND_DEPLOYMENT.md` for detailed instructions.

## Environment Configuration

To connect the frontend to the deployed backend:

1. Deploy the backend server to a platform like Railway, Render, or Vercel
2. Set the `REACT_APP_API_BASE_URL` environment variable to point to your deployed backend
3. The frontend will then make authentication API calls to your backend server instead of the GitHub Pages domain

## Features

- User authentication with Better Auth
- Personalized content based on user background
- RAG chatbot for content interaction
- GitHub Pages deployment for static content

## Local Development

To run the application locally:

1. Start the backend server:
   ```bash
   npm run dev:backend
   ```

2. Start the frontend:
   ```bash
   npm run dev:frontend
   ```

## Contributing

See the individual components for specific contribution guidelines.