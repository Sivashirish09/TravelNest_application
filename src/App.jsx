import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';

import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { AITripPlannerPage } from './pages/AITripPlannerPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { BookingDetailsPage } from './pages/BookingDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { TravelMemoriesPage } from './pages/TravelMemoriesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { SupportPage } from './pages/SupportPage';
import { ReportsPage } from './pages/ReportsPage';

// Protected App Layout Wrapper
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex">
        {/* Desktop Fixed Left Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <Header />
          <main className="flex-1 p-4 pb-20 lg:p-8 lg:pb-8 min-w-0">
            <Outlet />
          </main>
        </div>

        {/* Mobile Floating Glass Bottom Navigation Bar */}
        <BottomNav />

        {/* Global Toast Alerts Container */}
        <ToastContainer />
      </div>
    </ProtectedRoute>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Unauthenticated Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes Layout */}
            <Route element={<ProtectedLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/destination/:id" element={<DestinationDetailsPage />} />
              <Route path="/planner" element={<AITripPlannerPage />} />
              <Route path="/itinerary/:id" element={<ItineraryPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking-confirmation/:id" element={<BookingConfirmationPage />} />

              {/* My Trips routes (supports both /bookings and /trips) */}
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/trips" element={<MyBookingsPage />} />
              <Route path="/booking/:id" element={<BookingDetailsPage />} />
              <Route path="/trip/:id" element={<BookingDetailsPage />} />

              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/memories" element={<TravelMemoriesPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* Fallback Default Route */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
