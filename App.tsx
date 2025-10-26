import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
import PropertyEditorPage from './pages/host/PropertyEditorPage';
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
              <Route path={ROUTES.PROPERTY_DETAIL} element={<ProtectedRoute><PropertyDetailPage /></ProtectedRoute>} />
              <Route path={ROUTES.MY_TRIPS} element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
              <Route path={ROUTES.BOOKING_DETAIL} element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
              <Route path={ROUTES.BOOKING_CONFIRMATION} element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
              <Route path={ROUTES.PAYMENT} element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path={ROUTES.PROVIDER_PROFILE} element={<ProtectedRoute><ProviderProfilePage /></ProtectedRoute>} />
               {/* --- Role Upgrade Flow (for Guests only) --- */}
              <Route path={ROUTES.BECOME_HOST} element={<RoleProtectedRoute role={UserRole.GUEST}><BecomeRolePage targetRole={UserRole.HOST} /></RoleProtectedRoute>} />
              <Route path={ROUTES.BECOME_PROVIDER} element={<RoleProtectedRoute role={UserRole.GUEST}><BecomeRolePage targetRole={UserRole.SERVICE_PROVIDER} /></RoleProtectedRoute>} />


              {/* --- Protected Host Routes --- */}
              <Route path={ROUTES.HOST_DASHBOARD} element={<RoleProtectedRoute role={UserRole.HOST}><HostPropertiesPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_PROPERTIES} element={<RoleProtectedRoute role={UserRole.HOST}><HostPropertiesPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_ADD_PROPERTY} element={<RoleProtectedRoute role={UserRole.HOST}><PropertyEditorPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_EDIT_PROPERTY} element={<RoleProtectedRoute role={UserRole.HOST}><PropertyEditorPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_BOOKINGS} element={<RoleProtectedRoute role={UserRole.HOST}><HostBookingsPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_SUBSCRIPTION} element={<RoleProtectedRoute role={UserRole.HOST}><SubscriptionPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_EARNINGS} element={<RoleProtectedRoute role={UserRole.HOST}><EarningsPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_CALENDAR} element={<RoleProtectedRoute role={UserRole.HOST}><PropertyCalendarPage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_SERVICE_MARKETPLACE} element={<RoleProtectedRoute role={UserRole.HOST}><ServiceMarketplacePage /></RoleProtectedRoute>} />
              <Route path={ROUTES.HOST_SERVICE_ORDERS} element={<RoleProtectedRoute role={UserRole.HOST}><HostServiceOrdersPage /></RoleProtectedRoute>} />
              
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