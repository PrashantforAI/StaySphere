import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Removed modular imports for auth functions, as they will be called as methods on the auth/user objects.
import { auth } from '../services/firebase';
import { createUserProfile } from '../services/firestoreService';
import { ROUTES } from '../constants';
import { UserRole } from '../types';
import Header from '../components/layout/Header';

const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!displayName || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("User creation failed.");
      }

      // 2. Update Auth user's display name
      await user.updateProfile({ displayName });

      // 3. Create user profile in Firestore with default GUEST role
      await createUserProfile(user, { displayName, role: UserRole.GUEST });
      
      // 4. Redirect to the main dashboard
      navigate(ROUTES.DASHBOARD);

    } catch (err: any) {
      if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        setError('Firebase configuration error. The API key is invalid. Please check the setup instructions.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use by another account.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. It should be at least 6 characters long.');
      }
      else {
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
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Create an Account</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="displayName">
                            Full Name
                        </label>
                        <input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} className="font-bold text-primary-600 hover:text-primary-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default RegisterPage;