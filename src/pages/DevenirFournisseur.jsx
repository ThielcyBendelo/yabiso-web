import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaStore, FaCheckCircle, FaWhatsapp, FaMobileAlt, FaShieldAlt,
  FaIdCard, FaMapMarkerAlt, FaArrowRight, FaUserTie
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

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-32 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white dark:bg-[#131936] rounded-3xl p-8 border border-slate-200 dark:border-gray-800 shadow-xl text-center space-y-5"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-black">Bienvenue sur YaBiso RDC, {businessName} !</h2>
          <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
            Votre boutique fournisseur a été créée avec succès. Un code de confirmation vient d'être envoyé sur votre numéro WhatsApp{' '}
            <strong>{whatsappPhone}</strong>.
          </p>
          {requestVerification && (
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              Un agent YaBiso vous contactera sous 48h pour finaliser votre badge « Fournisseur Vérifié 🇨🇩 ».
            </div>
          )}
          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm transition"
            >
              Accéder à mon Tableau de Bord
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="py-3.5 px-5 rounded-xl border border-slate-200 dark:border-gray-700 font-bold text-sm"
            >
              Accueil
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLONNE GAUCHE : AVANTAGES POUR LES PRODUCTEURS LOCAUX (5 colonnes) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                Inscription 100% Gratuite
              </span>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                Vendez vos produits dans toute la <span className="text-sky-600 dark:text-sky-400">RDC</span>.
              </h1>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-3 leading-relaxed">
                Que vous soyez une coopérative agricole, un artisan ou une PME de transformation, touchez des milliers de particuliers et d'entreprises sans intermédiaires.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131936] border border-slate-100 dark:border-gray-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mt-0.5">
                  <FaWhatsapp size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Commandes reçues sur WhatsApp</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Pas besoin d'être devant un ordinateur : recevez vos alertes de commandes et devis directement sur WhatsApp.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131936] border border-slate-100 dark:border-gray-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 mt-0.5">
                  <FaMobileAlt size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Paiement garanti via Mobile Money</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    L'acheteur paie avant l'expédition. Retirez vos gains instantanément sur M-Pesa, Airtel, Orange ou Afrimoney.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131936] border border-slate-100 dark:border-gray-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 mt-0.5">
                  <FaShieldAlt size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Accès aux marchés B2B</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Répondez aux appels d'offres des hôtels, restaurants et supermarchés de Kinshasa, Lubumbashi et Goma.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : FORMULAIRE EN 3 ÉTAPES (7 colonnes) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131936] rounded-3xl border border-slate-200 dark:border-gray-800 p-6 sm:p-8 shadow-xl">
            
            {/* Indicateur d'étapes */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-gray-800">
              {[
                { num: 1, label: 'Activité' },
                { num: 2, label: 'Localisation' },
                { num: 3, label: 'Paiement & Validation' }
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <span
                    className={
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ' +
                      (step >= s.num
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 dark:bg-gray-800 text-slate-400')
                    }
                  >
                    {s.num}
                  </span>
                  <span
                    className={
                      'text-xs font-bold hidden sm:inline ' +
                      (step >= s.num ? 'text-slate-900 dark:text-white' : 'text-slate-400')
                    }
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-5">
              
              {/* ÉTAPE 1 : PROFIL DU FOURNISSEUR */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h2 className="text-xl font-black">1. Parlez-nous de votre activité</h2>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Nom de votre boutique, ferme ou coopérative *
                    </label>
                    <div className="relative">
                      <FaStore className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ex: Coopérative Agricole du Kivu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Type de fournisseur *
                    </label>
                                        <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'cooperative', label: 'Coopérative / Producteur' },
                        { id: 'artisan', label: 'Artisan / Atelier' },
                        { id: 'transformateur', label: 'Unité de Transformation' },
                        { id: 'grossiste', label: 'Grossiste Local' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSupplierType(type.id)}
                          className={
                            'p-3 rounded-xl border text-left text-xs font-bold transition ' +
                            (supplierType === type.id
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
                              : 'border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400')
                          }
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Catégorie principale de produits *
                    </label>
                    <select
                      value={mainCategory}
                      onChange={(e) => setMainCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm font-medium focus:outline-none focus:border-sky-500"
                    >
                      <option value="Agriculture & Vivres">Agriculture & Vivres</option>
                      <option value="Agro-alimentaire transformé">Agro-alimentaire transformé</option>
                      <option value="Artisanat & Déco">Artisanat & Déco</option>
                      <option value="Textiles & Mode">Textiles & Mode</option>
                      <option value="Cosmétiques Naturels">Cosmétiques Naturels</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!businessName.trim()}
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 transition"
                    >
                      Suivant <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ÉTAPE 2 : LOCALISATION & RESPONSABLE */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h2 className="text-xl font-black">2. Où êtes-vous situé en RDC ?</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                        Province *
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-amber-500" />
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm font-medium"
                        >
                          {provinces.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                        Ville / Territoire *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Matadi, Beni, Likasi..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Nom complet du responsable *
                    </label>
                    <div className="relative">
                      <FaUserTie className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Prénom et Nom"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl border border-slate-200 dark:border-gray-700 text-sm font-bold"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      disabled={!city.trim() || !contactName.trim()}
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 transition"
                    >
                      Suivant <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ÉTAPE 3 : WHATSAPP, MOBILE MONEY & BADGE VÉRIFIÉ */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h2 className="text-xl font-black">3. Réception des commandes & Paiements</h2>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Numéro Téléphone / WhatsApp & Mobile Money *
                    </label>
                    <div className="relative">
                      <FaWhatsapp className="absolute left-3.5 top-3.5 text-emerald-500 text-base" />
                      <input
                        type="tel"
                        required
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        placeholder="Ex: +243 81 000 0000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Opérateur Mobile Money préféré pour vos retraits
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'mpesa', name: 'M-Pesa' },
                        { id: 'airtel', name: 'Airtel' },
                        { id: 'orange', name: 'Orange' },
                        { id: 'afrimoney', name: 'Afrimoney' }
                      ].map((op) => (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => setMobileMoneyOperator(op.id)}
                          className={
                            'py-2 rounded-xl border text-xs font-bold transition ' +
                            (mobileMoneyOperator === op.id
                              ? 'border-amber-400 bg-amber-400/20 text-slate-900 dark:text-white'
                              : 'border-slate-200 dark:border-gray-700 text-slate-500')
                          }
                        >
                          {op.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Numéro RCCM ou Identification Nationale (Optionnel)
                    </label>
                    <div className="relative">
                      <FaIdCard className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={rccmNumber}
                        onChange={(e) => setRccmNumber(e.target.value)}
                        placeholder="Ex: CD/KIN/RCCM/..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-xl border border-slate-200 dark:border-gray-700 text-sm font-bold"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-lg transition"
                    >
                      Ouvrir ma boutique gratuitement
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
