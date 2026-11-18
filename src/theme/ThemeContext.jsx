import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themeConfig } from './themeConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      
      // Vérifier la préférence système
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isSystemPreference, setIsSystemPreference] = useState(() => {
    try {
      return localStorage.getItem('theme') === null;
    } catch {
      return true;
    }
  });

  // Mettre à jour le thème dans le DOM
  const applyTheme = useCallback((dark) => {
    const theme = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--current-theme', theme);
    
    // Appliquer les couleurs au document
    const colors = dark ? themeConfig.dark : themeConfig.light;
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }, []);

  // Écouter les changements de préférence système
  useEffect(() => {
    if (!isSystemPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
      applyTheme(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [isSystemPreference, applyTheme]);

  // Appliquer le thème au montage et au changement
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode, applyTheme]);

  // Sauvegarder la préférence
  useEffect(() => {
    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      setIsSystemPreference(false);
    } catch (e) {
      console.warn('Impossible de sauvegarder la préférence de thème:', e);
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const setTheme = useCallback((dark) => {
    setIsDarkMode(dark);
  }, []);

  const currentTheme = isDarkMode ? themeConfig.dark : themeConfig.light;

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme: currentTheme,
    themeMode: isDarkMode ? 'dark' : 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

