import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

export default function SecureLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login(email, password);
      notificationService.success('Connexion réussie, bienvenue !');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      notificationService.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b132b] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden text-white">
      
      {/* Arrière-plan dynamique (Flous de lumière) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent-1)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Conteneur Principal Grand Format split (Visuel + Formulaire) */}
      <div className="w-full max-w-5xl bg-[#1c2541]/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] relative z-10">
        
        {/* PANNEAU GAUCHE : Visuel & Branding (Masqué sur mobile) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#1c2541] via-[#0b132b] to-[#1c2541] p-10 flex-col justify-between border-r border-white/5 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-1)]/5 rounded-full blur-3xl" />
          
          {/* Logo / Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-1)] flex items-center justify-center font-black text-sm tracking-tighter">
              P
            </div>
            <span className="font-bold text-sm tracking-wider uppercase text-slate-200">Portail Fournisseurs</span>
          </div>

          {/* Accroche textuelle */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-1)] bg-[var(--accent-1)]/10 px-3 py-1 rounded-full">
              Production Locale
            </span>
            <h1 className="text-3xl font-black leading-tight text-white">
              Valorisons le savoir-faire de nos provinces.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connectez-vous à votre espace sécurisé pour gérer vos stocks, suivre vos commandes et propulser vos produits sur le marché.
            </p>
          </div>

          {/* Footer de marque */}
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} — Fièrement produit en RDC.
          </p>
        </div>

        {/* PANNEAU DROIT : Le Formulaire */}
        <div className="col-span-1 md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#141d36]/20">
          
          {/* En-tête (Adapté pour mobile & desktop) */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Connexion Vendeur
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Ravi de vous revoir ! Entrez vos accès pour continuer.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Champ Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider block text-slate-300">
                Adresse Email
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[var(--accent-1)] transition-colors">
                  <FaEnvelope size={14} />
                </span>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0b132b]/60 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--accent-1)] focus:ring-2 focus:ring-[var(--accent-1)]/20 transition-all" 
                  placeholder="ex: contact@cooperative.cd" 
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Mot de passe
                </label>
                <a href="#forgot" className="text-xs font-bold text-[var(--accent-1)] hover:underline transition-all">
                  Oublié ?
                </a>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[var(--accent-1)] transition-colors">
                  <FaLock size={14} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#0b132b]/60 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--accent-1)] focus:ring-2 focus:ring-[var(--accent-1)]/20 transition-all" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Options additionnelles */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-white/10 bg-[#0b132b] text-[var(--accent-1)] focus:ring-0 focus:ring-offset-0 checked:bg-[var(--accent-1)] cursor-pointer"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
            </div>

            {/* Bouton de soumission */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 py-3.5 bg-[var(--accent-1)] hover:bg-[#ff5722] disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-xl hover:shadow-[0_0_20px_rgba(var(--accent-1-rgb),0.3)] transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter 
                  <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Lien d'inscription pour les nouveaux fournisseurs */}
          <p className="text-center text-xs text-slate-400 mt-8">
            Nouveau fournisseur ?{' '}
            <a href="/register" className="font-bold text-white hover:text-[var(--accent-1)] transition-colors underline">
              Créer un compte
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
