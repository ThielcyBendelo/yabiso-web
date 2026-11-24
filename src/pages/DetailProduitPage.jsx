import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCTS_DB, getProductImage } from '../data/productsData';
import prod1 from '../assets/prod1.jpeg';

import {
  FaArrowLeft, FaCheckCircle, FaMapMarkerAlt, FaShieldAlt,
  FaWhatsapp, FaMobileAlt, FaTruck, FaStore, FaFileInvoice,
  FaShoppingCart, FaStar, FaInfoCircle, FaLock
} from 'react-icons/fa';

export default function ProductDetail({ buyerMode = 'B2C', setBuyerMode, currency = 'CDF' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Recherche du produit correspondant à l'ID dans l'URL
  const foundProduct = PRODUCTS_DB.find((p) => String(p.id) === String(id)) || PRODUCTS_DB[0];

  // Garantit un tableau d'images valide avec prod1.jpeg en secours
  const productImages =
    Array.isArray(foundProduct?.images) && foundProduct.images.length > 0
      ? foundProduct.images
      : [getProductImage(foundProduct?.id) || prod1];

  const product = {
    ...foundProduct,
    images: productImages,
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0] || prod1);
  const [quantity, setQuantity] = useState(
    buyerMode === 'B2B' ? (product.minQtyB2B || 10) : (product.minQtyB2C || 1)
  );
  const [deliveryMethod, setDeliveryMethod] = useState('domicile');
  const [mobileOperator, setMobileOperator] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [b2bNotes, setB2bNotes] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const EXCHANGE_RATE = 2850;

  useEffect(() => {
    setSelectedImage(product.images[0] || prod1);
    setQuantity(buyerMode === 'B2B' ? (product.minQtyB2B || 10) : (product.minQtyB2C || 1));
    setOrderSubmitted(false);
  }, [id, buyerMode]);

  const formatPrice = (usdAmount) => {
    if (currency === 'USD') return Number(usdAmount).toFixed(2) + ' $';
    return Math.round(Number(usdAmount) * EXCHANGE_RATE).toLocaleString('fr-FR') + ' FC';
  };

  const unitPrice = buyerMode === 'B2B' ? product.priceB2B : product.priceB2C;
  const minQty = buyerMode === 'B2B' ? (product.minQtyB2B || 10) : (product.minQtyB2C || 1);
  const deliveryFeeUsd = buyerMode === 'B2B' ? 0 : deliveryMethod === 'domicile' ? 2 : 0.5;
  const totalUsd = unitPrice * quantity + deliveryFeeUsd;

  const handleWhatsAppShare = () => {
    const text =
      'Bonjour ' +
      product.supplier +
      ', je souhaite commander "' +
      product.name +
      '" (Quantité : ' +
      quantity +
      ' - Mode ' +
      buyerMode +
      ') vu sur YaBiso RDC.';
    const url = 'https://wa.me' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderSubmitted(true);
  };

    // Sélection des produits similaires (même catégorie ou même province, hors produit actuel)
  const similarProducts = PRODUCTS_DB.filter(
    (p) =>
      String(p.id) !== String(product.id) &&
      (p.category === product.category ||
        p.categoryLabel === product.categoryLabel ||
        p.province === product.province)
  ).slice(0, 5);

  // Remonter en haut de page quand on clique sur un produit similaire
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070a1d] text-gray-900 dark:text-gray-100 pb-20">
      
      {/* =====================================================================
          1. PETITE NAVBAR COMPACTE FIXE (h-12)
         ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white/95 dark:bg-[#0d122b]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40 px-2.5 sm:px-4">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-2">
          
          {/* Gauche : Retour Catalogue + Titre compact */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/catalogue')}
              title="Retour au catalogue"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#131936] text-gray-700 dark:text-gray-200 hover:bg-sky-500 hover:text-white transition shrink-0"
            >
              <FaArrowLeft className="text-xs" />
            </button>
            <div className="min-w-0">
              <span className="hidden sm:inline text-[10px] font-semibold text-gray-400 mr-1.5">
                Catalogue /
              </span>
              <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate block sm:inline">
                {product.name}
              </span>
            </div>
          </div>

          {/* Droite : Sélecteur B2C / B2B compact */}
          {setBuyerMode && (
            <div className="flex p-0.5 rounded-lg bg-gray-100 dark:bg-[#131936] border border-gray-200 dark:border-gray-800 shrink-0 text-[10px] sm:text-xs font-bold">
              <button
                type="button"
                onClick={() => setBuyerMode('B2C')}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition ${
                  buyerMode === 'B2C'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Particulier (B2C)
              </button>
              <button
                type="button"
                onClick={() => setBuyerMode('B2B')}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition ${
                  buyerMode === 'B2B'
                    ? 'bg-amber-400 text-gray-900 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Gros (B2B)
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================================
          2. CONTENU PRINCIPAL COMPACT (Grille serrée & lisible)
         ===================================================================== */}
      <main className="pt-15 sm:pt-16 px-2.5 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-7 items-start">
            
            {/* COLONNE GAUCHE : VISUELS + CARTE FOURNISSEUR (5 colonnes) */}
            <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-16">
              
              {/* Image principale au ratio maîtrisé (4/3 mobile, carré léger desktop) */}
              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#131936] border border-gray-200/80 dark:border-gray-800 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] shadow-xs">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-[#0a0e27]/90 backdrop-blur-xs text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  <FaMapMarkerAlt className="text-amber-500 text-[10px]" />
                  {product.province} {product.city ? `(${product.city})` : ''}
                </span>
                {product.verified && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-sky-500/95 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <FaCheckCircle className="text-[9px]" /> Vérifié
                  </span>
                )}
              </div>

              {/* Miniatures compactes */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        selectedImage === img
                          ? 'border-sky-500 scale-102'
                          : 'border-transparent opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Miniature" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Carte Fournisseur compacte */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#131936] border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm shrink-0">
                    <FaStore />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-xs sm:text-sm truncate">{product.supplier}</h3>
                      {product.verified && (
                        <FaCheckCircle className="text-sky-500 text-xs shrink-0" title="Fournisseur Vérifié" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {product.supplierSales || 45} ventes • {product.supplierRating || 4.8}/5{' '}
                      <FaStar className="inline text-amber-400 mb-0.5 text-[10px]" />
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition shrink-0"
                >
                  <span>Discuter</span>
                </button>
              </div>
            </div>

            {/* COLONNE DROITE : DÉTAILS & TUNNEL D'ACHAT / DEVIS (7 colonnes) */}
            <div className="lg:col-span-7 space-y-3.5">
              
              {/* Bloc Titre, Prix & Description */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#131936] border border-gray-200/80 dark:border-gray-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    {product.categoryLabel || 'Produit Local RDC'}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En stock
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white leading-snug">
                  {product.name}
                </h1>

                {/* Prix Unitaire & Indicateur B2B */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400">
                      {formatPrice(unitPrice)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      / {product.unit || 'unité'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FaInfoCircle className="text-sky-500" />
                    Commande min. : <strong className="text-gray-800 dark:text-gray-200">{minQty} {product.unit || 'unité(s)'}</strong>
                  </span>
                </div>

                {product.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Bloc Configuration Commande / Devis */}
              {orderSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2.5"
                >
                  <FaCheckCircle className="text-2xl text-emerald-500 mx-auto" />
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                    {buyerMode === 'B2B' ? 'Demande de devis envoyée !' : 'Commande initiée avec séquestre !'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    {buyerMode === 'B2B'
                      ? `Le fournisseur ${product.supplier} a reçu votre demande pour ${quantity} unité(s) et vous contactera sous peu.`
                      : `Confirmez la notification push sur votre numéro ${phoneNumber} (${mobileOperator.toUpperCase()}) pour bloquer les fonds en sécurité.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOrderSubmitted(false)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold"
                  >
                    Modifier la commande
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleCheckoutSubmit}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#131936] border border-gray-200/80 dark:border-gray-800 space-y-3.5"
                >
                  {/* Quantité & Mode de livraison sur une ligne compacte */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                        Quantité ({product.unit || 'unités'})
                      </label>
                      <div className="flex items-center h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0e27] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                          className="w-9 h-full font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={minQty}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(minQty, Number(e.target.value)))}
                          className="w-full text-center bg-transparent text-xs font-bold focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-9 h-full font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {buyerMode === 'B2C' ? (
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                          Livraison
                        </label>
                        <select
                          value={deliveryMethod}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="w-full h-9 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0e27] text-xs font-semibold focus:outline-none focus:border-sky-500"
                        >
                          <option value="domicile">À domicile (+{formatPrice(2)})</option>
                          <option value="relais">Point relais (+{formatPrice(0.5)})</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                          Entreprise / Organisation
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Nom de votre société..."
                          className="w-full h-9 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0e27] text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Paiement Mobile Money (B2C) ou Cahier des charges (B2B) */}
                  {buyerMode === 'B2C' ? (
                    <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <label className="block text-[10px] font-bold uppercase text-gray-400">
                        Paiement Sécurisé Mobile Money (Séquestre)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'mpesa', label: 'M-Pesa', color: 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400' },
                          { id: 'airtel', label: 'Airtel Money', color: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400' },
                          { id: 'orange', label: 'Orange Money', color: 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400' },
                        ].map((op) => (
                          <button
                            key={op.id}
                            type="button"
                            onClick={() => setMobileOperator(op.id)}
                            className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                              mobileOperator === op.id
                                ? op.color
                                : 'border-gray-200 dark:border-gray-700 text-gray-500'
                            }`}
                          >
                            <FaMobileAlt className="text-[10px]" />
                            <span>{op.label}</span>
                          </button>
                        ))}
                      </div>

                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Numéro Mobile Money (ex: 081 000 0000)"
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0e27] text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <label className="block text-[10px] font-bold uppercase text-gray-400">
                        Précisions logistiques / Conditionnement B2B
                      </label>
                      <textarea
                        rows={2}
                        value={b2bNotes}
                        onChange={(e) => setB2bNotes(e.target.value)}
                        placeholder="Ex: Livraison souhaitée à Gombe, emballage en sacs de 50kg..."
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0e27] text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {/* Récapitulatif Total + Boutons d'action */}
                  <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Total estimé {buyerMode === 'B2C' && '(livraison incl.)'}
                      </span>
                      <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                        {formatPrice(totalUsd)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="submit"
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition ${
                          buyerMode === 'B2B'
                            ? 'bg-amber-400 hover:bg-amber-500 text-gray-900'
                            : 'bg-sky-500 hover:bg-sky-600 text-white'
                        }`}
                      >
                        {buyerMode === 'B2B' ? (
                          <>
                            <FaFileInvoice /> Demander un devis officiel
                          </>
                        ) : (
                          <>
                            <FaShoppingCart /> Commander avec séquestre
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="py-2.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0"
                      >
                        <FaWhatsapp className="text-sm" />
                        <span>WhatsApp</span>
                      </button>
                    </div>

                    {/* Badge confiance compact */}
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 pt-0.5">
                      <FaLock className="text-sky-500" />
                      Paiement protégé par séquestre YaBiso jusqu'à la livraison confirmée.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
                {/* =====================================================================
              3. SECTION PRODUITS SIMILAIRES (Grille compacte)
             ===================================================================== */}
          {similarProducts.length > 0 && (
            <section className="mt-8 pt-6 border-t border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                    Produits similaires
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Autres offres locales disponibles dans cette catégorie ou province
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/catalogue')}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline shrink-0"
                >
                  Voir tout →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                {similarProducts.map((item) => {
                  const itemImage =
                    (Array.isArray(item.images) && item.images.length > 0 && item.images[0]) ||
                    (typeof getProductImage === 'function' ? getProductImage(item.id) : null) ||
                    prod1;
                  const itemPrice = buyerMode === 'B2B' ? item.priceB2B : item.priceB2C;

                  return (
                    <article
                      key={item.id}
                      onClick={() => navigate(`/produit/${item.id}`)}
                      className="group cursor-pointer bg-white dark:bg-[#131936] rounded-xl border border-gray-200/90 dark:border-gray-800 overflow-hidden hover:border-sky-500/60 transition flex flex-col"
                    >
                      {/* Image compacte */}
                      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-[#0a0e27] overflow-hidden">
                        <img
                          src={itemImage}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {item.verified && (
                          <span className="absolute top-1.5 left-1.5 bg-sky-500/95 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                            <FaCheckCircle className="text-[8px]" /> Vérifié
                          </span>
                        )}
                        <span className="absolute bottom-1.5 right-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                          <FaMapMarkerAlt className="text-sky-400 text-[8px]" />
                          {item.province}
                        </span>
                      </div>

                      {/* Détails compacts */}
                      <div className="p-2 flex-1 flex flex-col justify-between gap-1.5">
                        <div>
                          <h3 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                            <FaStore className="text-[9px] text-gray-400 shrink-0" />
                            <span className="truncate">{item.supplier}</span>
                          </p>
                        </div>

                        <div className="pt-1.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-1">
                          <span className="font-extrabold text-xs text-sky-600 dark:text-sky-400 truncate">
                            {formatPrice(itemPrice)}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0a0e27] group-hover:bg-sky-500 group-hover:text-white transition shrink-0">
                            Voir
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
    </div>
  );
}
