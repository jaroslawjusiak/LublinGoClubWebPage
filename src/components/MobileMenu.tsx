import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip } from './primitives';

/**
 * @description An accessible mobile navigation menu with a state-driven toggle.
 */
const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={toggleMenu}
        className="p-2 text-ink hover:bg-gray-100 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaya/70"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-list"
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id="mobile-menu-list"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="flex flex-col p-4 border-t border-border space-y-2">
          <Link to="/zacznij" className="block py-3 text-lg font-medium hover:text-kaya transition duration-150">
            Zacznij
          </Link>
          <Link to="/o-klubie" className="block py-3 text-lg font-medium hover:text-kaya transition duration-150">
            O klubie
          </Link>
          <Link to="/aktualnosci" className="block py-3 text-lg font-medium hover:text-kaya transition duration-150">
            Aktualności
          </Link>
          <Link to="/kontakt" className="block py-3 text-lg font-medium hover:text-kaya transition duration-150">
            Kontakt
          </Link>

          <div className="flex justify-between items-center pt-4 border-t border-border mt-2">
            <Chip text="PL" />
            <Button to="/zacznij" variant="primary" className="py-2 px-4">
              Zacznij grać
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
