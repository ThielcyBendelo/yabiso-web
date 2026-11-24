import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import notificationService from '../services/notificationService';
import authService from '../services/authService';

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
      // Appel à votre backend FastAPI pour l'authentification
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erreur de connexion');
      }

      // Sauvegarder le token
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

  const handleGoogleLogin = async () => {
    try {
      // Implémenter Google OAuth avec votre backend
      notificationService.info('Redirection vers Google...');
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (err) {
      notificationService.error('Erreur Google OAuth');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1 } },
  };

    return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070a1d] text-gray-900 dark:text-gray-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Décoration d'arrière-plan subtile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
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
          2. CONTENEUR CENTRAL COMPACT (Mobile & Desktop)
         ===================================================================== */}
      <main className="flex-1 flex items-center justify-center px-3 py-6 sm:py-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md lg:max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#131936] rounded-2xl shadow-lg border border-gray-200/90 dark:border-gray-800 overflow-hidden"
        >
          
          {/* COLONNE GAUCHE : VISUEL & CONFIANCE (Desktop uniquement, 5 colonnes) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0d1433] via-[#111b42] to-[#0a0e27] text-white p-6 flex-col justify-between border-r border-gray-800">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                <FaStore /> Espace Pro RDC
              </span>
              <h2 className="text-2xl font-black leading-snug">
                Pilotez votre boutique <span className="text-sky-400">YaBiso</span> en temps réel.
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Suivez vos ventes B2C et B2B, gérez vos stocks et encaissez vos paiements Mobile Money en toute sécurité.
              </p>
            </div>

            <div className="space-y-2.5 pt-6 border-t border-white/10 text-[11px] text-gray-300">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-emerald-400 shrink-0" />
                <span>Paiements protégés par séquestre</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-amber-400 shrink-0" />
                <span>Accès direct aux appels d'offres entreprises</span>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : FORMULAIRE DE CONNEXION (7 colonnes sur desktop, 100% mobile) */}
          <motion.div
            variants={formVariants}
            className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-center"
          >
            {/* En-tête compact */}
            <div className="text-center lg:text-left mb-4">
              <h1 className="text-2xl font-black bg-gradient-to-r from-sky-500 to-amber-400 text-transparent bg-clip-text inline-block">
                YaBiso
              </h1>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                Connectez-vous à votre espace fournisseur
              </p>
            </div>

            {/* Connexion Google compacte */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-10 flex items-center justify-center gap-2.5 px-3 bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 rounded-xl hover:border-sky-500/50 transition text-xs font-bold text-gray-700 dark:text-gray-200"
            >
              <FaGoogle className="text-red-500 text-sm" />
              <span>Continuer avec Google</span>
            </button>

            {/* Séparateur resserré */}
            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              <span className="text-[11px] font-medium text-gray-400">ou par email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Champ Email */}
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
                    placeholder="votre.email@example.com"
                    className="w-full h-10 bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-3 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
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

              {/* Bouton de soumission */}
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

            {/* Lien d'inscription */}
            <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
              >
                Créer un compte
              </Link>
            </p>

                       {/* Encart Démo compact avec remplissage automatique en 1 clic */}
            <div className="mt-4 p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-between gap-2 text-[11px] text-sky-700 dark:text-sky-300">
              <div className="truncate">
                <strong className="font-bold">Démo :</strong> demo@yabiso.cd / Demo@2024
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@yabiso.cd');
                  setPassword('Demo@2024');
                }}
                className="px-2 py-1 rounded-md bg-sky-500 text-white text-[10px] font-bold hover:bg-sky-600 transition shrink-0"
              >
                Remplir
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
