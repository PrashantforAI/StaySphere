
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

export interface Property {
  propertyId: string;
  hostId: string;
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
  };
  availability: {
    calendarSyncUrl?: string;
    blockedDates: { start: Date; end: Date; reason: string }[];
  };
  status: PropertyStatus;
  subscriptionTier: "free" | "pro" | "business" | "ultra";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ratings: {
    average: number;
    count: number;
  };
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    REFUNDED = "refunded"
}

export enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}


export interface Booking {
  bookingId: string;
  propertyId: string;
  guestId: string;
  hostId: string;
  checkIn: Date;
  checkOut: Date;
  guests: { adults: number; children: number };
  pricing: {
    subtotal: number;
    platformFee: number;
    gst: number;
    total: number;
  };
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Conversation {
  conversationId: string;
  participants: string[];
  propertyId?: string; // Optional for AI chats
  isAiConversation?: boolean; // Flag for AI chats
  aiSummary?: string;
  status: "active" | "archived";
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
}

export interface Message {
  messageId: string;
  senderId: string;
  senderType: "guest" | "host" | "ai" | "system";
  content: string;
  attachments?: string[];
  timestamp: Timestamp;
  read: boolean;
}

export interface PropertySearchFilters {
  location?: string;
  guests?: number;
  amenities?: string[];
  priceMin?: number;
  priceMax?: number;
}