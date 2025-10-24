
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ROUTES } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary-600 dark:text-primary-400 mb-4">
          Welcome to StaySphere AI
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          Discover your next perfect getaway in India, powered by intelligent assistance. Find unique stays, manage your properties, and connect seamlessly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={ROUTES.LOGIN}
            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition duration-300"
          >
            Login
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="px-8 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition duration-300"
          >
            Register
          </Link>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} StaySphere AI. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
