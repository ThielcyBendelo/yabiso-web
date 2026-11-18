import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash, FaGoogle, FaChevronDown } from 'react-icons/fa';
import notificationService from '../services/notificationService';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const provinces = [
    'Kinshasa', 'Kongo Central', 'Nord-Kivu', 'Sud-Kivu',
    'Lualaba', 'Haut-Katanga', 'Tshopo', 'Équateur', 'Kasaï Central',
    'Kasaï Oriental', 'Lomami', 'Sankuru', 'Maniema', 'Ituri'
  ];

  const supplierTypes = [
    { value: 'wholesaler', label: 'Grossiste' },
    { value: 'cooperative', label: 'Coopérative' },
    { value: 'artisan', label: 'Artisan' },
    { value: 'producer', label: 'Producteur' },
    { value: 'trader', label: 'Commerçant' },
  ];

  const [formData, setFormData] = useState({
    // Étape 1: Informations entreprise
    companyName: '',
    supplierType: 'wholesaler',
    managerName: '',
    email: '',
    
    // Étape 2: Localisation
    province: '',
    city: '',
    phone: '',
    
    // Étape 3: Sécurité
    password: '',
    confirmPassword: '',
    idNat: '',
    rccm: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      return formData.companyName && formData.managerName && formData.email && formData.supplierType;
    } else if (stepNum === 2) {
      return formData.province && formData.city && formData.phone;
    } else if (stepNum === 3) {
      return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      notificationService.error('Veuillez remplir tous les champs');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
      // Appel à votre backend FastAPI pour l'inscription
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.managerName,
          company_name: formData.companyName,
          supplier_type: formData.supplierType,
          phone: formData.phone,
          province: formData.province,
          city: formData.city,
          id_nat: formData.idNat,
          rccm: formData.rccm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erreur d\'inscription');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token || '');
      localStorage.setItem('user', JSON.stringify(data.user));

      notificationService.success('Inscription réussie ! Bienvenue sur YaBiso 🎉');
      navigate('/dashboard');
    } catch (err) {
      notificationService.error(err.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
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

  const steps = [
    { num: 1, title: 'Entreprise', icon: '🏢' },
    { num: 2, title: 'Localisation', icon: '📍' },
    { num: 3, title: 'Sécurité', icon: '🔐' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e27] flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-sky-400 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-red-400 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-red-500 text-transparent bg-clip-text mb-2">
            YaBiso
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Créer votre compte fournisseur</p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center flex-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                  step >= s.num
                    ? 'bg-sky-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {s.icon}
              </motion.div>
              <p className={`text-xs font-semibold transition-colors ${
                step >= s.num ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500'
              }`}>
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#1a1f3a] rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: COMPANY INFO */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="ex: Ets Elikya & Fils"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Type de fournisseur *
                  </label>
                  <div className="relative">
                    <select
                      name="supplierType"
                      value={formData.supplierType}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-4 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 appearance-none transition-colors"
                      required
                    >
                      {supplierTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom du responsable *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleChange}
                      placeholder="ex: Jean Mukendi"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@example.com"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Google Sign Up Option */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300 mt-4"
                >
                  <FaGoogle className="text-red-500" />
                  Continuer avec Google
                </button>
              </>
            )}

            {/* STEP 2: LOCATION */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Province *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 appearance-none transition-colors"
                      required
                    >
                      <option value="">Sélectionner une province</option>
                      {provinces.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ville/Commune *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="ex: Kinshasa"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-4 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone WhatsApp *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+243912345678"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: SECURITY & DOCS */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 caractères"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-11 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmer"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-11 pr-11 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Numéro ID National (optionnel)
                  </label>
                  <input
                    type="text"
                    name="idNat"
                    value={formData.idNat}
                    onChange={handleChange}
                    placeholder="ex: 0123456789ABC"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-4 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    RCCM (optionnel)
                  </label>
                  <input
                    type="text"
                    name="rccm"
                    value={formData.rccm}
                    onChange={handleChange}
                    placeholder="ex: KIN/G/2024/12345"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-4 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Précédent
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Traitement...' : step === 3 ? 'Créer un compte' : 'Suivant'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-bold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
