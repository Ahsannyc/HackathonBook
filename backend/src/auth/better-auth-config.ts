import { betterAuth } from "better-auth";

/**
 * Better Auth Configuration
 *
 * This configuration sets up the authentication system with:
 * - Email and password authentication
 * - Session management
 * - User model customization
 * - GitHub Pages compatibility
 *
 * In development, uses SQLite. In production, uses Neon Postgres.
 */
const dbProvider = process.env.NEON_DATABASE_URL ? "neon" : "sqlite";
let dbUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "./sqlite.db";

// Normalize the SQLite URL: better-auth's sqlite adapter expects a `file:` URL.
if (dbProvider === 'sqlite' && !dbUrl.startsWith('file:')) {
  dbUrl = `file:${dbUrl}`;
}

console.log(`Using database provider: ${dbProvider}`);
console.log(`Database URL: ${dbUrl}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Use the database adapter when DATABASE_URL is set (for both development and production)
const databaseConfig = process.env.DATABASE_URL ? {
  provider: dbProvider,
  url: dbUrl,
} : undefined; // use in-memory adapter as fallback

const auth = betterAuth({
  database: databaseConfig,
  // Provide a simple logger so better-auth can surface internal debug/info messages
  logger: {
    info: (...args: any[]) => console.log('[better-auth]', ...args),
    warn: (...args: any[]) => console.warn('[better-auth]', ...args),
    error: (...args: any[]) => console.error('[better-auth]', ...args),
    debug: (...args: any[]) => console.debug ? console.debug('[better-auth]', ...args) : console.log('[better-auth]', ...args),
  },
  secret: process.env.AUTH_SECRET || "fallback-secret-key-change-this-in-production",
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
      windowMs: 15 * 60 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
    },
  },
  // GitHub Pages compatibility settings
  origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
});

export { auth };