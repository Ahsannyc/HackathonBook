# Authentication System Setup

This document describes how to set up and use the authentication system with Better Auth for the HackathonBook project.

## Overview

The authentication system implements:
- User sign-up and sign-in with email/password
- User background questionnaire for content personalization
- Session management with cookies
- GitHub Pages deployment compatibility
- Error handling and validation

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account for deployment

## Setup

### 1. Install Dependencies

```bash
npm install better-auth
npm install --save-dev typescript @types/node jest cypress
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the values in `.env` with your actual configuration:

```bash
# Authentication Configuration
AUTH_SECRET=your-auth-secret-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
NEXTAUTH_URL=http://localhost:3000

# Database Configuration (if using database)
DATABASE_URL=your-database-url-here
```

### 3. Backend Setup

The authentication backend is configured in `backend/src/auth/better-auth-config.ts`:

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "./sqlite.db",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      minLength: 8,
      requireNumbers: true,
      requireSymbols: false,
    },
  },
  session: {
    expires: 7 * 24 * 60 * 60 * 1000, // 7 days for "Remember me"
    updateAge: 24 * 60 * 60 * 1000,   // 1 day for regular sessions
  },
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
  origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
});
```

### 4. Frontend Setup

The frontend authentication service is available in `frontend/src/services/auth-client.ts`:

```typescript
import { authClient } from './auth-client';

// Sign up with background information
const result = await authClient.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  name: 'John Doe',
  softwareExperience: 'intermediate',
  hardwareExperience: 'beginner',
  primaryFocus: 'software',
  backgroundDetails: 'I have 3 years of software development experience...'
});

// Sign in
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});

// Update user background
await authClient.updateUserBackground({
  softwareExperience: 'advanced',
  hardwareExperience: 'intermediate',
  primaryFocus: 'both',
  backgroundDetails: 'Updated background information...'
});
```

## API Endpoints

The authentication system provides the following API endpoints:

- `POST /api/auth/signup` - User registration with background questionnaire
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user information
- `PUT /api/auth/user-background` - Update user background information
- `GET /api/auth/personalization` - Get personalized content recommendations

## Error Handling

The system provides comprehensive error handling:

- Input validation for all fields
- Rate limiting protection
- Secure session management
- Proper error messages instead of generic 404s
- Network error handling on the frontend

## Testing

Run the unit tests:

```bash
npm test
```

## Deployment to GitHub Pages

The authentication system is designed to work with GitHub Pages deployment. Make sure to:

1. Update the `NEXTAUTH_URL` environment variable to your GitHub Pages URL
2. Ensure your API routes are properly configured for static hosting
3. Test the authentication flow after deployment

## Security Features

- Password strength validation
- Rate limiting to prevent brute force attacks
- Secure session cookies with httpOnly flag
- Input validation and sanitization
- CSRF protection
- Proper redirect validation to prevent open redirects

## Content Personalization

The system collects user background information during sign-up to personalize content:

- Software experience level
- Hardware experience level
- Primary focus area (software, hardware, both, theory)
- Additional background details

This information is used to customize the learning path and content recommendations for each user.