# Data Model: Add Better Auth Authentication System

## Overview
This document defines the data models for the authentication system with user background collection functionality.

## User Account Entity
**Description**: Core user account information for authentication purposes
- **Fields**:
  - id (string): Unique identifier for the user
  - email (string): User's email address (unique, validated)
  - password (string): Hashed password (stored securely)
  - createdAt (datetime): Account creation timestamp
  - updatedAt (datetime): Last modification timestamp
  - emailVerified (boolean): Whether email has been verified
  - lastLoginAt (datetime): Timestamp of last successful login

## User Profile Entity
**Description**: Technical background information for content personalization
- **Fields**:
  - userId (string): Foreign key to User Account (unique)
  - softwareLevel (enum): User's software experience level (beginner, intermediate, advanced)
  - hardwareExperience (enum): User's hardware experience (none, basic, robotics, embedded)
  - primaryFocus (enum): Primary technical focus (software, hardware, both, theory)
  - backgroundDetails (string): Additional background information (optional, max 500 chars)
  - createdAt (datetime): Profile creation timestamp
  - updatedAt (datetime): Last profile update timestamp

## Authentication Session Entity
**Description**: Session information for maintaining user authentication state
- **Fields**:
  - id (string): Unique session identifier
  - userId (string): Foreign key to User Account
  - expiresAt (datetime): Session expiration timestamp
  - createdAt (datetime): Session creation timestamp
  - updatedAt (datetime): Last session update timestamp
  - userAgent (string): Browser/device information (for security)
  - ipAddress (string): IP address of session creation (for security)

## Validation Rules
- **Email**: Must follow standard email format, be unique across all users
- **Password**: Minimum 8 characters, must include at least one number and one special character
- **Software Level**: Must be one of: beginner, intermediate, advanced
- **Hardware Experience**: Must be one of: none, basic, robotics, embedded
- **Primary Focus**: Must be one of: software, hardware, both, theory
- **Background Details**: Maximum 500 characters if provided

## Relationships
- One User Account to One User Profile (1:1)
- One User Account to Many Authentication Sessions (1:M)

## State Transitions
- User Account: Created → Active → (potentially) Suspended/Deactivated
- Authentication Session: Created → Active → Expired/Revoked