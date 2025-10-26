
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
import ProviderOnboardingPage from './pages/service_provider/ProviderOnboardingPage';
import ProviderDashboardPage from './pages/service_provider/ProviderDashboardPage';
import ProviderJobsPage from './pages/service_provider/ProviderJobsPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProviderApprovalsPage from './pages/admin/AdminProviderApprovalsPage';

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

              {/* --- Protected Host Routes --- */}
              <Route path={ROUTES.HOST_DASHBOARD} element={<ProtectedRoute><HostPropertiesPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_PROPERTIES} element={<ProtectedRoute><HostPropertiesPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_ADD_PROPERTY} element={<ProtectedRoute><PropertyEditorPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_EDIT_PROPERTY} element={<ProtectedRoute><PropertyEditorPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_BOOKINGS} element={<ProtectedRoute><HostBookingsPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_SUBSCRIPTION} element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_EARNINGS} element={<ProtectedRoute><EarningsPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_CALENDAR} element={<ProtectedRoute><PropertyCalendarPage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_SERVICE_MARKETPLACE} element={<ProtectedRoute><ServiceMarketplacePage /></ProtectedRoute>} />
              <Route path={ROUTES.HOST_SERVICE_ORDERS} element={<ProtectedRoute><HostServiceOrdersPage /></ProtectedRoute>} />
              
              {/* --- Protected Service Provider Routes --- */}
              <Route path={ROUTES.PROVIDER_ONBOARDING} element={<ProtectedRoute><ProviderOnboardingPage/></ProtectedRoute>} />
              <Route path={ROUTES.PROVIDER_DASHBOARD} element={<ProtectedRoute><ProviderDashboardPage/></ProtectedRoute>} />
              <Route path={ROUTES.PROVIDER_JOBS} element={<ProtectedRoute><ProviderJobsPage/></ProtectedRoute>} />

              {/* --- Protected Admin Routes --- */}
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
              <Route path={ROUTES.ADMIN_PROVIDER_APPROVALS} element={<ProtectedRoute><AdminProviderApprovalsPage /></ProtectedRoute>} />

            </Routes>
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
