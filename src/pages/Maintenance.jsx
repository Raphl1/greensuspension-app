import React, { useState } from 'react';
import { Wrench, FileText, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { MAINTENANCE_LOG } from '../data/mockData';

const Maintenance = () => {
    const [requestSent, setRequestSent] = useState(false);

    const handleRequest = () => {
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 5000);
    }
  return (
    <div className="space-y-6">
      <Card icon={<Wrench size={20} />} title="Wartung & Service">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-neutral-800/70 p-4 rounded-lg">
                <p className="font-medium text-neutral-400">Letzte Wartung</p>
                <p className="text-lg font-bold text-white">12.01.2025</p>
            </div>
            <div className="bg-neutral-800/70 p-4 rounded-lg">
                <p className="font-medium text-neutral-400">Nächste geplante Wartung</p>
                <p className="text-lg font-bold text-white">15.07.2025</p>
            </div>
        </div>
        {!requestSent ? (
            <div className="mt-6">
              <GradientButton onClick={handleRequest}>Außerplanmäßige Wartung anfordern</GradientButton>
            </div>
        ) : (
             <div className="mt-6 text-center py-4 bg-emerald-900/50 border border-emerald-500/30 rounded-lg">
              <CheckCircle className="mx-auto text-emerald-400" size={32} />
              <p className="mt-2 font-semibold text-white">Anfrage erhalten</p>
              <p className="text-sm text-neutral-300">Wir kontaktieren Sie für einen Termin.</p>
            </div>
        )}
      </Card>
      
      <Card icon={<FileText size={20} />} title="Wartungsprotokoll">
        <div className="mt-4">
          <ul className="divide-y divide-neutral-800">
            {MAINTENANCE_LOG.map(log => (
              <li key={log.date} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-neutral-100">{log.service}</p>
                  <p className="text-sm text-neutral-400">Techniker: {log.technician}</p>
                </div>
                <span className="text-sm text-neutral-500 font-mono">{log.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Maintenance;
