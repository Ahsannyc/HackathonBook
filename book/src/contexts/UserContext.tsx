import React, { createContext, useState, useContext, ReactNode } from 'react';

type SoftwareBackground = 'Beginner' | 'Intermediate' | 'Expert' | null;

interface UserContextType {
  softwareBackground: SoftwareBackground;
  setSoftwareBackground: (background: SoftwareBackground) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [softwareBackground, setSoftwareBackground] = useState<SoftwareBackground>(null);

  // In a real application, this would load from local storage or user session
  // For now, we'll manually set it for testing or through a mock UI

  return (
    <UserContext.Provider value={{ softwareBackground, setSoftwareBackground }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
