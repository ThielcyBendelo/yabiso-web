import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  const { pathname, search } = useLocation();

  // Remonte automatiquement en haut de la page à chaque changement de route ou de filtre URL
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // 'instant' évite un défilement lent qui gêne l'animation d'entrée
    });
  }, [pathname, search]);

  return (
    <>
      {/* Barre de progression lumineuse ultra-fine en haut de l'écran */}
      <motion.div
        key={`progress-${pathname}`}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '0% 50%' }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-400 pointer-events-none"
      />

      {/* Animation d'entrée fluide du contenu de la page */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1], // Courbe d'accélération Apple/iOS très naturelle
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}
