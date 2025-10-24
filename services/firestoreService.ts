// FIX: Updated entire file to use Firebase v8 compatibility API for consistency and to fix bugs.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from './firebase';
import { UserProfile, UserRole, Property, Booking } from '../types';

/**
 * Creates a new user profile document in the Firestore 'users' collection.
 * This function is typically called right after a user successfully registers.
 * @param user - The Firebase Auth user object.
 * @param additionalData - Additional profile data like displayName and role.
 * @returns A promise that resolves when the document is successfully written.
 */
export const createUserProfile = async (user: firebase.User, additionalData: { displayName: string; role: UserRole }): Promise<void> => {
  const userDocRef = db.collection('users').doc(user.uid);
  
  const newUserProfile: Omit<UserProfile, 'createdAt' | 'lastLogin' | 'userId' | 'email'> = {
    displayName: additionalData.displayName,
    role: additionalData.role,
    verificationStatus: false,
    preferences: {
      language: 'en',
      currency: 'INR',
    },
  };

  try {
    // Using .set() with merge:true is safer to avoid overwriting data unintentionally.
    await userDocRef.set({
      ...newUserProfile,
      userId: user.uid,
      email: user.email!,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
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
  const userDocRef = db.collection('users').doc(userId);
  try {
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
      // We cast the data to UserProfile, assuming our Firestore data matches the type.
      return userDoc.data() as UserProfile;
    } else {
      console.warn("User profile not found in Firestore for userId:", userId);
      return null;
    }
  } catch (error)
  {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// =================================================================
// Stubs for Future CRUD Operations
// =================================================================

/**
 * (STUB) Creates a new property document in Firestore.
 * @param propertyData - The data for the new property.
 */
// export const createProperty = async (propertyData: Omit<Property, 'propertyId' | 'createdAt' | 'updatedAt' | 'hostId'>, hostId: string): Promise<void> => {
//   try {
//     await db.collection('properties').add({
//       ...propertyData,
//       hostId,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
//     });
//   } catch (error) {
//     console.error("Error creating property:", error);
//     throw error;
//   }
// };

/**
 * (STUB) Creates a new booking document in Firestore.
 * @param bookingData - The data for the new booking.
 */
// export const createBooking = async (bookingData: Omit<Booking, 'bookingId' | 'createdAt' | 'updatedAt'>): Promise<void> => {
//   try {
//     await db.collection('bookings').add({
//       ...bookingData,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
//     });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     throw error;
//   }
// };


/**
 * (STUB) Fetches messages for a given conversation.
 * @param conversationId - The ID of the conversation.
 */
// export const getConversationMessages = async (conversationId: string) => {
//   try {
//     const messagesSnapshot = await db.collection('conversations').doc(conversationId).collection('messages').orderBy('timestamp').get();
//     return messagesSnapshot.docs.map(doc => doc.data());
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     throw error;
//   }
// };
