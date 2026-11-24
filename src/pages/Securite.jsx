import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TrustSubNavbar from '../components/TrustSubNavbar';
import GlobalSearchModal from '../components/GlobalSearchModal';
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
  FaBars,
  FaTimes,
  FaStore,
  FaTruck,
  FaMobileAlt
} from 'react-icons/fa';

// Base de données pour la vérification KYC / RCCM des fournisseurs
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
  },
  'YB-SUP-310': {
    id: 'YB-SUP-310',
    name: 'Minoterie du Katanga',
    province: 'Haut-Katanga (Lubumbashi)',
    rccm: 'CD/LSH/RCCM/22-B-1104',
    status: 'Vérifié & Certifié Or',
    rating: '4.9/5 (215 transactions)',
    escrowEligible: true
  }
};

// Étapes interactives du système Escrow (Séquestre)
const escrowSteps = [
  {
    step: 1,
    title: 'Commande & Blocage Sécurisé',
    badge: 'Fonds protégés',
    desc: 'L’acheteur règle via Mobile Money (M-Pesa, Airtel Money, Orange Money, Afrimoney) ou Carte. L’argent est conservé sur un compte séquestre bloqué, jamais remis au vendeur avant expédition.',
    guarantee: '100 % remboursable en cas d’annulation avant envoi.'
  },
  {
    step: 2,
    title: 'Contrôle & Expédition Hub',
    badge: 'Traçabilité active',
    desc: 'Le fournisseur dépose la marchandise au point relais ou chez le transporteur partenaire. Le poids et la conformité sont validés avec génération d’un code QR de suivi.',
    guarantee: 'Preuve photo/vidéo disponible avant départ.'
  },
  {
    step: 3,
    title: 'Réception & Validation PIN / QR',
    badge: 'Déblocage instantané',
    desc: 'À la livraison, l’acheteur vérifie le colis et valide avec son code PIN secret. Les fonds sont immédiatement virés sur le compte Mobile Money ou bancaire du fournisseur.',
    guarantee: 'Zéro risque de colis vide ou non conforme.'
  }
];

const mobileMoneyProviders = [
  { name: 'M-Pesa', operator: 'Vodacom RDC', color: 'border-rose-500/40 bg-rose-500/5 text-rose-600 dark:text-rose-400', delay: 'Instantané' },
  { name: 'Airtel Money', operator: 'Airtel RDC', color: 'border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-400', delay: 'Instantané' },
  { name: 'Orange Money', operator: 'Orange RDC', color: 'border-orange-500/40 bg-orange-500/5 text-orange-600 dark:text-orange-400', delay: 'Instantané' },
  { name: 'Afrimoney', operator: 'Africell RDC', color: 'border-purple-500/40 bg-purple-500/5 text-purple-600 dark:text-purple-400', delay: 'Instantané' }
];

export default function SecuritePage() {
  const navigate = useNavigate();

  // Navigation mobile & recherche globale
  const [mobileQuickMenuOpen, setMobileQuickMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Explorateur interactif Escrow
  const [activeEscrowStep, setActiveEscrowStep] = useState(1);

  // Vérificateur KYC / RCCM
  const [supplierQuery, setSupplierQuery] = useState('YB-SUP-101');
  const [supplierResult, setSupplierResult] = useState(verifiedSuppliersDB['YB-SUP-101']);
  const [supplierNotFound, setSupplierNotFound] = useState(false);

  // Formulaire de signalement d'incident
  const [reportOrder, setReportOrder] = useState('');
  const [reportReason, setReportReason] = useState('retard');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

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

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportOrder.trim()) return;
    setReportSubmitted(true);
  };

  const currentEscrow = escrowSteps.find((s) => s.step === activeEscrowStep) || escrowSteps[0];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-0 pb-24">
      
      {/* 1. SOUS-NAVBAR DESKTOP */}
      <div className="hidden md:block">
        <TrustSubNavbar />
      </div>

      {/* 2. BARRE MOBILE COMPACTE PRO & MODERNE (Alignée avec AppelsOffres) */}
      <div className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-[#0b102b]/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 px-3 py-2">
        <div className="flex items-center justify-between gap-2 relative">
          
          <button
            type="button"
            onClick={() => setMobileQuickMenuOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              mobileQuickMenuOpen
                ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                : 'bg-slate-100 dark:bg-[#131936] text-slate-800 dark:text-white border-slate-200 dark:border-gray-800'
            }`}
          >
            {mobileQuickMenuOpen ? <FaTimes className="text-xs" /> : <FaBars className="text-xs text-sky-500" />}
            <span></span>
          </button>

          <span className="text-xs font-black text-slate-800 dark:text-white truncate">
            Sécurité & Escrow RDC
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Rechercher"
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] hover:border-sky-500 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-gray-800 transition cursor-pointer"
            >
              <FaSearch className="text-xs" />
            </button>

            <a
              href="#kyc-checker"
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1 shadow-sm shrink-0"
            >
              <FaUserCheck /> RCCM
            </a>
          </div>

          {/* POPOVER MENU FLOTTANT */}
          <AnimatePresence>
            {mobileQuickMenuOpen && (
              <>
                <div onClick={() => setMobileQuickMenuOpen(false)} className="fixed inset-0 z-30" />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-11 z-40 w-64 rounded-2xl bg-white dark:bg-[#0f1638] border border-slate-200 dark:border-gray-700/80 shadow-xl p-2 space-y-1"
                >
                  <button
                    type="button"
                    onClick={() => { setMobileQuickMenuOpen(false); navigate('/fournisseurs'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18214d] text-left text-xs font-bold"
                  >
                    <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500"><FaStore /></span>
                    <div>
                      <span className="block">Fournisseurs Vérifiés</span>
                      <span className="text-[10px] font-normal text-slate-500">Annuaire producteurs RDC</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMobileQuickMenuOpen(false); navigate('/logistique'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18214d] text-left text-xs font-bold"
                  >
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><FaTruck /></span>
                    <div>
                      <span className="block">Logistique & Fret</span>
                      <span className="text-[10px] font-normal text-slate-500">Transport 26 provinces</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMobileQuickMenuOpen(false); navigate('/appels-offres'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18214d] text-left text-xs font-bold"
                  >
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><FaHandshake /></span>
                    <div>
                      <span className="block">Appels d'Offres B2B</span>
                      <span className="text-[10px] font-normal text-slate-500">Marchés & devis en gros</span>
                    </div>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CONTENEUR PRINCIPAL (Plein écran rectangulaire sur mobile, centré sur desktop) */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 pt-0 sm:pt-4 space-y-2.5 sm:space-y-5">
        {/* 3. BANNIÈRE EN-TÊTE COMPACTE */}
        <section className="bg-gradient-to-br from-slate-900 via-[#0f173a] to-[#0a0e27] text-white rounded-none sm:rounded-2xl p-4 sm:p-6 border-b sm:border border-white/10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <FaShieldAlt />
                <span>Centre de Confiance & Protection YaBiso</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
                Transactions protégées par <span className="text-sky-400">Compte Séquestre (Escrow)</span> & Audit RCCM.
              </h1>

              <p className="hidden sm:block mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                Vos paiements Mobile Money sont bloqués en sécurité jusqu’à la confirmation physique de réception de votre commande partout en RDC.
              </p>
            </div>

            {/* 4 INDICATEURS CLÉS COMPACTS */}
            <div className="grid grid-cols-2 gap-2 shrink-0 lg:w-80">
              {[
                { label: 'Fonds Escrow', value: '100%' },
                { label: 'Audit Fournisseur', value: 'RCCM / KYC' },
                { label: 'Opérateurs RDC', value: '4 Réseaux' },
                { label: 'Médiation Litiges', value: '< 24h' }
              ].map((stat, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm sm:text-base font-black text-amber-400">{stat.value}</div>
                  <div className="text-[10px] font-semibold text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. EXPLORATEUR INTERACTIF DU COMPTE SÉQUESTRE (ESCROW) + MOBILE MONEY */}
        <section
          id="escrow-simulator"
          className="bg-white dark:bg-[#131936] rounded-none sm:rounded-2xl border-y sm:border border-slate-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-500">
                Fonctionnement étape par étape
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Comment fonctionne le Paiement Séquestre (Escrow) ?
              </h2>
            </div>

            {/* Onglets des 3 étapes */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-[#0a0e27] p-1 rounded-xl border border-slate-200 dark:border-gray-800">
              {escrowSteps.map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveEscrowStep(item.step)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                    activeEscrowStep === item.step
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Étape {item.step}
                </button>
              ))}
            </div>
          </div>

          {/* Détail de l'étape sélectionnée */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200/80 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                  {currentEscrow.badge}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {currentEscrow.step}. {currentEscrow.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                {currentEscrow.desc}
              </p>
            </div>

            <div className="sm:w-64 shrink-0 p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[11px] font-bold text-sky-700 dark:text-sky-300 flex items-center gap-2">
              <FaCheckCircle className="text-sky-500 shrink-0" />
              <span>{currentEscrow.guarantee}</span>
            </div>
          </div>

          {/* Opérateurs Mobile Money compatibles avec logos officiels */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 dark:text-gray-400 mb-2">
              <FaMobileAlt className="text-amber-500" />
              <span>Réseaux Mobile Money connectés au séquestre (CDF & USD) :</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {mobileMoneyProviders.map((op) => (
                <div
                  key={op.name}
                  className={`px-2.5 py-2 rounded-xl border flex items-center justify-between gap-2 ${op.color}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {op.logo}
                    <div className="min-w-0">
                      <span className="text-xs font-black block truncate">{op.name}</span>
                      <span className="text-[10px] opacity-80 block truncate">{op.operator}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/70 dark:bg-black/30 shrink-0">
                    {op.delay}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. GRILLE 2 COLONNES : VÉRIFICATEUR RCCM & SIGNALEMENT D'INCIDENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-5">
          
          {/* COLONNE GAUCHE : VÉRIFICATEUR D'IDENTITÉ FOURNISSEUR (RCCM / KYC) */}
          <section
            id="kyc-checker"
            className="bg-white dark:bg-[#131936] rounded-none sm:rounded-2xl border-y sm:border border-slate-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <FaUserCheck />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Vérification RCCM & Audit Fournisseur
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    Contrôlez l’authenticité d’une coopérative avant toute commande.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifySupplier} className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={supplierQuery}
                  onChange={(e) => setSupplierQuery(e.target.value)}
                  placeholder="Code fournisseur (ex: YB-SUP-101)"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-xs font-bold outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <FaSearch className="text-[11px]" /> Vérifier
                </button>
              </form>

              {/* Suggestions de codes de test */}
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500">
                <span>Tester :</span>
                {Object.keys(verifiedSuppliersDB).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setSupplierQuery(code);
                      setSupplierResult(verifiedSuppliersDB[code]);
                      setSupplierNotFound(false);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0a0e27] hover:text-sky-500 font-bold cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>

              {/* Résultat de la vérification */}
                           {/* Résultat de la vérification */}
              {supplierResult && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white">
                      {supplierResult.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-extrabold flex items-center gap-1">
                      <FaCheckCircle /> {supplierResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-600 dark:text-gray-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">N° RCCM enregistré</span>
                      <span className="font-mono font-bold">{supplierResult.rccm}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Province & Évaluation</span>
                      <span className="font-bold">{supplierResult.province} • {supplierResult.rating}</span>
                    </div>
                  </div>
                </div>
              )}

              {supplierNotFound && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <FaExclamationTriangle className="shrink-0" />
                  <span>Aucun fournisseur certifié trouvé sous ce matricule. Ne payez jamais hors séquestre.</span>
                </div>
              )}

            {/* Rappel QR Code */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <FaQrcode className="text-sky-500 text-sm" />
                Certificat KYC vérifiable par QR Code sur chaque facture.
              </span>
            </div>
          </div>
        </section>


          {/* COLONNE DROITE : MÉDIATION & SIGNALEMENT D'INCIDENT */}
          <section className="bg-white dark:bg-[#131936] rounded-none sm:rounded-2xl border-y sm:border border-slate-200 dark:border-gray-800 p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <FaBalanceScale />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Médiation & Gel des Fonds en cas de Litige
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    Signalez un retard ou une non-conformité avant de valider votre code PIN.
                  </p>
                </div>
              </div>

              {reportSubmitted ? (
                <div className="mt-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                  <div className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <FaCheckCircle /> Dossier ouvert — Fonds séquestres gelés
                  </div>
                  <p className="text-slate-600 dark:text-gray-300">
                    Notre équipe d’arbitrage à Kinshasa examine la commande <strong>{reportOrder}</strong> et vous contactera sous moins de 24h.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setReportSubmitted(false);
                      setReportOrder('');
                      setReportDetails('');
                    }}
                    className="text-[11px] font-bold text-sky-500 underline cursor-pointer"
                  >
                    Effectuer un autre signalement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-2.5 mt-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={reportOrder}
                      onChange={(e) => setReportOrder(e.target.value)}
                      placeholder="N° Commande (ex: CMD-884)"
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 outline-none focus:border-sky-500"
                    />
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 outline-none"
                    >
                      <option value="retard">Retard de livraison</option>
                      <option value="qualite">Produit non conforme</option>
                      <option value="quantite">Quantité incomplète</option>
                      <option value="autre">Autre litige</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    required
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Décrivez brièvement le problème constaté..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 outline-none focus:border-sky-500"
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition cursor-pointer"
                    >
                      Bloquer le paiement & Ouvrir un litige
                    </button>
                    <a
                      href="https://wa.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-700 hover:text-white dark:text-emerald-400 dark:hover:text-white border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <FaWhatsapp className="text-sm" /> Support Urgent
                    </a>
                  </div>
                </form>
              )}
            </div>
          </section>

        </div>
      </div>

      {/* MODALE EXTERNE DE RECHERCHE GLOBALE */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

