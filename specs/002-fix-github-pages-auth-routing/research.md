# Research: GitHub Pages Authentication Routing Issue

## Decision: Use Docusaurus-based client-side routing for GitHub Pages
**Rationale**: GitHub Pages serves static files and requires proper client-side routing configuration to handle SPA navigation correctly. The issue occurs when users are redirected to `/auth/onboarding` which results in a 404 error because GitHub Pages doesn't have server-side routing to handle the path.

**Alternatives considered**:
1. Server-side rendering (SSR) - Not applicable for GitHub Pages static hosting
2. Using hash-based routing - Would change URL structure and may not be SEO-friendly
3. Custom 404 page with JavaScript redirect - Would create a poor user experience
4. Docusaurus client-side routing with proper base URL configuration - Best approach for this static site

## Decision: Configure GitHub Pages with proper fallback for client-side routes
**Rationale**: GitHub Pages needs to be configured to serve the main index.html file for all routes that don't correspond to actual static files, allowing the client-side router to handle the navigation.

**Alternatives considered**:
1. Using a custom GitHub Actions workflow to generate specific routing files
2. Using a CNAME file with additional configuration
3. Configuring Docusaurus to use browser history API with proper base path - Chosen approach

## Technical approach:
1. Update Docusaurus configuration to handle client-side routing properly
2. Ensure all auth-related pages are properly built and accessible in the static site
3. Configure proper base URL handling for GitHub Pages deployment
4. Update navigation logic in auth components to work with Docusaurus routing