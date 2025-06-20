import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Datenschutz = ({ onBack }) => {
  return (
    <div className="animate-fade-in text-neutral-300">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={18} />
          <span>Zurück</span>
        </button>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Datenschutzerklärung</h1>
      <div className="space-y-4 text-sm">
        <p>Hier steht der ausführliche Text zur Datenschutzerklärung gemäß DSGVO.</p>
        <p>Es muss erklärt werden, welche Daten (z.B. Name, E-Mail bei Support-Anfragen, technische Daten vom Fahrzeug) zu welchem Zweck erhoben, verarbeitet und gespeichert werden.</p>
        <p>Die Rechte der Nutzer (Auskunft, Löschung, etc.) müssen ebenfalls aufgeführt werden.</p>
        <p><strong>Hinweis:</strong> Dieser Text muss von einem Fachexperten oder mit einem professionellen Generator erstellt werden, um rechtssicher zu sein.</p>
      </div>
    </div>
  );
};

export default Datenschutz;

