
import React from 'react';
import { useUser } from '@site/src/contexts/UserContext';

interface PersonalizedContentProps {
  children: React.ReactNode;
  requiredBackground: 'Beginner' | 'Expert';
}

const PersonalizedContent: React.FC<PersonalizedContentProps> = ({
  children,
  requiredBackground,
}) => {
  const { softwareBackground } = useUser();

  if (softwareBackground === requiredBackground) {
    return <>{children}</>;
  }
  return null;
};

export default PersonalizedContent;
