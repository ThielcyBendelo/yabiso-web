import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS_DB, getProductImage } from '../data/productsData';
import {
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHandshake,
  FaBoxOpen,
  FaArrowRight
} from 'react-icons/fa';

export default function GlobalSearchModal({ isOpen, onClose, rfqs = [], buyerMode = 'B2C' }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  // Focus automatique + masquage de MobileBottomNav à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.dataset.mobileMenuOpen = 'true';
      window.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: true }));
    } else {
      document.body.dataset.mobileMenuOpen = 'false';
      window.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: false }));
    }
  }, [isOpen]);

  // Filtrage instantané dès la 1ère lettre
  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return { products: [], offers: [] };

    const matchedProducts = (PRODUCTS_DB || [])
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(clean) ||
          p.categoryLabel?.toLowerCase().includes(clean) ||
          p.province?.toLowerCase().includes(clean) ||
          p.supplier?.toLowerCase().includes(clean)
      )
      .slice(0, 6);

    const matchedOffers = (rfqs || [])
      .filter(
        (r) =>
          r.title?.toLowerCase().includes(clean) ||
          r.buyer?.toLowerCase().includes(clean) ||
          r.province?.toLowerCase().includes(clean) ||
          r.category?.toLowerCase().includes(clean)
      )
      .slice(0, 4);

    return { products: matchedProducts, offers: matchedOffers };
  }, [query, rfqs]);

  if (!isOpen) return null;

  const hasTyped = query.trim().length > 0;
  const totalResults = results.products.length + results.offers.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-0 sm:pt-16 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[82vh] bg-white dark:bg-[#0b102b] sm:rounded-2xl border-0 sm:border border-slate-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* BARRE DE SAISIE EN HAUT */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-gray-800 flex items-center gap-2.5 bg-white dark:bg-[#0b102b]">
            <FaSearch className="text-sky-500 text-base shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit, province (Kivu, Kinshasa), appel d'offres..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5"
              >
                Effacer
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 shrink-0"
            >
              <FaTimes />
            </button>
          </div>

          {/* ZONE DE RÉSULTATS INSTANTANÉS */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
            {!hasTyped && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  Suggestions rapides RDC
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Café', 'Manioc', 'Miel', 'Kivu', 'Kinshasa', 'Raphia', 'Huile de Palme'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#131936] text-xs font-bold text-slate-700 dark:text-gray-300 hover:border-sky-500 border border-transparent transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasTyped && totalResults === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">
                Aucun résultat trouvé pour « <span className="font-bold text-slate-800 dark:text-white">{query}</span> ».
              </div>
            )}

            {/* RÉSULTATS PRODUITS LOCAUX */}
            {results.products.length > 0 && (
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-sky-500 mb-2 flex items-center gap-1.5">
                  <FaBoxOpen /> Produits Locaux ({results.products.length})
                </h4>
                <div className="space-y-2">
                  {results.products.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onClose();
                        navigate(`/produit/${prod.id}`);
                      }}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 dark:bg-[#131936] hover:border-sky-500 border border-slate-200/70 dark:border-gray-800 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={getProductImage(prod.id)}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                              <FaMapMarkerAlt /> {prod.province}
                            </span>
                            <span>•</span>
                            <span className="truncate">{prod.supplier}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-sky-600 dark:text-sky-400 block">
                          {buyerMode === 'B2B' ? prod.priceB2B : prod.priceB2C} $
                        </span>
                        <FaArrowRight className="text-[10px] text-slate-400 ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RÉSULTATS APPELS D'OFFRES B2B */}
            {results.offers.length > 0 && (
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1.5">
                  <FaHandshake /> Appels d'Offres B2B ({results.offers.length})
                </h4>
                <div className="space-y-2">
                  {results.offers.map((rfq) => (
                    <div
                      key={rfq.id}
                      onClick={() => {
                        onClose();
                        navigate('/appels-offres');
                      }}
                      className="p-2.5 rounded-xl bg-amber-500/5 hover:border-amber-400 border border-amber-500/20 cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <span>{rfq.id} • {rfq.province}</span>
                        <span>{rfq.quantity}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {rfq.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
