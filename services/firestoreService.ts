import { doc, getDoc, setDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
// FIX: Updated Firebase imports to use the v8 compatibility API.
import firebase from 'firebase/compat/app';
import { db } from './firebase';
import { UserProfile, UserRole } from '../types';

/**
 * Creates a new user profile document in the Firestore 'users' collection.
 * This function is typically called right after a user successfully registers.
 * @param user - The Firebase Auth user object.
 * @param additionalData - Additional profile data like displayName and role.
 * @returns A promise that resolves when the document is successfully written.
 */
// FIX: Used firebase.User type from the compatibility library.
export const createUserProfile = async (user: firebase.User, additionalData: { displayName: string; role: UserRole }): Promise<void> => {
  const userDocRef = doc(db, 'users', user.uid);
  
  const newUserProfile: Omit<UserProfile, 'createdAt' | 'lastLogin'> = {
    userId: user.uid,
    email: user.email!,
    displayName: additionalData.displayName,
    role: additionalData.role,
    verificationStatus: false,
    preferences: {
      language: 'en',
      currency: 'INR',
    },
  };

  try {
    await setDoc(userDocRef, {
      ...newUserProfile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile in Firestore:", error);
    // Re-throw the error to be handled by the calling function (e.g., in the UI)
    throw error;
  }
};

/**
 * Fetches a user's profile from the Firestore 'users' collection.
 * @param userId - The unique ID of the user.
 * @returns A promise that resolves with the user's profile data, or null if not found.
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      // We cast the data to UserProfile, assuming our Firestore data matches the type.
      return userDoc.data() as UserProfile;
    } else {
      console.warn("User profile not found in Firestore for userId:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// =================================================================
// Stubs for Future CRUD Operations
// =================================================================

// Example stub for creating a property
// export const createProperty = async (propertyData: Omit<Property, 'propertyId' | 'createdAt' | 'updatedAt'>) => {
//   // const propertiesCollectionRef = collection(db, 'properties');
//   // await addDoc(propertiesCollectionRef, { ...propertyData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
// };

// Example stub for getting all properties
// export const getProperties = async (): Promise<Property[]> => {
//   // const snapshot = await getDocs(collection(db, 'properties'));
//   // return snapshot.docs.map(doc => ({ ...doc.data(), propertyId: doc.id })) as Property[];
// };
