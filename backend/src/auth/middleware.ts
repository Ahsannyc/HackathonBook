import { auth } from "./better-auth-config";

/**
 * Authentication Middleware
 *
 * This middleware handles authentication for API routes and ensures
 * that only authenticated users can access protected resources.
 * It's designed to work with GitHub Pages deployment.
 */

export const authenticationMiddleware = async (req: any, res: any, next: any) => {
  try {
    // Extract the session token from cookies or headers
    const token = req.cookies['authjs.session-token'] ||
                  req.headers.authorization?.replace('Bearer ', '') ||
                  req.headers['x-auth-token'];

    if (!token) {
      // No token provided - user is not authenticated
      res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
      return;
    }

    // Verify the session using Better Auth
    const session = await auth.$ctx.getSessionFromToken(token);

    if (!session || session.expiresAt < new Date()) {
      // Invalid or expired session
      res.status(401).json({
        error: 'Invalid session',
        message: 'Session has expired. Please log in again.'
      });
      return;
    }

    // Add user information to the request object for downstream handlers
    req.user = session.user;
    req.session = session;

    // Continue with the request
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Unable to verify authentication token'
    });
  }
};

/**
 * Protected Route Handler
 *
 * A higher-order function that wraps route handlers to ensure
 * they can only be accessed by authenticated users
 */
export const withAuth = (handler: any) => {
  return async (req: any, res: any) => {
    try {
      // Extract the session token from cookies or headers
      const token = req.cookies['authjs.session-token'] ||
                    req.headers.authorization?.replace('Bearer ', '') ||
                    req.headers['x-auth-token'];

      if (!token) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
      }

      // Verify the session using Better Auth
      const session = await auth.$ctx.getSessionFromToken(token);

      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Session has expired. Please log in again.'
        });
      }

      // Add user information to the request object
      req.user = session.user;
      req.session = session;

      // Call the original handler with the authenticated context
      return await handler(req, res);
    } catch (error) {
      console.error('Protected route error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while processing your request'
      });
    }
  };
};

export default authenticationMiddleware;