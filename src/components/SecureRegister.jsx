import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBuilding, FaUser, FaEnvelope, FaLock, FaWhatsapp,
  FaMapMarkerAlt, FaIdCard, FaArrowLeft, FaEye, FaEyeSlash, FaShieldAlt
} from 'react-icons/fa';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

export default function SecureRegister() {
  const navigate = useNavigate();

  const provinces = [
    'Kinshasa', 'Kongo-Central', 'Nord-Kivu', 'Sud-Kivu',
    'Lualaba', 'Haut-Katanga', 'Tshopo', 'Équateur', 'Kasaï-Central'
  ];

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleRegister = () => {
    try {
      notificationService.info('Redirection vers Google...');
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (err) {
      notificationService.error('Erreur Google OAuth');
    }
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
      notificationService.success('Inscription réussie ! Bienvenue sur YaBiso RDC.');
      navigate('/dashboard');
    } catch (err) {
      setErrors(err.message || "Erreur lors de l'inscription");
      notificationService.error(err.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070a1d] text-gray-900 dark:text-gray-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Décoration subtile d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
      </div>

      {/* =====================================================================
          1. PETITE NAVBAR COMPACTE FIXE (h-12)
         ===================================================================== */}
      <header className="w-full h-12 bg-white/90 dark:bg-[#0d122b]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-3 sm:px-6 z-20 shrink-0">
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-sky-500 transition"
          >
            <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#131936] flex items-center justify-center text-sky-500">
              <FaArrowLeft className="text-[11px]" />
            </span>
            <span>Accueil</span>
          </Link>

          <Link
            to="/login"
            className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Déjà un compte ? Se connecter →
          </Link>
        </div>
      </header>

      {/* =====================================================================
          2. FORMULAIRE D'INSCRIPTION COMPACT & MODERNE
         ===================================================================== */}
      <main className="flex-1 flex items-center justify-center px-3 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-2xl bg-white dark:bg-[#131936] rounded-2xl shadow-lg border border-gray-200/90 dark:border-gray-800 p-5 sm:p-7"
        >
          {/* En-tête avec Logo Officiel YaBiso RDC */}
          <div className="flex flex-col items-center text-center mb-5">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer flex-shrink-0 group mb-2.5"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-sky-500/25 overflow-hidden">
                <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-400/90 rotate-45" />
                <div className="absolute -right-2.5 -top-2.5 w-4 h-4 bg-red-500/90 rotate-45" />
                <span className="relative z-10 text-white font-black text-lg tracking-tighter">
                  Y
                </span>
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Ya<span className="text-sky-500">Biso</span>
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 tracking-wider">
                    RDC
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-semibold -mt-0.5">
                  Made in Congo
                </span>
              </div>
            </motion.div>

            <h1 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              Créer un compte Fournisseur
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Rejoignez le marché du Made in RDC et développez vos ventes B2C & B2B
            </p>
          </div>

          {/* Bouton Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full h-10 flex items-center justify-center gap-2.5 px-4 bg-white dark:bg-[#0a0e27] border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#182044] hover:border-sky-500/50 transition text-xs font-bold text-gray-700 dark:text-gray-200 shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.31 0 3.25 2.69 1.25 6.64l3.66 2.84C5.78 6.89 8.63 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              />
              <path
                fill="#FBBC05"
                d="M4.91 14.52c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.5H1.25C.45 9.09 0 10.89 0 12.78s.45 3.69 1.25 5.28l3.66-3.54z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.37 0-6.22-1.89-7.09-4.48H1.25v2.84C3.25 21.31 7.31 24 12 24z"
              />
            </svg>
            <span>Continuer avec Google</span>
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-[11px] font-medium text-gray-400">ou remplir le formulaire</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Message d'erreur */}
          {errors && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold text-center">
              {errors}
            </div>
          )}

          {/* Formulaire complet */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* SECTION 1 : IDENTIFICATION */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2.5">
                1. Entreprise ou Coopérative
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Nom de l'entreprise *
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                                           placeholder="Ex: Ets Elikya & Fils"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Nom du responsable *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="text"
                      name="managerName"
                      required
                      value={formData.managerName}
                      onChange={handleChange}
                      placeholder="Ex: Jean Mukendi"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2 : LOCALISATION & CONTACT */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2.5">
                2. Localisation & Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Province d'origine *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-xs" />
                    <select
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition cursor-pointer"
                    >
                      <option value="">Sélectionnez la province</option>
                      {provinces.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Ville / Territoire *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ex: Kalamu, Goma, Matadi"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Numéro WhatsApp Business *
                  </label>
                  <div className="relative">
                    <FaWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-xs" />
                    <input
                      type="tel"
                      name="whatsappNumber"
                      required
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="Ex: 243812345678"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Adresse Email Professionnelle *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="direction@cooperative.cd"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3 : DOCUMENTS LÉGAUX (OPTIONNEL) */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2.5">
                3. Documents Légaux (Optionnel pour artisans)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Numéro RCCM
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="text"
                      name="rccm"
                      value={formData.rccm}
                      onChange={handleChange}
                      placeholder="Ex: CD/KIN/RCCM/24-B-001"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Identification Nationale (ID Nat)
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="text"
                      name="idNat"
                      value={formData.idNat}
                      onChange={handleChange}
                      placeholder="Ex: 01-93-N12345K"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4 : SÉCURITÉ DU COMPTE */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2.5">
                4. Sécurité du compte
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-9 pl-8 pr-8 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-9 pl-8 pr-8 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de validation */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? 'Création du compte en cours...' : 'Créer mon compte Fournisseur'}
            </motion.button>
          </form>

          {/* Lien Connexion */}
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/login"
              className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
            >
              Se connecter
            </Link>
          </p>

          {/* Badge confiance */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <FaShieldAlt className="text-emerald-500 shrink-0" />
            <span>Données protégées • Validation rapide des fournisseurs locaux RDC</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
