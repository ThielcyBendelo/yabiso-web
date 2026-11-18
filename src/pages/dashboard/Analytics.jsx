import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaGlobeAfrica, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import dashboardService from '../../services/dashboardService';
import notificationService from '../../services/notificationService';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.getStats().then(setStats).catch((err) => notificationService.error(err.message));
  }, []);

  const categories = stats ? Object.entries(stats.categories_breakdown) : [];
  const maxCount = categories.length ? Math.max(...categories.map(([, c]) => c)) : 0;

  return (
    <div className="space-y-8 text-white">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tighter uppercase italic">
            Intelligence <span className="text-[var(--accent-1)]">Commerciale</span>
          </h3>
          <p className="text-xs text-slate-500 font-mono">Basé sur les données réelles de votre catalogue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CARTE : RÉPARTITION RÉELLE PAR FILIÈRE */}
        <div className="lg:col-span-2 bg-[#1c2541]/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-[var(--accent-1)]">
            <FaGlobeAfrica size={120} />
          </div>

          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <FaMapMarkerAlt className="text-red-500" /> Répartition du catalogue par filière
          </h4>

          {categories.length === 0 ? (
            <p className="text-sm text-slate-500">Publiez des produits pour voir apparaître vos statistiques.</p>
          ) : (
            <div className="space-y-6">
              {categories.map(([label, count], i) => (
                <div key={label} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 capitalize group-hover:text-white transition-colors">{label}</span>
                    <span className="text-xs font-black text-white">{count}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARTE : SYNTHÈSE FINANCIÈRE RÉELLE */}
        <div className="bg-gradient-to-br from-[var(--accent-1)] to-orange-700 p-1 rounded-[2.5rem] shadow-2xl">
          <div className="h-full w-full bg-slate-950 rounded-[2.4rem] p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[var(--accent-1)]/10 text-[var(--accent-1)] rounded-2xl">
                  <FaChartLine size={24} />
                </div>
              </div>
              <h4 className="text-base font-black text-white uppercase tracking-wider mb-2">Synthèse financière</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Basée sur vos factures enregistrées dans le module Facturation B2B.
              </p>
            </div>

            <div className="mt-8">
              <div className="text-4xl font-black text-white tracking-tighter">
                {stats?.total_invoiced_usd?.toFixed(2) ?? '0.00'} $
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Total facturé validé</div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
              <div className="flex-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Produits</p>
                <p className="text-sm font-black text-white">{stats?.total_products ?? 0}</p>
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Factures en attente</p>
                <p className="text-sm font-black text-white">{stats?.pending_invoices ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Note de transparence : pas encore de tracking de vues/clics */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-start gap-4">
        <FaInfoCircle className="text-sky-400 shrink-0 mt-1" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Le suivi des vues de fiches produits et des clics WhatsApp (analytics de trafic) n'est pas encore instrumenté côté backend.
          Cette section affichera des métriques d'audience réelles dès l'ajout du tracking d'évènements sur le catalogue public.
        </p>
      </div>
    </div>
  );
}
