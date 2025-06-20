import React, { useState, useEffect, useRef } from 'react';
import { User, Edit3, Save, ArrowLeft, Upload, LoaderCircle, Briefcase, Car } from 'lucide-react';
import { db, storage } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

const Profile = ({ userId, onBack, onLogout }) => {
  const [profileData, setProfileData] = useState({ name: '', email: '', company: '', position: '', fleetInfo: '', photoURL: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  
  useEffect(() => {
    if (!userId) return;
    const userDocRef = doc(db, 'artifacts', appId, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [userId, appId]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    const userDocRef = doc(db, 'artifacts', appId, 'users', userId);
    // Wir speichern alle Daten außer der E-Mail, da diese nicht änderbar sein soll.
    const { email, ...dataToSave } = profileData;
    await setDoc(userDocRef, dataToSave, { merge: true });
    setIsEditing(false);
    setIsSaving(false);
    showSuccess('Profil erfolgreich gespeichert!');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;
    setIsUploading(true);
    const storageRef = ref(storage, `artifacts/${appId}/profile-pictures/${userId}`);
    
    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      const userDocRef = doc(db, 'artifacts', appId, 'users', userId);
      await setDoc(userDocRef, { photoURL }, { merge: true });
      showSuccess('Profilbild aktualisiert!');
    } catch (error) {
        console.error("Error uploading image: ", error);
    } finally {
        setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  
  if (isLoading) {
    return <div className="text-center p-10"><LoaderCircle className="animate-spin mx-auto text-emerald-500" /></div>;
  }

  return (
    <div className="animate-fade-in">
        <div className="mb-6">
            <button onClick={onBack} className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors text-sm font-semibold">
                <ArrowLeft size={18} /><span>Zurück zum Dashboard</span>
            </button>
        </div>
        <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                 <button onClick={() => fileInputRef.current.click()} disabled={isUploading} className="relative w-24 h-24 rounded-full group">
                    {isUploading ? (
                        <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center">
                            <LoaderCircle className="animate-spin text-emerald-500" />
                        </div>
                    ) : (
                        <>
                           <img src={profileData.photoURL || `https://placehold.co/96x96/27272a/fafafa?text=${profileData.name ? profileData.name.substring(0, 2).toUpperCase() : ''}`} alt="Profilbild" className="w-full h-full rounded-full object-cover" />
                           <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Upload size={24} className="text-white" />
                           </div>
                        </>
                    )}
                 </button>
                 <div>
                    <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
                    <p className="text-neutral-400">{profileData.email}</p>
                 </div>
            </div>
            {successMessage && <div className="text-center text-green-400 bg-green-900/50 p-3 rounded-lg text-sm">{successMessage}</div>}
            
            <Card icon={<User size={20} />} title="Persönliche Daten">
                {!isEditing ? (
                  <>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-neutral-400">Name</span><span className="text-white font-medium">{profileData.name}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Firma</span><span className="text-white font-medium">{profileData.company || 'Nicht angegeben'}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Position</span><span className="text-white font-medium">{profileData.position || 'Nicht angegeben'}</span></div>
                    </div>
                     <button onClick={() => setIsEditing(true)} className="mt-6 w-full text-sm bg-neutral-800 text-neutral-300 font-semibold py-2 px-4 rounded-lg hover:bg-neutral-700 transition-colors flex items-center justify-center space-x-2">
                        <Edit3 size={16} /><span>Daten bearbeiten</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mt-4 space-y-4 text-sm">
                        <div>
                            <label className="block mb-1 text-xs text-neutral-400">Name</label>
                            <input type="text" name="name" value={profileData.name} onChange={handleChange} className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"/>
                        </div>
                         <div>
                            <label className="block mb-1 text-xs text-neutral-400">Firma</label>
                            <input type="text" name="company" value={profileData.company || ''} onChange={handleChange} className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"/>
                        </div>
                         <div>
                            <label className="block mb-1 text-xs text-neutral-400">Position</label>
                            <input type="text" name="position" value={profileData.position || ''} onChange={handleChange} className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"/>
                        </div>
                    </div>
                    <button onClick={handleSave} disabled={isSaving} className="mt-6 w-full text-sm bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSaving ? <LoaderCircle className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                        <span>{isSaving ? 'Wird gespeichert...' : 'Änderungen speichern'}</span>
                    </button>
                  </>
                )}
            </Card>

            <Card icon={<Car size={20} />} title="Flotteninformationen">
                 <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-400">Fahrzeugtyp</span><span className="text-white font-medium">{profileData.fleetInfo || 'Nicht angegeben'}</span></div>
                </div>
            </Card>

            <GradientButton onClick={onLogout}>
                Abmelden
            </GradientButton>
        </div>
    </div>
  );
};
export default Profile;
