/**
 * User Model Interface
 *
 * Defines the structure of user data based on the data model specifications.
 * Note: Better Auth manages the actual user storage, this is for type safety
 * and documentation purposes.
 */

export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;

  /**
   * User's email address (required, unique, validated)
   */
  email: string;

  /**
   * User's name (optional)
   */
  name?: string;

  /**
   * Timestamp when the user account was created
   */
  createdAt: Date;

  /**
   * Timestamp when the user account was last updated
   */
  updatedAt: Date;

  /**
   * Whether the user's email has been verified
   */
  emailVerified: boolean;

  /**
   * URL to the user's profile picture (optional)
   */
  image?: string;

  /**
   * Software experience level (beginner, intermediate, advanced, expert)
   */
  softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  /**
   * Hardware experience level (beginner, intermediate, advanced, expert)
   */
  hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  /**
   * Primary focus area (software, hardware, both, theory)
   */
  primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';

  /**
   * Additional details about user's background
   */
  backgroundDetails?: string;
}

/**
 * User Background Interface
 *
 * Represents the user's background information for content personalization
 */
export interface UserBackground {
  /**
   * Unique identifier for the background record
   */
  id: string;

  /**
   * Foreign key to User.id
   */
  userId: string;

  /**
   * Software experience level (beginner, intermediate, advanced, expert)
   */
  softwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  /**
   * Hardware experience level (beginner, intermediate, advanced, expert)
   */
  hardwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  /**
   * Primary focus area (software, hardware, both, theory)
   */
  primaryFocus: 'software' | 'hardware' | 'both' | 'theory';

  /**
   * Additional details about user's background
   */
  backgroundDetails?: string;

  /**
   * Timestamp when the background record was created
   */
  createdAt: Date;

  /**
   * Timestamp when the background record was last updated
   */
  updatedAt: Date;
}

/**
 * Session Interface
 *
 * Represents the user's session information (managed by Better Auth)
 */
export interface Session {
  /**
   * Unique identifier for the session
   */
  id: string;

  /**
   * Foreign key to User.id
   */
  userId: string;

  /**
   * Expiration time for the session
   */
  expiresAt: Date;

  /**
   * Timestamp when the session was created
   */
  createdAt: Date;

  /**
   * Timestamp when the session was last updated
   */
  updatedAt: Date;
}