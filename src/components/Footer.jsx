import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaThLarge,
  FaStore,
  FaHandshake,
  FaUserCircle,
  FaTimes,
  FaShieldAlt,
  FaBalanceScale
} from 'react-icons/fa';

export default function Footer({ isAuthenticated = false }) {
  const currentYear = new Date().getFullYear();
  const [legalModal, setLegalModal] = useState(null); // 'mentions' | 'confidentialite' | null

  const navLinks = [
    { label: 'Accueil', path: '/', icon: FaHome },
    { label: 'Catalogue', path: '/catalogue', icon: FaThLarge },
    { label: 'Devenir Fournisseur', path: '/devenir-fournisseur', icon: FaStore },
    { label: "Appels d'Offres (B2B)", path: '/appels-offres', icon: FaHandshake },
    {
      label: isAuthenticated ? 'Mon Compte' : 'Connexion',
      path: isAuthenticated ? '/dashboard' : '/login',
      icon: FaUserCircle,
    },
  ];

  return (
    <>
      <footer className="hidden lg:block bg-[var(--surface)] text-gray-300 py-6 mt-auto border-t border-[var(--border-color)] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 space-y-5">
          
          {/* Ligne unique des liens de navigation */}
          <nav
            aria-label="Navigation pied de page"
            className="flex flex-nowrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-wider"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--accent-1)] transition-colors whitespace-nowrap"
                >
                  <Icon className="text-sky-400 text-sm" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Barre de Copyright Finale */}
          <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-center gap-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              © {currentYear} YaBiso <span className="mx-2">|</span> Valorisation & Distribution de gros du Made in DRC
            </p>
            <div className="flex gap-6 text-[10px] uppercase tracking-widest font-black text-gray-400">
              <button
                type="button"
                onClick={() => setLegalModal('mentions')}
                className="hover:text-[var(--accent-1)] transition-colors cursor-pointer"
              >
                Mentions Légales
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('confidentialite')}
                className="hover:text-[var(--accent-1)] transition-colors cursor-pointer"
              >
                Confidentialité
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* MODALE MENTIONS LÉGALES & CONFIDENTIALITÉ */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLegalModal(null)}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white dark:bg-[#0d1330] border border-gray-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden text-left"
            >
              {/* En-tête de la modale */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-[#070a1d] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {legalModal === 'mentions' ? (
                    <FaBalanceScale className="text-amber-500 text-lg" />
                  ) : (
                    <FaShieldAlt className="text-sky-500 text-lg" />
                  )}
                  <h3 className="font-black text-base text-gray-900 dark:text-white">
                    {legalModal === 'mentions'
                      ? 'Mentions Légales — YaBiso RDC'
                      : 'Politique de Confidentialité & Sécurité'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  aria-label="Fermer"
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-800 transition"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Contenu dynamique */}
              <div className="p-6 space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-[65vh] overflow-y-auto">
                {legalModal === 'mentions' ? (
                  <>
                    <p>
                      <strong className="text-gray-900 dark:text-white">Éditeur de la plateforme :</strong>{' '}
                      YaBiso RDC, hub numérique B2B & B2C dédié à la valorisation et la distribution des produits locaux de la République Démocratique du Congo.
                    </p>
                    <p>
                      <strong className="text-gray-900 dark:text-white">Siège opérationnel :</strong>{' '}
                      Kinshasa, République Démocratique du Congo.
                    </p>
                    <p>
                      <strong className="text-gray-900 dark:text-white">Vérification des fournisseurs (KYC) :</strong>{' '}
                      Les producteurs, coopératives et grossistes affichant le badge « Vérifié » ont soumis leurs documents légaux congolais (RCCM, Identification Nationale, Numéro Impôt).
                    </p>
                    <p>
                      <strong className="text-gray-900 dark:text-white">Contact officiel :</strong>{' '}
                      support@yabiso.cd
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong className="text-gray-900 dark:text-white">Protection des données personnelles :</strong>{' '}
                      Conformément au Code du Numérique en vigueur en RDC, vos informations (nom, numéro WhatsApp, adresse de livraison et documents d'entreprise) sont strictement utilisées pour le traitement de vos commandes et demandes de devis.
                    </p>
                    <p>
                      <strong className="text-gray-900 dark:text-white">Sécurité des transactions :</strong>{' '}
                      YaBiso ne stocke aucun code PIN Mobile Money (M-Pesa, Airtel Money, Orange Money) ni numéro de carte bancaire. Tous les paiements transitent via des passerelles agréées et chiffrées.
                    </p>
                    <p>
                      <strong className="text-gray-900 dark:text-white">Vos droits :</strong>{' '}
                      Vous pouvez demander la modification ou la suppression de votre compte fournisseur ou acheteur à tout moment depuis votre espace personnel ou par e-mail.
                    </p>
                  </>
                )}
              </div>

                            {/* Pied de la modale */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-[#070a1d] border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/securite"
                    onClick={() => setLegalModal(null)}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Centre de sécurité →
                  </Link>
                  <Link
                    to="/logistique"
                    onClick={() => setLegalModal(null)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Logistique & Livraison →
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


              