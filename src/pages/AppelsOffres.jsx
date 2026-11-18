import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHandshake, FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaBuilding,
  FaCheckCircle, FaPaperPlane, FaTimes, FaShieldAlt
} from 'react-icons/fa';

const INITIAL_RFQS = [
  {
    id: 'AO-2026-01',
    title: 'Approvisionnement hebdomadaire en Farine de Maïs & Manioc',
    buyer: 'Hôtel Fleuve Congo (Service Achats)',
    category: 'Agriculture & Vivres',
    province: 'Kinshasa',
    quantity: '2 Tonnes / mois',
    deadline: 'Dans 5 jours',
    budgetEst: '1 400 $ - 1 600 $',
    offersCount: 4,
    verifiedBuyer: true,
    details: 'Recherche fournisseur régulier avec certificat sanitaire et livraison directe à Gombe.'
  },
  {
    id: 'AO-2026-02',
    title: 'Lot de 150 Paniers Artisanaux & Décorations en Raphia',
    buyer: 'Boutique Kin-Design',
    category: 'Artisanat & Déco',
    province: 'Kasaï / Kinshasa',
    quantity: '150 pièces',
    deadline: 'Dans 10 jours',
    budgetEst: '2 200 $',
    offersCount: 2,
    verifiedBuyer: true,
    details: 'Besoin de finitions soignées pour exportation et vente en boutique. Échantillon souhaité.'
  },
  {
    id: 'AO-2026-03',
    title: 'Café Arabica Torréfié en grains (Qualité Hôtellerie)',
    buyer: 'Chaîne Supermarchés Kin-Mart',
    category: 'Agro-alimentaire',
    province: 'Sud-Kivu / Kinshasa',
    quantity: '500 kg',
    deadline: 'Dans 7 jours',
    budgetEst: '4 500 $',
    offersCount: 6,
    verifiedBuyer: true,
    details: 'Conditionnement en sacs de 5kg avec valve fraîcheur. Paiement par virement ou séquestre.'
  }
];

export default function AppelsOffres({ currency = 'CDF' }) {
  const [rfqs, setRfqs] = useState(INITIAL_RFQS);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedRfqForBid, setSelectedRfqForBid] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Formulaire nouvel appel d'offres (Acheteur B2B)
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newCategory, setNewCategory] = useState('Agriculture & Vivres');
  const [newProvince, setNewProvince] = useState('Kinshasa');
  const [newQuantity, setNewQuantity] = useState('');
  const [newDetails, setNewDetails] = useState('');

  // Formulaire soumission de devis (Fournisseur)
  const [bidSupplierName, setBidSupplierName] = useState('');
  const [bidPhone, setBidPhone] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [bidNote, setBidNote] = useState('');

  const handleCreateRfq = (e) => {
    e.preventDefault();
    const created = {
      id: 'AO-2026-0' + (rfqs.length + 1),
      title: newTitle,
      buyer: newCompany,
      category: newCategory,
      province: newProvince,
      quantity: newQuantity,
      deadline: 'Dans 14 jours',
      budgetEst: 'Sur devis',
      offersCount: 0,
      verifiedBuyer: true,
      details: newDetails
    };
    setRfqs([created, ...rfqs]);
    setShowNewModal(false);
    setNewTitle('');
    setNewCompany('');
    setNewQuantity('');
    setNewDetails('');
    setSuccessMessage('Votre appel d’offres a été publié avec succès ! Les fournisseurs vérifiés ont été notifiés.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSendBid = (e) => {
    e.preventDefault();
    setRfqs(
      rfqs.map((item) =>
        item.id === selectedRfqForBid.id
          ? { ...item, offersCount: item.offersCount + 1 }
          : item
      )
    );
    setSelectedRfqForBid(null);
    setBidSupplierName('');
    setBidPhone('');
    setBidPrice('');
    setBidNote('');
    setSuccessMessage('Votre devis chiffré a bien été transmis à l’acheteur !');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="bg-sky-50/70 dark:bg-[#0b102b] border border-sky-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <FaHandshake /> Marchés & Contrats B2B
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Appels d'Offres & Besoins en Gros
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 mt-2">
              Hôtels, restaurants et supermarchés : publiez vos besoins d'approvisionnement. Producteurs et coopératives : répondez directement avec vos meilleurs tarifs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 transition shrink-0"
          >
            <FaPlus /> Publier un Appel d'Offres
          </button>
        </div>

        {/* MESSAGE DE CONFIRMATION */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center gap-3"
          >
            <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* LISTE DES APPELS D'OFFRES EN COURS */}
        <div className="space-y-5">
          {rfqs.map((rfq) => (
            <motion.div
              key={rfq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#131936] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 font-bold">
                    {rfq.id}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold">
                    {rfq.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-gray-400 font-medium">
                    <FaMapMarkerAlt className="text-amber-500" /> {rfq.province}
                  </span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                    <FaCalendarAlt /> Clôture : {rfq.deadline}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {rfq.title}
                </h2>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-gray-300">
                  <FaBuilding className="text-sky-500" />
                  <span>Acheteur : {rfq.buyer}</span>
                  {rfq.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400">
                      <FaCheckCircle /> Entreprise Vérifiée
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-gray-400">
                  {rfq.details}
                </p>
              </div>

              {/* BLOC VOLUMES & ACTION FOURNISSEUR */}
              <div className="lg:w-72 bg-slate-50 dark:bg-[#0a0e27] rounded-2xl p-4 border border-slate-100 dark:border-gray-800 flex flex-col justify-between gap-4 shrink-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Volume recherché :</span>
                    <span className="font-black text-slate-900 dark:text-white">{rfq.quantity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Budget estimatif :</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{rfq.budgetEst}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Devis déjà reçus :</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{rfq.offersCount} offre(s)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRfqForBid(rfq)}
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <FaPaperPlane /> Soumettre un devis
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

           {/* MODALE 1 : PUBLIER UN NOUVEL APPEL D'OFFRES (ACHETEUR) */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#131936] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-gray-800"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-gray-800 pb-4 mb-5">
                <h3 className="text-xl font-black">Publier un besoin (B2B)</h3>
                <button type="button" onClick={() => setShowNewModal(false)} className="p-2 text-slate-400 hover:text-slate-700">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateRfq} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Titre du besoin *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: 500 kg de haricots rouges du Kivu"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Entreprise / Hôtel *</label>
                    <input
                      type="text"
                      required
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="Nom de votre structure"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quantité / Volume *</label>
                    <input
                      type="text"
                      required
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      placeholder="Ex: 50 sacs de 25kg"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Catégorie</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                    >
                      <option value="Agriculture & Vivres">Agriculture & Vivres</option>
                      <option value="Agro-alimentaire">Agro-alimentaire</option>
                      <option value="Artisanat & Déco">Artisanat & Déco</option>
                      <option value="Textiles & Mode">Textiles & Mode</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Ville de livraison</label>
                    <select
                      value={newProvince}
                      onChange={(e) => setNewProvince(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                    >
                      <option value="Kinshasa">Kinshasa</option>
                      <option value="Lubumbashi">Lubumbashi</option>
                      <option value="Goma">Goma</option>
                      <option value="Bukavu">Bukavu</option>
                      <option value="Matadi">Matadi</option>
                      <option value="Kisangani">Kisangani</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Cahier des charges / Précisions</label>
                  <textarea
                    rows={3}
                    required
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                    placeholder="Qualité exigée, conditionnement, fréquence de livraison..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm transition"
                >
                  Diffuser aux fournisseurs vérifiés
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE 2 : SOUMETTRE UN DEVIS (FOURNISSEUR) */}
      <AnimatePresence>
        {selectedRfqForBid && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#131936] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-gray-800"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-gray-800 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-sky-500">{selectedRfqForBid.id}</span>
                  <h3 className="text-lg font-black line-clamp-1">{selectedRfqForBid.title}</h3>
                </div>
                <button type="button" onClick={() => setSelectedRfqForBid(null)} className="p-2 text-slate-400">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSendBid} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nom de votre coopérative / entreprise *</label>
                  <input
                    type="text"
                    required
                    value={bidSupplierName}
                    onChange={(e) => setBidSupplierName(e.target.value)}
                    placeholder="Ex: Coopérative Agricole du Kongo"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Téléphone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={bidPhone}
                      onChange={(e) => setBidPhone(e.target.value)}
                      placeholder="Ex: +243 81 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Votre Offre Totale ({currency}) *</label>
                    <input
                      type="text"
                      required
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      placeholder="Ex: 1 350 $ ou 3 800 000 FC"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Délai de livraison et garanties</label>
                  <textarea
                    rows={3}
                    required
                    value={bidNote}
                    onChange={(e) => setBidNote(e.target.value)}
                    placeholder="Précisez votre stock disponible, les délais de transport et la possibilité d'envoyer un échantillon..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FaShieldAlt className="text-sky-500" />
                  <span>Transaction sécurisée par YaBiso Séquestre en cas d'acceptation.</span>
                </div>

                                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm transition"
                >
                  Envoyer mon devis à l'acheteur
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
