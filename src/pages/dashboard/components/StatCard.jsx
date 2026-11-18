import React from 'react';
import { motion } from 'framer-motion';

// Classes Tailwind statiques (les classes générées dynamiquement ne sont pas fiables avec le JIT scanner)
const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', hoverBg: 'group-hover:bg-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', hoverBg: 'group-hover:bg-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', hoverBg: 'group-hover:bg-purple-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', hoverBg: 'group-hover:bg-red-500/20' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', hoverBg: 'group-hover:bg-yellow-500/20' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', hoverBg: 'group-hover:bg-sky-500/20' },
};

/** Carte KPI réutilisable pour les vues du tableau de bord fournisseur. */
export default function StatCard({ label, value, icon: Icon, color = 'emerald', trend }) {
  const c = COLOR_MAP[color] || COLOR_MAP.emerald;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
    >
      <div className="flex justify-between items-start">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
        <div className={`p-2.5 ${c.bg} ${c.text} rounded-xl ${c.hoverBg} transition-colors`}>
          <Icon size={14} />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between w-full">
        <span className="text-3xl font-black tracking-tight text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-bold ${c.text} flex items-center gap-0.5`}>
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
