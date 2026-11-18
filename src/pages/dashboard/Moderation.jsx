import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

export default function Moderation() {
  return (
    <div className="p-8 text-white min-h-[50vh] flex flex-col justify-center items-center bg-[#1c2541]/45 border border-dashed border-zinc-700 rounded-2xl text-center">
      <FaShieldAlt size={40} className="text-slate-600 mb-4" />
      <h3 className="text-xl font-bold mb-2">🛡️ Espace Modération</h3>
      <p className="text-sm text-gray-400 max-w-md">
        Interface de validation des documents légaux (RCCM / ID Nat) des nouveaux fournisseurs en cours de développement...
      </p>
    </div>
  );
}
