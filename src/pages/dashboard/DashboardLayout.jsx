import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome, FaBoxes, FaChartLine, FaUser,
  FaSignOutAlt, FaChevronRight, FaStore,
  FaFileInvoice, FaComments, FaCreditCard, FaShieldAlt, FaBell,
} from 'react-icons/fa';
import authService from '../../services/authService';
import profileService from '../../services/profileService';
import dashboardService from '../../services/dashboardService';

// Menu synchronisé avec les routes déclarées dans App.jsx (voir <Route path="dashboard">)
const MENU_ITEMS = [
  { path: '/dashboard', label: "Vue d'ensemble", icon: FaHome, color: 'text-emerald-400', end: true },
  { path: '/dashboard/mes-produits', label: 'Mon Catalogue', icon: FaBoxes, color: 'text-yellow-400' },
  { path: '/dashboard/factures', label: 'Mes Factures', icon: FaFileInvoice, color: 'text-cyan-400' },
  { path: '/dashboard/statistiques', label: 'Statistiques', icon: FaChartLine, color: 'text-red-400' },
  { path: '/dashboard/messagerie', label: 'Messagerie', icon: FaComments, color: 'text-purple-400', badgeKey: 'unread_messages' },
  { path: '/dashboard/paiements', label: 'Paiements B2B', icon: FaCreditCard, color: 'text-blue-400' },
  { path: '/dashboard/mon-profil', label: 'Mon Profil', icon: FaUser, color: 'text-sky-400' },
  { path: '/dashboard/moderation', label: 'Modération', icon: FaShieldAlt, color: 'text-orange-500' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    // Rafraîchit le profil depuis le backend (avatar, nom d'entreprise à jour)
    profileService.getProfile().then(setUser).catch(() => {});
    dashboardService.getStats().then((s) => setUnreadMessages(s.unread_messages)).catch(() => {});
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const avatarUrl = profileService.resolveAvatarUrl(user?.avatar_url);
  const badgeValues = { unread_messages: unreadMessages };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row text-white antialiased font-sans">

      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-72 bg-[var(--surface)] border-r border-white/5 p-6 flex flex-col justify-between shrink-0 shadow-2xl relative z-20">
        <div className="space-y-10">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group px-2"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
              <FaStore className="text-white text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter uppercase leading-none">
                YaBiso<span className="text-emerald-400">Panel</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Vendor Hub
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            {MENU_ITEMS.map((item) => {
              const isActive = item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);
              const badge = item.badgeKey ? badgeValues[item.badgeKey] : null;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center justify-between px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-white/5 text-white border border-white/10 shadow-lg'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className={`${isActive ? 'text-white' : item.color} text-lg transition-colors`}>
                        <item.icon />
                      </span>
                      {!!badge && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-[9px] flex items-center justify-center rounded-full text-white border-2 border-[var(--surface)]">
                          {badge}
                        </span>
                      )}
                    </div>
                    <span className={isActive ? 'text-white' : ''}>{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-indicator">
                      <FaChevronRight size={10} className="text-emerald-400" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="pt-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            Quitter le Panel
          </button>
        </div>
      </aside>

      {/* --- ZONE DE CONTENU --- */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Header dynamique */}
        <header className="h-20 shrink-0 border-b border-white/5 bg-[var(--surface)]/50 backdrop-blur-md flex items-center justify-between px-8 md:px-12">
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-white uppercase tracking-widest leading-none">
              {MENU_ITEMS.find((i) => (i.end ? location.pathname === i.path : location.pathname.startsWith(i.path)))?.label || 'Administration'}
            </h2>
            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">
              YaBiso Digital Solutions // {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/messagerie')}
              className="relative p-2.5 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Messagerie"
            >
              <FaBell size={16} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[9px] flex items-center justify-center rounded-full text-white">
                  {unreadMessages}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/dashboard/mon-profil')}
              className="flex items-center gap-3 pl-4 border-l border-white/5"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">{user?.company_name || 'Fournisseur'}</p>
                <p className="text-[10px] text-slate-500 mt-1">{user?.city || 'RD Congo'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white font-black shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.company_name} className="w-full h-full object-cover" />
                ) : (
                  user?.company_name?.charAt(0)?.toUpperCase() || 'F'
                )}
              </div>
            </button>
          </div>
        </header>

        {/* Injection des composants enfants via Outlet */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet context={{ user, setUser }} />
          </motion.div>
        </div>
      </main>

    </div>
  );
}
