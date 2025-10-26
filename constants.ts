
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
  HOST_DASHBOARD: '/host/dashboard',
  HOST_PROPERTIES: '/host/properties',
  HOST_ADD_PROPERTY: '/host/properties/new',
  HOST_EDIT_PROPERTY: '/host/properties/edit/:propertyId',
  HOST_BOOKINGS: '/host/bookings',
  HOST_CALENDAR: '/host/calendar',
  HOST_EARNINGS: '/host/earnings',
  HOST_SUBSCRIPTION: '/host/subscription',
  HOST_SERVICE_MARKETPLACE: '/host/services',
  HOST_SERVICE_ORDERS: '/host/service-orders',

  // Service Provider Routes
  PROVIDER_DASHBOARD: '/provider/dashboard',
  PROVIDER_ONBOARDING: '/provider/onboarding',
  PROVIDER_JOBS: '/provider/jobs',
  PROVIDER_PROFILE: '/provider/:providerId',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROVIDER_APPROVALS: '/admin/provider-approvals',
};

export const ROLES = {
  GUEST: 'guest',
  HOST: 'host',
  SERVICE_PROVIDER: 'service_provider',
  ADMIN: 'admin',
};
