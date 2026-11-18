/**
 * YaBiso Theme Configuration
 * Système de thème complet avec support light/dark mode
 */

export const colors = {
  light: {
    // Primaire
    primary: '#0066CC', // Bleu ciel
    primaryDark: '#0052A3',
    primaryLight: '#3399FF',
    
    // Secondaire
    secondary: '#00AA66',
    secondaryDark: '#008844',
    
    // Fond et texte
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceSecondary: '#EBEBEB',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Frontières
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    
    // États
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Spécial
    ripple: 'rgba(0, 102, 204, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    // Primaire
    primary: '#3399FF', // Bleu ciel clair
    primaryDark: '#0066CC',
    primaryLight: '#66B3FF',
    
    // Secondaire
    secondary: '#00DD88',
    secondaryDark: '#00AA66',
    
    // Fond et texte
    background: '#0F0F0F',
    surface: '#1A1A1A',
    surfaceSecondary: '#252525',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#999999',
    
    // Frontières
    border: '#333333',
    borderLight: '#444444',
    
    // États
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Spécial
    ripple: 'rgba(51, 153, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
};

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const transitions = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  elastic: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
};

// Ripple Effect Grid Background
export const patterns = {
  rippleGrid: `
    linear-gradient(0deg, transparent 24%, rgba(0, 102, 204, 0.05) 25%, rgba(0, 102, 204, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 102, 204, 0.05) 75%, rgba(0, 102, 204, 0.05) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(0, 102, 204, 0.05) 25%, rgba(0, 102, 204, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 102, 204, 0.05) 75%, rgba(0, 102, 204, 0.05) 76%, transparent 77%, transparent)
  `,
  gridSize: '50px',
};

// Utilisation dans les composants
export const getThemeColors = (isDarkMode) => isDarkMode ? colors.dark : colors.light;

export const getCSSVariables = (isDarkMode) => {
  const themeColors = getThemeColors(isDarkMode);
  
  return {
    '--color-primary': themeColors.primary,
    '--color-primary-dark': themeColors.primaryDark,
    '--color-primary-light': themeColors.primaryLight,
    '--color-secondary': themeColors.secondary,
    '--color-background': themeColors.background,
    '--color-surface': themeColors.surface,
    '--color-text': themeColors.text,
    '--color-text-secondary': themeColors.textSecondary,
    '--color-border': themeColors.border,
    '--color-success': themeColors.success,
    '--color-error': themeColors.error,
    '--color-warning': themeColors.warning,
  };
};

export default { colors, typography, spacing, breakpoints, shadows, transitions, borderRadius };
