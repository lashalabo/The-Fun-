// src/App.tsx

import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { useTheme } from './hooks/useTheme';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user, loading } = useAuth(); // Get user and loading state from context
  const isDiscoverPage = location.pathname === '/discover' || location.pathname === '/';

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className={'bg-white dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen max-w-md mx-auto flex flex-col shadow-2xl'}>
        <Header />
        <main className="flex-grow relative">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className={`${isDiscoverPage ? 'bg-transparent' : 'bg-white dark:bg-dark-bg'} text-light-text dark:text-dark-text min-h-screen max-w-md mx-auto flex flex-col shadow-2xl`}>
      <Header />
      <main className={`flex-grow relative pb-16 ${isDiscoverPage ? '' : 'overflow-y-auto'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/discover" />} />
          <Route path="/discover" element={<DiscoveryPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/create" element={<CreateEventPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Navigate to="/profile" />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

const App: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`${theme} font-sans`}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </div>
  );
};

export default App;