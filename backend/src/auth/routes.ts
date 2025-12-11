import express from 'express';
import { auth } from './better-auth-config';
import { authService } from '../services/auth-service';
import { personalizationService } from '../services/personalization-service';
import { authenticationMiddleware } from './middleware';
import {
  validateSignUpRequest,
  validateSignInRequest,
  validateUserBackgroundRequest
} from './route-validation';

const router = express.Router();

/**
 * Authentication API Routes
 *
 * Provides REST API endpoints for authentication functionality
 * compatible with Better Auth and GitHub Pages deployment
 */

// Sign up route with background questionnaire
router.post('/signup', validateSignUpRequest, async (req, res) => {
  try {
    const { email, password, name, softwareExperience, hardwareExperience, primaryFocus, backgroundDetails } = req.body;

    // Register the user with background information
    const result = await authService.registerUser(
      email,
      password,
      name,
      {
        softwareExperience,
        hardwareExperience,
        primaryFocus,
        backgroundDetails
      }
    );

    // Set session cookie
    res.cookie('authjs.session-token', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
    });

    // Return user information and background data
    res.status(200).json({
      user: result.user,
      session: result.session,
      userBackground: {
        id: result.user.id,
        userId: result.user.id,
        softwareExperience: result.user.softwareExperience,
        hardwareExperience: result.user.hardwareExperience,
        primaryFocus: result.user.primaryFocus,
        backgroundDetails: result.user.backgroundDetails,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({
      error: 'Sign up failed',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

// Sign in route
router.post('/signin', validateSignInRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rate limiting check could go here
    // For now, just authenticate the user
    const result = await authService.authenticateUser(email, password);

    if (!result) {
      // Add a small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));

      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Set session cookie
    res.cookie('authjs.session-token', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day (or 7 days if "remember me" was selected)
      sameSite: 'strict',
    });

    // Return user information
    res.status(200).json({
      user: result.user,
      session: result.session
    });
  } catch (error) {
    console.error('Sign in error:', error);

    // Check if it's a specific authentication error
    if (error instanceof Error && error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please wait before trying to sign in again'
      });
    }

    res.status(500).json({
      error: 'Sign in failed',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

// Get current user information
router.get('/me', authenticationMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: 'Not authenticated',
        message: 'User must be logged in to access this resource'
      });
    }

    // Get user background information
    const userBackground = await authService.getUserBackground(user.id);

    res.status(200).json({
      user,
      userBackground
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user information',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

// Update user background information
router.put('/user-background', authenticationMiddleware, validateUserBackgroundRequest, async (req, res) => {
  try {
    const userId = req.user.id;
    const { softwareExperience, hardwareExperience, primaryFocus, backgroundDetails } = req.body;

    // Update user background information
    const updatedBackground = await authService.updateUserBackground(userId, {
      softwareExperience,
      hardwareExperience,
      primaryFocus,
      backgroundDetails
    });

    res.status(200).json(updatedBackground);
  } catch (error) {
    console.error('Update background error:', error);
    res.status(500).json({
      error: 'Failed to update background information',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

// Get personalized content recommendations
router.get('/personalization', authenticationMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user background information
    const userBackground = await authService.getUserBackground(userId);

    if (!userBackground) {
      return res.status(404).json({
        error: 'User background not found',
        message: 'Please complete your background questionnaire to receive personalized content'
      });
    }

    // Get personalization recommendations
    const difficulty = personalizationService.getContentDifficulty(userBackground);
    const sections = personalizationService.getRecommendedContentSections(userBackground);
    const path = personalizationService.getPersonalizedLearningPath(userBackground);
    const adaptations = personalizationService.getContentAdaptations(userBackground);
    const summary = personalizationService.getPersonalizedContentSummary(userBackground);

    res.status(200).json({
      difficulty,
      recommendedSections: sections,
      learningPath: path,
      adaptations,
      summary
    });
  } catch (error) {
    console.error('Personalization error:', error);
    res.status(500).json({
      error: 'Failed to get personalization recommendations',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

// Sign out route
router.post('/signout', authenticationMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.session.id;

    // Logout the user
    await authService.logout(userId, sessionId);

    // Clear session cookie
    res.clearCookie('authjs.session-token');

    res.status(200).json({
      message: 'Successfully signed out'
    });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({
      error: 'Sign out failed',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

// Fallback route for any other auth-related paths
// This prevents GitHub Pages 404 errors by handling invalid routes gracefully
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested authentication route '${req.path}' does not exist. Please check the URL and try again.`,
    availableRoutes: [
      '/signup',
      '/signin',
      '/signout',
      '/me',
      '/user-background',
      '/personalization'
    ]
  });
});

export default router;