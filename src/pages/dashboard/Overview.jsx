import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBoxes, FaWhatsapp, FaCheckCircle, FaChartLine, FaFileInvoiceDollar,
  FaComments, FaArrowRight, FaLightbulb,
} from 'react-icons/fa';
import dashboardService from '../../services/dashboardService';
import notificationService from '../../services/notificationService';
import StatCard from './components/StatCard';

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then(setStats)
      .catch((err) => notificationService.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Chargement des statistiques réelles...</p>
      </div>
    );
  }

  const topCategory = stats?.categories_breakdown
    ? Object.entries(stats.categories_breakdown).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div className="space-y-6 text-white">

      {/* En-tête de bienvenue contextuel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1c2541]/40 to-[#0b132b]/20 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-black tracking-tight">Tableau de bord Vendeur</h2>
          <p className="text-xs text-slate-400 mt-1">Données calculées en direct depuis votre catalogue et vos échanges.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <FaCheckCircle className="text-emerald-400" size={14} />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Compte Certifié RDC</span>
        </div>
      </div>

      {/* Grille principale des KPIs (données réelles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Produits Actifs" value={stats?.total_products ?? 0} icon={FaBoxes} color="emerald" />
        <StatCard label="En Stock" value={stats?.in_stock_products ?? 0} icon={FaCheckCircle} color="sky" />
        <StatCard label="Messages Non Lus" value={stats?.unread_messages ?? 0} icon={FaComments} color="purple" />
        <StatCard label="Factures en Attente" value={stats?.pending_invoices ?? 0} icon={FaFileInvoiceDollar} color="yellow" />
      </div>

      {/* Carte d'Insight basée sur des données réelles */}
      <div className="bg-gradient-to-br from-[#1c2541]/80 to-[#141d36]/90 border border-white/10 p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 max-w-3xl">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0 mt-0.5">
            <FaLightbulb size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {stats?.total_products > 0 ? 'Aperçu de votre catalogue' : 'Votre catalogue est encore vide'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {stats?.total_products > 0 ? (
                <>
                  Votre filière la plus représentée est <span className="text-emerald-400 font-semibold">{topCategory?.[0]}</span> avec{' '}
                  <span className="font-semibold text-white">{topCategory?.[1]}</span> produit(s). Un total de{' '}
                  <span className="font-semibold text-white">{stats?.total_invoiced_usd?.toFixed(2)} $</span> a été facturé et validé.
                </>
              ) : (
                'Publiez votre premier produit pour commencer à apparaître dans le catalogue national et recevoir des demandes B2B.'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/mes-produits')}
          className="w-full md:w-auto shrink-0 bg-white/5 hover:bg-emerald-600 text-white border border-white/10 hover:border-transparent px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-md"
        >
          Gérer mon catalogue
          <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Répartition par filière (donnée réelle) */}
      <div className="p-6 bg-[var(--surface)] border border-white/5 rounded-3xl">
        <h5 className="text-sm font-bold text-white uppercase tracking-tight mb-6">Répartition du catalogue par filière</h5>
        {stats?.total_products > 0 ? (
          <div className="space-y-4">
            {Object.entries(stats.categories_breakdown).map(([cat, count], i) => {
              const pct = Math.round((count / stats.total_products) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 capitalize">{cat}</span>
                    <span className="text-xs font-black text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aucun produit publié pour le moment.</p>
        )}
      </div>
    </div>
  );
}
