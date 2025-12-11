import React from 'react';

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface DefaultFallbackProps {
  error?: Error;
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({ error }) => {
  return (
    <div className="auth-error-fallback">
      <h2>Something went wrong with authentication</h2>
      {error && <p>Error: {error.message}</p>}
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  );
};

export default AuthErrorBoundary;