import React from 'react';
import Component from '@docusaurus/Component';
import PersonalizedContent from '@site/src/components/PersonalizedContent';
import RagChat from '@site/src/components/RagChat';
import Details from '@theme/Details';

// Define the missing components that are referenced in MD files
const BeginnerBackground: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="personalization-hook" data-background="Beginner">
    <h4>For Beginners:</h4>
    <div>{children}</div>
  </div>
);

const ExpertBackground: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="personalization-hook" data-background="Expert">
    <h4>For Experts:</h4>
    <div>{children}</div>
  </div>
);

const IntermediateBackground: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="personalization-hook" data-background="Intermediate">
    <h4>For Intermediate:</h4>
    <div>{children}</div>
  </div>
);

// Export all MDX components
const MDXComponents = {
  BeginnerBackground,
  ExpertBackground,
  IntermediateBackground,
  PersonalizedContent,
  RagChat,
  Details, // Add the Details component that Docusaurus uses
  // You can add more custom components here as needed
};

export default MDXComponents;