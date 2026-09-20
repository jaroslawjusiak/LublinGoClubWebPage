import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Assuming updated Header component is available
import Footer from './Footer'; 

/**
 * @description The main application layout wrapper.
 * This component enforces consistent structure (Header -> Content/Outlet -> Footer)
 * across all primary pages and ensures correct semantic HTML usage.
 */
const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-stone-800">
      {/* 1. Global Header Component */}
      <Header />

      {/* Main Content Area - Uses Outlet for dynamic page content */}
      <main role="main" aria-live="polite" className="flex-grow pt-16"> {/* Added padding top to prevent layout shift under sticky header */}
        <Outlet /> 
      </main>

      {/* 3. Global Footer Component */}
      <Footer />
    </div>
  );
};

export default AppLayout;