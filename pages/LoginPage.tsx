
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Removed modular import for signInWithEmailAndPassword, as it will be called as a method on the auth object.
import { auth } from '../services/firebase';
import { ROUTES } from '../constants';
import Header from '../components/layout/Header';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FIX: Switched to the v8 compat API style: auth.signInWithEmailAndPassword()
      await auth.signInWithEmailAndPassword(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        setError('Firebase configuration error. The API key is invalid. Please check the setup instructions.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Login to StaySphere AI</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
            <form onSubmit={handleLogin}>
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email
                </label>
                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
                </label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
            </form>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="font-bold text-primary-600 hover:text-primary-500">
                Sign up
            </Link>
            </p>
        </div>
        </div>
    </div>
  );
};

export default LoginPage;
