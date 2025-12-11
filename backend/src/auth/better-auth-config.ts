import { betterAuth } from "better-auth";

/**
 * Better Auth Configuration
 *
 * This configuration sets up the authentication system with:
 * - Email and password authentication
 * - Session management
 * - User model customization
 * - GitHub Pages compatibility
 */
export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "./sqlite.db",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      // Minimum password requirements
      minLength: 8,
      requireNumbers: true,
      requireSymbols: false,
    },
  },
  socialProviders: {
    // GitHub OAuth (optional)
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID || "",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    // },
  },
  session: {
    expires: 7 * 24 * 60 * 60 * 1000, // 7 days for "Remember me"
    updateAge: 24 * 60 * 60 * 1000,   // 1 day for regular sessions
  },
  // Custom user model fields for background information
  user: {
    additionalFields: {
      softwareExperience: {
        type: "string",
        required: false,
        defaultValue: "beginner",
      },
      hardwareExperience: {
        type: "string",
        required: false,
        defaultValue: "beginner",
      },
      primaryFocus: {
        type: "string",
        required: false,
        defaultValue: "both",
      },
      backgroundDetails: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  // Account security
  accountSecurity: {
    bruteForceProtection: true,
    rateLimiter: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
    },
  },
  // GitHub Pages compatibility settings
  origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
});