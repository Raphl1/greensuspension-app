import React, { useState, useEffect } from 'react';
import { Sun, LifeBuoy, Wrench } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';

import Dashboard from './pages/Dashboard';
import Support from './pages/Support';
import Maintenance from './pages/Maintenance';
import Profile from './pages/Profile';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
// Der LogoIcon-Import wird nicht mehr benötigt.

export default function MainApp() {
  const [page, setPage] = useState('app');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileHeaderData, setProfileHeaderData] = useState({ name: '', photoURL: '' });
  const user = auth.currentUser;
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const { name, photoURL } = docSnap.data();
          setProfileHeaderData({ name, photoURL });
        }
      });
      return () => unsubscribe();
    }
  }, [user, appId]);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };
  
  const handleNavClick = (tabId) => {
    setPage('app');
    setActiveTab(tabId);
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'support': return <Support userId={user.uid} />;
      case 'maintenance': return <Maintenance userId={user.uid} />;
      default: return <Dashboard userId={user.uid} />;
    }
  };
  
  const renderPage = () => {
     switch (page) {
      case 'profile': return <Profile userId={user.uid} onBack={() => setPage('app')} onLogout={handleLogout} />;
      case 'impressum': return <Impressum onBack={() => setPage('app')} />;
      case 'datenschutz': return <Datenschutz onBack={() => setPage('app')} />;
      case 'app': return renderMainContent();
      default: return <div>Wird geladen...</div>;
    }
  };
  
  const tabs = [
    { id: 'dashboard', label: 'Übersicht', icon: <Sun size={18} /> },
    { id: 'support', label: 'Support', icon: <LifeBuoy size={18} /> },
    { id: 'maintenance', label: 'Wartung', icon: <Wrench size={18} /> },
  ];

  return (
    <>
      <style>{`/* ... (styles unverändert) ... */`}</style>
      <div className="min-h-screen bg-black font-sans text-neutral-200">
        <div className="bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-800 sticky top-0 z-10">
          <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <button onClick={() => handleNavClick('dashboard')} className="focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1">
              <h1 className="text-xl font-bold text-white">
                  Green<span className="text-emerald-500">Suspension</span>
              </h1>
            </button>
            <div className="flex items-center space-x-4">
                <button onClick={() => setPage('profile')} className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center p-0.5 font-bold text-white uppercase">
                   {profileHeaderData.photoURL ? (
                     <img src={profileHeaderData.photoURL} alt="Profilbild" className="rounded-full w-full h-full object-cover" />
                   ) : (
                     <span>{profileHeaderData.name ? profileHeaderData.name.substring(0, 2) : ''}</span>
                   )}
                </button>
            </div>
          </header>
          {page === 'app' && (
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleNavClick(tab.id)}
                      className={`relative flex items-center justify-center flex-1 sm:flex-none sm:justify-start space-x-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none ${ activeTab === tab.id ? 'text-white' : 'text-neutral-400 hover:text-white' }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>}
                    </button>
                  ))}
                </div>
            </nav>
          )}
        </div>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
        <footer className="text-center py-8 text-xs text-neutral-600">
          <p>&copy; {new Date().getFullYear()} GreenSuspension GmbH</p>
          <div className="mt-2 space-x-4">
            <button onClick={() => setPage('impressum')} className="hover:text-neutral-400">Impressum</button>
            <button onClick={() => setPage('datenschutz')} className="hover:text-neutral-400">Datenschutz</button>
          </div>
        </footer>
      </div>
    </>
  );
}
