# Specification: Better-Auth Integration with Onboarding and Personalization

## Feature Description
Integrate custom Better-Auth implementation with onboarding flow and personalization service for the Hackathon Book Docusaurus + RAG chatbot project. The system collects user experience levels (software and hardware) to personalize RAG responses and provides complete user authentication lifecycle management.

## User Scenarios & Testing

### Primary User Scenarios
1. **New User Registration**: A user signs up, completes onboarding with experience levels, and receives personalized RAG responses.
2. **Returning User Authentication**: An existing user signs in and continues to receive personalized responses based on their profile.
3. **Profile Management**: Users can update their experience levels to refine personalization over time.
4. **Guest Usage**: Unauthenticated users can use the RAG chat with default responses.

### Testing Approach
- Test authentication flow (signup, signin, profile management)
- Validate onboarding completion and data persistence
- Verify personalization based on user experience levels
- Confirm RAG responses adapt to different experience levels
- Test error handling for authentication and authorization
- Validate secure password storage and JWT token management

## Functional Requirements

### Authentication System
- **Signup Endpoint** (`POST /auth/signup`): Create user account with email/password validation and bcrypt password hashing
- **Signin Endpoint** (`POST /auth/signin`): Authenticate user and return JWT token
- **Session Management**: JWT-based authentication with configurable expiration
- **Password Security**: Bcrypt hashing with salt rounds for secure password storage

### Onboarding System
- **Experience Collection**: Collect "Software Experience Level" and "Hardware Experience Level" (Beginner/Intermediate/Advanced)
- **Onboarding Endpoint** (`POST /auth/onboarding`): Save user experience data to Postgres
- **Profile Completion**: Required after signup, redirect users if not completed
- **Profile Update** (`PUT /auth/profile`): Allow users to update their experience levels

### Personalization Service
- **RAG Response Personalization**: Adjust response complexity based on user experience levels
- **Beginner Adaptation**: Provide detailed explanations and simpler terminology
- **Advanced Adaptation**: Use technical terminology and assume prior knowledge
- **Context-Aware Responses**: Modify answer depth based on user profile

### User Profile Management
- **Profile Retrieval** (`GET /auth/profile`): Fetch user account and onboarding data
- **Profile Updates**: Allow users to update their experience levels
- **Data Linking**: Connect all user data (chat logs, onboarding, sessions) to user ID

### Frontend Integration
- **Auth Pages**: Create signup, signin, onboarding, and profile update pages
- **RAG Chat Integration**: Use authenticated API calls with personalization
- **Navigation Integration**: Show appropriate links based on authentication status
- **Welcome Messages**: Personalize welcome content based on auth status

### Database Requirements
- **Users Table**: Store user accounts with email, hashed passwords, and account status
- **Sessions Table**: Track active user sessions with expiration
- **Onboarding Profiles Table**: Store user experience levels with foreign key to users
- **Chat Logs Enhancement**: Link chat logs to authenticated users

## Non-Functional Requirements

### Performance
- Authentication endpoints should respond within 500ms
- Personalization should add minimal latency to RAG queries
- Session validation should be efficient with proper caching

### Security
- Passwords must be securely hashed using bcrypt
- JWT tokens must be properly signed and validated
- All user data must be stored securely in Postgres
- Authentication state must be properly managed in frontend

### Quality
- All authentication flows must be thoroughly validated
- Personalization logic must be consistent and predictable
- Error handling must be comprehensive and user-friendly
- Session management must be secure and reliable

### Maintainability
- Code must follow existing project structure and patterns
- Authentication logic must be modular and reusable
- Database schema must be well-organized and documented
- API endpoints must follow REST conventions

## Success Criteria

### Quantitative Measures
- 100% of authentication endpoints functional and tested
- 100% of onboarding flow completed successfully
- 100% of RAG queries properly personalized when authenticated
- 0% of unhandled authentication errors in production

### Qualitative Measures
- Users can seamlessly sign up and complete onboarding
- Personalized responses match user experience level appropriately
- Authentication system integrates smoothly with existing RAG chat
- Profile management allows easy updates to experience levels

## Key Entities
- Authentication endpoints (signup, signin, profile management)
- User profiles with experience levels
- JWT tokens and session management
- Personalized RAG responses
- Database tables (users, sessions, onboarding profiles)

## Constraints

### Scope Constraints
- Focus on authentication and personalization rather than complex user management
- Limit to software/hardware experience levels for initial implementation
- Maintain compatibility with existing Docusaurus and RAG systems
- Keep personalization logic simple and effective

### Technical Constraints
- Use JWT for token-based authentication
- Store data in existing Postgres database (Neon)
- Integrate with existing RAG system without major refactoring
- Maintain responsive design for all auth components

## Assumptions
- Users will provide honest experience level information
- The Qwen API can handle personalized system messages
- Existing RAG infrastructure supports customization
- Users have basic familiarity with authentication flows

## Dependencies
- FastAPI backend with SQLAlchemy ORM
- Postgres database (Neon)
- Docusaurus frontend framework
- Qwen API for RAG responses
- React Router for frontend navigation

## Implementation Notes
- All auth components (Signup, Signin, Onboarding) must be SSR-safe and use `useIsBrowser` hook with `window.location` for navigation instead of `useNavigate` from react-router-dom
- The Navbar component must check for browser environment before accessing auth context
- The RagChat component must use localStorage for auth state instead of directly accessing auth context during SSR
- Import paths in auth pages must use `@site` alias for proper module resolution in Docusaurus
- Docusaurus configuration must not have duplicate theme configurations to prevent build failures
- Personalization functionality uses UserBackgroundSelector component to allow users to select experience level (Beginner, Intermediate, Expert)
- Personalized content is displayed using PersonalizedContent component and background-specific MDX components
- Content sections in markdown files are marked with 'personalization-hook' class and 'data-background' attributes for conditional rendering
- Backend authentication requires bcrypt==4.0.1 for compatibility with passlib library to avoid 72-byte password length limitation errors
- Password validation includes automatic truncation to 72 characters maximum to comply with bcrypt limitations
- Authentication endpoints must properly handle password hashing with validation and error handling