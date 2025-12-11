# Quickstart: Better Auth Integration and User Background Questionnaire

## Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account for deployment

## Setup Better Auth

1. Install Better Auth package:
```bash
npm install better-auth
```

2. Create the auth configuration file at `backend/src/auth/better-auth-config.ts`:
```typescript
import { betterAuth } = from "better-auth";

export const auth = betterAuth({
  database: {
    // Configure your database connection
  },
  secret: process.env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Optional: Add social login providers
  },
});
```

3. Set up the authentication middleware in `backend/src/auth/middleware.ts` to handle the authentication state and protect routes.

## Implement User Background Questionnaire

1. Create the questionnaire component that will be shown after signup:
   - Collect software experience level (beginner, intermediate, advanced, expert)
   - Collect hardware experience level (beginner, intermediate, advanced, expert)
   - Collect primary focus area (software, hardware, both, theory)
   - Optionally collect additional background details

2. Store the questionnaire results in the User Background entity in your database.

## Integrate with GitHub Pages

1. Configure Better Auth to work with static hosting by setting up API routes that are compatible with GitHub Pages deployment.

2. Implement client-side authentication state management using cookies and sessions.

3. Test the authentication flow to ensure no 404 errors occur when redirecting after sign-in.

## Content Personalization

1. Create a personalization service that reads user background data and customizes content accordingly.

2. Implement the personalization functionality to adjust content based on the user's experience level and focus area.

## Testing

1. Test the complete signup flow including the background questionnaire
2. Verify that user sessions are properly maintained
3. Confirm that content personalization works as expected
4. Ensure no 404 errors occur during authentication flows