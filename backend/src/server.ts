import 'dotenv/config';

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './auth/routes';
import ragProxyRoutes from './services/rag-proxy';

const app = express();
const PORT = process.env.PORT || 3000;

// Debug environment variables
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('AUTH_SECRET exists:', !!process.env.AUTH_SECRET);

const allowedOrigins = (process.env.NODE_ENV === 'production'
  ? [
      process.env.GITHUB_PAGES_URL || 'https://your-username.github.io',
      process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app',
      process.env.CORS_ORIGIN
    ].filter((origin): origin is string => Boolean(origin)) // Remove any undefined/null values
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080'
    ]);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/rag', ragProxyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fallback route for GitHub Pages compatibility
// This ensures that non-API routes don't return 404 errors
app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This is an API endpoint. Please use the correct API path or visit the main application.',
    availableEndpoints: [
      '/health',
      '/api/auth/signup',
      '/api/auth/signin',
      '/api/auth/signout',
      '/api/auth/me',
      '/api/auth/user-background',
      '/api/auth/personalization',
      '/rag/query',
      '/rag/selected_text_query',
      '/rag/health'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`GitHub Pages URL: ${process.env.GITHUB_PAGES_URL || 'not set'}`);
});

export default app;