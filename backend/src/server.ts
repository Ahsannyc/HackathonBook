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
import path from 'path';
import authRoutes from './auth/routes';
import ragProxyRoutes from './services/rag-proxy';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';

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

// Serve static files from the built book directory
app.use(express.static('../book/build'));

// Fallback route to serve the main index.html for client-side routing
// This enables the frontend routing to work properly
app.get('*', (req, res) => {
  // If it's an API request, return the API endpoints list
  if (req.path.startsWith('/api/') || req.path.startsWith('/rag/') || req.path === '/health') {
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
  } else {
    // For all other routes, serve the index.html to allow client-side routing
    res.sendFile(path.join(__dirname, '../../book/build', 'index.html'));
  }
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`GitHub Pages URL: ${process.env.GITHUB_PAGES_URL || 'not set'}`);
});

server.on('error', (err: any) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Start with a different PORT or stop the process using it.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

export { server };
export default app;