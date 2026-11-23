import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TrustSubNavbar from '../components/TrustSubNavbar';
import { getProductImage } from '../data/productsData';
import {
  FaHandshake, FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaBuilding,
  FaCheckCircle, FaPaperPlane, FaTimes, FaWhatsapp, FaPhoneAlt,
  FaImages, FaEye, FaBars, FaStore, FaTruck, FaShieldAlt, FaTrash
} from 'react-icons/fa';

const INITIAL_RFQS = [
  {
    id: 'AO-2026-01',
    title: 'Approvisionnement hebdomadaire en Farine de Maïs & Manioc',
    buyer: 'Hôtel Fleuve Congo (Service Achats)',
    phone: '+243810001122',
    publishedAt: 'Il y a 2 heures',
    category: 'Agriculture & Vivres',
    province: 'Kinshasa',
    quantity: '2 Tonnes / mois',
    deadline: 'Dans 5 jours',
    budgetEst: '1 400 $ - 1 600 $',
    offersCount: 4,
    verifiedBuyer: true,
    details:
      'Recherche fournisseur régulier capable de livrer chaque lundi matin à Gombe (Kinshasa). Exigences : farine blanche bien séchée (taux humidité < 12%), sacs de 25kg ou 50kg propres, certificat sanitaire ou contrôle qualité à la réception. Paiement garanti par virement ou Mobile Money séquestre.',
    photos: [
      getProductImage(4),
      getProductImage(6),
      getProductImage(9),
      getProductImage(14),
      getProductImage(1)
    ]
  },
  {
    id: 'AO-2026-02',
    title: 'Lot de 150 Paniers Artisanaux & Décorations en Raphia',
    buyer: 'Boutique Kin-Design & Export',
    phone: '+243820003344',
    publishedAt: 'Hier à 16:40',
    category: 'Artisanat & Déco',
    province: 'Kasaï / Kinshasa',
    quantity: '150 pièces',
    deadline: 'Dans 10 jours',
    budgetEst: '2 200 $',
    offersCount: 2,
    verifiedBuyer: true,
    details:
      'Besoin de finitions très soignées (tressage serré, teintures naturelles durables) pour exportation et vente en showroom à Kinshasa. Un échantillon physique sera validé avant le lancement de la production complète.',
    photos: [
      getProductImage(3),
      getProductImage(19),
      getProductImage(20),
      getProductImage(12),
      getProductImage(13)
    ]
  },
  {
    id: 'AO-2026-03',
    title: 'Café Arabica Torréfié en grains (Qualité Hôtellerie)',
    buyer: 'Chaîne Supermarchés Kin-Mart',
    phone: '+243990005566',
    publishedAt: '15 nov.',
    category: 'Agro-alimentaire transformé',
    province: 'Sud-Kivu / Kinshasa',
    quantity: '500 kg',
    deadline: 'Dans 7 jours',
    budgetEst: '4 500 $',
    offersCount: 6,
    verifiedBuyer: true,
    details:
      'Conditionnement souhaité en sachets hermétiques de 1kg et 5kg avec valve fraîcheur. Torréfaction moyenne à foncée. Prise en charge du fret aérien Goma/Bukavu vers Kinshasa possible via nos partenaires logistiques.',
    photos: [
      getProductImage(1),
      getProductImage(2),
      getProductImage(8),
      getProductImage(11),
      getProductImage(17)
    ]
  }
];

export default function AppelsOffres({ currency = 'CDF' }) {
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState(INITIAL_RFQS);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [mobileQuickMenuOpen, setMobileQuickMenuOpen] = useState(false);

  // Modaux
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedRfqForBid, setSelectedRfqForBid] = useState(null);
  const [selectedRfqDetails, setSelectedRfqDetails] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Formulaire nouvel appel d'offres (Acheteur B2B + 5 photos)
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('Agriculture & Vivres');
  const [newProvince, setNewProvince] = useState('Kinshasa');
  const [newQuantity, setNewQuantity] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newPhotos, setNewPhotos] = useState([]);
  const [photoError, setPhotoError] = useState('');

  // Formulaire soumission de devis (Fournisseur)
  const [bidSupplierName, setBidSupplierName] = useState('');
  const [bidPhone, setBidPhone] = useState('');
  const [bidPrice, setBidPrice] = useState('');
 const [bidDelay, setBidDelay] = useState('48h');
  const [bidNote, setBidNote] = useState('');

  // Gestion upload des photos (minimum 5 recommandé/requis)
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    const combined = [...newPhotos, ...urls].slice(0, 8);
    setNewPhotos(combined);
    if (combined.length >= 5) setPhotoError('');
  };

  const removePhoto = (indexToRemove) => {
    setNewPhotos(newPhotos.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreateRfq = (e) => {
    e.preventDefault();
    if (newPhotos.length < 5) {
      setPhotoError('Veuillez ajouter au moins 5 photos de référence (exemples de produits, conditionnement ou cahier des charges).');
      return;
    }

    const created = {
      id: 'AO-2026-0' + (rfqs.length + 1),
      title: newTitle,
      buyer: newCompany,
      phone: newPhone || '+243810000000',
      publishedAt: "À l'instant",
      category: newCategory,
      province: newProvince,
      quantity: newQuantity,
      deadline: 'Dans 14 jours',
      budgetEst: newBudget || 'Sur devis',
      offersCount: 0,
      verifiedBuyer: true,
      details: newDetails,
      photos: newPhotos
    };

    setRfqs([created, ...rfqs]);
    setShowNewModal(false);
    // Reset formulaire
    setNewTitle('');
    setNewCompany('');
    setNewPhone('');
    setNewQuantity('');
    setNewBudget('');
    setNewDetails('');
    setNewPhotos([]);
    setPhotoError('');

    setSuccessMessage('Votre appel d’offres avec photos a été publié ! Les fournisseurs vérifiés ont été notifiés.');
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

  const openWhatsAppContact = (rfq) => {
    const cleanPhone = (rfq.phone || '+243810000000').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Bonjour ${rfq.buyer}, je vous contacte depuis YaBiso RDC concernant votre appel d'offres "${rfq.title}" (${rfq.id}).`
    );
    window.open(`https://wa.me{cleanPhone}?text=${text}`, '_blank');
  };

  const categories = ['Tout', 'Agriculture & Vivres', 'Agro-alimentaire transformé', 'Artisanat & Déco', 'Textiles & Mode'];
  const filteredRfqs = selectedCategory === 'Tout'
    ? rfqs
    : rfqs.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-0 pb-24">
      
      {/* SOUS-NAVBAR DESKTOP */}
      <div className="hidden md:block">
        <TrustSubNavbar />
      </div>

      {/* BARRE MOBILE COMPACTE AVEC BOUTON MENU + PUBLIER */}
      <div className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-[#0b102b]/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 px-3 py-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMobileQuickMenuOpen(!mobileQuickMenuOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#131936] text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-gray-800"
        >
          {mobileQuickMenuOpen ? <FaTimes /> : <FaBars />}
          <span>Menu</span>
        </button>

        <span className="text-xs font-black text-slate-800 dark:text-white truncate">
          Appels d'Offres B2B
        </span>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-sm shrink-0"
        >
          <FaPlus /> Publier
        </button>
      </div>

            {/* TIROIR MENU MOBILE (Liens Fournisseurs, Logistique, Sécurité + Publier) */}
      <AnimatePresence>
        {mobileQuickMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white dark:bg-[#0b102b] border-b border-slate-200 dark:border-gray-800 px-4 py-3 space-y-2"
          >
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileQuickMenuOpen(false);
                  navigate('/fournisseurs');
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-800 text-[11px] font-bold"
              >
                <FaStore className="text-sky-500 mb-1 text-sm" />
                Fournisseurs
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileQuickMenuOpen(false);
                  navigate('/logistique');
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-800 text-[11px] font-bold"
              >
                <FaTruck className="text-sky-500 mb-1 text-sm" />
                Logistique
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileQuickMenuOpen(false);
                  navigate('/securite');
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-800 text-[11px] font-bold"
              >
                <FaShieldAlt className="text-emerald-500 mb-1 text-sm" />
                Sécurité
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileQuickMenuOpen(false);
                setShowNewModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <FaPlus /> Publier un Appel d'Offres (avec photos)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        {/* EN-TÊTE COMPACT DESKTOP & MOBILE */}
        <div className="bg-white dark:bg-[#0b102b] border border-slate-200/80 dark:border-gray-800 rounded-2xl p-4 sm:p-5 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400/15 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              <FaHandshake /> Marchés & Contrats B2B RDC
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              Appels d'Offres & Besoins en Gros
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
              Consultez les cahiers des charges en images, contactez directement les acheteurs ou soumettez votre devis chiffré.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="hidden sm:flex px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
          >
            <FaPlus /> Publier un Appel d'Offres
          </button>
        </div>

        {/* FILTRES PAR FILIÈRE */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white dark:bg-[#131936] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:border-sky-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MESSAGE DE CONFIRMATION */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2"
          >
            <FaCheckCircle className="text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* FLUX DES PUBLICATIONS D'APPELS D'OFFRES (Grille 2 cols Desktop / 1 col Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRfqs.map((rfq) => {
            const photos = rfq.photos || [];
            return (
              <motion.article
                key={rfq.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#131936] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* 1. EN-TÊTE STYLE PUBLICATION SOCIALE */}
                  <div className="p-3.5 pb-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-amber-400 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {rfq.buyer.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {rfq.buyer}
                          </span>
                          {rfq.verifiedBuyer && (
                            <FaCheckCircle
                              className="text-sky-500 text-xs shrink-0"
                              title="Entreprise vérifiée"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-gray-400">
                          <span>{rfq.publishedAt}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                            <FaMapMarkerAlt className="text-[10px]" /> {rfq.province}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-extrabold shrink-0">
                      {rfq.id}
                    </span>
                  </div>

                  {/* 2. TEXTE & CAHIER DES CHARGES */}
                  <div className="px-3.5 pb-3">
                    <h2 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {rfq.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {rfq.details}
                    </p>
                  </div>

                  {/* 3. MOSAÏQUE MULTI-PHOTOS (2 grandes en haut + 3 vignettes en bas) */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-6 gap-1 bg-slate-100 dark:bg-gray-900 border-y border-slate-200/70 dark:border-gray-800">
                      {photos.slice(0, 2).map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLightboxImage(img)}
                          className="col-span-3 h-36 sm:h-40 bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer relative group"
                        >
                          <img
                            src={img}
                            alt={`${rfq.title} ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      ))}

                      {photos.slice(2, 5).map((img, idx) => {
                        const isLastWithMore = idx === 2 && photos.length > 5;
                        return (
                          <div
                            key={idx + 2}
                            onClick={() => setLightboxImage(img)}
                            className="col-span-2 h-24 sm:h-28 bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer relative group"
                          >
                            <img
                                                          src={img}
                            alt={`${rfq.title} ${idx + 3}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          {isLastWithMore && (
                            <div className="absolute inset-0 bg-slate-950/65 flex items-center justify-center text-white font-black text-sm">
                              +{photos.length - 5}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. RÉSUMÉ CHIFFRÉ & BARRE D'ACTIONS (Détails, Contact, Devis) */}
              <div className="p-3 bg-slate-50/80 dark:bg-[#0a0e27]/80 space-y-2.5">
                <div className="grid grid-cols-3 gap-2 text-[11px] bg-white dark:bg-[#131936] p-2 rounded-xl border border-slate-200/70 dark:border-gray-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Volume requis</span>
                    <span className="font-black text-slate-900 dark:text-white">{rfq.quantity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Budget estimé</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{rfq.budgetEst}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Clôture / Offres</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {rfq.deadline} ({rfq.offersCount})
                    </span>
                  </div>
                </div>

                {/* 3 BOUTONS D'ACTION RESPONSIVE */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRfqDetails(rfq)}
                    className="py-2 px-2 rounded-lg bg-white dark:bg-[#131936] hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-700 font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <FaEye className="text-sky-500" /> Détails
                  </button>

                  <button
                    type="button"
                    onClick={() => openWhatsAppContact(rfq)}
                    className="py-2 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-700 hover:text-white dark:text-emerald-400 dark:hover:text-white border border-emerald-500/30 font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <FaWhatsapp className="text-xs" /> Contact
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRfqForBid(rfq)}
                    className="py-2 px-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
                  >
                    <FaPaperPlane className="text-[10px]" /> Devis
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>

    {/* ===================================================================== */}
    {/* MODAL 1 : PUBLIER UN APPEL D'OFFRES (AVEC UPLOAD DE 5 PHOTOS MINIMUM) */}
    {/* ===================================================================== */}
    <AnimatePresence>
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0b102b] rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-gray-800 p-4 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-gray-800">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Publier un Appel d'Offres B2B
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Titre du besoin *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5 Tonnes de Haricots Rouges du Kivu"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Entreprise / Acheteur *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Hôtel Pullman Kinshasa"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Téléphone WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +243 81 000 0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Filière</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                  >
                    <option>Agriculture & Vivres</option>
                    <option>Agro-alimentaire</option>
                    <option>Artisanat & Déco</option>
                    <option>Textiles & Mode</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Province de livraison</label>
                  <input
                    type="text"
                    required
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Volume requis *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 50 Sacs de 50kg"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Budget estimé</label>
                  <input
                    type="text"
                    placeholder="Ex: 2 500 $"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Cahier des charges & détails *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Précisez la qualité attendue, le conditionnement et le lieu exact de livraison..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none focus:border-sky-500"
                />
              </div>

                            {/* ZONE D'UPLOAD : MINIMUM 5 PHOTOS REQUISES */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold flex items-center gap-1.5">
                    <FaImages className="text-sky-500" /> Photos du produit / modèle recherché (Min. 5) *
                  </label>
                  <span
                    className={`font-extrabold ${
                      newPhotos.length >= 5 ? 'text-emerald-500' : 'text-amber-500'
                    }`}
                  >
                    {newPhotos.length} / 5 photos
                  </span>
                </div>

                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-sky-400/50 rounded-xl bg-sky-50/40 dark:bg-[#131936] cursor-pointer hover:border-sky-500 transition">
                  <FaImages className="text-2xl text-sky-500 mb-1" />
                  <span className="font-bold text-slate-700 dark:text-gray-200">
                    Cliquez pour ajouter des photos
                  </span>
                  <span className="text-[10px] text-slate-500">
                    JPG, PNG ou WebP (Sélection multiple autorisée)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photoError && (
                  <p className="text-rose-500 font-bold text-[11px] mt-1">{photoError}</p>
                )}

                {newPhotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {newPhotos.map((src, idx) => (
                      <div key={idx} className="relative h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700">
                        <img src={src} alt="Aperçu" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-0.5 right-0.5 p-1 rounded bg-rose-600 text-white text-[9px]"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
              >
                Publier l'Appel d'Offres
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* ===================================================================== */}
    {/* MODAL 2 : SOUMETTRE UN DEVIS CHIFFRÉ (FOURNISSEUR)                    */}
    {/* ===================================================================== */}
    <AnimatePresence>
      {selectedRfqForBid && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0b102b] rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-gray-800 p-4 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-gray-800">
              <div>
                <span className="text-[10px] font-extrabold text-sky-500 uppercase">
                  Réponse à {selectedRfqForBid.id}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                  {selectedRfqForBid.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRfqForBid(null)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSendBid} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Nom de votre coopérative / entreprise *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ferme Nsioni Kongo-Central"
                  value={bidSupplierName}
                  onChange={(e) => setBidSupplierName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Téléphone / Mobile Money *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+243..."
                    value={bidPhone}
                    onChange={(e) => setBidPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Votre offre totale ({currency}) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1 450 $"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Délai de livraison proposé</label>
                <input
                  type="text"
                  value={bidDelay}
                  onChange={(e) => setBidDelay(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Conditions & garanties</label>
                <textarea
                  rows={3}
                  placeholder="Disponibilité du stock, transport inclus, paiement séquestre accepté..."
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131936] border border-slate-200 dark:border-gray-700 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <FaPaperPlane /> Envoyer mon devis officiel
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* ===================================================================== */}
    {/* MODAL 3 : DÉTAILS COMPLETS DE L'APPEL D'OFFRES + GALERIE              */}
    {/* ===================================================================== */}
    <AnimatePresence>
      {selectedRfqDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0b102b] rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-gray-800 p-4 sm:p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200 dark:border-gray-800">
              <div>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-extrabold text-[10px]">
                  {selectedRfqDetails.id} • {selectedRfqDetails.category}
                </span>
                <h3 className="text-base sm:text-lg font-black mt-1 text-slate-900 dark:text-white">
                  {selectedRfqDetails.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRfqDetails(null)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 dark:bg-[#131936] p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-500 block">Acheteur</span>
                <span className="font-bold">{selectedRfqDetails.buyer}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Province</span>
                <span className="font-bold">{selectedRfqDetails.province}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Volume</span>
                <span className="font-black text-sky-500">{selectedRfqDetails.quantity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Budget</span>
                <span className="font-bold text-amber-500">{selectedRfqDetails.budgetEst}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
              {selectedRfqDetails.details}
            </p>

            {/* Galerie complète */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(selectedRfqDetails.photos || []).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Photo ${i + 1}`}
                  onClick={() => setLightboxImage(img)}
                  className="w-full h-28 object-cover rounded-xl cursor-pointer border border-slate-200 dark:border-gray-800"
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => openWhatsAppContact(selectedRfqDetails)}
                className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaWhatsapp /> Contacter sur WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = selectedRfqDetails;
                  setSelectedRfqDetails(null);
                  setSelectedRfqForBid(target);
                }}
                className="py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaPaperPlane /> Soumettre un devis
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* LIGHTBOX PLEIN ÉCRAN AU CLIC SUR UNE PHOTO */}
    {lightboxImage && (
      <div
        onClick={() => setLightboxImage(null)}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
      >
        <img
          src={lightboxImage}
          alt="Agrandissement"
          className="max-w-full max-h-[88vh] rounded-xl object-contain"
        />
      </div>
    )}
  </div>
  );
}
