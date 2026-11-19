import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaThLarge,
  FaHandshake,
  FaStore,
  FaUserCircle
} from 'react-icons/fa';

export default function MobileBottomNav({ isAuthenticated = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Masquer la barre inférieure dans l'espace fournisseur ou sur les écrans d'authentification
  if (
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

  return (
    <nav
      aria-label="Navigation mobile inférieure"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Barre Liquid Glass collée tout en bas de l'écran */}
      <div
        className="
          w-full px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]
          rounded-t-3xl
          bg-white/80 dark:bg-[#0b102b]/80
          backdrop-blur-2xl backdrop-saturate-150
          border-t border-white/60 dark:border-white/15
          shadow-[0_-8px_30px_rgba(2,6,23,0.18),inset_0_1px_1px_rgba(255,255,255,0.75)]
          dark:shadow-[0_-10px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]
          flex items-center justify-around relative
        "
      >
        {/* Reflet lumineux sur le bord supérieur */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-sky-300/40 to-transparent" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isHighlight) {
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="relative -mt-6 flex flex-col items-center justify-center group focus:outline-none"
              >
                <div
                  className="
                    w-13 h-13 p-3.5 rounded-2xl
                    bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200
                    text-slate-950
                    shadow-[0_8px_20px_rgba(251,191,36,0.45),inset_0_1px_1px_rgba(255,255,255,0.9)]
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
              onClick={() => navigate(item.path)}
              className="relative flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded-2xl transition-colors focus:outline-none group"
            >
              {active && (
                <motion.div
                  layoutId="liquidGlassActivePill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="
                    absolute inset-0 mx-1 rounded-2xl
                    bg-sky-500/15 dark:bg-sky-400/20
                    border border-sky-400/30 dark:border-sky-300/25
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]
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
