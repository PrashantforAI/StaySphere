
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { ROUTES } from '../constants';
import { UserRole } from '../types';
import Header from '../components/layout/Header';

const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        email: user.email,
        displayName,
        role,
        verificationStatus: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        preferences: {
          language: 'en',
          currency: 'INR',
        },
      });

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
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">I am a...</label>
                        <div className="flex rounded-md shadow-sm">
                            <button type="button" onClick={() => setRole(UserRole.GUEST)} className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md focus:z-10 focus:ring-2 focus:ring-primary-500 ${role === UserRole.GUEST ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                                Guest
                            </button>
                            <button type="button" onClick={() => setRole(UserRole.HOST)} className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md focus:z-10 focus:ring-2 focus:ring-primary-500 ${role === UserRole.HOST ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                                Host
                            </button>
                        </div>
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
