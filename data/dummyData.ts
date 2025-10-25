/**
 * An expanded list of dummy properties to provide a richer dataset for testing.
 * This data is used to simulate property listings for search and AI interactions.
 */
export const dummyProperties = [
  {
    propertyId: 'prop001', hostId: 'host@staysphere.com',
    title: 'Serene Beachfront Villa', 
    location: { city: 'Goa', state: 'Goa', coordinates: { lat: 15.3, lng: 73.8 } },
    pricing: { basePrice: 15000, weekendPrice: 18000, cleaningFee: 1000, securityDeposit: 5000 },
    images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop', caption: 'Villa exterior', order: 1 }],
    ratings: { average: 4.9, count: 120 }, 
    capacity: { maxGuests: 8, bedrooms: 4, bathrooms: 4 }, 
    amenities: ['pool', 'wifi', 'beach access', 'ac', 'kitchen', 'parking'],
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: true, checkIn: '14:00', checkOut: '11:00' },
  },
  {
    propertyId: 'prop002', hostId: 'host@staysphere.com',
    title: 'Cozy Mountain Cottage',
    location: { city: 'Manali', state: 'Himachal Pradesh', coordinates: { lat: 32.2, lng: 77.1 } },
    pricing: { basePrice: 8500, weekendPrice: 10000, cleaningFee: 500, securityDeposit: 3000 },
    images: [{ url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', caption: 'Cottage view', order: 1 }],
    ratings: { average: 4.8, count: 95 }, 
    capacity: { maxGuests: 4, bedrooms: 2, bathrooms: 1 }, 
    amenities: ['wifi', 'heating', 'kitchen'],
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: false, smokingAllowed: true, eventsAllowed: false, checkIn: '13:00', checkOut: '12:00' },
  },
  {
    propertyId: 'prop003', hostId: 'host@staysphere.com',
    title: 'Modern City Apartment', 
    location: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0, lng: 72.8 } },
    pricing: { basePrice: 12000, weekendPrice: 13500, cleaningFee: 800, securityDeposit: 6000 },
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', caption: 'Living room', order: 1 }],
    ratings: { average: 4.7, count: 210 }, 
    capacity: { maxGuests: 3, bedrooms: 1, bathrooms: 1 }, 
    amenities: ['wifi', 'ac', 'gym', 'pool'],
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: false, checkIn: '15:00', checkOut: '10:00' },
  },
  {
    propertyId: 'prop004', hostId: 'host@staysphere.com',
    title: 'Luxury Lakeside Retreat', 
    location: { city: 'Udaipur', state: 'Rajasthan', coordinates: { lat: 24.5, lng: 73.7 } },
    pricing: { basePrice: 22000, weekendPrice: 25000, cleaningFee: 1500, securityDeposit: 10000 },
    images: [{ url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop', caption: 'Exterior view', order: 1 }],
    ratings: { average: 4.9, count: 150 }, 
    capacity: { maxGuests: 6, bedrooms: 3, bathrooms: 3 }, 
    amenities: ['pool', 'wifi', 'lake view', 'ac', 'parking'],
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: true, checkIn: '14:00', checkOut: '11:00' },
  },
  {
    propertyId: 'prop005', hostId: 'host@staysphere.com',
    title: 'Spacious Lonavala Villa',
    location: { city: 'Lonavala', state: 'Maharashtra', coordinates: { lat: 18.7, lng: 73.4 } },
    pricing: { basePrice: 18000, weekendPrice: 21000, cleaningFee: 1200, securityDeposit: 8000 },
    images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', caption: 'Pool area', order: 1 }],
    ratings: { average: 4.8, count: 75 }, 
    capacity: { maxGuests: 10, bedrooms: 5, bathrooms: 5 }, 
    amenities: ['pool', 'wifi', 'parking', 'ac', 'kitchen'],
    rules: { petFriendly: true, vegAllowed: true, nonVegAllowed: true, smokingAllowed: true, eventsAllowed: true, checkIn: '12:00', checkOut: '10:00' },
  },
  {
    propertyId: 'prop006', hostId: 'host@staysphere.com',
    title: 'Historic Haveli in Jaipur', 
    location: { city: 'Jaipur', state: 'Rajasthan', coordinates: { lat: 26.9, lng: 75.7 } },
    pricing: { basePrice: 11000, weekendPrice: 13000, cleaningFee: 700, securityDeposit: 4000 },
    images: [{ url: 'https://images.unsplash.com/photo-1603241434319-4b6a064853e2?q=80&w=2070&auto=format&fit=crop', caption: 'Courtyard', order: 1 }],
    ratings: { average: 4.9, count: 180 }, 
    capacity: { maxGuests: 6, bedrooms: 3, bathrooms: 2 }, 
    amenities: ['wifi', 'ac', 'courtyard', 'kitchen'],
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: false, smokingAllowed: false, eventsAllowed: false, checkIn: '14:00', checkOut: '12:00' },
  },
  {
    propertyId: 'prop007', hostId: 'host@staysphere.com',
    title: 'Quiet Kerala Backwaters Houseboat', 
    location: { city: 'Alleppey', state: 'Kerala', coordinates: { lat: 9.5, lng: 76.3 } },
    pricing: { basePrice: 9500, weekendPrice: 11000, cleaningFee: 1000, securityDeposit: 2000 },
    images: [{ url: 'https://images.unsplash.com/photo-1615836245337-c5b7342475a8?q=80&w=2070&auto=format&fit=crop', caption: 'Houseboat on water', order: 1 }],
    ratings: { average: 4.7, count: 88 }, 
    capacity: { maxGuests: 2, bedrooms: 1, bathrooms: 1 }, 
    amenities: ['ac', 'chef'],
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: false, checkIn: '12:00', checkOut: '09:00' },
  },
  {
    propertyId: 'prop008', hostId: 'host@staysphere.com',
    title: 'Penthouse with Rooftop Pool', 
    location: { city: 'Bangalore', state: 'Karnataka', coordinates: { lat: 12.9, lng: 77.5 } },
    pricing: { basePrice: 19500, weekendPrice: 22000, cleaningFee: 1300, securityDeposit: 9000 },
    images: [{ url: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=2070&auto=format&fit=crop', caption: 'Rooftop pool', order: 1 }],
    ratings: { average: 4.8, count: 130 }, 
    capacity: { maxGuests: 5, bedrooms: 3, bathrooms: 3 }, 
    amenities: ['pool', 'wifi', 'gym', 'ac', 'kitchen'],
    rules: { petFriendly: false, vegAllowed: true, nonVegAllowed: true, smokingAllowed: false, eventsAllowed: false, checkIn: '15:00', checkOut: '11:00' },
  },
];


/**
 * Dummy booking data to simulate user trips.
 * This can be used to populate "My Trips" pages for guests and booking management for hosts.
 */
export const dummyBookings = [
    {
        bookingId: 'book001',
        propertyId: 'prop001',
        guestId: 'guest@staysphere.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date('2024-08-10'),
        checkOut: new Date('2024-08-15'),
        status: 'Confirmed'
    },
    {
        bookingId: 'book002',
        propertyId: 'prop005',
        guestId: 'guest@staysphere.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date('2024-09-01'),
        checkOut: new Date('2024-09-04'),
        status: 'Completed'
    },
    {
        bookingId: 'book003',
        propertyId: 'prop002',
        guestId: 'anotherguest@example.com',
        hostId: 'host@staysphere.com',
        checkIn: new Date('2024-08-20'),
        checkOut: new Date('2024-08-23'),
        status: 'Confirmed'
    }
];
