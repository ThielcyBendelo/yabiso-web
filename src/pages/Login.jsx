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
    <div className="min-h-screen bg-white dark:bg-[#0a0e27] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-sky-400 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-red-400 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-red-500 text-transparent bg-clip-text mb-2"
          >
            YaBiso
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">Connexion Fournisseur</p>
        </div>

        {/* Main Form Card */}
        <motion.div
          variants={formVariants}
          className="bg-white dark:bg-[#1a1f3a] rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800 p-8"
        >
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300"
            >
              <FaGoogle className="text-red-500" size={20} />
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          </div>

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@example.com"
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-11 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6 text-right">
            <Link to="/forgot-password" className="text-sm text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </motion.button>
        </motion.div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-bold transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300"
        >
          <strong>Demo:</strong> Email: demo@yabiso.cd | Mot de passe: Demo@2024
        </motion.div>
      </motion.div>
    </div>
  );
}

