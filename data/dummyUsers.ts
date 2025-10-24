import { UserRole } from '../types';

/**
 * Predefined user data for one-click dummy logins.
 * This makes it easy to test the application from different user perspectives.
 * The password for all users is 'password123'.
 */
export const dummyUsers = [
  {
    email: 'guest@staysphere.com',
    password: 'password123',
    displayName: 'Anjali Sharma',
    role: UserRole.GUEST,
  },
  {
    email: 'host@staysphere.com',
    password: 'password123',
    displayName: 'Rajesh Kumar',
    role: UserRole.HOST,
  },
  {
    email: 'provider@staysphere.com',
    password: 'password123',
    displayName: 'Vikram Singh',
    role: UserRole.SERVICE_PROVIDER,
  },
];
