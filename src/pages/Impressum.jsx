import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Impressum = ({ onBack }) => {
  return (
    <div className="animate-fade-in text-neutral-300">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={18} />
          <span>Zurück</span>
        </button>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Impressum</h1>
      <div className="space-y-4 text-sm">
        <p>GreenSuspension GmbH</p>
        <p>Musterstraße 123</p>
        <p>12345 Musterstadt</p>
        <p>Deutschland</p>
        <h2 className="text-xl font-semibold text-white pt-4">Vertreten durch:</h2>
        <p>Max Mustermann</p>
        <h2 className="text-xl font-semibold text-white pt-4">Kontakt:</h2>
        <p>Telefon: +49 (0) 123 456789</p>
        <p>E-Mail: kontakt@greensuspension.example.com</p>
      </div>
    </div>
  );
};

export default Impressum;
