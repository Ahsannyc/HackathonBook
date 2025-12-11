import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { authClient } from '../services/auth-client';
import { User, UserBackground } from '../services/auth-client';

interface AuthState {
  user: User | null;
  userBackground: UserBackground | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; userBackground: UserBackground } }
  | { type: 'LOGIN_FAILURE'; payload: { error: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: { user: User } }
  | { type: 'UPDATE_BACKGROUND'; payload: { userBackground: UserBackground } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    backgroundData?: {
      softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
      backgroundDetails?: string;
    }
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserBackground: (backgroundData: {
    softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
    backgroundDetails?: string;
  }) => Promise<void>;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  userBackground: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        userBackground: action.payload.userBackground,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        userBackground: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        userBackground: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'UPDATE_BACKGROUND':
      return {
        ...state,
        userBackground: action.payload.userBackground,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { loading: true } });
        const result = await authClient.getCurrentUser();

        if (result) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: result.user,
              userBackground: result.userBackground,
            },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: { loading: false } });
        }
      } catch (error) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: error instanceof Error ? error.message : 'Failed to verify session' },
        });
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const result = await authClient.signIn({ email, password });

      if (result) {
        // Get user background info after successful login
        const userBackgroundResult = await authClient.getCurrentUser();

        if (userBackgroundResult) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: result.user,
              userBackground: userBackgroundResult.userBackground,
            },
          });
        } else {
          dispatch({
            type: 'LOGIN_FAILURE',
            payload: { error: 'Failed to load user background information' },
          });
        }
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: 'Invalid email or password' },
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: error instanceof Error ? error.message : 'Login failed' },
      });
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    backgroundData?: {
      softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
      backgroundDetails?: string;
    }
  ) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const result = await authClient.signUp({
        email,
        password,
        name,
        ...backgroundData,
      });

      if (result) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.user,
            userBackground: result.userBackground,
          },
        });
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: 'Failed to create account' },
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: error instanceof Error ? error.message : 'Signup failed' },
      });
    }
  };

  const logout = async () => {
    try {
      const success = await authClient.signOut();
      if (success) {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: error instanceof Error ? error.message : 'Logout failed' },
      });
    }
  };

  const updateUserBackground = async (backgroundData: {
    softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
    backgroundDetails?: string;
  }) => {
    try {
      const updatedBackground = await authClient.updateUserBackground(backgroundData);
      if (updatedBackground) {
        dispatch({
          type: 'UPDATE_BACKGROUND',
          payload: { userBackground: updatedBackground },
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: error instanceof Error ? error.message : 'Failed to update background' },
      });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateUserBackground,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};