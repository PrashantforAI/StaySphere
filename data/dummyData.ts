import { Booking, BookingStatus, PaymentStatus, Property, Review, Notification, PaymentHistory, PropertyStatus } from "../types";

const nowInSeconds = Math.floor(Date.now() / 1000);
const createMockTimestamp = (offsetSeconds = 0) => ({
    seconds: nowInSeconds - offsetSeconds,
    nanoseconds: 0
});


// Dummy host profiles
const dummyHosts = {
    'host001': {
        hostId: 'host001',
        name: 'Rajesh Kumar',
        profileImage: 'https://i.pravatar.cc/150?u=host001',
        rating: 4.9,
        responseTime: 'within an hour'
    },
    'host002': {
        hostId: 'host002',
        name: 'Priya Mehta',
        profileImage: 'https://i.pravatar.cc/150?u=host002',
        rating: 4.8,
        responseTime: 'within a few hours'
    }
};

// Dummy reviews
const dummyReviews: Review[] = [
    { reviewId: 'rev001', guestId: 'guest001', guestName: 'Anjali Sharma', guestImage: 'https://i.pravatar.cc/150?u=guest001', rating: 5, comment: 'Absolutely stunning villa with breathtaking views. The host was incredibly helpful. A perfect getaway!', createdAt: createMockTimestamp(86400 * 2) as any },
    { reviewId: 'rev002', guestId: 'guest002', guestName: 'Vikram Singh', guestImage: 'https://i.pravatar.cc/150?u=guest002', rating: 4, comment: 'Great location and very clean. The pool was fantastic. Would recommend!', createdAt: createMockTimestamp(86400 * 5) as any },
];


/**
 * An expanded list of dummy properties to provide a richer dataset for testing.
 * This data is used to simulate property listings for search and AI interactions.
 */
export const dummyProperties: Property[] = [
  {
    propertyId: 'prop001', hostId: 'host@staysphere.com',
    host: dummyHosts['host001'],
    title: 'Serene Beachfront Villa', 
    description: 'Escape to our stunning 4-bedroom villa right on the shores of Goa. Enjoy private beach access, a magnificent infinity pool, and breathtaking sunsets every evening. Perfect for families and groups looking for a luxurious coastal retreat.',
    location: { city: 'Goa', state: 'Goa', coordinates: { lat: 15.3, lng: 73.8 }, area: 'Candolim', pincode: '403515' },
    pricing: { basePrice: 15000, weekendPrice: 18000, cleaningFee: 1000, securityDeposit: 5000 },
    images: [
        { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop', caption: 'Villa exterior', order: 1 },
        { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', caption: 'Pool area', order: 2 },
        { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop', caption: 'Living room', order: 3 },
    ],
    ratings: { average: 4.9, count: 120 }, 
    capacity: { maxGuests: 8, bedrooms: 4, bathrooms: 4, beds: [{type: 'king', count: 4}] }, 
    amenities: {
        'Featured': ['Pool', 'Wifi', 'Beach access', 'AC'],
        'Kitchen & Dining': ['Kitchen', 'Refrigerator', 'Microwave'],
        'Entertainment': ['TV', 'Sound System'],
        'Parking & Facilities': ['Free parking on premises'],
        'Safety': ['Fire extinguisher', 'First aid kit']
    },
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: true, checkIn: '14:00', checkOut: '11:00' },
    availability: { blockedDates: [{start: '2024-12-24', end: '2024-12-26', reason: 'owner stay'}] },
    reviews: dummyReviews,
    additionalInfo: {},
  },
  {
    propertyId: 'prop002', hostId: 'host@staysphere.com',
    host: dummyHosts['host002'],
    title: 'Cozy Mountain Cottage',
    description: 'Nestled in the Himalayas, our cozy 2-bedroom cottage in Manali offers stunning mountain views and a tranquil atmosphere. Features a fireplace, a fully equipped kitchen, and a lovely garden. Ideal for a romantic escape or a small family adventure.',
    location: { city: 'Manali', state: 'Himachal Pradesh', coordinates: { lat: 32.2, lng: 77.1 }, area: 'Old Manali', pincode: '175131' },
    pricing: { basePrice: 8500, weekendPrice: 10000, cleaningFee: 500, securityDeposit: 3000 },
    images: [{ url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', caption: 'Cottage view', order: 1 }],
    ratings: { average: 4.8, count: 95 }, 
    capacity: { maxGuests: 4, bedrooms: 2, bathrooms: 1, beds: [{type: 'queen', count: 2}] }, 
    amenities: {
        'Featured': ['Wifi', 'Heating', 'Fireplace'],
        'Kitchen & Dining': ['Kitchen', 'Kettle'],
        'Outdoor': ['Garden', 'Bonfire area']
    },
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: false, smokingAllowed: true, eventsAllowed: false, checkIn: '13:00', checkOut: '12:00' },
    availability: { blockedDates: [] },
    reviews: [],
    additionalInfo: {},
  },
  {
    propertyId: 'prop003', hostId: 'host@staysphere.com',
    host: dummyHosts['host001'],
    title: 'Modern City Apartment', 
    description: 'Experience the heart of Mumbai from our stylish 1-bedroom apartment in Bandra. This modern space offers all the comforts of home, plus access to a rooftop pool and gym. Perfect for business travelers or couples exploring the city.',
    location: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0, lng: 72.8 }, area: 'Bandra', pincode: '400050' },
    pricing: { basePrice: 12000, weekendPrice: 13500, cleaningFee: 800, securityDeposit: 6000 },
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', caption: 'Living room', order: 1 }],
    ratings: { average: 4.7, count: 210 }, 
    capacity: { maxGuests: 3, bedrooms: 1, bathrooms: 1, beds: [{type: 'king', count: 1}] }, 
    amenities: {
        'Featured': ['Wifi', 'AC', 'Pool', 'Gym'],
        'Parking & Facilities': ['Elevator', 'Paid parking off premises']
    },
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: false, checkIn: '15:00', checkOut: '10:00' },
    availability: { blockedDates: [] },
    reviews: [dummyReviews[1]],
    additionalInfo: {},
  },
  {
    propertyId: 'prop004', hostId: 'host@staysphere.com',
    host: dummyHosts['host002'],
    title: 'Luxury Lakeside Retreat', 
    description: 'Discover tranquility at our luxurious 3-bedroom retreat overlooking Lake Pichola in Udaipur. With elegant interiors, a private plunge pool, and impeccable service, this property promises an unforgettable royal experience.',
    location: { city: 'Udaipur', state: 'Rajasthan', coordinates: { lat: 24.5, lng: 73.7 }, area: 'Near Lake Pichola', pincode: '313001' },
    pricing: { basePrice: 22000, weekendPrice: 25000, cleaningFee: 1500, securityDeposit: 10000 },
    images: [{ url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop', caption: 'Exterior view', order: 1 }],
    ratings: { average: 4.9, count: 150 }, 
    capacity: { maxGuests: 6, bedrooms: 3, bathrooms: 3, beds: [{type: 'king', count: 3}] }, 
    amenities: {
        'Featured': ['Pool', 'Wifi', 'Lake view', 'AC', 'Jacuzzi'],
        'Parking & Facilities': ['Free parking on premises']
    },
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: true, checkIn: '14:00', checkOut: '11:00' },
    availability: { blockedDates: [] },
    reviews: [],
    additionalInfo: {},
  },
  {
    propertyId: 'prop005', hostId: 'host@staysphere.com',
    host: dummyHosts['host001'],
    title: 'Spacious Lonavala Villa',
    description: 'Ideal for large groups, this 5-bedroom villa in Lonavala boasts a large private pool, a lush lawn, and ample space for everyone to relax and unwind. It\'s the perfect venue for family gatherings and weekend getaways from Mumbai and Pune.',
    location: { city: 'Lonavala', state: 'Maharashtra', coordinates: { lat: 18.7, lng: 73.4 }, area: 'Tungarli', pincode: '410401' },
    pricing: { basePrice: 18000, weekendPrice: 21000, cleaningFee: 1200, securityDeposit: 8000 },
    images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', caption: 'Pool area', order: 1 }],
    ratings: { average: 4.8, count: 75 }, 
    capacity: { maxGuests: 10, bedrooms: 5, bathrooms: 5, beds: [{type: 'queen', count: 5}] }, 
    amenities: {
        'Featured': ['Pool', 'Wifi', 'AC', 'Garden'],
        'Kitchen & Dining': ['Kitchen'],
        'Parking & Facilities': ['Free parking on premises']
    },
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: true, smokingAllowed: true, eventsAllowed: true, checkIn: '12:00', checkOut: '10:00' },
    availability: { blockedDates: [] },
    reviews: [dummyReviews[0]],
    additionalInfo: {},
  },
  // Add other properties with host and reviews...
].map(p => ({ ...p, propertyType: 'villa', status: PropertyStatus.ACTIVE, subscriptionTier: 'pro', createdAt: createMockTimestamp(86400 * 30), updatedAt: createMockTimestamp(86400 * 7) } as any as Property));


/**
 * Dummy booking data to simulate user trips.
 * This can be used to populate "My Trips" pages for guests and booking management for hosts.
 */
export const dummyBookings: Booking[] = [
    {
        bookingId: 'book001',
        propertyId: 'prop001',
        propertyTitle: 'Serene Beachfront Villa',
        propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop',
        guestId: 'guest@staysphere.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], // Upcoming
        checkOut: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
        bookingStatus: BookingStatus.CONFIRMED,
        guests: { adults: 2, children: 1, infants: 0 },
        pricing: { nights: 5, subtotal: 75000, cleaningFee: 1000, platformFee: 3750, gst: 675, total: 80425 },
        // FIX: Used PaymentStatus enum instead of string literal.
        payment: { status: PaymentStatus.PAID, amount: 80425, currency: 'INR' },
        createdAt: createMockTimestamp(86400 * 10) as any, updatedAt: createMockTimestamp(86400 * 3) as any
    },
    {
        bookingId: 'book002',
        propertyId: 'prop005',
        propertyTitle: 'Spacious Lonavala Villa',
        propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
        guestId: 'guest@staysphere.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // Past
        checkOut: new Date(new Date().setDate(new Date().getDate() - 27)).toISOString().split('T')[0],
        bookingStatus: BookingStatus.COMPLETED,
        guests: { adults: 8, children: 2, infants: 1 },
        pricing: { nights: 3, subtotal: 54000, cleaningFee: 1200, platformFee: 2700, gst: 486, total: 58386 },
        // FIX: Used PaymentStatus enum instead of string literal.
        payment: { status: PaymentStatus.PAID, amount: 58386, currency: 'INR' },
        createdAt: createMockTimestamp(86400 * 40) as any, updatedAt: createMockTimestamp(86400 * 30) as any
    },
    {
        bookingId: 'book003',
        propertyId: 'prop002',
        propertyTitle: 'Cozy Mountain Cottage',
        propertyImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
        guestId: 'anotherguest@example.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0], // Upcoming
        checkOut: new Date(new Date().setDate(new Date().getDate() + 23)).toISOString().split('T')[0],
        bookingStatus: BookingStatus.CONFIRMED,
        guests: { adults: 2, children: 0, infants: 0 },
        pricing: { nights: 3, subtotal: 25500, cleaningFee: 500, platformFee: 1275, gst: 229.5, total: 27504.5 },
        // FIX: Used PaymentStatus enum instead of string literal.
        payment: { status: PaymentStatus.PAID, amount: 27504.5, currency: 'INR' },
        createdAt: createMockTimestamp(86400 * 5) as any, updatedAt: createMockTimestamp(86400 * 1) as any
    },
    {
        bookingId: 'book004',
        propertyId: 'prop003',
        propertyTitle: 'Modern City Apartment',
        propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        guestId: 'guest@staysphere.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date(new Date().setDate(new Date().getDate() + 40)).toISOString().split('T')[0], // Pending
        checkOut: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString().split('T')[0],
        bookingStatus: BookingStatus.PENDING_CONFIRMATION,
        guests: { adults: 1, children: 0, infants: 0 },
        pricing: { nights: 5, subtotal: 60000, cleaningFee: 800, platformFee: 3000, gst: 540, total: 64340 },
        // FIX: Used PaymentStatus enum instead of string literal.
        payment: { status: PaymentStatus.PENDING, amount: 64340, currency: 'INR' },
        createdAt: createMockTimestamp(3600) as any, updatedAt: createMockTimestamp(3600) as any
    },
    {
        bookingId: 'book005',
        propertyId: 'prop004',
        propertyTitle: 'Luxury Lakeside Retreat',
        propertyImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop',
        guestId: 'guest@staysphere.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], // Ongoing
        checkOut: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
        bookingStatus: BookingStatus.ONGOING,
        guests: { adults: 4, children: 0, infants: 0 },
        pricing: { nights: 5, subtotal: 110000, cleaningFee: 1500, platformFee: 5500, gst: 990, total: 117990 },
        // FIX: Used PaymentStatus enum instead of string literal.
        payment: { status: PaymentStatus.PAID, amount: 117990, currency: 'INR' },
        createdAt: createMockTimestamp(86400 * 4) as any, updatedAt: createMockTimestamp(86400 * 2) as any
    }
];

export const dummyNotifications: Notification[] = [
    {
        notificationId: 'notif001',
        userId: 'host@staysphere.com',
        title: 'New Booking Request!',
        message: `You have a new request for 'Modern City Apartment'.`,
        type: 'new_booking',
        referenceId: 'book004',
        isRead: false,
        createdAt: { seconds: new Date().getTime() / 1000 - 3600, nanoseconds: 0 } as any
    },
    {
        notificationId: 'notif002',
        userId: 'guest@staysphere.com',
        title: 'Booking Confirmed!',
        message: `Your booking for 'Serene Beachfront Villa' is confirmed.`,
        type: 'booking_confirmed',
        referenceId: 'book001',
        isRead: false,
        createdAt: { seconds: new Date().getTime() / 1000 - 86400, nanoseconds: 0 } as any
    },
    {
        notificationId: 'notif003',
        userId: 'host@staysphere.com',
        title: 'Payout Processed',
        message: 'A payout of ₹58,386 for 1 booking has been sent.',
        type: 'payout_processed',
        referenceId: 'book002',
        isRead: true,
        createdAt: { seconds: new Date().getTime() / 1000 - 2592000, nanoseconds: 0 } as any
    }
];

export const dummyPaymentHistory: PaymentHistory[] = [
    {
        invoiceId: 'inv_20240701',
        date: { seconds: new Date('2024-07-01').getTime() / 1000, nanoseconds: 0 } as any,
        amount: 2999,
        paymentMethod: 'UPI',
        status: 'Paid',
        description: 'Pro Plan - July 2024'
    },
    {
        invoiceId: 'inv_20240601',
        date: { seconds: new Date('2024-06-01').getTime() / 1000, nanoseconds: 0 } as any,
        amount: 2999,
        paymentMethod: 'UPI',
        status: 'Paid',
        description: 'Pro Plan - June 2024'
    },
    {
        invoiceId: 'inv_20240501',
        date: { seconds: new Date('2024-05-01').getTime() / 1000, nanoseconds: 0 } as any,
        amount: 2999,
        paymentMethod: 'UPI',
        status: 'Paid',
        description: 'Pro Plan - May 2024'
    }
];