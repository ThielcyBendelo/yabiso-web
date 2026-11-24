import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaArrowLeft, FaShieldAlt, FaStore
} from 'react-icons/fa';
import notificationService from '../services/notificationService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erreur de connexion');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token || '');
      localStorage.setItem('user', JSON.stringify(data.user));

      notificationService.success('Connexion réussie ! 🎉');
      navigate('/dashboard');
    } catch (err) {
      notificationService.error(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      notificationService.info('Redirection vers Google...');
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (err) {
      notificationService.error('Erreur Google OAuth');
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
            to="/devenir-fournisseur"
            className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Devenir fournisseur →
          </Link>
        </div>
      </header>

            {/* =====================================================================
          2. FORMULAIRE SIMPLE, PRO & MODERNE (Mobile & Desktop)
         ===================================================================== */}
      <main className="flex-1 flex items-center justify-center px-3 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#131936] rounded-2xl shadow-lg border border-gray-200/90 dark:border-gray-800 p-5 sm:p-7"
        >
          {/* En-tête avec Logo officiel YaBiso RDC */}
          <div className="flex flex-col items-center text-center mb-5">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer flex-shrink-0 group mb-2.5"
            >
              {/* Emblème moderne aux couleurs RDC */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-sky-500/25 overflow-hidden">
                <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-400/90 rotate-45" />
                <div className="absolute -right-2.5 -top-2.5 w-4 h-4 bg-red-500/90 rotate-45" />
                <span className="relative z-10 text-white font-black text-lg tracking-tighter">
                  Y
                </span>
              </div>

              {/* Texte du logo */}
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

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Connectez-vous pour gérer vos produits et commandes
            </p>
          </div>

          {/* Bouton Google OAuth officiel (SVG multicolore + style moderne) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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
            <span className="text-[11px] font-medium text-gray-400">ou avec votre email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Formulaire Email & Mot de passe */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.cd"
                  className="w-full h-10 bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-3 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Mot de passe
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-9 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Afficher ou masquer le mot de passe"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-xs"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </motion.button>
          </form>

          {/* Lien Inscription */}
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
            >
              Créer un compte
            </Link>
          </p>

          {/* Badge sécurité compact */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <FaShieldAlt className="text-emerald-500 shrink-0" />
            <span>Connexion sécurisée • Espace Fournisseur YaBiso RDC</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
