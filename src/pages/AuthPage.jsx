import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInAnonymously } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import GradientButton from '../components/GradientButton';
import Impressum from './Impressum';
import Datenschutz from './Datenschutz';
import { X, Mail, KeyRound } from 'lucide-react';

const AuthForm = ({ title, buttonText, onSubmit, children, email, onEmailChange, password, onPasswordChange, showPasswordField = true, message, error }) => (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-white mb-8">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input type="email" placeholder="E-Mail" value={email} onChange={onEmailChange} required className="w-full p-4 pl-12 bg-neutral-800 border-2 border-transparent rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"/>
            </div>
            {showPasswordField && (
                <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input type="password" placeholder="Passwort" value={password} onChange={onPasswordChange} required className="w-full p-4 pl-12 bg-neutral-800 border-2 border-transparent rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"/>
                </div>
            )}
            {message && <p className="text-green-400 text-sm text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <GradientButton type="submit">{buttonText}</GradientButton>
        </form>
        {children}
    </div>
);


const AuthPage = () => {
  const [pageState, setPageState] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (pageState === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        await setDoc(userDocRef, {
            name: email.split('@')[0],
            email: user.email,
            company: '',
            position: '',
            fleetInfo: '',
            photoURL: ''
        });
      }
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use': setError('Diese E-Mail-Adresse wird bereits verwendet.'); break;
        case 'auth/invalid-email': setError('Dies ist keine gültige E-Mail-Adresse.'); break;
        case 'auth/weak-password': setError('Das Passwort muss mindestens 6 Zeichen lang sein.'); break;
        case 'auth/user-not-found':
        case 'auth/wrong-password': setError('Falsche E-Mail oder falsches Passwort.'); break;
        default: setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'); break;
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
        await sendPasswordResetEmail(auth, email);
        setMessage('E-Mail zum Zurücksetzen des Passworts wurde gesendet.');
    } catch (err) {
        setError('Fehler. Ist die E-Mail-Adresse korrekt?');
    }
  };
  
  const handleGuestLogin = async () => {
    setError('');
    setMessage('');
    try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        // Erstellt ein Standardprofil für den Gast, falls noch keins existiert
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        await setDoc(userDocRef, {
            name: 'Test-Nutzer',
            email: 'gast@greensuspension.app',
            company: 'Demo-Firma',
            position: 'Testfahrer',
            fleetInfo: 'Test-Flotte',
            photoURL: ''
        }, { merge: true }); // merge:true verhindert das Überschreiben, falls schon Daten da sind
    } catch (error) {
        console.error("Gast-Login Fehler:", error);
        setError("Der Gast-Login ist fehlgeschlagen.");
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {showDisclaimer && (
          <div className="w-full max-w-sm bg-amber-500/10 text-amber-300 text-xs text-center p-2 relative border border-amber-500/20 rounded-lg mb-4">
            Dies ist eine Demo-Version.{" "}
            <button onClick={handleGuestLogin} className="underline hover:text-white font-bold">
                Als Gast fortfahren.
            </button>
            <button onClick={() => setShowDisclaimer(false)} className="absolute top-1/2 right-2 -translate-y-1/2 text-amber-400 hover:text-white"><X size={16} /></button>
          </div>
        )}
      <div className="w-full max-w-sm">
        <div className="flex justify-center items-center space-x-3 mb-8">
          <h1 className="text-3xl font-bold text-white">Green<span className="text-emerald-500">Suspension</span></h1>
        </div>
        
        {pageState === 'impressum' && <Impressum onBack={() => setPageState('login')} />}
        {pageState === 'datenschutz' && <Datenschutz onBack={() => setPageState('login')} />}

        {pageState === 'reset' && (
             <AuthForm 
                title="Passwort zurücksetzen" 
                buttonText="Link anfordern" 
                onSubmit={handlePasswordReset}
                email={email}
                onEmailChange={(e) => setEmail(e.target.value)}
                showPasswordField={false}
                message={message}
                error={error}
            >
                <p className="text-sm text-neutral-300 text-center -mt-4 mb-6">Geben Sie Ihre E-Mail ein. Wir senden Ihnen einen Link zum Zurücksetzen.</p>
                <div className="text-center mt-6">
                    <button onClick={() => setPageState('login')} className="text-sm text-neutral-400 hover:text-white">Zurück zum Login</button>
                </div>
            </AuthForm>
        )}

        {(pageState === 'login' || pageState === 'register') && (
            <AuthForm 
                title={pageState === 'login' ? 'Anmelden' : 'Konto erstellen'} 
                buttonText={pageState === 'login' ? 'Anmelden' : 'Registrieren'} 
                onSubmit={handleAuth}
                email={email}
                onEmailChange={(e) => setEmail(e.target.value)}
                password={password}
                onPasswordChange={(e) => setPassword(e.target.value)}
                message={message}
                error={error}
            >
                <div className="text-xs text-center mt-6 space-y-2">
                    <button onClick={() => { setPageState(pageState === 'login' ? 'register' : 'login'); setError(''); }} className="text-sm text-neutral-400 hover:text-white">
                        {pageState === 'login' ? 'Noch kein Konto? Jetzt registrieren' : 'Bereits ein Konto? Jetzt anmelden'}
                    </button>
                    <p><button onClick={() => setPageState('reset')} className="text-neutral-500 hover:text-white">Passwort vergessen?</button></p>
                </div>
            </AuthForm>
        )}

        <footer className="text-center py-8 text-xs text-neutral-600">
             <div className="mt-2 space-x-4">
                <button onClick={() => setPageState('impressum')} className="hover:text-neutral-400">Impressum</button>
                <button onClick={() => setPageState('datenschutz')} className="hover:text-neutral-400">Datenschutz</button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;