import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import logoM from '../assets/logoM.png'; // ⚠️ Vérifiez que le chemin et l'extension (.png, .svg, .webp) correspondent à votre fichier

export default function ProfessionalSplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Connexion aux terroirs de la RDC...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 4;
        if (next === 36) setStatusText('Vérification des coopératives et artisans...');
        if (next === 72) setStatusText('Sécurisation Mobile Money & Séquestre...');
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[999] bg-white dark:bg-[#070a1d] flex flex-col justify-between items-center p-6 sm:p-10 select-none overflow-hidden"
      >
        {/* Décoration subtile en arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-100/60 dark:bg-sky-900/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-100/50 dark:bg-amber-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Barre supérieure : Badge RDC + Bouton Passer */}
        <div className="w-full max-w-4xl flex justify-between items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#131936] text-slate-600 dark:text-gray-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>Plateforme B2C & B2B • RDC 🇨🇩</span>
          </div>

          <button
            type="button"
            onClick={() => onComplete && onComplete()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-[#131936] transition cursor-pointer"
          >
            <span>Passer</span>
            <FaArrowRight size={10} />
          </button>
        </div>

        {/* Centre : Logo animé, Slogan & Barre de progression */}
        <div className="flex flex-col items-center text-center max-w-md w-full my-auto">
          {/* Emblème animé */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-sky-700 shadow-2xl shadow-sky-500/30 flex items-center justify-center relative overflow-hidden">
              {/* Ruban diagonale jaune & rouge inspiré du drapeau RDC */}
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-400 rotate-45 opacity-90" />
              <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-red-500 rotate-45 opacity-90" />
              <span className="relative z-10 text-white font-serif font-black text-3xl tracking-tight">
                YB
              </span>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-md"
            >
              <FaCheckCircle size={15} />
            </motion.div>
          </motion.div>

          {/* Titre de la marque */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-sky-600 via-amber-500 to-red-500 text-transparent bg-clip-text font-serif tracking-wide">
                YaBiso
              </h1>
              <span className="text-sm font-black px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400">
                RDC
              </span>
            </div>
            <p className="text-xs uppercase tracking-[3px] text-slate-400 dark:text-gray-400 font-bold mt-2">
              Le Hub du Made in Congo
            </p>
          </motion.div>

          {/* Barre de progression moderne */}
          <div className="w-full mt-8 sm:mt-10 space-y-2.5">
            <div className="w-full h-2 bg-slate-100 dark:bg-[#131936] rounded-full overflow-hidden p-0.5 border border-slate-200/70 dark:border-gray-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-amber-400 to-sky-600"
                style={{ width: progress + '%' }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-gray-400">
              <span>{statusText}</span>
              <span className="font-black text-sky-600 dark:text-sky-400">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Bas de page : Mention sécurité + Signature de marque "from Muamokel" */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-gray-500 text-center">
            <FaShieldAlt className="text-sky-500 shrink-0" />
            <span>Transactions protégées • M-Pesa • Airtel • Orange • Afrimoney</span>
          </div>

          {/* 3. SIGNATURE DE MARQUE (FOOTER "FROM MUAMOKEL") */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col items-center gap-2 relative z-10"
          >
            {/* Mention "from" discrète et corporative */}
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500/80 dark:text-slate-400/80">
              from
            </span>

            {/* Bloc Logo + Nom de la société */}
            <div className="flex items-center gap-3 bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-slate-800 rounded-xl px-5 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] backdrop-blur-md">
              <img
                src={logoM}
                alt="Logo Muamokel"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain opacity-95"
              />
              <span className="text-slate-900 dark:text-white font-black tracking-wider text-base sm:text-lg uppercase">
                Muamokel
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
