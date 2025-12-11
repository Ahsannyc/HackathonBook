import { AuthService } from '../auth-service';

// Mock the Better Auth functions
jest.mock('../../auth/better-auth-config', () => ({
  auth: {
    $ctx: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      getSessionFromToken: jest.fn(),
      createSession: jest.fn(),
      deleteSession: jest.fn(),
    }
  }
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('registerUser', () => {
    it('should register a new user with background information', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
        softwareExperience: 'beginner',
        hardwareExperience: 'intermediate',
        primaryFocus: 'both',
        backgroundDetails: 'Test background details',
      };

      const mockSession = {
        id: 'test-session-id',
        token: 'test-session-token',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      };

      // Mock the auth context functions
      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.signUp.mockResolvedValue(mockUser);
      auth.$ctx.createSession.mockResolvedValue(mockSession);

      const result = await authService.registerUser(
        'test@example.com',
        'password123',
        'Test User',
        {
          softwareExperience: 'beginner',
          hardwareExperience: 'intermediate',
          primaryFocus: 'both',
          backgroundDetails: 'Test background details',
        }
      );

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(auth.$ctx.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        softwareExperience: 'beginner',
        hardwareExperience: 'intermediate',
        primaryFocus: 'both',
        backgroundDetails: 'Test background details',
      });
    });

    it('should throw an error when user creation fails', async () => {
      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.signUp.mockResolvedValue(null);

      await expect(
        authService.registerUser('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('Failed to create user account');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user with valid credentials', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockSession = {
        id: 'test-session-id',
        token: 'test-session-token',
        userId: 'test-user-id',
      };

      const mockResult = {
        user: mockUser,
        session: mockSession,
      };

      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.signIn.mockResolvedValue(mockResult);

      const result = await authService.authenticateUser('test@example.com', 'password123');

      expect(result).toEqual(mockResult);
      expect(auth.$ctx.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return null for invalid credentials', async () => {
      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.signIn.mockResolvedValue(null);

      const result = await authService.authenticateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('updateUserBackground', () => {
    it('should update user background information', async () => {
      const mockUpdatedUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        softwareExperience: 'advanced',
        hardwareExperience: 'expert',
        primaryFocus: 'software',
        backgroundDetails: 'Updated background details',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.updateUser.mockResolvedValue(mockUpdatedUser);

      const result = await authService.updateUserBackground('test-user-id', {
        softwareExperience: 'advanced',
        hardwareExperience: 'expert',
        primaryFocus: 'software',
        backgroundDetails: 'Updated background details',
      });

      expect(result).toEqual({
        id: 'test-user-id',
        userId: 'test-user-id',
        softwareExperience: 'advanced',
        hardwareExperience: 'expert',
        primaryFocus: 'software',
        backgroundDetails: 'Updated background details',
        createdAt: mockUpdatedUser.createdAt,
        updatedAt: mockUpdatedUser.updatedAt,
      });
    });
  });

  describe('getUserBackground', () => {
    it('should get user background information', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        softwareExperience: 'intermediate',
        hardwareExperience: 'beginner',
        primaryFocus: 'hardware',
        backgroundDetails: 'Some background details',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.getUserById.mockResolvedValue(mockUser);

      const result = await authService.getUserBackground('test-user-id');

      expect(result).toEqual({
        id: 'test-user-id',
        userId: 'test-user-id',
        softwareExperience: 'intermediate',
        hardwareExperience: 'beginner',
        primaryFocus: 'hardware',
        backgroundDetails: 'Some background details',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should return null if user does not exist', async () => {
      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.getUserById.mockResolvedValue(null);

      const result = await authService.getUserBackground('non-existent-user');

      expect(result).toBeNull();
    });
  });

  describe('verifySession', () => {
    it('should return true for a valid session', async () => {
      const mockSession = {
        id: 'test-session-id',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 10000), // 10 seconds from now
        token: 'test-session-token',
        user: { id: 'test-user-id', email: 'test@example.com' },
      };

      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.getSessionFromToken.mockResolvedValue(mockSession);

      const result = await authService.verifySession('test-session-token');

      expect(result).toBe(true);
    });

    it('should return false for an expired session', async () => {
      const mockSession = {
        id: 'test-session-id',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() - 10000), // 10 seconds ago
        token: 'test-session-token',
        user: { id: 'test-user-id', email: 'test@example.com' },
      };

      const { auth } = require('../../auth/better-auth-config');
      auth.$ctx.getSessionFromToken.mockResolvedValue(mockSession);

      const result = await authService.verifySession('test-session-token');

      expect(result).toBe(false);
    });
  });
});