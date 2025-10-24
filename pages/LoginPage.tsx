import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Removed modular import for signInWithEmailAndPassword, as it will be called as a method on the auth object.
import { auth } from '../services/firebase';
import { ROUTES } from '../constants';
import Header from '../components/layout/Header';
import { dummyUsers } from '../data/dummyUsers';
import { createUserProfile } from '../services/firestoreService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDummy, setLoadingDummy] = useState<string | null>(null);
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

  /**
   * Handles one-click login for dummy users.
   * If the user doesn't exist in Firebase Auth, it automatically creates the user
   * and their profile before logging them in.
   * @param dummy - The dummy user object from dummyUsers.ts
   */
  const handleDummyLogin = async (dummy: typeof dummyUsers[0]) => {
    setLoadingDummy(dummy.email);
    setError('');
    try {
        await auth.signInWithEmailAndPassword(dummy.email, dummy.password);
        navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            // User doesn't exist, so we register them automatically
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(dummy.email, dummy.password);
                const user = userCredential.user;
                if (!user) throw new Error("Auto-registration failed.");
                await user.updateProfile({ displayName: dummy.displayName });
                await createUserProfile(user, { displayName: dummy.displayName, role: dummy.role });
                navigate(ROUTES.DASHBOARD);
            } catch (regError: any) {
                 setError(`Auto-registration failed: ${regError.message}`);
            }
        } else {
             setError(err.message);
        }
    } finally {
        setLoadingDummy(null);
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

            {/* Dummy User Login Section */}
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or one-click login</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                    {dummyUsers.map((user) => (
                        <button
                            key={user.email}
                            onClick={() => handleDummyLogin(user)}
                            disabled={!!loadingDummy}
                            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-wait"
                        >
                           {loadingDummy === user.email ? 'Please wait...' : `Log in as ${user.displayName} (${user.role})`}
                        </button>
                    ))}
                </div>
            </div>

        </div>
        </div>
    </div>
  );
};

export default LoginPage;