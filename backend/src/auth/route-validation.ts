import { Request, Response, NextFunction } from 'express';

/**
 * Route validation middleware for authentication routes
 * Validates route parameters and request bodies to prevent errors
 */

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): boolean => {
  // At least 8 characters, with at least one number and one special character
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return passwordRegex.test(password);
};

// Validate experience level
export const validateExperienceLevel = (level: string): boolean => {
  const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  return validLevels.includes(level);
};

// Validate primary focus
export const validatePrimaryFocus = (focus: string): boolean => {
  const validFocuses = ['software', 'hardware', 'both', 'theory'];
  return validFocuses.includes(focus);
};

// Middleware to validate sign-up request
export const validateSignUpRequest = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { email, password, name, softwareExperience, hardwareExperience, primaryFocus, backgroundDetails } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Email is required'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please provide a valid email address'
    });
  }

  if (!password) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Password is required'
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Password must be at least 8 characters long and contain at least one number and one special character'
    });
  }

  if (!name) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Name is required'
    });
  }

  // Validate optional fields if provided
  if (softwareExperience && !validateExperienceLevel(softwareExperience)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Software experience must be one of: beginner, intermediate, advanced, expert'
    });
  }

  if (hardwareExperience && !validateExperienceLevel(hardwareExperience)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Hardware experience must be one of: beginner, intermediate, advanced, expert'
    });
  }

  if (primaryFocus && !validatePrimaryFocus(primaryFocus)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Primary focus must be one of: software, hardware, both, theory'
    });
  }

  if (backgroundDetails && typeof backgroundDetails !== 'string') {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Background details must be a string'
    });
  }

  if (backgroundDetails && backgroundDetails.length > 500) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Background details must be 500 characters or less'
    });
  }

  next();
};

// Middleware to validate sign-in request
export const validateSignInRequest = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Email is required'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please provide a valid email address'
    });
  }

  if (!password) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Password is required'
    });
  }

  next();
};

// Middleware to validate user background update request
export const validateUserBackgroundRequest = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { softwareExperience, hardwareExperience, primaryFocus, backgroundDetails } = req.body;

  // Validate optional fields if provided
  if (softwareExperience && !validateExperienceLevel(softwareExperience)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Software experience must be one of: beginner, intermediate, advanced, expert'
    });
  }

  if (hardwareExperience && !validateExperienceLevel(hardwareExperience)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Hardware experience must be one of: beginner, intermediate, advanced, expert'
    });
  }

  if (primaryFocus && !validatePrimaryFocus(primaryFocus)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Primary focus must be one of: software, hardware, both, theory'
    });
  }

  if (backgroundDetails && typeof backgroundDetails !== 'string') {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Background details must be a string'
    });
  }

  if (backgroundDetails && backgroundDetails.length > 500) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Background details must be 500 characters or less'
    });
  }

  next();
};