import React from 'react';
import { AuthProvider } from './components/auth/AuthContext';

// Root component that wraps the entire application
export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}