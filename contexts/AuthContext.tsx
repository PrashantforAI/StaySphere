import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
// FIX: Updated Firebase imports to use the v8 compatibility API.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../services/firebase';
import { UserProfile } from '../types';
import { getUserProfile } from '../services/firestoreService';

interface AuthContextType {
  // FIX: Used firebase.User type from the compatibility library.
  currentUser: firebase.User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // FIX: Used firebase.User type from the compatibility library.
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Switched to the onAuthStateChanged method from the auth service object.
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch user profile from Firestore using the centralized service
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ currentUser, userProfile, loading }), [currentUser, userProfile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
