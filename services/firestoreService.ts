// FIX: Updated entire file to use Firebase v8 compatibility API for consistency and to fix bugs.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from './firebase';
import { UserProfile, UserRole, Property, Booking, Message } from '../types';

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

/**
 * Fetches or creates a dedicated AI conversation for a user.
 * @param userId - The ID of the user.
 * @returns The ID of the conversation.
 */
export const getOrCreateAiConversation = async (userId: string): Promise<string> => {
  const conversationCollection = db.collection('conversations');
  // Add a flag to identify AI chats
  const q = conversationCollection
    .where('participants', 'array-contains', userId)
    .where('isAiConversation', '==', true);

  const snapshot = await q.get();
  
  if (!snapshot.empty) {
    // Conversation already exists
    return snapshot.docs[0].id;
  } else {
    // Create a new conversation
    const newConversationRef = await conversationCollection.add({
      participants: [userId, 'ai'],
      isAiConversation: true,
      status: 'active',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return newConversationRef.id;
  }
};

/**
 * Adds a message to a conversation and updates the last message timestamp.
 * @param conversationId - The ID of the conversation.
 * @param message - The message object to add.
 */
export const addMessageToConversation = async (conversationId: string, message: Omit<Message, 'messageId' | 'timestamp' | 'attachments'>): Promise<void> => {
  const conversationRef = db.collection('conversations').doc(conversationId);
  const messagesCollection = conversationRef.collection('messages');
  const batch = db.batch();
  
  const messageRef = messagesCollection.doc();
  batch.set(messageRef, {
      ...message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  
  batch.update(conversationRef, {
      lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  
  await batch.commit();
};

/**
 * Fetches messages for a given conversation, ordered by timestamp.
 * @param conversationId - The ID of the conversation.
 */
export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const messagesSnapshot = await db.collection('conversations').doc(conversationId).collection('messages').orderBy('timestamp', 'asc').get();
    return messagesSnapshot.docs.map(doc => ({ messageId: doc.id, ...doc.data() } as Message));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
