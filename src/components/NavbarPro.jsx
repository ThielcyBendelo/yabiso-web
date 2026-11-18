import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaBars, FaTimes, FaMoon, FaSun, FaSearch, FaUser, FaSignOutAlt, FaHome,
  FaBox, FaShoppingCart, FaChartLine, FaChevronDown
} from 'react-icons/fa';
import { useTheme } from '../theme/ThemeContext';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { audioService } from '../services/audioService';
import './NavbarPro.css';

const PRODUCT_CATEGORIES = [
  { name: 'Électronique', subcategories: ['Téléphones', 'Laptops', 'Accessoires'] },
  { name: 'Mode', subcategories: ['Vêtements', 'Chaussures', 'Accessoires'] },
  { name: 'Maison', subcategories: ['Meubles', 'Décoration', 'Électroménager'] },
  { name: 'Sports', subcategories: ['Équipement', 'Vêtements', 'Accessoires'] },
];

const NavbarPro = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const searchRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const logged = authService.isLoggedIn();
      setIsLoggedIn(logged);
      if (logged) {
        setUser(authService.getCurrentUser());
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [searchOpen]);

  // Handle navigation
  const handleNavigate = (path) => {
    audioService.playNavigate();
    navigate(path);
    setIsOpen(false);
    setActiveCategory(null);
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      audioService.playNavigate();
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    audioService.playClick();
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    notificationService.info('Déconnecté avec succès');
    navigate('/');
    setIsOpen(false);
  };

  // Menu item variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  const categoryMenuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 },
    },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  return (
    <nav
      className="navbar-pro"
      style={{
        backgroundColor: theme.background,
        borderBottomColor: theme.border,
      }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <motion.div
          className="navbar-logo"
          whileHover={{ scale: 1.05 }}
          onClick={() => handleNavigate('/')}
        >
          <div className="logo-icon" style={{ background: theme.gradientPrimary }}>
            ⚡
          </div>
          <span style={{ color: theme.text }}>YA-BISO</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="navbar-menu-desktop">
          <motion.button
            className="menu-item"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigate('/')}
            style={{ color: theme.text }}
          >
            <FaHome size={18} />
            <span>Accueil</span>
          </motion.button>

          {/* Categories Dropdown */}
          <div className="category-dropdown">
            <motion.button
              className="menu-item"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setActiveCategory('products')}
              onMouseLeave={() => setActiveCategory(null)}
              style={{ color: theme.text }}
            >
              <FaBox size={18} />
              <span>Produits</span>
              <FaChevronDown size={14} />
            </motion.button>

            <AnimatePresence>
              {activeCategory === 'products' && (
                <motion.div
                  className="dropdown-menu"
                  variants={categoryMenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onMouseEnter={() => setActiveCategory('products')}
                  onMouseLeave={() => setActiveCategory(null)}
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <div key={category.name} className="category-section">
                      <motion.button
                        className="category-title"
                        whileHover={{ paddingLeft: '1.5rem' }}
                        onClick={() => handleNavigate(`/catalogue?category=${category.name}`)}
                        style={{ color: theme.text }}
                      >
                        {category.name}
                      </motion.button>
                      <div className="subcategories">
                        {category.subcategories.map((sub) => (
                          <motion.button
                            key={sub}
                            className="subcategory-item"
                            whileHover={{ paddingLeft: '2rem' }}
                            onClick={() =>
                              handleNavigate(
                                `/catalogue?category=${category.name}&sub=${sub}`
                              )
                            }
                            style={{ color: theme.textSecondary }}
                          >
                            {sub}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            className="menu-item"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigate('/catalogue')}
            style={{ color: theme.text }}
          >
            <FaShoppingCart size={18} />
            <span>Catalogue</span>
          </motion.button>

          {isLoggedIn && (
            <motion.button
              className="menu-item"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavigate('/dashboard')}
              style={{ color: theme.text }}
            >
              <FaChartLine size={18} />
              <span>Tableau de bord</span>
            </motion.button>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Search */}
          <div className="search-container" ref={searchRef}>
            <motion.button
              className="search-btn"
              whileHover={{ scale: 1.1 }}
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ color: theme.primary }}
            >
              <FaSearch size={20} />
            </motion.button>

            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  className="search-input-wrapper"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '250px' }}
                  exit={{ opacity: 0, width: 0 }}
                  onSubmit={handleQuickSearch}
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      color: theme.text,
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    }}
                    autoFocus
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            className="theme-toggle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audioService.playClick();
              toggleTheme();
            }}
            style={{ color: theme.primary }}
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </motion.button>

          {/* Auth Section */}
          {isLoggedIn ? (
            <motion.div
              className="auth-section"
              whileHover={{ scale: 1.05 }}
            >
              <motion.button
                className="user-btn"
                onClick={() => handleNavigate('/profile')}
                style={{
                  backgroundColor: theme.primary,
                  color: 'white',
                }}
              >
                <FaUser size={18} />
                <span>{user?.name?.split(' ')[0] || 'Profil'}</span>
              </motion.button>

              <motion.button
                className="logout-btn"
                whileHover={{ scale: 1.1 }}
                onClick={handleLogout}
                title="Se déconnecter"
                style={{ color: theme.error }}
              >
                <FaSignOutAlt size={18} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              className="auth-buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="btn-outline"
                onClick={() => handleNavigate('/login')}
                whileHover={{ scale: 1.05 }}
                style={{
                  color: theme.primary,
                  borderColor: theme.primary,
                }}
              >
                Connexion
              </motion.button>
              <motion.button
                className="btn-primary"
                onClick={() => handleNavigate('/register')}
                whileHover={{ scale: 1.05 }}
                style={{
                  backgroundColor: theme.primary,
                  color: 'white',
                }}
              >
                S'inscrire
              </motion.button>
            </motion.div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            className="mobile-menu-btn"
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: theme.text }}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="navbar-menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ backgroundColor: theme.surface }}
          >
            <motion.div className="mobile-menu-content">
              <motion.button
                className="mobile-menu-item"
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                onClick={() => handleNavigate('/')}
                style={{ color: theme.text }}
              >
                <FaHome /> Accueil
              </motion.button>

              <motion.button
                className="mobile-menu-item"
                custom={1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                onClick={() => handleNavigate('/catalogue')}
                style={{ color: theme.text }}
              >
                <FaBox /> Produits
              </motion.button>

              {isLoggedIn && (
                <>
                  <motion.button
                    className="mobile-menu-item"
                    custom={2}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleNavigate('/dashboard')}
                    style={{ color: theme.text }}
                  >
                    <FaChartLine /> Tableau de bord
                  </motion.button>

                  <motion.button
                    className="mobile-menu-item"
                    custom={3}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleNavigate('/profile')}
                    style={{ color: theme.text }}
                  >
                    <FaUser /> Profil
                  </motion.button>

                  <motion.button
                    className="mobile-menu-item logout"
                    custom={4}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={handleLogout}
                    style={{ color: theme.error }}
                  >
                    <FaSignOutAlt /> Déconnexion
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarPro;
