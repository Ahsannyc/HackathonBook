import { AuthClient } from '../auth-client';

// Mock the fetch API
global.fetch = jest.fn();

describe('AuthClient Integration Tests', () => {
  let authClient: AuthClient;

  beforeEach(() => {
    authClient = new AuthClient('http://localhost:3000/api/auth');
    // Reset fetch mock
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockClear();
  });

  describe('Sign Up Flow', () => {
    it('should successfully register a new user with background information', async () => {
      const mockResponse = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: true,
        },
        userBackground: {
          id: 'test-bg-id',
          userId: 'test-user-id',
          softwareExperience: 'beginner',
          hardwareExperience: 'intermediate',
          primaryFocus: 'both',
          backgroundDetails: 'Test background details',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        session: {
          id: 'test-session-id',
          token: 'test-session-token',
          userId: 'test-user-id',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }
      };

      (global.fetch as jest.MockedFunction<typeof global.fetch>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response);

      const result = await authClient.signUp({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        softwareExperience: 'beginner',
        hardwareExperience: 'intermediate',
        primaryFocus: 'both',
        backgroundDetails: 'Test background details',
      });

      expect(result).toEqual({
        user: mockResponse.user,
        userBackground: mockResponse.userBackground,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/signup',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Password123!',
            name: 'Test User',
            softwareExperience: 'beginner',
            hardwareExperience: 'intermediate',
            primaryFocus: 'both',
            backgroundDetails: 'Test background details',
          }),
        })
      );
    });

    it('should handle sign up failure', async () => {
      (global.fetch as jest.MockedFunction<typeof global.fetch>)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'Email already exists' }),
        } as Response);

      await expect(authClient.signUp({
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Test User',
      })).rejects.toThrow('Email already exists');
    });
  });

  describe('Sign In Flow', () => {
    it('should successfully authenticate a user', async () => {
      const mockResponse = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: true,
        },
        session: {
          id: 'test-session-id',
          token: 'test-session-token',
          userId: 'test-user-id',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }
      };

      (global.fetch as jest.MockedFunction<typeof global.fetch>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response);

      const result = await authClient.signIn({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toEqual({ user: mockResponse.user });
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/signin',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Password123!',
          }),
        })
      );
    });

    it('should handle sign in failure', async () => {
      (global.fetch as jest.MockedFunction<typeof global.fetch>)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Invalid email or password' }),
        } as Response);

      await expect(authClient.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('Invalid email or password');
    });
  });

  describe('User Background Management', () => {
    it('should update user background information', async () => {
      const mockResponse = {
        id: 'test-bg-id',
        userId: 'test-user-id',
        softwareExperience: 'advanced',
        hardwareExperience: 'expert',
        primaryFocus: 'software',
        backgroundDetails: 'Updated background details',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock successful authentication for context
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'authjs.session-token=test-session-token',
      });

      (global.fetch as jest.MockedFunction<typeof global.fetch>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response);

      const result = await authClient.updateUserBackground({
        softwareExperience: 'advanced',
        hardwareExperience: 'expert',
        primaryFocus: 'software',
        backgroundDetails: 'Updated background details',
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/user-background',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            softwareExperience: 'advanced',
            hardwareExperience: 'expert',
            primaryFocus: 'software',
            backgroundDetails: 'Updated background details',
          }),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (global.fetch as jest.MockedFunction<typeof global.fetch>)
        .mockRejectedValue(new TypeError('Network error'));

      await expect(authClient.signIn({
        email: 'test@example.com',
        password: 'Password123!',
      })).rejects.toThrow('Network error. Please check your connection and try again.');
    });

    it('should handle server errors', async () => {
      (global.fetch as jest.MockedFunction<typeof global.fetch>)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Internal server error' }),
        } as Response);

      await expect(authClient.signIn({
        email: 'test@example.com',
        password: 'Password123!',
      })).rejects.toThrow('Internal server error');
    });
  });
});