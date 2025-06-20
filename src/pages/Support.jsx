import React, { useState } from 'react';
import { LifeBuoy, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

const Support = ({ userId }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!subject.trim() || !message.trim()) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    try {
      // Speichert das Support-Ticket in der Firestore-Datenbank
      const supportTicketsCollectionRef = collection(db, 'artifacts', appId, 'supportTickets');
      await addDoc(supportTicketsCollectionRef, {
        userId: userId,
        subject: subject,
        message: message,
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setIsSent(true);
    } catch (err) {
      console.error("Error sending support ticket: ", err);
      setError('Fehler beim Senden. Bitte versuchen Sie es später erneut.');
    }
  };

  if (isSent) {
    return (
      <Card icon={<LifeBuoy size={20} />} title="Kundensupport">
        <div className="text-center py-10">
          <CheckCircle className="mx-auto text-emerald-400" size={48} />
          <h3 className="mt-4 text-lg font-semibold text-white">Vielen Dank!</h3>
          <p className="mt-1 text-neutral-300">Ihre Anfrage wurde erfolgreich übermittelt. Wir werden uns in Kürze bei Ihnen melden.</p>
          <button onClick={() => { setIsSent(false); setSubject(''); setMessage(''); }} className="mt-6 text-sm text-neutral-400 hover:text-white">Weitere Anfrage senden</button>
        </div>
      </Card>
    );
  }

  return (
    <Card icon={<LifeBuoy size={20} />} title="Kundensupport kontaktieren">
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-sm text-neutral-400">
                Beschreiben Sie Ihr Anliegen. Wir erhalten automatisch technische Informationen zu Ihrem System, um Ihnen besser helfen zu können.
            </p>
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-neutral-300">Betreff</label>
            <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 block w-full px-3 py-3 bg-neutral-800 border border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-neutral-300">Ihre Nachricht</label>
            <textarea id="message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <GradientButton type="submit">Anfrage senden</GradientButton>
        </form>
    </Card>
  );
};

export default Support;




