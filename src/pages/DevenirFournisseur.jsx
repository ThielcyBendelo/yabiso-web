import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaStore, FaCheckCircle, FaWhatsapp, FaMobileAlt, FaShieldAlt,
  FaIdCard, FaMapMarkerAlt, FaArrowRight, FaArrowLeft, FaUserTie
} from 'react-icons/fa';

export default function DevenirFournisseur() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // États du formulaire
  const [businessName, setBusinessName] = useState('');
  const [supplierType, setSupplierType] = useState('cooperative');
  const [mainCategory, setMainCategory] = useState('Agriculture & Vivres');
  const [province, setProvince] = useState('Kinshasa');
  const [city, setCity] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [mobileMoneyOperator, setMobileMoneyOperator] = useState('mpesa');
  const [rccmNumber, setRccmNumber] = useState('');
  const [requestVerification, setRequestVerification] = useState(true);

  const provinces = [
    'Kinshasa', 'Kongo-Central', 'Nord-Kivu', 'Sud-Kivu',
    'Haut-Katanga', 'Lualaba', 'Équateur', 'Kasaï', 'Tshopo', 'Ituri'
  ];

  const categories = [
    'Agriculture & Vivres',
    'Agro-alimentaire transformé',
    'Artisanat & Déco',
    'Textiles & Mode',
    'Cosmétiques naturels & Soins'
  ];

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-16 pb-20 px-3 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-[#131936] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-gray-800 shadow-lg text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            <FaCheckCircle />
          </div>
          <h2 className="text-lg sm:text-xl font-black">
            Bienvenue sur YaBiso RDC, {businessName} !
          </h2>
          <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
            Votre boutique fournisseur a été créée avec succès. Un code de confirmation vient d'être envoyé sur votre numéro WhatsApp{' '}
            <strong className="text-slate-900 dark:text-white">{whatsappPhone}</strong>.
          </p>
          {requestVerification && (
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-[11px] font-semibold">
              Un agent YaBiso vous contactera sous 48h pour finaliser votre badge « Fournisseur Vérifié 🇨🇩 ».
            </div>
          )}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition"
            >
              Accéder à mon Tableau de Bord
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-gray-700 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Accueil
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pb-20 pt-19">
      
      {/* =====================================================================
          1. PETITE NAVBAR COMPACTE FIXE (h-12)
         ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white/95 dark:bg-[#0d122b]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40 px-2.5 sm:px-4">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              title="Retour à l'accueil"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#131936] text-gray-700 dark:text-gray-200 hover:bg-sky-500 hover:text-white transition"
            >
              <FaArrowLeft className="text-xs" />
            </button>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-xs sm:text-sm tracking-tight text-gray-900 dark:text-white">
                Devenir Fournisseur
              </h1>
              <span className="hidden xs:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-400">
                Gratuit
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Déjà inscrit ? Connexion →
          </button>
        </div>
      </header>

      {/* =====================================================================
          2. CONTENU PRINCIPAL COMPACT (Grille serrée)
         ===================================================================== */}
      <main className="pt-15 sm:pt-16 px-2.5 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-7 items-start">
            
            {/* COLONNE GAUCHE : AVANTAGES PRODUCTEURS LOCAUX (5 colonnes) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-white dark:bg-[#131936] lg:bg-transparent p-3.5 lg:p-0 rounded-2xl border border-gray-200/80 dark:border-gray-800 lg:border-none">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Espace Producteurs & PME RDC
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight">
                  Vendez vos produits dans toute la <span className="text-sky-600 dark:text-sky-400">RDC</span>.
                </h2>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Coopérative agricole, artisan ou PME de transformation : touchez des milliers d'acheteurs et d'entreprises sans intermédiaires.
                </p>
              </div>

              {/* Cartes avantages compactes (défilement horizontal sur mobile, empilées sur desktop) */}
              <div className="flex lg:flex-col gap-2.5 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="min-w-[240px] lg:min-w-0 p-3 rounded-xl bg-white dark:bg-[#131936] border border-slate-200/80 dark:border-gray-800 flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 shrink-0">
                    <FaWhatsapp className="text-sm" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">Commandes sur WhatsApp</h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                      Recevez vos alertes de commandes et demandes de devis directement sur WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="min-w-[240px] lg:min-w-0 p-3 rounded-xl bg-white dark:bg-[#131936] border border-slate-200/80 dark:border-gray-800 flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 shrink-0">
                    <FaMobileAlt className="text-sm" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">Paiement garanti Mobile Money</h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                      Fonds sécurisés avant expédition. Retraits instantanés sur M-Pesa, Airtel, Orange ou Afrimoney.
                    </p>
                  </div>
                </div>

                <div className="min-w-[240px] lg:min-w-0 p-3 rounded-xl bg-white dark:bg-[#131936] border border-slate-200/80 dark:border-gray-800 flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 shrink-0">
                    <FaShieldAlt className="text-sm" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">Accès aux marchés B2B</h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                      Répondez aux appels d'offres des hôtels, restaurants et supermarchés du pays.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE : FORMULAIRE EN 3 ÉTAPES COMPACT (7 colonnes) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#131936] rounded-2xl border border-slate-200/90 dark:border-gray-800 p-4 sm:p-5 shadow-sm">
              
                           {/* Indicateur d'étapes compact */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-gray-800">
                {[
                  { num: 1, label: 'Activité' },
                  { num: 2, label: 'Localisation' },
                  { num: 3, label: 'Paiement & Validation' }
                ].map((s) => (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => s.num < step && setStep(s.num)}
                    className="flex items-center gap-1.5 text-left"
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition ${
                        step >= s.num
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-100 dark:bg-gray-800 text-slate-400'
                      }`}
                    >
                      {s.num}
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        step === s.num
                          ? 'text-slate-900 dark:text-white'
                          : step > s.num
                          ? 'text-sky-600 dark:text-sky-400 hidden sm:inline'
                          : 'text-slate-400 hidden sm:inline'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* ================= ÉTAPE 1 : ACTIVITÉ ================= */}
              {step === 1 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Nom de la structure / Coopérative / Marque *
                    </label>
                    <div className="relative">
                      <FaStore className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ex: Coopérative Café Kivu, Miel du Mayombe..."
                        className="w-full h-9 pl-8 pr-3 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Type de fournisseur
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'cooperative', label: 'Coopérative' },
                        { id: 'pme', label: 'PME / Société' },
                        { id: 'artisan', label: 'Artisan / Indép.' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSupplierType(t.id)}
                          className={`py-2 px-2 rounded-lg border text-[11px] font-bold transition ${
                            supplierType === t.id
                              ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Catégorie principale de produits
                    </label>
                    <select
                      value={mainCategory}
                      onChange={(e) => setMainCategory(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs font-medium focus:outline-none focus:border-sky-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <span>Continuer : Localisation</span>
                      <FaArrowRight className="text-[11px]" />
                    </button>
                  </div>
                </form>
              )}

              {/* ================= ÉTAPE 2 : LOCALISATION & CONTACT ================= */}
              {step === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Province de production *
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-2.5 text-amber-500 text-xs" />
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full h-9 pl-8 pr-2.5 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs font-medium focus:outline-none focus:border-sky-500"
                        >
                          {provinces.map((prov) => (
                            <option key={prov} value={prov}>
                              {prov}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Ville / Territoire *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Kalamu, Beni, Matadi..."
                        className="w-full h-9 px-3 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Nom du responsable *
                      </label>
                      <div className="relative">
                        <FaUserTie className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Prénom & Nom"
                          className="w-full h-9 pl-8 pr-3 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Numéro WhatsApp professionnel *
                      </label>
                      <div className="relative">
                        <FaWhatsapp className="absolute left-3 top-2.5 text-emerald-500 text-xs" />
                        <input
                          type="tel"
                          required
                          value={whatsappPhone}
                          onChange={(e) => setWhatsappPhone(e.target.value)}
                          placeholder="+243 81 000 0000"
                          className="w-full h-9 pl-8 pr-3 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                                    <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      ← Retour
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 transition"
                    >
                      <span>Continuer : Paiement</span>
                      <FaArrowRight className="text-[11px]" />
                    </button>
                  </div>
                </form>
              )}
                           {/* ================= ÉTAPE 3 : PAIEMENT & VALIDATION ================= */}
              {step === 3 && (
                <form onSubmit={handleFinalSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Opérateur Mobile Money pour vos encaissements
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'mpesa', label: 'M-Pesa' },
                        { id: 'airtel', label: 'Airtel Money' },
                        { id: 'orange', label: 'Orange Money' },
                        { id: 'afrimoney', label: 'Afrimoney' },
                      ].map((op) => (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => setMobileMoneyOperator(op.id)}
                          className={`py-2 px-2 rounded-lg border text-[11px] font-bold transition ${
                            mobileMoneyOperator === op.id
                              ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500'
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Numéro RCCM / Patente / Carte d'identité (Optionnel)
                    </label>
                    <div className="relative">
                      <FaIdCard className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                      <input
                        type="text"
                        value={rccmNumber}
                        onChange={(e) => setRccmNumber(e.target.value)}
                        placeholder="Ex: CD/KIN/RCCM/24-B-00123"
                        className="w-full h-9 pl-8 pr-3 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200/80 dark:border-gray-800">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requestVerification}
                        onChange={(e) => setRequestVerification(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-sky-500 focus:ring-sky-500"
                      />
                      <span className="text-xs leading-snug">
                        <strong className="text-gray-900 dark:text-white flex items-center gap-1">
                          <FaCheckCircle className="text-sky-500" /> Demander le badge « Fournisseur Vérifié 🇨🇩 »
                        </strong>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                          Augmente la confiance des acheteurs B2B et débloque l'accès aux appels d'offres.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      ← Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <FaCheckCircle />
                      <span>Créer ma boutique fournisseur</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
