import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaTimes, FaCloudUploadAlt, FaTag, FaBoxOpen, FaCheckCircle,
  FaExclamationTriangle, FaTrash,
} from 'react-icons/fa';
import { apiFetch } from '../../config/api';
import notificationService from '../../services/notificationService';
import EmptyState from './components/EmptyState';

const CATEGORIES = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'artisanat', label: 'Artisanat' },
  { value: 'cosmetique', label: 'Cosmétique' },
];

const CATEGORY_STYLES = {
  agriculture: 'text-lime-400 border-lime-400/20 bg-lime-400/5',
  artisanat: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  cosmetique: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
};

const EMPTY_FORM = {
  title: '', category: 'agriculture', description: '',
  details: '', price_usd: '', min_order: '', in_stock: true,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newProd, setNewProd] = useState(EMPTY_FORM);

  const fetchMyProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/my-products');
      setProducts(data);
    } catch (error) {
      notificationService.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({ ...newProd, price_usd: parseFloat(newProd.price_usd) }),
      });
      notificationService.success('Produit publié sur le catalogue national.');
      setShowAdd(false);
      setNewProd(EMPTY_FORM);
      fetchMyProducts();
    } catch (error) {
      notificationService.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-white">

      {/* Header du catalogue */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight uppercase italic">
            Inventaire <span className="text-[var(--accent-1)]">National</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">Gérez vos stocks et leur visibilité sur le marché global.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
            showAdd ? 'bg-slate-800 text-white' : 'bg-[var(--accent-1)] hover:bg-orange-600 text-white'
          }`}
        >
          {showAdd ? <FaTimes /> : <FaPlus />}
          {showAdd ? 'Annuler' : 'Publier un produit'}
        </button>
      </div>

      {/* Formulaire d'ajout animé */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAddProduct}
            className="bg-[#1c2541]/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex items-center gap-2 text-orange-500 mb-2">
                <FaCloudUploadAlt size={20} />
                <span className="text-sm font-black uppercase tracking-widest text-white">Nouvelle Fiche Produit</span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nom de l'article</label>
                <input
                  type="text" placeholder="Ex: Café Arabica du Kivu" required
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Filière</label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Prix unitaire (USD)</label>
                <div className="relative">
                  <input
                    type="number" step="0.01" placeholder="0.00" required
                    value={newProd.price_usd}
                    onChange={(e) => setNewProd({ ...newProd, price_usd: e.target.value })}
                    className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">MOQ (Commande Min.)</label>
                <input
                  type="text" placeholder="Ex: 50 kg ou 10 unités" required
                  value={newProd.min_order}
                  onChange={(e) => setNewProd({ ...newProd, min_order: e.target.value })}
                  className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Arguments de vente (Grossistes)</label>
                <textarea
                  placeholder="Décrivez la qualité, l'origine exacte et les délais de livraison..." rows="3"
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit" disabled={submitting}
                className="md:col-span-2 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 mt-2 disabled:opacity-60"
              >
                {submitting ? 'Publication en cours...' : 'Mettre sur le marché national'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Liste des produits */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-[var(--accent-1)] rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest">Calcul des inventaires...</p>
        </div>
      ) : products.length === 0 ? (
        <EmptyState icon={FaBoxOpen} title="Aucun produit dans votre catalogue actuel." description="Cliquez sur « Publier un produit » pour commencer à vendre." />
      ) : (
        <div className="bg-[#1c2541]/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                  <th className="p-6">Désignation</th>
                  <th className="p-6">Filière</th>
                  <th className="p-6">Prix de Gros</th>
                  <th className="p-6">Logistique</th>
                  <th className="p-6 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[var(--accent-1)]">
                          <FaTag size={14} />
                        </div>
                        <div>
                          <p className="font-black text-white text-base">{p.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">SKU-{p.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${CATEGORY_STYLES[p.category] || CATEGORY_STYLES.agriculture}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-white">${Number(p.price_usd).toFixed(2)}</td>
                    <td className="p-6 text-sm text-slate-400">{p.min_order}</td>
                    <td className="p-6 text-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        p.in_stock ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {p.in_stock ? <FaCheckCircle size={10} /> : <FaExclamationTriangle size={10} />}
                        {p.in_stock ? 'En stock' : 'Rupture'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
