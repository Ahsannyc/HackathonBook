import express from 'express';
import { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Get RAG backend URL from environment, default to local Python backend
const RAG_BACKEND_URL = process.env.RAG_BACKEND_URL || 'http://localhost:8000';

/**
 * Proxy middleware to forward requests to RAG backend
 */
const proxyToRagBackend = async (req: Request, res: Response, endpoint: string) => {
  try {
    // Extract authorization token from headers
    const authHeader = req.headers.authorization;

    // Prepare the request to the RAG backend
    const ragResponse = await axios({
      method: req.method,
      url: `${RAG_BACKEND_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      data: req.body,
      timeout: 30000, // 30 second timeout
    });

    // Forward the response from RAG backend to the frontend
    res.status(ragResponse.status).json(ragResponse.data);
  } catch (error: any) {
    console.error(`Error proxying to RAG backend (${endpoint}):`, error.message);

    // Handle different types of errors from the RAG backend
    if (error.response) {
      // If RAG backend returned an error response, forward it
      res.status(error.response.status).json({
        error: error.response.data?.detail || error.response.data?.error || 'RAG backend error',
        message: error.message,
      });
    } else if (error.request) {
      // If there was a network error connecting to RAG backend
      res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to RAG backend service',
      });
    } else {
      // If there was an error setting up the request
      res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while processing your request',
      });
    }
  }
};

/**
 * General RAG query endpoint
 */
router.post('/query', async (req, res) => {
  await proxyToRagBackend(req, res, '/rag/query');
});

/**
 * Selected text query endpoint
 */
router.post('/selected_text_query', async (req, res) => {
  await proxyToRagBackend(req, res, '/rag/selected_text_query');
});

/**
 * Health check for RAG backend
 */
router.get('/health', async (req, res) => {
  try {
    const ragResponse = await axios.get(`${RAG_BACKEND_URL}/health`, {
      timeout: 5000,
    });

    res.status(200).json({
      status: 'healthy',
      ragBackend: ragResponse.data,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      message: 'RAG backend is not responding',
    });
  }
});

export default router;