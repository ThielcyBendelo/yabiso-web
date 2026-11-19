import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Services
import notificationService from '../services/notificationService';
import audioService from '../services/audioService';
import authService from '../services/authService';

// Icônes
import { 
  FaTachometerAlt, FaHome, FaBars, FaTimes, FaMoon, FaSun, 
  FaVolumeUp, FaVolumeMute, FaStore, FaBoxes, FaHandshake,
  FaSearch, FaShareAlt, FaChevronDown, FaUserCircle, FaBuilding, FaUser, FaArrowRight,
  FaSeedling,
  FaIndustry,
  FaPalette,
  FaTshirt,
  FaThLarge,
  FaCheckCircle,
  FaWarehouse,
  FaTractor,
  FaHammer
} from 'react-icons/fa';

export default function Navbar({ buyerMode = 'B2C', setBuyerMode, currency = 'CDF', setCurrency }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(audioService.isEnabled());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState(null);

  // Gestion locale si les props ne sont pas encore passées par App.jsx
  const [localMode, setLocalMode] = useState(buyerMode);
  const [localCurrency, setLocalCurrency] = useState(currency);

  const activeMode = setBuyerMode ? buyerMode : localMode;
  const activeCurrency = setCurrency ? currency : localCurrency;

  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Catégories enrichies selon nos priorités RDC
  const categories = [
  {
    name: 'Produits',
    icon: <FaBoxes className="text-sky-500" />,
    subcategories: [
      { 
        name: 'Agriculture & Vivres', 
        href: '/catalogue?category=agriculture',
        icon: <FaSeedling className="text-emerald-500" />
      },
      { 
        name: 'Agro-alimentaire transformé', 
        href: '/catalogue?category=transformation',
        icon: <FaIndustry className="text-amber-500" />
      },
      { 
        name: 'Artisanat & Déco', 
        href: '/catalogue?category=artisanat',
        icon: <FaPalette className="text-purple-500" />
      },
      { 
        name: 'Textiles & Mode', 
        href: '/catalogue?category=textiles',
        icon: <FaTshirt className="text-pink-500" />
      },
      { 
        name: 'Tout le catalogue', 
        href: '/catalogue',
        icon: <FaThLarge className="text-sky-500" />
      },
    ]
  },
  {
    name: 'Fournisseurs',
    icon: <FaStore className="text-sky-500" />,
    subcategories: [
      { 
        name: 'Annuaire Vérifié 🇨🇩', 
        href: '/fournisseurs',
        icon: <FaCheckCircle className="text-emerald-500" />
      },
      { 
        name: 'Grossistes (B2B)', 
        href: '/fournisseurs?type=wholesaler',
        icon: <FaWarehouse className="text-indigo-500" />
      },
      { 
        name: 'Coopératives Agricoles', 
        href: '/fournisseurs?type=cooperative',
        icon: <FaTractor className="text-amber-600" />
      },
      { 
        name: 'Artisans Locaux', 
        href: '/fournisseurs?type=artisan',
        icon: <FaHammer className="text-orange-500" />
      },
    ]
  }
];

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 35);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    authService.initialize().then(() => {
      setIsAuthenticated(authService.isLoggedIn());
      setCurrentUser(authService.getCurrentUser());
    });

    const interval = setInterval(() => {
      setIsAuthenticated(authService.isLoggedIn());
      setCurrentUser(authService.getCurrentUser());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    audioService.playClick();
    notificationService.info(`Mode ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`, { autoClose: 1500 });
  };

  const toggleAudio = () => {
    const newState = audioService.toggle();
    setAudioEnabled(newState);
    newState ? notificationService.success('🔊 Effets sonores activés') : notificationService.info('🔇 Sons coupés');
  };

  const handleModeSwitch = (mode) => {
    audioService.playClick();
    setBuyerMode ? setBuyerMode(mode) : setLocalMode(mode);
    notificationService.info(
      mode === 'B2B' 
        ? '🏢 Mode Professionnel (Gros & Devis) activé' 
        : '🛍️ Mode Particulier (Détail) activé',
      { autoClose: 2000 }
    );
  };

  const handleCurrencyToggle = () => {
    audioService.playClick();
    const next = activeCurrency === 'CDF' ? 'USD' : 'CDF';
    setCurrency ? setCurrency(next) : setLocalCurrency(next);
    notificationService.info(`Devise : ${next === 'CDF' ? 'Franc Congolais (FC)' : 'Dollar Américain ($)'}`, { autoClose: 1500 });
  };

  const handleNavClick = (href, e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    setOpenCategories(null);
    audioService.playNavigate();
    navigate(href);
  };

  const handleShareClick = async () => {
    audioService.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'YaBiso RDC | Fournisseurs du Made in DRC',
          text: 'Achetez directement auprès des producteurs, coopératives et artisans de la RDC !',
          url: window.location.origin,
        });
        notificationService.success('Merci pour le partage ! 🇨🇩');
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      notificationService.info('Lien copié dans le presse-papiers !');
    }
  };

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}&mode=${activeMode}`);
    }
  };

    return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* BANDEAU SUPÉRIEUR : SÉLECTEUR B2C / B2B & DEVISE */}
      <div className="bg-sky-600 dark:bg-[#060919] text-white text-xs py-1.5 px-4 border-b border-sky-500/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sky-100">Espace :</span>
            <div className="inline-flex rounded-full bg-sky-800/70 dark:bg-gray-800 p-0.5">
              <button
                type="button"
                onClick={() => handleModeSwitch('B2C')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold transition-all ${
                  activeMode === 'B2C' ? 'bg-amber-400 text-gray-900 shadow-sm' : 'text-gray-200 hover:text-white'
                }`}
              >
                <FaUser size={10} /> Particulier
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('B2B')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold transition-all ${
                  activeMode === 'B2B' ? 'bg-amber-400 text-gray-900 shadow-sm' : 'text-gray-200 hover:text-white'
                }`}
              >
                <FaBuilding size={10} /> Entreprise / Gros
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sky-100">Paiement Mobile Money & Séquestre 100% Sécurisé</span>
            <button
              type="button"
              onClick={handleCurrencyToggle}
              className="px-2.5 py-0.5 rounded bg-white/15 hover:bg-white/25 font-bold tracking-wider transition"
              title="Changer la devise d'affichage"
            >
              {activeCurrency === 'CDF' ? '🇨🇩 CDF (FC)' : '🇺🇸 USD ($)'}
            </button>
          </div>
        </div>
      </div>

      {/* NAVBAR PRINCIPALE */}
      <nav className={`w-full transition-all duration-300 ${
        isSticky 
          ? 'bg-white/95 dark:bg-[#0a0e27]/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white dark:bg-[#0a0e27] shadow-md py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            
            {/* LOGO */}
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              className="flex flex-col cursor-pointer flex-shrink-0" 
              onClick={() => handleNavClick('/')}
            >
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black bg-gradient-to-r from-sky-500 via-amber-400 to-red-500 text-transparent bg-clip-text font-serif tracking-wide">
                  YaBiso
                </span>
                <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400">
                  RDC
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[2px] text-gray-500 dark:text-gray-400 font-bold">
                Made in Congo
              </span>
            </motion.div>

            {/* NAVIGATION DESKTOP */}
            <div className="hidden lg:flex items-center gap-1">
              <button 
                type="button"
                onClick={(e) => handleNavClick('/', e)} 
                className="px-3 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-sky-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
              >
                <FaHome className="text-sky-500" />
                <span>Accueil</span>
              </button>

              {/* Dropdowns Catégories */}
              {categories.map((category) => (
                <div 
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setOpenCategories(category.name)}
                  onMouseLeave={() => setOpenCategories(null)}
                >
                  <button 
                    type="button"
                    className="px-3 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-sky-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
                  >
                    <span className="text-sky-500">{category.icon}</span>
                    <span>{category.name}</span>
                    <FaChevronDown size={11} className="opacity-60" />
                  </button>

                  <AnimatePresence>
                    {openCategories === category.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#131936] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50"
                      >
                        {category.subcategories.map((sub) => (
                          <button
                            type="button"
                            key={sub.name}
                            onClick={(e) => handleNavClick(sub.href, e)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Lien Spécial Appels d'offres B2B */}
              <button 
                type="button"
                onClick={(e) => handleNavClick('/appels-offres', e)} 
                className="px-3 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-amber-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
              >
                <FaHandshake className="text-amber-500" />
                <span>Appels d'Offres</span>
              </button>

              {isAuthenticated && (
                <button 
                  type="button"
                  onClick={(e) => handleNavClick('/dashboard', e)} 
                  className="px-3 py-2 flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 rounded-lg"
                >
                  <FaTachometerAlt />
                  <span>Mon Espace</span>
                </button>
              )}
            </div>

            {/* ACTIONS DROITE */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Rechercher"
              >
                <FaSearch />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Changer de thème"
              >
                {theme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon />}
              </button>

              <button
                type="button"
                onClick={toggleAudio}
                className="hidden sm:flex p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Son"
              >
                {audioEnabled ? <FaVolumeUp className="text-sky-500" /> : <FaVolumeMute />}
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                className="hidden sm:flex p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Partager"
              >
                <FaShareAlt />
              </button>

              {/* Bouton Connexion / Mon Compte */}
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={(e) => handleNavClick('/connexion', e)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-bold shadow-md shadow-sky-500/20 transition"
                >
                  <FaUserCircle />
                  <span>Connexion</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleNavClick('/dashboard', e)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-500/40 text-sky-600 dark:text-sky-400 text-sm font-bold"
                >
                  <FaUserCircle />
                  <span>{currentUser?.name || 'Compte'}</span>
                </button>
              )}

                           {/* Bouton Menu Mobile */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Menu"
              >
                {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {/* BARRE DE RECHERCHE DÉPLIABLE */}
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleQuickSearchSubmit}
                className="pb-3 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeMode === 'B2B'
                        ? "Rechercher en gros (ex: 50 sacs de maïs, café Kivu...)"
                        : "Que cherchez-vous ? (ex: miel pur, pagne, manioc...)"
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#131936] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-sky-500 text-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm transition"
                  >
                    Trouver
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

       {/* MENU MOBILE */}
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="lg:hidden fixed right-0 top-16 z-50 w-72 max-w-[82vw] max-h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-[#0a0e27] border-l border-b border-gray-200 dark:border-gray-800 rounded-bl-2xl px-4 py-4 space-y-3 shadow-2xl"
    >
      {/* Lien Accueil avec Submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNavClick('/', e);
        }}
      >
        <button
          type="submit"
          className="w-full text-left py-2 px-2 rounded-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition"
        >
          <FaHome className="text-sky-500 shrink-0" />
          <span>Accueil</span>
        </button>
      </form>

      {/* Catégories et Sous-catégories avec Icônes & Submit */}
      {categories.map((cat) => (
        <div key={cat.name} className="space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800/70">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 py-1 flex items-center gap-2">
            {cat.icon}
            <span>{cat.name}</span>
          </div>

          {cat.subcategories.map((sub) => (
            <form
              key={sub.name}
              onSubmit={(e) => {
                e.preventDefault();
                handleNavClick(sub.href, e);
              }}
            >
              <button
                type="submit"
                className="w-full text-left pl-4 pr-2 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:text-sky-500 hover:bg-sky-50/70 dark:hover:bg-slate-800/50 flex items-center gap-2.5 transition"
              >
                <span className="text-xs shrink-0">{sub.icon}</span>
                <span className="truncate">{sub.name}</span>
              </button>
            </form>
          ))}
        </div>
      ))}

      {/* Lien Appels d'Offres avec Submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNavClick('/appels-offres', e);
        }}
        className="pt-2 border-t border-gray-100 dark:border-gray-800/70"
      >
        <button
          type="submit"
          className="w-full text-left py-2 px-2 rounded-lg font-semibold text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition"
        >
          <FaHandshake className="shrink-0" />
          <span>Appels d'Offres (B2B)</span>
        </button>
      </form>

      {/* BOUTONS D'ACTION PRINCIPAUX EN BAS DU MENU */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2.5">
        {/* Bouton 1 : Explorer le catalogue */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (typeof setIsOpen === 'function') setIsOpen(false);
            navigate('/catalogue');
          }}
        >
          <button
            type="submit"
            className="w-full px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <span>Explorer le catalogue</span>
            <FaArrowRight />
          </button>
        </form>

        {/* Bouton 2 : Devenir Fournisseur */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (typeof setIsOpen === 'function') setIsOpen(false);
            navigate('/devenir-fournisseur');
          }}
        >
          <button
            type="submit"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#131936] hover:bg-sky-50 dark:hover:bg-slate-800 border-2 border-sky-500 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <FaStore />
            <span>Devenir Fournisseur (Gratuit)</span>
          </button>
        </form>

        {/* Bouton 3 : Connexion / Tableau de Bord */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNavClick(isAuthenticated ? '/dashboard' : '/connexion', e);
          }}
        >
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-center text-xs transition shadow-sm"
          >
            {isAuthenticated ? 'Mon Tableau de Bord' : 'Connexion / Inscription'}
          </button>
        </form>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </nav>
    </header>
  );
}
