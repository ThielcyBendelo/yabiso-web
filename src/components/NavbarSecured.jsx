import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Assurez-vous que le chemin correspond à votre projet :
import { PRODUCTS_DB, getProductImage } from '../data/productsData';
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
  FaHammer,
  FaMapMarkerAlt
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
  const [showSuggestions, setShowSuggestions] = useState(false);

  
// Formateur de prix identique à Hero.jsx
const formatPrice = (usdAmount) => {
  if (!usdAmount) return '';
  if (activeCurrency === 'USD') return `${usdAmount.toFixed(2)} $`;
  return `${Math.round(usdAmount * 2850).toLocaleString('fr-FR')} FC`;
};

// Filtre instantané : produits commençant par les lettres saisies
const filteredSuggestions = useMemo(() => {
  const query = (searchQuery || '').trim().toLowerCase();
  if (!query) return [];

  return PRODUCTS_DB.filter((product) =>
    product.name.toLowerCase().startsWith(query)
  ).slice(0, 6);
}, [searchQuery]);

// Clic direct sur un produit suggéré
const handleSelectSuggestion = (product) => {
  setSearchQuery(product.name);
  setShowSuggestions(false);
  setSearchOpen(false);
  navigate(`/catalogue?search=${encodeURIComponent(product.name)}&mode=${activeMode}`);
};
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

  // À exécuter chaque fois que l'état du menu change (ex: dans un useEffect)
  // À exécuter chaque fois que l'état du menu change
  useEffect(() => {
    document.body.dataset.mobileMenuOpen = String(isOpen);
    const event = new CustomEvent('mobileMenuToggle', { detail: isOpen });
    window.dispatchEvent(event);
  }, [isOpen]);

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
  setShowSuggestions(false);
  if (searchQuery.trim()) {
    setSearchOpen(false);
    navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}&mode=${activeMode}`);
  }
};

    return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
{/* BANDEAU SUPÉRIEUR COMPACT : SÉLECTEUR B2C / B2B & DEVISE */}
<div className="bg-sky-600 dark:bg-[#060919] text-white text-[11px] py-0.5 px-4 border-b border-sky-500/30">
  <div className="max-w-7xl mx-auto flex justify-between items-center min-h-[26px]">
    <div className="flex items-center gap-1.5">
      <span className="hidden sm:inline text-sky-100 font-medium">Espace :</span>
      <div className="inline-flex rounded-full bg-sky-800/70 dark:bg-gray-800 p-0.5">
        <button
          type="button"
          onClick={() => handleModeSwitch('B2C')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none transition-all ${
            activeMode === 'B2C'
              ? 'bg-amber-400 text-gray-900 shadow-sm'
              : 'text-gray-200 hover:text-white'
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

 {/* NAVBAR PRINCIPALE COMPACTE */}
<nav
  className={`w-full transition-all duration-300 ${
    isSticky
      ? 'bg-white/95 dark:bg-[#0a0e27]/95 backdrop-blur-md shadow-md py-1'
      : 'bg-white dark:bg-[#0a0e27] shadow-sm py-1.5'
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="flex justify-between items-center h-11">
      
      {/* 1. LOGO PRO & MODERNE (Plus compact) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 cursor-pointer flex-shrink-0 group"
        onClick={() => handleNavClick('/')}
      >
        {/* Pensez aussi à réduire légèrement l'icône du logo (ex: w-8 h-8 au lieu de w-10 h-10) */}

              {/* Emblème moderne aux couleurs RDC */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-sky-500/25 overflow-hidden">
                <div className="absolute -right-2 -top-2 w-6 h-6 bg-amber-400/90 rotate-45" />
                <div className="absolute -right-2.5 -top-2.5 w-5 h-5 bg-red-500/90 rotate-45" />
                <span className="relative z-10 text-white font-black text-xl tracking-tighter">
                  Y
                </span>
              </div>

              {/* Texte du logo */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
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

            {/* 2. NAVIGATION DESKTOP */}
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
                        className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-[#131936] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50"
                      >
                        {category.subcategories.map((sub) => (
                          <button
                            type="button"
                            key={sub.name}
                            onClick={(e) => handleNavClick(sub.href, e)}
                            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          >
                            {sub.icon && <span>{sub.icon}</span>}
                            <span>{sub.name}</span>
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
            </div>

                       {/* 3. ACTIONS DROITE (Recherche Mobile uniquement + Thème + Menu Mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Bouton Recherche : MASQUÉ sur Desktop grâce à 'lg:hidden' */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setShowSuggestions(false);
                }}
                className={`lg:hidden p-2.5 rounded-full transition ${
                  searchOpen
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-label={searchOpen ? 'Fermer la recherche' : 'Rechercher'}
                title="Rechercher"
              >
                {searchOpen ? <FaTimes size={16} /> : <FaSearch size={16} />}
              </button>

              {/* Bouton Thème (Clair / Sombre) : Visible sur Mobile & Desktop */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Changer le thème"
                title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {theme === 'dark' ? (
                  <FaSun className="text-amber-400" size={16} />
                ) : (
                  <FaMoon className="text-slate-700" size={16} />
                )}
              </button>

             {/* Bouton Connexion : MASQUÉ sur mobile ('hidden'), VISIBLE sur desktop ('lg:flex') */}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={(e) => handleNavClick('/dashboard', e)}
                  className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold shadow-sm shadow-sky-500/25 transition"
                >
                  <FaTachometerAlt size={14} />
                  <span>Mon Espace</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleNavClick('/login', e)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold shadow-sm shadow-sky-500/25 transition"
                >
                  <FaUserCircle size={15} />
                  <span>Connexion</span>
                </button>
              )}

              {/* Bouton Menu Mobile */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Menu principal"
              >
                {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>
          </div>
      </nav>

      {/* BARRE DE RECHERCHE COMPACTE FLOTTANTE SOUS LA NAVBAR (BLUR TRANSPARENT) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="w-full px-4 pt-2.5 pb-3 bg-white/65 dark:bg-[#0a0f2c]/65 backdrop-blur-xl border-b border-gray-200/40 dark:border-sky-500/20 shadow-lg"
          >
            {/* Longueur réduite et centrée (max-w-lg) */}
            <div className="max-w-lg mx-auto">
              <form onSubmit={handleQuickSearchSubmit} className="relative flex items-center">
                <input
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder={
                    activeMode === 'B2B'
                      ? 'Rechercher en gros (ex: Maïs, café...)'
                      : 'Tapez une lettre (ex: M, C, H, P...)'
                  }
                  className="w-full pl-4 pr-20 py-2.5 rounded-xl bg-white/85 dark:bg-[#131936]/85 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300/60 dark:border-white/15 focus:outline-none focus:border-sky-500 shadow-sm text-[16px] md:text-sm transition"
                  autoFocus
                />

                <div className="absolute right-1.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      aria-label="Effacer"
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}

                  <button
                    type="submit"
                    aria-label="Rechercher"
                    title="Rechercher"
                    className="p-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white rounded-lg shadow-sm transition flex items-center justify-center"
                  >
                    <FaSearch className="text-xs" />
                  </button>
                </div>

                {/* LISTE DÉROULANTE DES SUGGESTIONS */}
                <AnimatePresence>
                  {showSuggestions && searchQuery.trim().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-[#131936]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/70 dark:border-white/15 overflow-hidden z-50"
                    >
                      {filteredSuggestions.length > 0 ? (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto">
                          {filteredSuggestions.map((product) => (
                            <li key={product.id}>
                              <button
                                type="button"
                                onMouseDown={() => handleSelectSuggestion(product)}
                                className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-sky-500/10 transition text-left gap-3"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    className="w-9 h-9 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 shrink-0"
                                  />
                                  <div className="truncate">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                      {product.name}
                                    </p>
                                    {product.province && (
                                      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-amber-500 text-[9px]" />
                                        {product.province}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {product.price && (
                                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 shrink-0">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                          Aucun produit commençant par « <span className="font-semibold">{searchQuery}</span> »
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
            </motion.div>
        )}
      </AnimatePresence>


           
                    {/* MENU MOBILE PLEIN ÉCRAN & GLASSMORPHISM */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden fixed inset-0 z-50 flex flex-col bg-slate-50/85 dark:bg-[#060919]/90 backdrop-blur-2xl overflow-y-auto"
          >
            {/* EN-TÊTE DU MENU PLEIN ÉCRAN */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-[#0a0e27]/75 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10">
              <div
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-sky-500/25 overflow-hidden">
                  <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-400/90 rotate-45" />
                  <div className="absolute -right-2.5 -top-2.5 w-4 h-4 bg-red-500/90 rotate-45" />
                  <span className="relative z-10 text-white font-black text-lg tracking-tighter">
                    Y
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Ya<span className="text-sky-500">Biso</span>
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                    RDC
                  </span>
                </div>
              </div>

              {/* Bouton Fermer */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer le menu"
                className="p-2.5 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-gray-200/60 dark:border-white/15 text-gray-800 dark:text-white hover:bg-red-500 hover:text-white transition shadow-sm"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* CORPS DU MENU (BOUTONS BLUR TRANSPARENTS) */}
            <div className="flex-1 px-5 py-6 space-y-6 max-w-lg w-full mx-auto">
              
              {/* 1. Navigation Principale (Grille 2 boutons Glassmorphism) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={(e) => handleNavClick('/', e)}
                  className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.1] backdrop-blur-md border border-gray-200/70 dark:border-white/10 shadow-sm active:scale-[0.98] transition flex flex-col items-start gap-2.5 text-left"
                >
                  <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                    <FaHome size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      Accueil
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Page principale
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleNavClick('/appels-offres', e)}
                  className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.1] backdrop-blur-md border border-amber-400/40 dark:border-amber-400/25 shadow-sm active:scale-[0.98] transition flex flex-col items-start gap-2.5 text-left relative overflow-hidden"
                >
                  <span className="absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                    B2B
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <FaHandshake size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      Appels d'Offres
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Achats en gros
                    </p>
                  </div>
                </button>
              </div>
                <div>
              <button
                      type="button"
                      onClick={() => navigate('/devenir-fournisseur')}
                      className="w-full sm:w-auto px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border-2 border-sky-400 text-gray-500 dark:text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition whitespace-nowrap"
                    >
                      <FaStore className="text-sky-300 shrink-0" />
                      <span className="truncate">Devenir Fournisseur</span>
                    </button>
                  </div>

              {/* 2. Catégories et Sous-catégories en boutons Blur Transparent */}
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-2.5">
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-sm">{cat.icon}</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {cat.subcategories.map((sub) => (
                      <button
                        type="button"
                        key={sub.name}
                        onClick={(e) => handleNavClick(sub.href, e)}
                        className="w-full px-3.5 py-3 rounded-2xl bg-white/60 dark:bg-white/[0.04] hover:bg-white/90 dark:hover:bg-white/[0.09] backdrop-blur-md border border-gray-200/60 dark:border-white/10 shadow-xs active:scale-[0.98] flex items-center justify-between gap-3 transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="p-2 rounded-xl bg-gray-100/80 dark:bg-white/5 text-base shrink-0 group-hover:scale-110 transition-transform">
                            {sub.icon}
                          </span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                            {sub.name}
                          </span>
                        </div>
                        <FaArrowRight className="text-xs text-gray-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* PIED DU MENU : CONNEXION / ESPACE + UTILITAIRES */}
            <div className="sticky bottom-0 px-5 py-4 bg-white/75 dark:bg-[#0a0e27]/85 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 space-y-3">
              <div className="max-w-lg mx-auto space-y-2.5">
                {/* Bouton Connexion ou Mon Espace (accessible depuis le menu mobile) */}
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={(e) => handleNavClick('/dashboard', e)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition"
                  >
                    <FaTachometerAlt size={15} />
                    <span>Accéder à Mon Espace</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleNavClick('/login', e)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition"
                  >
                    <FaUserCircle size={16} />
                    <span>Connexion / Créer un compte</span>
                  </button>
                )}

                {/* Partage & Audio */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleShareClick();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-gray-200/60 dark:border-white/10 text-sky-600 dark:text-sky-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-sky-500/10 transition"
                  >
                    <FaShareAlt size={13} />
                    <span>Partager YaBiso</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="py-2.5 px-3 rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-500/10 transition"
                  >
                    {audioEnabled ? (
                      <>
                        <FaVolumeUp className="text-emerald-500" size={14} />
                        <span>Sons : Activés</span>
                      </>
                    ) : (
                      <>
                        <FaVolumeMute className="text-gray-400" size={14} />
                        <span>Sons : Coupés</span>
                      </>
                                          )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

