import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaUser, FaEnvelope, FaLock, FaWhatsapp, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

export default function SecureRegister() {
  const navigate = useNavigate();
  
  // Liste des provinces majeures de la RDC pour l'ancrage régional
  const provinces = [
    'Kinshasa', 'Kongo Central', 'Nord-Kivu', 'Sud-Kivu', 
    'Lualaba', 'Haut-Katanga', 'Tshopo', 'Équateur', 'Kasaï-Central'
  ];

  // État initial du formulaire d'inscription
  const [formData, setFormData] = useState({
    companyName: '',
    managerName: '',
    email: '',
    whatsappNumber: '',
    province: '',
    city: '',
    rccm: '',
    idNat: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors('');

    if (formData.password !== formData.confirmPassword) {
      setErrors('Les mots de passe ne correspondent pas.');
      notificationService.error('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(formData);
      notificationService.success('Inscription réussie ! Bienvenue sur la plateforme.');
      navigate('/dashboard');
    } catch (err) {
      setErrors(err.message);
      notificationService.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-12 text-white">
      <form 
        onSubmit={handleRegisterSubmit} 
        className="w-full max-w-2xl bg-[var(--surface)] p-6 md:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-6"
      >
        {/* En-tête de la page */}
        <div className="text-center">
          <span className="px-3 py-1 text-[10px] font-black uppercase bg-[var(--accent-1)]/10 text-[var(--accent-1)] rounded-full tracking-wider border border-[var(--accent-1)]/20">
            Espace Grossistes & Coopératives
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-3">Créer un compte Vendeur</h2>
          <p className="text-xs text-[var(--muted-2)] mt-1">Rejoignez le marché global du Made in DRC et boostez vos commandes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* SECTION 1 : IDENTIFICATION DE L'ENTREPRISE */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-1)] border-b border-[var(--border-color)] pb-1">
              🏢 L'Entreprise ou Coopérative
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Nom de l'entreprise *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaBuilding className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="ex: Ets Elikya & Fils" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Nom du Responsable *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaUser className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="text" name="managerName" required value={formData.managerName} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="ex: Jean Mukendi" />
            </div>
          </div>

          {/* SECTION 2 : LOCALISATION ET CONTACT */}
          <div className="space-y-4 md:col-span-2 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-1)] border-b border-[var(--border-color)] pb-1">
              📍 Localisation & WhatsApp
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Province d'Origine *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2">
              <FaMapMarkerAlt className="text-gray-500 mr-2 shrink-0 text-sm" />
              <select name="province" required value={formData.province} onChange={handleChange} className="w-full bg-transparent text-white text-xs py-1 focus:outline-none appearance-none cursor-pointer">
                <option value="" className="bg-[var(--surface)]">Sélectionnez la province</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov} className="bg-[var(--surface)] text-white">{prov}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Ville / Territoire *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaMapMarkerAlt className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="ex: Goma, Moanda, Maluku" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Numéro WhatsApp Business *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaWhatsapp className="text-emerald-500 mr-2 shrink-0 text-base" />
              <input type="tel" name="whatsappNumber" required value={formData.whatsappNumber} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="ex: 243812345678" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Adresse Email Professionnelle *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaEnvelope className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="ex: direction@cooperative.cd" />
            </div>
          </div>

          {/* SECTION 3 : ENREGISTREMENT LEGAL (RCCM / ID NAT) */}
          <div className="space-y-4 md:col-span-2 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-1)] border-b border-[var(--border-color)] pb-1">
              ⚖️ Documents Légaux (Optionnel pour artisans)
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Numéro RCCM</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaIdCard className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="text" name="rccm" value={formData.rccm} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="ex: CD/KIN/RCCM/..." />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Identification Nationale (ID NAT)</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaIdCard className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="text" name="idNat" value={formData.idNat} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="ex: 01-83-N..." />
            </div>
          </div>

          {/* SECTION 4 : SECURITE DU COMPTE */}
          <div className="space-y-4 md:col-span-2 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-1)] border-b border-[var(--border-color)] pb-1">
              🔐 Sécurité de l'accès
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Mot de passe *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaLock className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-gray-300">Confirmer le mot de passe *</label>
            <div className="relative flex items-center bg-[var(--bg)] rounded-xl border border-[var(--border-color)] px-3 py-2.5">
              <FaLock className="text-gray-500 mr-2 shrink-0 text-sm" />
              <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="••••••••" />
            </div>
          </div>
        </div>

        {errors && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {errors}
          </div>
        )}

        {/* Bouton de validation final */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-4 py-3.5 bg-[var(--accent-1)] hover:bg-[#ff5722] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-95 duration-150"
        >
          {isLoading ? 'Inscription en cours...' : 'Valider mon inscription fournisseur'}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-[var(--muted-2)]">
            Vous possédez déjà un compte ?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/login')} 
              className="text-[var(--accent-1)] font-bold hover:underline"
            >
              Se connecter ici
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
