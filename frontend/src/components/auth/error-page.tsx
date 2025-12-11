import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  message?: string;
  errorCode?: string;
  showHomeLink?: boolean;
  showBackLink?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'An error occurred',
  message = 'Something went wrong. Please try again.',
  errorCode,
  showHomeLink = true,
  showBackLink = true,
}) => {
  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon">
          <i className="error-icon-symbol">⚠️</i>
        </div>

        <h1>{title}</h1>

        {errorCode && (
          <div className="error-code">
            Error: {errorCode}
          </div>
        )}

        <p>{message}</p>

        <div className="error-actions">
          {showBackLink && (
            <button
              className="error-button secondary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          )}

          {showHomeLink && (
            <Link to="/" className="error-button primary">
              Go to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;