import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt,
  FaLock,
  FaUserCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaWhatsapp,
  FaHandshake,
  FaQrcode,
  FaBalanceScale,
  FaArrowRight,
  FaFileContract,
  FaRegCheckCircle
} from 'react-icons/fa';

// Base de données simulée pour la vérification KYC des fournisseurs
const verifiedSuppliersDB = {
  'YB-SUP-101': {
    id: 'YB-SUP-101',
    name: 'Coopérative Café Kivu (SOPACDI)',
    province: 'Sud-Kivu (Minova)',
    rccm: 'CD/BKV/RCCM/21-B-0412',
    status: 'Vérifié & Certifié Or',
    rating: '4.9/5 (142 transactions)',
    escrowEligible: true
  },
  'YB-SUP-205': {
    id: 'YB-SUP-205',
    name: 'Agri-Nsele Ferme Moderne',
    province: 'Kinshasa (N’sele)',
    rccm: 'CD/KNG/RCCM/23-A-0891',
    status: 'Vérifié & Certifié',
    rating: '4.8/5 (89 transactions)',
    escrowEligible: true
  }
};

// Étapes interactives du système Escrow (Séquestre)
const escrowSteps = [
  {
    step: 1,
    title: 'Commande & Blocage Sécurisé',
    badge: 'Fonds protégés',
    desc: 'L’acheteur paie via Mobile Money (M-Pesa, Airtel, Orange) ou Carte. L’argent est conservé sur un compte séquestre sécurisé, jamais remis directement au vendeur avant expédition.',
    guarantee: '100% remboursable en cas d’annulation avant envoi.'
  },
  {
    step: 2,
    title: 'Contrôle & Expédition Hub',
    badge: 'Traçabilité active',
    desc: 'Le fournisseur dépose la marchandise au point relais ou chez le transporteur partenaire. Le poids et la conformité sont validés avec génération d’un code QR de suivi.',
    guarantee: 'Preuve vidéo/photo disponible sur demande B2B.'
  },
  {
    step: 3,
    title: 'Réception & Validation PIN / QR',
    badge: 'Déblocage instantané',
    desc: 'À l’arrivée, l’acheteur vérifie la marchandise et communique son code PIN de réception. Les fonds sont immédiatement libérés vers le compte du fournisseur.',
    guarantee: 'Zéro risque de colis vide ou non conforme.'
  }
];

export default function SecuritePage() {
  // État pour l'explorateur interactif Escrow
  const [activeEscrowStep, setActiveEscrowStep] = useState(1);

  // États pour le vérificateur de fournisseur
  const [supplierQuery, setSupplierQuery] = useState('YB-SUP-101');
  const [supplierResult, setSupplierResult] = useState(verifiedSuppliersDB['YB-SUP-101']);
  const [supplierNotFound, setSupplierNotFound] = useState(false);

  // États pour le formulaire de signalement d'incident
  const [reportOrder, setReportOrder] = useState('');
  const [reportReason, setReportReason] = useState('retard');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Vérification d'un fournisseur
  const handleVerifySupplier = (e) => {
    e.preventDefault();
    const cleanCode = supplierQuery.trim().toUpperCase();
    if (verifiedSuppliersDB[cleanCode]) {
      setSupplierResult(verifiedSuppliersDB[cleanCode]);
      setSupplierNotFound(false);
    } else {
      setSupplierResult(null);
      setSupplierNotFound(true);
    }
  };

  // Soumission d'un signalement
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportOrder.trim()) return;
    setReportSubmitted(true);
  };

  const currentEscrow = escrowSteps.find((s) => s.step === activeEscrowStep) || escrowSteps[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e27] text-slate-900 dark:text-white pb-20">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0f173a] to-[#0a0e27] text-white pt-14 pb-16 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-5">
              <FaShieldAlt />
              <span>Centre de Confiance & Protection YaBiso</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Achetez et vendez en RDC avec une <span className="text-sky-400">sécurité garantie</span>.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Notre architecture protège chaque transaction grâce au paiement séquestre (Escrow),
              la vérification physique des coopératives et un contrôle qualité avant expédition.
            </p>

            {/* Boutons d'action rapides */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#escrow-simulator"
                className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition shadow-lg"
              >
                <FaLock size={13} />
                <span>Découvrir le Paiement Séquestre</span>
              </a>
              <a
                href="#kyc-checker"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <FaUserCheck size={14} />
                <span>Vérifier un fournisseur</span>
              </a>
            </div>
          </div>

          {/* Barre de statistiques de confiance */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12">
            {[
              { label: 'Fonds protégés (Escrow)', value: '100%', sub: 'Libérés après validation' },
              { label: 'Fournisseurs audités', value: 'KYC / RCCM', sub: 'Identité & stock vérifiés' },
              { label: 'Paiements chiffrés', value: 'SSL 256-bit', sub: 'Mobile Money & Cartes' },
              { label: 'Médiation & Litiges', value: '< 24h', sub: 'Support basé à Kinshasa' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-xl sm:text-2xl font-black text-amber-400">{stat.value}</div>
                <div className="text-xs font-bold text-white mt-1">{stat.label}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LES 4 PILIERS DE SÉCURITÉ ================= */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black">Comment nous éliminons les risques</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1.5">
            Un protocole strict adapté aux échanges commerciaux inter-provinciaux en RDC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {[
            {
              icon: FaLock,
              color: 'text-sky-500 bg-sky-500/10',
              title: 'Séquestre Financier',
              desc: 'Votre paiement reste bloqué en sécurité jusqu’à ce que vous confirmiez la bonne réception des produits.'
            },
            {
              icon: FaUserCheck,
              color: 'text-emerald-500 bg-emerald-500/10',
              title: 'Audit KYC & Terrain',
              desc: 'Chaque producteur fournit son RCCM, sa pièce d’identité et passe un contrôle de capacité de production.'
            },
            {
              icon: FaQrcode,
              color: 'text-amber-500 bg-amber-500/10',
              title: 'Validation QR / PIN',
              desc: 'Un code unique est généré à la commande. Seul ce code autorise le déblocage des fonds au livreur.'
            },
            {
              icon: FaBalanceScale,
              color: 'text-purple-500 bg-purple-500/10',
              title: 'Arbitrage & Remboursement',
              desc: 'En cas de non-conformité constatée à la livraison, notre équipe bloque le paiement et rembourse l’acheteur.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#131936] p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm hover:border-sky-500/50 transition"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-black text-base mt-4">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

           {/* ================= EXPLORATEUR INTERACTIF ESCROW ================= */}
      <section id="escrow-simulator" className="max-w-7xl mx-auto px-4 mt-14">
        <div className="bg-white dark:bg-[#131936] rounded-3xl p-6 sm:p-9 border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-500">
                Fonctionnement pas à pas
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Le Bouclier de Paiement Séquestre (Escrow)
              </h2>
            </div>
            <div className="flex gap-2">
              {escrowSteps.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveEscrowStep(s.step)}
                  className={
                    'px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ' +
                    (activeEscrowStep === s.step
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-[#0a0e27] text-slate-600 dark:text-gray-300 hover:bg-sky-500/10')
                  }
                >
                  Étape {s.step}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-7 items-center">
            {/* Liste des étapes à gauche */}
            <div className="lg:col-span-5 space-y-3">
              {escrowSteps.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveEscrowStep(s.step)}
                  className={
                    'w-full text-left p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ' +
                    (activeEscrowStep === s.step
                      ? 'border-sky-500 bg-sky-500/10'
                      : 'border-slate-200 dark:border-gray-800 hover:border-sky-500/40')
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        'w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ' +
                        (activeEscrowStep === s.step
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-300')
                      }
                    >
                      {s.step}
                    </span>
                    <span className="font-bold text-xs sm:text-sm">{s.title}</span>
                  </div>
                  <FaArrowRight
                    size={12}
                    className={activeEscrowStep === s.step ? 'text-sky-500' : 'text-slate-400'}
                  />
                </button>
              ))}
            </div>

            {/* Détail dynamique à droite */}
            <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 to-[#0a0e27] text-white p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {currentEscrow.badge}
                </span>
                <span className="text-xs text-gray-400 font-bold">
                  Étape {currentEscrow.step} sur 3
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black mt-4">{currentEscrow.title}</h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                {currentEscrow.desc}
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <FaCheckCircle className="text-emerald-400 shrink-0" size={18} />
                <span className="text-xs font-semibold text-gray-200">
                  {currentEscrow.guarantee}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VÉRIFICATEUR KYC & SIGNALEMENT ================= */}
      <section id="kyc-checker" className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLONNE GAUCHE : Vérificateur d'authenticité fournisseur (6 col) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#131936] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sky-500 text-xs font-black uppercase">
                <FaFileContract />
                <span>Contrôle d’identité</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1">
                Vérifier l’accréditation d’un fournisseur
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Saisissez le matricule YaBiso d’un vendeur (ex: <strong>YB-SUP-101</strong> ou{' '}
                <strong>YB-SUP-205</strong>) pour consulter son statut légal.
              </p>

              <form onSubmit={handleVerifySupplier} className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={supplierQuery}
                  onChange={(e) => setSupplierQuery(e.target.value)}
                  placeholder="Ex: YB-SUP-101"
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-800 text-sm font-bold uppercase focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
                >
                  <FaSearch size={13} />
                  <span>Vérifier</span>
                </button>
              </form>

              {supplierNotFound && (
                <div className="mt-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                  <FaExclamationTriangle className="text-rose-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-rose-600 dark:text-rose-400">
                    <strong>Matricule introuvable.</strong> Ne versez jamais d’argent hors de la
                    plateforme à un vendeur non vérifié. Testez avec <code>YB-SUP-101</code>.
                  </div>
                </div>
              )}

              {supplierResult && (
                <div className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {supplierResult.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1">
                      <FaRegCheckCircle /> {supplierResult.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-500/20">
                    <div>
                      <span className="text-slate-500 dark:text-gray-400">Province : </span>
                      <span className="font-bold">{supplierResult.province}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-gray-400">RCCM : </span>
                      <span className="font-bold">{supplierResult.rccm}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 dark:text-gray-400">Fiabilité : </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {supplierResult.rating}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-gray-400">Vous êtes producteur en RDC ?</span>
              <Link
                to="/devenir-fournisseur"
                className="font-black text-sky-500 hover:underline flex items-center gap-1"
              >
                <span>Obtenir le badge Vérifié</span>
                <FaArrowRight size={10} />
              </Link>
            </div>
          </div>

          {/* COLONNE DROITE : Centre de signalement & Urgence Litige (6 col) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#131936] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-black uppercase">
              <FaHandshake />
              <span>Protection Acheteur & Vendeur</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1">
              Signaler un litige ou geler un paiement
            </h2>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Un problème avec une commande ? Bloquez immédiatement le déblocage des fonds séquestres.
            </p>

            {reportSubmitted ? (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <FaCheckCircle className="text-emerald-500 text-3xl mx-auto" />
                <div className="font-black text-sm">Dossier enregistré & Fonds mis en pause</div>
                <p className="text-xs text-slate-600 dark:text-gray-300">
                  Notre équipe de médiation a gelé la transaction{' '}
                  <strong>{reportOrder.toUpperCase()}</strong> et vous contactera sous 2 heures.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReportSubmitted(false);
                    setReportOrder('');
                    setReportDetails('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Faire un autre signalement
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-4 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 mb-1">
                      N° de commande / Bordereau *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportOrder}
                      onChange={(e) => setReportOrder(e.target.value)}
                      placeholder="Ex: CMD-2026-412"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-800 text-xs font-bold focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 mb-1">
                      Motif du blocage
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-800 text-xs font-bold focus:outline-none focus:border-sky-500"
                    >
                      <option value="retard">Retard anormal de livraison</option>
                      <option value="qualite">Produit non conforme / endommagé</option>
                      <option value="quantite">Quantité manquante au pesage</option>
                      <option value="fraude">Tentative de paiement hors plateforme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 mb-1">
                    Description rapide
                  </label>
                  <textarea
                    rows="2"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Expliquez brièvement la situation..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-800 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    Geler les fonds & Ouvrir un ticket
                  </button>
                  <a
                    href={
                      'https://wa.me' +
                      encodeURIComponent(
                        'Urgence Sécurité YaBiso : J’ai besoin d’assistance sur une transaction.'
                      )
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <FaWhatsapp size={15} />
                    <span>Urgence WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
