import { Booking, BookingStatus, PaymentStatus, Property, Review, Notification, PaymentHistory, ServiceProviderProfile, ServiceBooking, ServiceBookingStatus, ServiceSpecialty } from "../types";

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
    { reviewId: 'rev001', guestId: 'guest001', guestName: 'Anjali Sharma', guestImage: 'https://i.pravatar.cc/150?u=guest001', rating: 5, comment: 'Absolutely stunning villa with breathtaking views. The host was incredibly helpful. A perfect getaway!', createdAt: {} as any },
    { reviewId: 'rev002', guestId: 'guest002', guestName: 'Vikram Singh', guestImage: 'https://i.pravatar.cc/150?u=guest002', rating: 4, comment: 'Great location and very clean. The pool was fantastic. Would recommend!', createdAt: {} as any },
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
    capacity: { maxGuests: 8, bedrooms: 4, bathrooms: 4 }, 
    amenities: ['pool', 'wifi', 'beach access', 'ac', 'kitchen', 'parking', 'tv', 'balcony'],
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: true, checkIn: '14:00', checkOut: '11:00' },
    availability: { blockedDates: [{start: '2024-12-24', end: '2024-12-26', reason: 'owner stay'}] },
    reviews: dummyReviews,
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
    capacity: { maxGuests: 4, bedrooms: 2, bathrooms: 1 }, 
    amenities: ['wifi', 'heating', 'kitchen', 'fireplace', 'garden'],
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: false, smokingAllowed: true, eventsAllowed: false, checkIn: '13:00', checkOut: '12:00' },
    availability: { blockedDates: [] },
    reviews: [],
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
    capacity: { maxGuests: 3, bedrooms: 1, bathrooms: 1 }, 
    amenities: ['wifi', 'ac', 'gym', 'pool', 'elevator'],
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: false, checkIn: '15:00', checkOut: '10:00' },
    availability: { blockedDates: [] },
    reviews: [dummyReviews[1]],
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
    capacity: { maxGuests: 6, bedrooms: 3, bathrooms: 3 }, 
    amenities: ['pool', 'wifi', 'lake view', 'ac', 'parking', 'jacuzzi'],
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: true, checkIn: '14:00', checkOut: '11:00' },
    availability: { blockedDates: [] },
    reviews: [],
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
    capacity: { maxGuests: 10, bedrooms: 5, bathrooms: 5 }, 
    amenities: ['pool', 'wifi', 'parking', 'ac', 'kitchen', 'garden'],
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: true, smokingAllowed: true, eventsAllowed: true, checkIn: '12:00', checkOut: '10:00' },
    availability: { blockedDates: [] },
    reviews: [dummyReviews[0]],
  },
  // Add other properties with host and reviews...
].map(p => ({ ...p, propertyType: 'villa', status: 'active', subscriptionTier: 'pro', createdAt: {} as any, updatedAt: {} as any } as Property));


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
        createdAt: {} as any, updatedAt: {} as any
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
        createdAt: {} as any, updatedAt: {} as any
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
        createdAt: {} as any, updatedAt: {} as any
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
        createdAt: {} as any, updatedAt: {} as any
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
        createdAt: {} as any, updatedAt: {} as any
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


// --- SERVICE PROVIDER DUMMY DATA ---

export const dummyServiceProviders: ServiceProviderProfile[] = [
    {
        providerId: 'provider@staysphere.com',
        displayName: 'Vikram Singh',
        profileImage: 'https://i.pravatar.cc/150?u=provider001',
        bio: 'Professional cleaning services with over 10 years of experience. We handle everything from standard cleaning to deep-cleaning for post-guest checkouts. Eco-friendly products used.',
        specialties: ['cleaning', 'pest_control'],
        serviceLocations: ['Mumbai', 'Thane'],
        basePricing: 'Starts at ₹1,500 per service',
        portfolio: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070', caption: 'Deep cleaning a kitchen' }
        ],
        verificationStatus: 'approved',
        rating: 4.9,
        reviewCount: 45,
    },
    {
        providerId: 'provider002',
        displayName: 'Priya Electricals',
        profileImage: 'https://i.pravatar.cc/150?u=provider002',
        bio: 'Certified electrician available for all your repair and installation needs. Fast, reliable, and available 24/7 for emergencies.',
        specialties: ['electrical'],
        serviceLocations: ['Mumbai'],
        basePricing: 'Inspection charge ₹300',
        portfolio: [],
        verificationStatus: 'approved',
        rating: 4.8,
        reviewCount: 32,
    },
    {
        providerId: 'provider003',
        displayName: 'Lens Queen Photography',
        profileImage: 'https://i.pravatar.cc/150?u=provider003',
        bio: 'Capture the beauty of your property with professional real estate photography. High-quality images that make your listing stand out.',
        specialties: ['photography'],
        serviceLocations: ['Goa', 'Mumbai', 'Lonavala'],
        basePricing: '₹8,000 per shoot',
        portfolio: [
             { type: 'image', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070', caption: 'Living Room Photoshoot' },
             { type: 'image', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071', caption: 'Pool Area at Twilight' },
        ],
        verificationStatus: 'pending',
        rating: 5.0,
        reviewCount: 12,
    }
];

export const dummyServiceBookings: ServiceBooking[] = [
    {
        serviceBookingId: 'sb_001',
        hostId: 'host@staysphere.com',
        propertyId: 'prop001',
        propertyTitle: 'Serene Beachfront Villa',
        serviceType: 'cleaning',
        requestedDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
        notes: 'Need a deep clean after the guests check out on the 4th. Focus on kitchen and bathrooms.',
        status: ServiceBookingStatus.ACCEPTED,
        providerId: 'provider@staysphere.com',
        applicants: [{ providerId: 'provider@staysphere.com', providerName: 'Vikram Singh', providerImage: 'https://i.pravatar.cc/150?u=provider001' }],
        cost: 2500,
        createdAt: { seconds: Date.now() / 1000 - 86400 * 2, nanoseconds: 0 } as any,
    },
    {
        serviceBookingId: 'sb_002',
        hostId: 'host@staysphere.com',
        propertyId: 'prop003',
        propertyTitle: 'Modern City Apartment',
        serviceType: 'electrical',
        requestedDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
        notes: 'The AC in the main bedroom is not working correctly. Please inspect.',
        status: ServiceBookingStatus.COMPLETED,
        providerId: 'provider002',
        applicants: [{ providerId: 'provider002', providerName: 'Priya Electricals', providerImage: 'https://i.pravatar.cc/150?u=provider002' }],
        cost: 800,
        createdAt: { seconds: Date.now() / 1000 - 86400 * 12, nanoseconds: 0 } as any,
    },
     {
        serviceBookingId: 'sb_003',
        hostId: 'host@staysphere.com',
        propertyId: 'prop005',
        propertyTitle: 'Spacious Lonavala Villa',
        serviceType: 'photography',
        requestedDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0],
        notes: 'Looking for new photos for my listing. Need shots of the pool, all bedrooms, and the garden area.',
        status: ServiceBookingStatus.REQUESTED,
        applicants: [],
        createdAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 } as any,
    },
];
