
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { ROUTES } from '../../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={ROUTES.HOME} className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          StaySphere AI
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
