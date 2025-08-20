
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const isDiscoverPage = location.pathname === '/discover' || location.pathname === '/';

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
