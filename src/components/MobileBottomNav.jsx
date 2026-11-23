import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaThLarge,
  FaHandshake,
  FaStore,
  FaUserCircle
} from 'react-icons/fa';

export default function MobileBottomNav({ isAuthenticated = false }) {
  // 1. Déclaration obligatoire des hooks de routage
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(
    () => document.body.dataset.mobileMenuOpen === 'true'
  );

  useEffect(() => {
    const handleMenuToggle = (e) => setIsMenuOpen(Boolean(e.detail));
    window.addEventListener('mobileMenuToggle', handleMenuToggle);
    return () => window.removeEventListener('mobileMenuToggle', handleMenuToggle);
  }, []);

  // Masquer si le menu mobile est ouvert, ou sur le dashboard / pages d'authentification
  if (
    isMenuOpen ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  const navItems = [
    {
      label: 'Accueil',
      path: '/',
      icon: FaHome,
    },
    {
      label: 'Catalogue',
      path: '/catalogue',
      icon: FaThLarge,
    },
    {
      label: 'Vendre',
      path: '/devenir-fournisseur',
      icon: FaStore,
      isHighlight: true,
    },
    {
      label: 'B2B',
      path: '/appels-offres',
      icon: FaHandshake,
    },
    {
      label: isAuthenticated ? 'Compte' : 'Connexion',
      path: isAuthenticated ? '/dashboard' : '/login',
      icon: FaUserCircle,
    },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Navigation mobile inférieure"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Barre rectangulaire (rounded-none) collée tout en bas de l'écran */}
      <div
        className="
          w-full px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]
          rounded-none
          bg-white/90 dark:bg-[#0b102b]/90
          backdrop-blur-2xl backdrop-saturate-150
          border-t border-slate-200/80 dark:border-white/15
          shadow-[0_-6px_25px_rgba(2,6,23,0.12)]
          dark:shadow-[0_-8px_25px_rgba(0,0,0,0.55)]
          flex items-center justify-around relative
        "
      >
        {/* Reflet lumineux sur toute la largeur du bord supérieur rectangulaire */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isHighlight) {
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className="relative -mt-5 flex flex-col items-center justify-center group focus:outline-none cursor-pointer"
              >
                <div
                  className="
                    w-12 h-12 p-3 rounded-xl
                    bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200
                    text-slate-950
                    shadow-[0_6px_16px_rgba(251,191,36,0.45)]
                    border border-white/70
                    group-active:scale-90 transition-transform duration-200
                    flex items-center justify-center
                  "
                >
                  <Icon className="text-lg" />
                </div>
                <span className="mt-1 text-[10px] font-extrabold tracking-tight text-slate-800 dark:text-amber-300">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className="relative flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded-xl transition-colors focus:outline-none group cursor-pointer"
            >
              {active && (
                <motion.div
                  layoutId="liquidGlassActivePill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="
                    absolute inset-0 mx-1 rounded-xl
                    bg-sky-500/15 dark:bg-sky-400/20
                    border border-sky-400/30 dark:border-sky-300/25
                  "
                />
              )}

              <Icon
                className={`relative z-10 text-base transition-transform duration-200 group-active:scale-90 ${
                  active
                    ? 'text-sky-600 dark:text-sky-400 scale-110'
                    : 'text-slate-600 dark:text-slate-300 group-hover:text-sky-500'
                }`}
              />
              <span
                className={`relative z-10 mt-1 text-[10px] tracking-tight transition-colors ${
                  active
                    ? 'font-extrabold text-sky-700 dark:text-sky-300'
                    : 'font-semibold text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
