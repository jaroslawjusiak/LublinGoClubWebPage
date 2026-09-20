// src/components/AppLayout.tsx
import React from 'react';
/** 
 * @component AppLayout 
 * @description Provides global styling and layout context for the application. 
 * Children components (like <Header />) will be placed inside this container structure.
 */
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-ink">
      {children}
    </div>
  );
};

export default AppLayout;