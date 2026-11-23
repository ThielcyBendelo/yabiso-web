import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaStore, FaTruck, FaShieldAlt, FaCheckCircle, FaSearch } from 'react-icons/fa';
import GlobalSearchModal from './GlobalSearchModal';


export default function TrustSubNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const links = [
    {
      label: 'Fournisseurs Vérifiés',
      shortLabel: 'Fournisseurs',
      path: '/fournisseurs',
      icon: FaStore,
      badge: '100% RDC',
    },
    {
      label: 'Logistique & Fret',
      shortLabel: 'Logistique',
      path: '/logistique',
      icon: FaTruck,
      badge: '26 Provinces',
    },
    {
      label: 'Sécurité & Escrow',
      shortLabel: 'Sécurité',
      path: '/securite',
      icon: FaShieldAlt,
      badge: 'Garanti',
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-slate-50/95 dark:bg-[#080c21]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-9 gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Liens de navigation rapides */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-white dark:bg-[#131936] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400'
                  }`}
                >
                  <Icon
                    className={`text-[11px] ${
                      isActive ? 'text-white' : 'text-sky-500 dark:text-sky-400'
                    }`}
                  />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>
                  
                  {/* Petit badge indicateur */}
                  <span
                    className={`hidden md:inline-block text-[9px] px-1.5 py-0.2 font-extrabold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-400/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

                   {/* BOUTON BARRE DE RECHERCHE RAPIDE (Desktop & Mobile) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-[#131936] hover:border-sky-500 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 text-xs transition cursor-pointer shrink-0 sm:w-64 md:w-72 justify-between"
          >
            <span className="flex items-center gap-1.5 truncate">
              <FaSearch className="text-sky-500 text-[11px] shrink-0" />
              <span className="truncate">Rechercher produit, province...</span>
            </span>
            <span className="hidden md:inline text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-gray-800 text-slate-400">
              RDC
            </span>
          </button>

        </div>
      </div>

      {/* MODALE EXTERNE DE RECHERCHE INSTANTANÉE */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
