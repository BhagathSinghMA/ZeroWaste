import React, { useState } from 'react';
import { useAuthStore } from './store';
import Landing from './Landing';
import Auth from './Auth';
import Dashboard from './Dashboard';

export default function App() {
  const { user } = useAuthStore();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  // If logged in, always show dashboard
  if (user) {
    return <Dashboard />;
  }

  // If not logged in, show Landing or Auth
  if (authMode) {
    return <Auth initialMode={authMode} onBack={() => setAuthMode(null)} />;
  }

  return (
    <Landing 
      onLogin={() => setAuthMode('login')} 
      onSignup={() => setAuthMode('signup')} 
    />
  );
}
