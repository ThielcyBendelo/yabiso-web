/**
 * 🎨 Configuration Thème Global
 * Thème clair: Blanc + Bleu ciel + Noir (texte)
 * Thème sombre: Noir + Blanc + Gris (texte)
 */

export const themeConfig = {
  light: {
    // Couleurs principales
    primary: '#0ea5e9', // Bleu ciel
    secondary: '#06b6d4', // Cyan
    accent: '#10b981', // Vert émeraude
    background: '#ffffff', // Blanc
    surface: '#f8fafc', // Gris très clair
    surfaceAlt: '#f1f5f9', // Gris clair
    text: '#000000', // Noir
    textSecondary: '#475569', // Gris foncé
    textTertiary: '#94a3b8', // Gris moyen
    border: '#e2e8f0', // Gris très clair
    shadow: 'rgba(0, 0, 0, 0.1)',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    gradientAccent: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  },
  
  dark: {
    // Couleurs principales
    primary: '#0ea5e9', // Bleu ciel (constant)
    secondary: '#06b6d4', // Cyan
    accent: '#10b981', // Vert émeraude
    background: '#0f172a', // Noir très foncé
    surface: '#1e293b', // Noir foncé
    surfaceAlt: '#334155', // Gris très foncé
    text: '#ffffff', // Blanc
    textSecondary: '#cbd5e1', // Gris clair
    textTertiary: '#94a3b8', // Gris moyen
    border: '#475569', // Gris foncé
    shadow: 'rgba(0, 0, 0, 0.3)',
    error: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
    info: '#60a5fa',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    gradientAccent: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  },
};

// Ripple Grid Background Pro
export const rippleGridPattern = (theme) => `
  radial-gradient(circle at 1px 1px, ${theme.textTertiary}, transparent 1px)
`;

// Styles réutilisables
export const commonStyles = {
  // Transitions
  transitionSmooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionFast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionSlow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Ombres
  shadowSmall: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLarge: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  
  // Blur
  blurSmall: 'blur(4px)',
  blurMedium: 'blur(8px)',
  blurLarge: 'blur(16px)',
};

export default themeConfig;
