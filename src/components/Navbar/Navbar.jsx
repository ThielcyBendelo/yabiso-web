import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategoryMenu, setActiveCategoryMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categories avec subcategories
  const categories = [
    {
      id: 'electronics',
      label: 'Électroniques',
      subcategories: [
        { label: 'Téléphones', path: '/products?category=phones' },
        { label: 'Ordinateurs', path: '/products?category=computers' },
        { label: 'Accessoires', path: '/products?category=accessories' },
      ],
    },
    {
      id: 'fashion',
      label: 'Mode',
      subcategories: [
        { label: 'Homme', path: '/products?category=mens' },
        { label: 'Femme', path: '/products?category=womens' },
        { label: 'Enfants', path: '/products?category=kids' },
      ],
    },
    {
      id: 'home',
      label: 'Maison & Vie',
      subcategories: [
        { label: 'Mobilier', path: '/products?category=furniture' },
        { label: 'Décoration', path: '/products?category=decor' },
        { label: 'Électroménager', path: '/products?category=appliances' },
      ],
    },
    {
      id: 'sports',
      label: 'Sports & Loisirs',
      subcategories: [
        { label: 'Sports', path: '/products?category=sports' },
        { label: 'Loisirs', path: '/products?category=hobbies' },
        { label: 'Bien-être', path: '/products?category=wellness' },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${
        isDarkMode ? 'navbar--dark' : 'navbar--light'
      }`}
      style={{
        '--navbar-bg': colors.background,
        '--navbar-text': colors.text,
        '--navbar-border': colors.border,
        '--navbar-hover': colors.ripple,
      }}
    >
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">YaBiso</span>
        </Link>

        {/* Desktop Menu */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu--mobile-open' : ''}`}>
          {/* Categories with Dropdowns */}
          <div className="navbar-categories">
            {categories.map((category) => (
              <div key={category.id} className="navbar-category">
                <button
                  className={`navbar-category-trigger ${
                    activeCategoryMenu === category.id ? 'navbar-category-trigger--active' : ''
                  }`}
                  onMouseEnter={() => setActiveCategoryMenu(category.id)}
                  onMouseLeave={() => setActiveCategoryMenu(null)}
                  onClick={() =>
                    setActiveCategoryMenu(activeCategoryMenu === category.id ? null : category.id)
                  }
                >
                  {category.label}
                  <svg className="chevron-icon" width="16" height="16" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      d="M5 6l3 3 3-3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {activeCategoryMenu === category.id && (
                  <div
                    className="navbar-dropdown"
                    onMouseEnter={() => setActiveCategoryMenu(category.id)}
                    onMouseLeave={() => setActiveCategoryMenu(null)}
                  >
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        className="navbar-dropdown-item"
                        onClick={() => {
                          setActiveCategoryMenu(null);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Links */}
          <div className="navbar-links">
            <Link
              to="/products"
              className={`navbar-link ${isActive('/products') ? 'navbar-link--active' : ''}`}
            >
              Produits
            </Link>
            <Link
              to="/contact"
              className={`navbar-link ${isActive('/contact') ? 'navbar-link--active' : ''}`}
            >
              Contact
            </Link>
            <Link
              to="/about"
              className={`navbar-link ${isActive('/about') ? 'navbar-link--active' : ''}`}
            >
              À propos
            </Link>
          </div>

          {/* Right Section */}
          <div className="navbar-right">
            {/* Search Bar */}
            <div className="navbar-search">
              <input type="text" placeholder="Rechercher..." className="navbar-search-input" />
              <button className="navbar-search-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Theme Toggle */}
            <button className="navbar-theme-toggle" onClick={toggleTheme} title="Basculer thème">
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="navbar-user">
                <Link to="/dashboard" className="navbar-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="navbar-avatar-placeholder">{user?.name?.charAt(0) || 'U'}</div>
                  )}
                </Link>
                <button onClick={logout} className="navbar-logout">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="navbar-link navbar-link--login">
                  Connexion
                </Link>
                <Link to="/register" className="navbar-btn navbar-btn--primary">
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="navbar-cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 2L4 6v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6l-2-4H6z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M9 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="navbar-cart-badge">0</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`navbar-hamburger ${isMobileMenuOpen ? 'navbar-hamburger--active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
