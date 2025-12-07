import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { software_background: string; hardware_background: string } | null;
  login: (software: string, hardware: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ software_background: string; hardware_background: string } | null>(null);

  const login = (software: string, hardware: string) => {
    setIsAuthenticated(true);
    setUser({ software_background: software, hardware_background: hardware });
    // In a real app, this would involve API calls and token management
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default Root component provided by Docusaurus, wrapped with AuthProvider
export default function Root({ children }: { children: ReactNode }): JSX.Element {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}