import { db } from './firebase';
import firebase from 'firebase/compat/app';
import { Booking, Notification, ServiceBooking } from '../types';

/**
 * Creates a notification document in Firestore.
 * @param notification - The notification data to save.
 */
const createNotification = async (notification: Omit<Notification, 'notificationId' | 'createdAt' | 'isRead'>): Promise<void> => {
    try {
        await db.collection('notifications').add({
            ...notification,
            isRead: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

/**
 * --- NOTIFICATION TRIGGER STUBS ---
 * These functions would be called from a backend environment (like Firebase Functions)
 * in a real application. For now, they are stubs to show the logic.
 */

/**
 * Sends notifications when a new booking is created.
 * @param booking - The newly created booking object.
 */
export const onNewBookingCreated = async (booking: Booking): Promise<void> => {
    // Notify the host
    await createNotification({
        userId: booking.hostId,
        title: 'New Booking Request!',
        message: `You have a new booking request for ${booking.propertyTitle} from ${booking.checkIn}.`,
        type: 'new_booking',
        referenceId: booking.bookingId,
    });
    console.log(`[Notification Stub] Sent 'new_booking' notification to host ${booking.hostId}`);
};

/**
 * Sends notifications when a booking is confirmed.
 * @param booking - The confirmed booking object.
 */
export const onBookingConfirmed = async (booking: Booking): Promise<void> => {
     // Notify the guest
    await createNotification({
        userId: booking.guestId,
        title: 'Your Booking is Confirmed!',
        message: `Your booking for ${booking.propertyTitle} from ${booking.checkIn} is confirmed.`,
        type: 'booking_confirmed',
        referenceId: booking.bookingId,
    });
    console.log(`[Notification Stub] Sent 'booking_confirmed' notification to guest ${booking.guestId}`);
};

/**
 * Sends notifications when a booking is cancelled.
 * @param booking - The cancelled booking object.
 * @param cancelledBy - Who cancelled the booking.
 */
export const onBookingCancelled = async (booking: Booking, cancelledBy: 'guest' | 'host'): Promise<void> => {
    const recipientId = cancelledBy === 'guest' ? booking.hostId : booking.guestId;
    await createNotification({
        userId: recipientId,
        title: 'Booking Cancelled',
        message: `Your booking for ${booking.propertyTitle} from ${booking.checkIn} has been cancelled.`,
        type: 'booking_cancelled',
        referenceId: booking.bookingId,
    });
    console.log(`[Notification Stub] Sent 'booking_cancelled' notification to user ${recipientId}`);
};

/**
 * Sends notifications when a host payout is processed.
 * @param hostId The ID of the host who received the payout.
 * @param amount The amount of the payout.
 * @param bookingIds The list of booking IDs included in this payout.
 */
export const onPayoutProcessed = async (hostId: string, amount: number, bookingIds: string[]): Promise<void> => {
    await createNotification({
        userId: hostId,
        title: 'Payout Sent!',
        message: `A payout of ₹${amount.toLocaleString('en-IN')} for ${bookingIds.length} bookings has been sent.`,
        type: 'payout_processed',
        referenceId: bookingIds.length > 0 ? bookingIds[0] : '', // Reference the first booking.
    });
    console.log(`[Notification Stub] Sent 'payout_processed' notification to host ${hostId}`);
};


/**
 * Sends notifications to relevant providers when a new service request is created.
 * @param serviceBooking - The new service booking request.
 */
export const onServiceRequestCreated = async (serviceBooking: ServiceBooking): Promise<void> => {
    // In a real app, you'd find providers matching the specialty and location
    // and create a notification for each of them.
    console.log(`[Notification Stub] A new service request for '${serviceBooking.serviceType}' on '${serviceBooking.propertyTitle}' was created. Relevant providers should be notified.`);
};

/**
 * Sends a notification to a provider when their application for a job is accepted.
 * @param serviceBooking - The service booking that has been accepted.
 */
export const onServiceJobAccepted = async (serviceBooking: ServiceBooking): Promise<void> => {
    if (!serviceBooking.providerId) return;
    await createNotification({
        userId: serviceBooking.providerId,
        title: 'You got the job!',
        message: `Your application for the '${serviceBooking.serviceType}' job at '${serviceBooking.propertyTitle}' has been accepted.`,
        type: 'service_job_accepted',
        referenceId: serviceBooking.serviceBookingId,
    });
    console.log(`[Notification Stub] Sent 'service_job_accepted' notification to provider ${serviceBooking.providerId}`);
};
