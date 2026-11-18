import React from 'react';

/** État vide standard pour les listes du tableau de bord (messages, factures, produits...). */
export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="p-16 text-center bg-[#1c2541]/20 rounded-3xl border border-dashed border-white/10">
      {Icon && <Icon size={48} className="mx-auto text-slate-700 mb-4" />}
      <p className="text-slate-300 font-bold mb-1">{title}</p>
      {description && <p className="text-slate-500 text-sm">{description}</p>}
    </div>
  );
}
