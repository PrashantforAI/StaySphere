// FIX: Updated entire file to use Firebase v8 compatibility API for consistency and to fix bugs.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from './firebase';
import { UserProfile, UserRole, Property, Booking, Message, BookingStatus, PropertyStatus, Notification, PaymentHistory, ServiceProviderProfile, ServiceBooking, ServiceSpecialty } from '../types';
import { dummyProperties, dummyBookings, dummyNotifications, dummyPaymentHistory, dummyServiceProviders, dummyServiceBookings } from '../data/dummyData';

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

    // If the user is a service provider, create their provider profile
    if (additionalData.role === UserRole.SERVICE_PROVIDER) {
        const providerProfileRef = db.collection('serviceProviders').doc(user.uid);
        await providerProfileRef.set({
            providerId: user.uid,
            displayName: additionalData.displayName,
            profileImage: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            verificationStatus: 'pending',
            rating: 0,
            reviewCount: 0,
            specialties: [],
            serviceLocations: [],
            // Other fields will be added during onboarding
        }, { merge: true });
    }

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

/**
 * Fetches notifications for a given user, ordered by creation date.
 * NOTE: This currently simulates a DB fetch using local dummy data.
 * @param userId The user ID to fetch notifications for.
 * @returns A promise that resolves to an array of Notification objects.
 */
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, you'd fetch from Firestore and filter by userId
    const userNotifications = dummyNotifications.filter(n => n.userId === 'host@staysphere.com' || n.userId === 'guest@staysphere.com');
    return userNotifications.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
};

/**
 * Marks a single notification as read.
 * NOTE: This currently simulates a DB update using local dummy data.
 * @param notificationId The ID of the notification to update.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const notif = dummyNotifications.find(n => n.notificationId === notificationId);
    if (notif) {
        notif.isRead = true;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(`[SIMULATION] Marked notification ${notificationId} as read.`);
    /*
    In a real app, you would run:
    await db.collection('notifications').doc(notificationId).update({ isRead: true });
    */
};

/**
 * Fetches payment history for a user.
 * NOTE: This currently simulates a DB fetch using local dummy data.
 * @param userId The user ID to fetch payment history for.
 * @returns A promise that resolves to an array of PaymentHistory objects.
 */
export const getPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyPaymentHistory;
};


// =================================================================
// BOOKING-RELATED FIRESTORE FUNCTIONS
// =================================================================

/**
 * Creates a new booking document in Firestore.
 * @param bookingData - The booking data to be saved.
 * @returns The ID of the newly created booking document.
 */
export const createBooking = async (bookingData: Omit<Booking, 'bookingId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
        const docRef = await db.collection('bookings').add({
            ...bookingData,
            bookingStatus: BookingStatus.PENDING_CONFIRMATION,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating booking:", error);
        throw new Error("Failed to create booking in Firestore.");
    }
};

/**
 * Fetches a single booking by its ID.
 * @param bookingId The ID of the booking to fetch.
 * @returns A promise that resolves to the Booking object or null if not found.
 */
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
    try {
        // NOTE: Simulating fetch from dummy data
        await new Promise(resolve => setTimeout(resolve, 300));
        const booking = dummyBookings.find(b => b.bookingId === bookingId) || null;
        return booking;
    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        throw error;
    }
};


/**
 * Fetches all bookings for a specific guest.
 * @param guestId The user ID of the guest.
 * @returns A promise that resolves to an array of Booking objects.
 */
export const getGuestBookings = async (guestId: string): Promise<Booking[]> => {
    try {
        // NOTE: Using dummy data for demonstration.
        // In a real app, you would perform a Firestore query:
        // const snapshot = await db.collection('bookings').where('guestId', '==', guestId).get();
        await new Promise(resolve => setTimeout(resolve, 500));
        const bookings = dummyBookings.filter(b => b.guestId === 'guest@staysphere.com');
        
        // Sort the results by check-in date in descending order on the client.
        bookings.sort((a, b) => b.checkIn.localeCompare(a.checkIn));

        return bookings;
    } catch (error) {
        console.error("Error fetching guest bookings:", error);
        throw error;
    }
};

/**
 * Fetches all bookings for a specific host.
 * @param hostId The user ID of the host.
 * @returns A promise that resolves to an array of Booking objects.
 */
export const getHostBookings = async (hostId: string): Promise<Booking[]> => {
    try {
        // NOTE: Using dummy data for demonstration.
        // In a real app, you would perform a Firestore query:
        // const snapshot = await db.collection('bookings').where('hostId', '==', hostId).get();
        await new Promise(resolve => setTimeout(resolve, 500));
        const bookings = dummyBookings.filter(b => b.hostId === 'host@staysphere.com');

        // Sort the results by check-in date in descending order on the client.
        bookings.sort((a, b) => b.checkIn.localeCompare(a.checkIn));

        return bookings;
    } catch (error) {
        console.error("Error fetching host bookings:", error);
        throw error;
    }
};


/**
 * Updates the status of a booking (e.g., to confirmed or cancelled).
 * @param bookingId The ID of the booking to update.
 * @param newStatus The new BookingStatus.
 * @returns A promise that resolves when the update is complete.
 */
export const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus): Promise<void> => {
    try {
        // This would update Firestore in a real app.
        console.log(`[SIMULATION] Updating booking ${bookingId} to status ${newStatus}`);
        // To make the UI update, we can modify the dummy data in-memory (this is for demo only)
        const bookingIndex = dummyBookings.findIndex(b => b.bookingId === bookingId);
        if (bookingIndex !== -1) {
            dummyBookings[bookingIndex].bookingStatus = newStatus;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        return;
        /*
        await db.collection('bookings').doc(bookingId).update({
            bookingStatus: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        */
    } catch (error) {
        console.error("Error updating booking status:", error);
        throw error;
    }
};


// =================================================================
// PROPERTY-RELATED FIRESTORE FUNCTIONS
// =================================================================

/**
 * Creates a new property document in Firestore.
 * @param propertyData - The initial data for the property.
 * @returns The ID of the newly created property document.
 */
export const addProperty = async (propertyData: Partial<Property>): Promise<string> => {
    try {
        const docRef = await db.collection('properties').add({
            ...propertyData,
            status: propertyData.status || PropertyStatus.DRAFT,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding property:", error);
        throw new Error("Failed to create property in Firestore.");
    }
};

/**
 * Updates an existing property document in Firestore.
 * @param propertyId - The ID of the property to update.
 * @param propertyData - An object containing the fields to update.
 */
export const updateProperty = async (propertyId: string, propertyData: Partial<Property>): Promise<void> => {
    try {
        await db.collection('properties').doc(propertyId).update({
            ...propertyData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating property:", error);
        throw new Error("Failed to update property in Firestore.");
    }
};

/**
 * Fetches all properties belonging to a specific host.
 * @param hostId The user ID of the host.
 * @returns A promise that resolves to an array of Property objects.
 */
export const getHostProperties = async (hostId: string): Promise<Property[]> => {
    try {
        // NOTE: For a real app, you'd fetch from Firestore. We'll simulate this.
        console.log(`Simulating fetch for host properties: ${hostId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        // We filter properties for our dummy host.
        return dummyProperties.filter(p => p.hostId === 'host@staysphere.com');
    } catch (error) {
        console.error("Error fetching host properties:", error);
        throw error;
    }
};


/**
 * Fetches a single property by its ID.
 * NOTE: This currently simulates a DB fetch using local dummy data.
 * @param propertyId The ID of the property to fetch.
 * @returns A promise that resolves to the Property object or null if not found.
 */
export const getPropertyById = async (propertyId: string): Promise<Property | null> => {
    // Simulate async fetch
    await new Promise(resolve => setTimeout(resolve, 300));
    const property = dummyProperties.find(p => p.propertyId === propertyId);
    return property || null;
};


// =================================================================
// SERVICE PROVIDER MARKETPLACE FUNCTIONS (SIMULATED)
// =================================================================

/**
 * Fetches service providers based on optional filters.
 */
export const getServiceProviders = async (filters: { specialty?: ServiceSpecialty, location?: string }): Promise<ServiceProviderProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let providers = dummyServiceProviders;
    if (filters.specialty) {
        providers = providers.filter(p => p.specialties.includes(filters.specialty!));
    }
    if (filters.location) {
        providers = providers.filter(p => p.serviceLocations.some(l => l.toLowerCase().includes(filters.location!.toLowerCase())));
    }
    return providers;
};

/**
 * Fetches a single service provider by their ID.
 */
export const getServiceProviderById = async (providerId: string): Promise<ServiceProviderProfile | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return dummyServiceProviders.find(p => p.providerId === providerId) || null;
};


/**
 * Creates a new service request.
 */
export const createServiceRequest = async (requestData: Omit<ServiceBooking, 'serviceBookingId' | 'createdAt'>): Promise<string> => {
    console.log("[SIMULATION] Creating new service request:", requestData);
    await new Promise(resolve => setTimeout(resolve, 300));
    const newBookingId = `sb_${Math.random().toString(36).substr(2, 9)}`;
    dummyServiceBookings.push({
        ...requestData,
        serviceBookingId: newBookingId,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    });
    return newBookingId;
};

/**
 * Fetches all service bookings requested by a specific host.
 */
export const getServiceBookingsForHost = async (hostId: string): Promise<ServiceBooking[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyServiceBookings.filter(sb => sb.hostId === hostId)
        .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
};

/**
 * Fetches all service bookings relevant to a specific provider.
 */
export const getServiceBookingsForProvider = async (providerId: string): Promise<ServiceBooking[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Relevant jobs are those the provider has applied to OR has been accepted for.
    return dummyServiceBookings.filter(sb => sb.providerId === providerId || sb.applicants.some(a => a.providerId === providerId))
         .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
};

/**
 * Fetches all service requests that are open for applications.
 */
export const getOpenServiceRequests = async (): Promise<ServiceBooking[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyServiceBookings.filter(sb => sb.status === 'requested');
};
