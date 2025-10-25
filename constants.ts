
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
  HOST_BOOKINGS: '/host/bookings', // For hosts
};

export const ROLES = {
  GUEST: 'guest',
  HOST: 'host',
  SERVICE_PROVIDER: 'service_provider',
  ADMIN: 'admin',
};