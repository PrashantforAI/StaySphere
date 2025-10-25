
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROPERTY_DETAIL: '/property/:propertyId',
  BOOKING_CONFIRMATION: '/booking-confirmation/:bookingId',
  BOOKING_DETAIL: '/booking/:bookingId',
  PAYMENT: '/payment/:bookingId',
  MY_TRIPS: '/my-trips', // For guests
  
  // Host Routes
  HOST_DASHBOARD: '/host/dashboard', // Placeholder for a future overview page
  HOST_PROPERTIES: '/host/properties',
  HOST_ADD_PROPERTY: '/host/properties/new',
  HOST_EDIT_PROPERTY: '/host/properties/edit/:propertyId',
  HOST_BOOKINGS: '/host/bookings', // For hosts
  HOST_CALENDAR: '/host/calendar',
  HOST_EARNINGS: '/host/earnings',
  HOST_SUBSCRIPTION: '/host/subscription',
};

export const ROLES = {
  GUEST: 'guest',
  HOST: 'host',
  SERVICE_PROVIDER: 'service_provider',
  ADMIN: 'admin',
};