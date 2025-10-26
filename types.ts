// FIX: Replaced the v9 modular import for Timestamp with the v8 compatibility version.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export type Timestamp = firebase.firestore.Timestamp;

export enum UserRole {
  GUEST = "guest",
  HOST = "host",
  SERVICE_PROVIDER = "service_provider",
  ADMIN = "admin",
}

export interface UserProfile {
  userId: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  displayName: string;
  profileImage?: string;
  verificationStatus: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  preferences: {
    language: "en" | "hi" | "mr";
    currency: "INR";
  };
}

export enum PropertyType {
    VILLA = "villa",
    APARTMENT = "apartment",
    COTTAGE = "cottage",
    UNIQUE = "unique"
}

export enum PropertyStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive"
}

// Added HostProfile and Review types to enrich property data
export interface HostProfile {
  hostId: string;
  name: string;
  profileImage: string;
  rating: number;
  responseTime: string; // e.g., "within an hour"
}

export interface Review {
  reviewId: string;
  guestId: string;
  guestName: string;
  guestImage: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}


export interface Property {
  propertyId: string;
  hostId: string;
  host: HostProfile; // Embed host info
  title: string;
  description: string;
  propertyType: PropertyType;
  location: {
    city: string;
    area: string;
    state: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
  };
  pricing: {
    basePrice: number;
    weekendPrice: number;
    cleaningFee: number;
    securityDeposit: number;
  };
  capacity: {
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
  };
  amenities: string[];
  images: { url: string; caption: string; order: number }[];
  rules: {
    checkIn: string;
    checkOut: string;
    petFriendly: boolean;
    smokingAllowed: boolean;
    eventsAllowed: boolean;
    vegAllowed: boolean;
    nonVegAllowed: boolean;
  };
  availability: {
    calendarSyncUrl?: string;
    blockedDates: { start: string; end: string; reason: string }[]; // Dates as YYYY-MM-DD strings
  };
  status: PropertyStatus;
  subscriptionTier: "free" | "pro" | "business" | "ultra";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ratings: {
    average: number;
    count: number;
  };
  reviews: Review[]; // Embed reviews
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    REFUNDED = "refunded",
    FAILED = "failed",
}

export enum BookingStatus {
    PENDING_CONFIRMATION = "pending_confirmation",
    CONFIRMED = "confirmed",
    CANCELLED_BY_GUEST = "cancelled_by_guest",
    CANCELLED_BY_HOST = "cancelled_by_host",
    COMPLETED = "completed",
    ONGOING = "ongoing",
}

export interface PaymentDetails {
    paymentId?: string; // e.g., from Razorpay
    method?: string;
    amount: number;
    currency: "INR";
    status: PaymentStatus;
    transactionTimestamp?: Timestamp;
}

export interface Booking {
  bookingId: string;
  propertyId: string;
  propertyTitle: string; // Denormalized for easy display
  propertyImage: string; // Denormalized for easy display
  guestId: string;
  hostId: string;
  checkIn: string; // Stored as YYYY-MM-DD
  checkOut: string; // Stored as YYYY-MM-DD
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  pricing: {
    nights: number;
    subtotal: number; // basePrice * nights
    cleaningFee: number;
    platformFee: number; // Guest service fee
    gst: number; // GST on platformFee
    total: number;
  };
  payment: PaymentDetails;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// FIX: Added the missing Message interface to be used for chat functionality.
export interface Message {
  messageId: string;
  senderId: string; // The user's UID or a special ID like 'ai'
  senderType: UserRole | 'ai';
  content: string;
  timestamp: Timestamp;
  attachments?: { type: 'image' | 'file'; url: string }[];
  read: boolean;
}


export interface Notification {
    notificationId: string;
    userId: string; // The user who should see this notification
    title: string;
    message: string;
    type: "new_booking" | "booking_confirmed" | "booking_cancelled" | "review_request" | "payout_processed" | "new_service_request" | "service_job_accepted";
    referenceId: string; // e.g., bookingId
    isRead: boolean;
    createdAt: Timestamp;
}


export interface PropertySearchFilters {
  location?: string;
  guests?: {
    adults: number;
    kids: number;
    infants: number;
  };
  checkIn?: string; // Stored as YYYY-MM-DD
  checkOut?: string; // Stored as YYYY-MM-DD
  amenities?: string[];
  priceMin?: number;
  priceMax?: number;
  isPetFriendly?: boolean;
  isVegAllowed?: boolean;
  isNonVegAllowed?: boolean;
}

export interface PaymentHistory {
    invoiceId: string;
    date: Timestamp;
    amount: number;
    paymentMethod: string; // e.g., 'UPI', 'Credit Card **** 1234'
    status: 'Paid' | 'Failed';
    description: string; // e.g., 'Pro Plan - Monthly Subscription'
    downloadUrl?: string; // Link to a PDF invoice
}

// --- SERVICE PROVIDER MARKETPLACE TYPES ---

export type ServiceSpecialty = 'cleaning' | 'plumbing' | 'electrical' | 'photography' | 'catering' | 'pest_control';

export interface ServiceProviderProfile {
    providerId: string; // Same as userProfile.userId
    displayName: string;
    profileImage: string;
    bio: string;
    specialties: ServiceSpecialty[];
    serviceLocations: string[]; // e.g., ['Mumbai', 'Thane']
    basePricing: string; // e.g., "Starts from ₹500/hr"
    portfolio: { type: 'image' | 'video'; url: string; caption: string }[];
    verificationStatus: 'pending' | 'approved' | 'rejected';
    rating: number; // Average rating
    reviewCount: number;
}

export enum ServiceBookingStatus {
    REQUESTED = "requested", // Host has sent a request
    APPLIED = "applied", // One or more providers have applied
    ACCEPTED = "accepted", // Host accepted a provider
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export interface ServiceBooking {
    serviceBookingId: string;
    hostId: string;
    propertyId: string;
    propertyTitle: string;
    providerId?: string; // The provider who was accepted for the job
    applicants: { providerId: string; providerName: string; providerImage: string }[];
    serviceType: ServiceSpecialty;
    requestedDate: string; // YYYY-MM-DD
    notes: string;
    status: ServiceBookingStatus;
    cost?: number;
    createdAt: Timestamp;
}

export interface ServiceReview {
    reviewId: string;
    hostId: string;
    providerId: string;
    serviceBookingId: string;
    rating: number; // 1-5
    comment: string;
    createdAt: Timestamp;
}
