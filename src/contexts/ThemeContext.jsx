import React, { createContext, useContext, useState, useEffect } from 'react';
import { colors, getCSSVariables } from '../config/theme';

// Créer le contexte
const ThemeContext = createContext();

// Hook personnalisé pour utiliser le thème
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider du thème professionnel
export const ThemeProvider = ({ children }) => {
  // Récupérer le thème depuis localStorage ou utiliser la préférence système
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Appliquer le thème au document
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Appliquer à l'élément root
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.classList.toggle('light-mode', !isDarkMode);
    
    // Appliquer les variables CSS
    const cssVars = getCSSVariables(isDarkMode);
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [isDarkMode]);

  // Fonction pour basculer le thème
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Obtenir les couleurs courantes
  const currentColors = isDarkMode ? colors.dark : colors.light;

  const value = {
    isDarkMode,
    toggleTheme,
    colors: currentColors,
    isDark: isDarkMode,
    isLight: !isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
