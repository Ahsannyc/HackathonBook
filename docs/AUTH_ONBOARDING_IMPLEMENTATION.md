# Better-Auth Integration with Onboarding Implementation

## Overview
This document describes the implementation of Better-Auth (custom implementation) with onboarding functionality for the Hackathon Book Docusaurus + RAG chatbot project.

## Features Implemented

### 1. Backend Authentication System
- **Signup/Signin endpoints**: `/auth/signup` and `/auth/signin`
- **Session management**: JWT-based authentication with token refresh
- **User profiles**: Complete user profile management with email verification
- **Password security**: Bcrypt hashing with salt rounds

### 2. Onboarding System
- **Experience collection**: Software and hardware experience levels
- **Profile completion**: Required after signup to personalize experience
- **Data storage**: Secure storage in Postgres with user linking

### 3. Personalization Service
- **RAG query personalization**: Adjusts responses based on user experience level
- **Adaptive explanations**: Beginner/Intermediate/Advanced level responses
- **Context-aware responses**: Uses user profile to customize answer depth

### 4. Frontend Components
- **Signup page**: `/auth/signup` with email/password validation
- **Signin page**: `/auth/signin` with authentication flow
- **Onboarding page**: `/auth/onboarding` for experience collection
- **Profile page**: `/auth/profile` for profile management
- **Integrated RAG chat**: Personalized responses based on auth status

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique, Indexed)
- `password_hash`
- `is_active` (Boolean, default: true)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Sessions Table
- `id` (Primary Key, Session ID)
- `user_id` (Foreign Key, Indexed)
- `expires_at` (DateTime)
- `created_at` (DateTime)
- `is_active` (Boolean, default: true)

### Onboarding Profiles Table
- `id` (Primary Key)
- `user_id` (Foreign Key, Indexed)
- `software_experience` (String, nullable)
- `hardware_experience` (String, nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Updated ChatLogs Table
- Added `user_id` column to link chat logs to authenticated users

## API Endpoints

### Authentication Endpoints
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Authenticate existing user
- `POST /auth/onboarding` - Complete onboarding profile
- `GET /auth/profile` - Get user profile and onboarding data
- `PUT /auth/profile` - Update user profile

### RAG Endpoints (Enhanced)
- `POST /rag/query` - Query with personalization based on user profile
- `POST /rag/selected_text_query` - Selected text query with personalization

## Frontend Integration

### Authentication Context
- `AuthProvider` component wraps the entire application
- `useAuth` hook provides authentication state across components
- Automatic token management and storage in localStorage

### RAG Chat Integration
- Uses `authApi` for all backend communication
- Personalized responses based on user experience level
- Shows welcome message based on authentication status
- Links all chat logs to authenticated users

### Navigation Integration
- Custom Navbar component with auth-aware links
- Shows different options based on authentication status
- Profile dropdown with user email when authenticated

## Personalization Logic

The system adjusts responses based on user experience levels:
- **Beginner**: More detailed explanations, simpler terminology
- **Intermediate**: Balanced explanations with some technical details
- **Advanced**: Technical terminology and assumes prior knowledge

## Security Features

- Passwords hashed with bcrypt
- JWT tokens with configurable expiration
- Secure token storage in localStorage
- Input validation and sanitization
- SQL injection prevention with SQLAlchemy ORM

## Environment Variables Required

- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `DATABASE_URL` - Postgres connection string

## Installation & Setup

1. Install required Python dependencies:
   ```
   pip install passlib[bcrypt] pyjwt
   ```

2. Update requirements.txt with:
   ```
   passlib[bcrypt]==1.7.4
   pyjwt==2.8.0
   ```

3. Run database migrations to create new tables:
   ```python
   # In main.py, create_tables() function creates all required tables
   ```

4. Set up environment variables for JWT configuration

## Usage Flow

1. **New User**: Signs up → Completes onboarding → Uses personalized RAG chat
2. **Returning User**: Signs in → (Optionally updates profile) → Uses personalized RAG chat
3. **Unauthenticated User**: Uses RAG chat with default responses

## Error Handling

- Comprehensive error handling for all API endpoints
- Proper HTTP status codes
- User-friendly error messages
- Graceful degradation for unauthenticated users

## Testing

All endpoints have been tested for:
- Authentication flow
- Onboarding completion
- Profile management
- RAG query personalization
- Session management
- Error scenarios