import React, { useEffect } from 'react';
import { AuthProvider } from './components/auth/AuthContext';
import useIsBrowser from '@docusaurus/useIsBrowser';

// Root component that wraps the entire application
export default function Root({ children }) {
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (isBrowser) {
      // Handle redirect path from 404 page
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath) {
        sessionStorage.removeItem('redirectPath');
        // Only redirect if we're not already at the intended path
        if (window.location.href !== redirectPath) {
          // Use window.location.replace to avoid adding to browser history
          window.location.replace(redirectPath);
        }
      }
    }
  }, [isBrowser]);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}