import { auth } from "../auth/better-auth-config";
import { User, UserBackground } from "../models/user";

/**
 * Authentication Service
 *
 * Provides methods for user authentication, registration, and session management.
 * This service handles the core authentication logic while integrating with
 * Better Auth for the underlying implementation.
 */
export class AuthService {
  /**
   * Register a new user with background information
   */
  async registerUser(
    email: string,
    password: string,
    name: string,
    backgroundData?: {
      softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
      backgroundDetails?: string;
    }
  ): Promise<{ user: User; session: any }> {
    try {
      // Create the user account with Better Auth
      const user = await auth.$ctx.signUp({
        email,
        password,
        name,
        // Include background information as additional fields
        ...(backgroundData?.softwareExperience && { softwareExperience: backgroundData.softwareExperience }),
        ...(backgroundData?.hardwareExperience && { hardwareExperience: backgroundData.hardwareExperience }),
        ...(backgroundData?.primaryFocus && { primaryFocus: backgroundData.primaryFocus }),
        ...(backgroundData?.backgroundDetails && { backgroundDetails: backgroundData.backgroundDetails }),
      });

      if (!user) {
        throw new Error('Failed to create user account');
      }

      // Create a session for the new user
      const session = await auth.$ctx.createSession({
        userId: user.id,
        expiresIn: 24 * 60 * 60, // 24 hours
      });

      return {
        user: user as unknown as User,
        session,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Authenticate a user with email and password
   */
  async authenticateUser(email: string, password: string): Promise<{ user: User; session: any } | null> {
    try {
      // Sign in the user with Better Auth
      const result = await auth.$ctx.signIn({
        email,
        password,
      });

      if (!result) {
        return null;
      }

      return {
        user: result.user as unknown as User,
        session: result.session,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  /**
   * Update user background information
   */
  async updateUserBackground(
    userId: string,
    backgroundData: {
      softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
      backgroundDetails?: string;
    }
  ): Promise<UserBackground> {
    try {
      // Update the user's background information
      const updatedUser = await auth.$ctx.updateUser({
        userId,
        ...backgroundData,
      });

      if (!updatedUser) {
        throw new Error('Failed to update user background information');
      }

      // Return the updated background information
      return {
        id: userId,
        userId: userId,
        softwareExperience: updatedUser.softwareExperience as 'beginner' | 'intermediate' | 'advanced' | 'expert' || 'beginner',
        hardwareExperience: updatedUser.hardwareExperience as 'beginner' | 'intermediate' | 'advanced' | 'expert' || 'beginner',
        primaryFocus: updatedUser.primaryFocus as 'software' | 'hardware' | 'both' | 'theory' || 'both',
        backgroundDetails: updatedUser.backgroundDetails || '',
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      console.error('Update background error:', error);
      throw new Error(`Failed to update background: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user background information by user ID
   */
  async getUserBackground(userId: string): Promise<UserBackground | null> {
    try {
      const user = await auth.$ctx.getUserById(userId);

      if (!user) {
        return null;
      }

      return {
        id: userId,
        userId: userId,
        softwareExperience: user.softwareExperience as 'beginner' | 'intermediate' | 'advanced' | 'expert' || 'beginner',
        hardwareExperience: user.hardwareExperience as 'beginner' | 'intermediate' | 'advanced' | 'expert' || 'beginner',
        primaryFocus: user.primaryFocus as 'software' | 'hardware' | 'both' | 'theory' || 'both',
        backgroundDetails: user.backgroundDetails || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Get background error:', error);
      return null;
    }
  }

  /**
   * Get current user information from session token
   */
  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const session = await auth.$ctx.getSessionFromToken(token);

      if (!session) {
        return null;
      }

      return session.user as unknown as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Verify if a session token is valid
   */
  async verifySession(token: string): Promise<boolean> {
    try {
      const session = await auth.$ctx.getSessionFromToken(token);
      return !!session && session.expiresAt > new Date();
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout user and invalidate session
   */
  async logout(userId: string, sessionId: string): Promise<boolean> {
    try {
      await auth.$ctx.deleteSession(sessionId);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
}

// Export a singleton instance of the AuthService
export const authService = new AuthService();