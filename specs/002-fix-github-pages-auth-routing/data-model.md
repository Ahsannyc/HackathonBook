# Data Model: GitHub Pages Authentication Routing

## Entities

### AuthRoute
- **Path**: string (e.g., `/auth/onboarding`, `/auth/signup`, `/auth/signin`)
- **Component**: React component reference
- **Authentication Requirement**: boolean (whether authentication is required)
- **Props**: object (additional props to pass to the component)

### GitHubPagesConfiguration
- **Base URL**: string (GitHub Pages base URL, e.g., `/HackathonBook/`)
- **404 Fallback**: boolean (whether to fallback to index.html for client-side routing)
- **Custom Domain Settings**: object (if using custom domain)

### ClientSideRouter
- **Route Definitions**: array of route objects
- **Navigation History**: array of visited routes
- **State Management**: object (for preserving state across route changes)

### AuthenticationState
- **User ID**: integer (authenticated user ID)
- **Session Token**: string (JWT token)
- **Onboarding Status**: string (completed/incomplete/pending)

### RedirectHandler
- **Target Route**: string (destination route after authentication)
- **Authentication Status**: string (authenticated/unauthenticated)
- **User Profile**: object (user information for routing decisions)