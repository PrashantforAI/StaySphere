import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ROUTES } from './constants';
import { isFirebaseConfigured } from './services/firebase';
import FirebaseConfigNotice from './components/setup/FirebaseConfigNotice';
import ErrorBoundary from './components/common/ErrorBoundary';
import PropertyDetailPage from './pages/PropertyDetailPage';
import MyTripsPage from './pages/MyTripsPage';
import HostBookingsPage from './pages/HostBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import HostPropertiesPage from './pages/host/HostPropertiesPage';
import ConversationalListingPage from './pages/host/ConversationalListingPage';
import SubscriptionPage from './pages/host/SubscriptionPage';
import EarningsPage from './pages/host/EarningsPage';
import PropertyCalendarPage from './pages/host/PropertyCalendarPage';
import ServiceMarketplacePage from './pages/host/ServiceMarketplacePage';
import HostServiceOrdersPage from './pages/host/HostServiceOrdersPage';
import ProviderDashboardPage from './pages/service_provider/ProviderDashboardPage';
import ProviderJobsPage from './pages/service_provider/ProviderJobsPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProviderApprovalsPage from './pages/admin/AdminProviderApprovalsPage';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import { UserRole } from './types';
import BecomeRolePage from './pages/BecomeRolePage';
import GuestProfilePage from './pages/guest/GuestProfilePage';
import HostDashboardPage from './pages/host/HostDashboardPage';
import HostLayout from './components/layout/HostLayout';
import HostMessagesPage from './pages/host/HostMessagesPage';
import HostProfilePage from './pages/host/HostProfilePage';

const App: React.FC = () => {

  if (!isFirebaseConfigured) {
    return <FirebaseConfigNotice />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              
              {/* --- Protected Guest & General Routes --- */}
              <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path={ROUTES.PROFILE} element={<ProtectedRoute><GuestProfilePage /></ProtectedRoute>} />
              <Route path={ROUTES.PROPERTY_DETAIL} element={<ProtectedRoute><PropertyDetailPage /></ProtectedRoute>} />
              <Route path={ROUTES.MY_TRIPS} element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
              <Route path={ROUTES.BOOKING_DETAIL} element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
              <Route path={ROUTES.BOOKING_CONFIRMATION} element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
              <Route path={ROUTES.PAYMENT} element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path={ROUTES.PROVIDER_PROFILE} element={<ProtectedRoute><ProviderProfilePage /></ProtectedRoute>} />
               {/* --- Role Upgrade Flow (for Guests only) --- */}
              <Route path={ROUTES.BECOME_HOST} element={<RoleProtectedRoute role={UserRole.GUEST}><BecomeRolePage targetRole={UserRole.HOST} /></RoleProtectedRoute>} />
              <Route path={ROUTES.BECOME_PROVIDER} element={<RoleProtectedRoute role={UserRole.GUEST}><BecomeRolePage targetRole={UserRole.SERVICE_PROVIDER} /></RoleProtectedRoute>} />


              {/* --- Protected Host Routes (with dedicated layout) --- */}
              <Route element={<RoleProtectedRoute role={UserRole.HOST}><HostLayout /></RoleProtectedRoute>}>
                <Route path={ROUTES.HOST_DASHBOARD} element={<HostDashboardPage />} />
                <Route path={ROUTES.HOST_PROPERTIES} element={<HostPropertiesPage />} />
                <Route path={ROUTES.HOST_ADD_PROPERTY} element={<ConversationalListingPage />} />
                <Route path={ROUTES.HOST_EDIT_PROPERTY} element={<ConversationalListingPage />} />
                <Route path={ROUTES.HOST_BOOKINGS} element={<HostBookingsPage />} />
                <Route path={ROUTES.HOST_MESSAGES} element={<HostMessagesPage />} />
                <Route path={ROUTES.HOST_CALENDAR} element={<PropertyCalendarPage />} />
                <Route path={ROUTES.HOST_EARNINGS} element={<EarningsPage />} />
                <Route path={ROUTES.HOST_SUBSCRIPTION} element={<SubscriptionPage />} />
                <Route path={ROUTES.HOST_SERVICE_MARKETPLACE} element={<ServiceMarketplacePage />} />
                <Route path={ROUTES.HOST_SERVICE_ORDERS} element={<HostServiceOrdersPage />} />
                <Route path={ROUTES.HOST_PROFILE} element={<HostProfilePage />} />
              </Route>
              
              {/* --- Protected Service Provider Routes --- */}
              <Route path={ROUTES.PROVIDER_DASHBOARD} element={<RoleProtectedRoute role={UserRole.SERVICE_PROVIDER}><ProviderDashboardPage/></RoleProtectedRoute>} />
              <Route path={ROUTES.PROVIDER_JOBS} element={<RoleProtectedRoute role={UserRole.SERVICE_PROVIDER}><ProviderJobsPage/></RoleProtectedRoute>} />

              {/* --- Protected Admin Routes --- */}
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<RoleProtectedRoute role={UserRole.ADMIN}><AdminDashboardPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.ADMIN_PROVIDER_APPROVALS} element={<RoleProtectedRoute role={UserRole.ADMIN}><AdminProviderApprovalsPage /></RoleProtectedRoute>} />

            </Routes>
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;