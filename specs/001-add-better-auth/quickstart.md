# Quickstart: Add Better Auth Authentication System

## Overview
This guide provides the essential steps to implement the Better Auth authentication system with user background collection.

## Prerequisites
- Node.js 18+ installed
- Neon Postgres database account
- Basic knowledge of TypeScript/JavaScript

## Installation Steps

1. **Install Better Auth and dependencies**:
   ```bash
   npm install better-auth @better-auth/node postgres
   ```

2. **Install Neon Postgres client**:
   ```bash
   npm install @neondatabase/serverless
   ```

3. **Set up environment variables**:
   Create a `.env` file with:
   ```
   DATABASE_URL="your_neon_postgres_connection_string"
   AUTH_SECRET="your_auth_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Basic Configuration

1. **Initialize Better Auth**:
   Create `backend/src/auth/better-auth-config.ts`:
   ```typescript
   import { betterAuth } from "better-auth";

   export const auth = betterAuth({
     database: {
       provider: "neon",
       url: process.env.DATABASE_URL!,
     },
     secret: process.env.AUTH_SECRET!,
     emailAndPassword: {
       enabled: true,
       requireEmailVerification: false,
     },
     // Add custom user fields for background information
     user: {
       additionalFields: {
         softwareLevel: {
           type: "string",
           required: false,
         },
         hardwareExperience: {
           type: "string",
           required: false,
         },
         primaryFocus: {
           type: "string",
           required: false,
         }
       }
     }
   });
   ```

2. **Create API routes**:
   Set up signup and signin endpoints that collect background information during registration.

3. **Create user interface components**:
   - Sign-up form with background questionnaire
   - Sign-in form
   - Profile management page

## Testing the Implementation

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test user registration**:
   - Navigate to sign-up page
   - Fill in credentials and background information
   - Verify account creation and authentication

3. **Test user login**:
   - Use existing credentials to sign in
   - Verify session management works correctly

## Next Steps

1. Implement profile update functionality
2. Connect background data to personalization features
3. Add security enhancements (rate limiting, etc.)
4. Implement comprehensive error handling