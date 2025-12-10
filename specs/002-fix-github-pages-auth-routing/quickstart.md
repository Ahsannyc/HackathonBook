# Quickstart: GitHub Pages Authentication Routing Fix

## Overview
This guide explains how to implement proper client-side routing for authentication flows in the Docusaurus-based textbook application when deployed to GitHub Pages.

## Problem
When users sign in to the application, they are redirected to `/auth/onboarding` which results in a 404 error on GitHub Pages because the static hosting doesn't handle client-side routes properly.

## Solution
Configure Docusaurus to properly handle client-side routing by:

1. Ensuring all auth-related pages are built as static HTML files
2. Using Docusaurus' built-in client-side routing instead of react-router-dom
3. Properly configuring the base URL for GitHub Pages deployment
4. Updating navigation logic in auth components to work with Docusaurus routing

## Implementation Steps

1. **Update auth components** to use Docusaurus navigation instead of react-router-dom
2. **Verify auth pages are properly built** during the static site generation
3. **Test routing locally** using `npm run build` and `npx serve -s build`
4. **Deploy to GitHub Pages** and verify the routing works

## Files to Modify
- `book/src/components/auth/Signup.jsx`
- `book/src/components/auth/Signin.jsx`
- `book/src/components/auth/Onboarding.jsx`
- `book/docusaurus.config.ts` (if needed)