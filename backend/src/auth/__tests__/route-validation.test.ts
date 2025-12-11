import {
  validateEmail,
  validatePassword,
  validateExperienceLevel,
  validatePrimaryFocus,
  validateSignUpRequest,
  validateSignInRequest,
  validateUserBackgroundRequest
} from '../route-validation';

// Mock Express request and response objects
const createMockRequest = (body: any = {}) => ({
  body,
  params: {},
  query: {},
});

const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.send = jest.fn(() => res);
  return res;
};

describe('Route Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('MyPass9@word')).toBe(true);
    });

    it('should return false for invalid passwords', () => {
      expect(validatePassword('short')).toBe(false); // too short
      expect(validatePassword('nouppercase123!')).toBe(false); // no uppercase
      expect(validatePassword('NoNumber!')).toBe(false); // no number
      expect(validatePassword('NOLOWERCASE123!')).toBe(false); // no lowercase
      expect(validatePassword('NoSpecial123')).toBe(false); // no special char
    });
  });

  describe('validateExperienceLevel', () => {
    it('should return true for valid experience levels', () => {
      expect(validateExperienceLevel('beginner')).toBe(true);
      expect(validateExperienceLevel('intermediate')).toBe(true);
      expect(validateExperienceLevel('advanced')).toBe(true);
      expect(validateExperienceLevel('expert')).toBe(true);
    });

    it('should return false for invalid experience levels', () => {
      expect(validateExperienceLevel('novice')).toBe(false);
      expect(validateExperienceLevel('master')).toBe(false);
      expect(validateExperienceLevel('')).toBe(false);
    });
  });

  describe('validatePrimaryFocus', () => {
    it('should return true for valid primary focus values', () => {
      expect(validatePrimaryFocus('software')).toBe(true);
      expect(validatePrimaryFocus('hardware')).toBe(true);
      expect(validatePrimaryFocus('both')).toBe(true);
      expect(validatePrimaryFocus('theory')).toBe(true);
    });

    it('should return false for invalid primary focus values', () => {
      expect(validatePrimaryFocus('design')).toBe(false);
      expect(validatePrimaryFocus('marketing')).toBe(false);
      expect(validatePrimaryFocus('')).toBe(false);
    });
  });

  describe('validateSignUpRequest middleware', () => {
    it('should pass validation for valid sign-up request', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        softwareExperience: 'intermediate',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: 'Some background details'
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateSignUpRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail validation for missing required fields', () => {
      const req = createMockRequest({
        email: '', // Missing email
        password: 'Password123!',
        name: 'Test User'
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateSignUpRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail validation for invalid email', () => {
      const req = createMockRequest({
        email: 'invalid-email',
        password: 'Password123!',
        name: 'Test User'
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateSignUpRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail validation for invalid experience level', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        softwareExperience: 'invalid-level' // Invalid level
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateSignUpRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateSignInRequest middleware', () => {
    it('should pass validation for valid sign-in request', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'Password123!'
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateSignInRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail validation for missing email', () => {
      const req = createMockRequest({
        email: '', // Missing email
        password: 'Password123!'
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateSignInRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail validation for missing password', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        password: '' // Missing password
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateSignInRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateUserBackgroundRequest middleware', () => {
    it('should pass validation for valid background update request', () => {
      const req = createMockRequest({
        softwareExperience: 'intermediate',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: 'Updated background details'
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateUserBackgroundRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail validation for invalid experience level', () => {
      const req = createMockRequest({
        softwareExperience: 'invalid-level' // Invalid level
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateUserBackgroundRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail validation for invalid primary focus', () => {
      const req = createMockRequest({
        primaryFocus: 'invalid-focus' // Invalid focus
      });
      const res = createMockResponse();
      const next = jest.fn();

      validateUserBackgroundRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});