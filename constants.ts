export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile', // New route for user profile
  PROPERTY_DETAIL: '/property/:propertyId',
  BOOKING_CONFIRMATION: '/booking-confirmation/:bookingId',
  BOOKING_DETAIL: '/booking/:bookingId',
  PAYMENT: '/payment/:bookingId',
  MY_TRIPS: '/my-trips', // For guests
  
  // Host Routes
  HOST_DASHBOARD: '/host/dashboard',
  HOST_PROPERTIES: '/host/properties',
  HOST_ADD_PROPERTY: '/host/properties/list', // New conversational listing route
  HOST_EDIT_PROPERTY: '/host/properties/list/:propertyId', // Edit uses the same page
  HOST_BOOKINGS: '/host/bookings',
  HOST_CALENDAR: '/host/calendar',
  HOST_EARNINGS: '/host/earnings',
  HOST_SUBSCRIPTION: '/host/subscription',
  HOST_SERVICE_MARKETPLACE: '/host/services',
  HOST_SERVICE_ORDERS: '/host/service-orders',
  HOST_MESSAGES: '/host/messages', // New route for host messages
  HOST_PROFILE: '/host/profile', // New route for host profile

  // Service Provider Routes
  PROVIDER_DASHBOARD: '/provider/dashboard',
  PROVIDER_JOBS: '/provider/jobs',
  PROVIDER_PROFILE: '/provider/:providerId',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROVIDER_APPROVALS: '/admin/provider-approvals',

  // Role Upgrade Flow
  BECOME_HOST: '/become-host',
  BECOME_PROVIDER: '/become-provider',
};

export const ROLES = {
  GUEST: 'guest',
  HOST: 'host',
  SERVICE_PROVIDER: 'service_provider',
  ADMIN: 'admin',
};