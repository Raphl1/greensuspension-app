import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import MainApp from './MainApp';
import AuthPage from './pages/AuthPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="bg-black text-white min-h-screen flex items-center justify-center">Lade...</div>;
  }

  return user ? <MainApp /> : <AuthPage />;
}