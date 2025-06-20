// src/App.jsx

import React, { useState } from 'react';
import { Sun, LifeBuoy, Wrench, ArrowLeft } from 'lucide-react';

// Importieren der Seiten-Komponenten
import Dashboard from './pages/Dashboard.js';
import Support from './pages/Support.js';
import Maintenance from './pages/Maintenance.js';
import Profile from './pages/Profile.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);

  // Die Reiter für die Hauptnavigation
  const tabs = [
    { id: 'dashboard', label: 'Übersicht', icon: <Sun size={18} /> },
    { id: 'support', label: 'Support', icon: <LifeBuoy size={18} /> },
    { id: 'maintenance', label: 'Wartung', icon: <Wrench size={18} /> },
  ];

  const handleNavClick = (tabId) => {
    setShowProfile(false); // Profilansicht schließen, falls offen
    setActiveTab(tabId);
  }

  // Diese Funktion entscheidet, welche Hauptseite gerendert wird
  const renderMainContent = () => {
    switch (activeTab) {
      case 'support':
        return <Support />;
      case 'maintenance':
        return <Maintenance />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* Globale Styles und Schriftart-Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .accent-gradient {
            background: linear-gradient(90deg, #10B981, #3B82F6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="min-h-screen bg-black font-sans text-neutral-200">
        <div className="bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-800 sticky top-0 z-10">
          <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
               <div className="bg-emerald-500 p-2 rounded-lg shadow-md shadow-emerald-500/30">
                  <Sun className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                  Green<span className="text-emerald-500">Suspension</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setShowProfile(true)} className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center p-0.5">
                   <img src="https://placehold.co/40x40/1a1a1a/e5e5e5" alt="Profilbild" className="rounded-full w-full h-full object-cover" />
                </button>
            </div>
          </header>

          {/* Navigationsleiste nur anzeigen, wenn NICHT im Profil */}
          {!showProfile && (
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleNavClick(tab.id)}
                      className={`relative flex items-center justify-center flex-1 sm:flex-none sm:justify-start space-x-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none ${
                         activeTab === tab.id && !showProfile ? 'text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      {activeTab === tab.id && !showProfile && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                      )}
                    </button>
                  ))}
                </div>
            </nav>
          )}
        </div>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Weiche: Zeige entweder Profil oder den Hauptinhalt an */}
          {showProfile ? <Profile onBack={() => setShowProfile(false)} /> : renderMainContent() }
        </main>
        
        <footer className="text-center py-8 text-xs text-neutral-600">
          <p>&copy; {new Date().getFullYear()} GreenSuspension GmbH</p>
        </footer>
      </div>
    </>
  );
}
