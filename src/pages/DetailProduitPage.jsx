import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaCheckCircle, FaMapMarkerAlt, FaShieldAlt,
  FaWhatsapp, FaMobileAlt, FaTruck, FaStore, FaFileInvoice,
  FaShoppingCart, FaStar, FaInfoCircle, FaLock
} from 'react-icons/fa';

// Base de données simulée (à relier ensuite à votre API Supabase / Node.js)
const PRODUCTS_DB = [
  {
    id: 1,
    name: 'Café Arabica du Kivu (Torréfié)',
    categoryLabel: 'Agro-alimentaire transformé',
    province: 'Sud-Kivu',
    city: 'Kalehe / Bukavu',
    supplier: 'Coopérative Sopacdi',
    supplierRating: 4.9,
    supplierSales: 320,
    verified: true,
    priceB2C: 12,
    unitB2C: 'Sachet 500g',
    minQtyB2C: 1,
    priceB2B: 9.5,
    unitB2B: 'Sac 10kg',
    minQtyB2B: 5,
    stock: '2 000 kg disponibles',
    deliveryDelay: '24h à 48h (Kinshasa / Goma / Bukavu)',
    description:
      'Cultivé sur les hauts plateaux volcaniques bordant le lac Kivu à plus de 1 600 mètres d’altitude. Ce café 100% Arabica est récolté à la main, lavé à l’eau de source et torréfié localement pour préserver ses arômes fruités et chocolatés.',
    specs: [
      { label: 'Variété', value: '100% Arabica Bourbon' },
      { label: 'Origine', value: 'Territoire de Kalehe, Sud-Kivu' },
      { label: 'Certification', value: 'Agriculture Biologique & Commerce Équitable' },
      { label: 'Conditionnement', value: 'Sachet hermétique avec valve fraîcheur' }
    ],
    images: [
      'https://unsplash.com',
      'https://unsplash.com'
    ]
  },
  {
    id: 2,
    name: 'Miel Pur de Forêt Équatoriale',
    categoryLabel: 'Agriculture & Vivres',
    province: 'Équateur',
    city: 'Mbandaka',
    supplier: 'Rucher Mbandaka Bio',
    supplierRating: 4.8,
    supplierSales: 185,
    verified: true,
    priceB2C: 8,
    unitB2C: 'Pot 1 Litre',
    minQtyB2C: 1,
    priceB2B: 6,
    unitB2B: 'Bidon 20 Litres',
    minQtyB2B: 2,
    stock: '500 Litres disponibles',
    deliveryDelay: '48h à 72h via fret aérien / fluvial',
    description:
      'Miel sauvage récolté durablement dans la forêt primaire de l’Équateur. Non chauffé, non filtré industriellement et garanti 100% pur sans ajout de sucre.',
    specs: [
      { label: 'Type', value: 'Miel polyfloral de forêt' },
      { label: 'Origine', value: 'Province de l’Équateur, RDC' },
      { label: 'Conservation', value: '24 mois à température ambiante' }
    ],
    images: [
      'https://unsplash.com'
    ]
  },
  {
    id: 3,
    name: 'Panier Artisanal Tressé Raphia',
    categoryLabel: 'Artisanat & Déco',
    province: 'Kasaï',
    city: 'Tshikapa',
    supplier: 'Atelier Mains d’Or',
    supplierRating: 4.9,
    supplierSales: 94,
    verified: true,
    priceB2C: 25,
    unitB2C: 'Pièce unique',
    minQtyB2C: 1,
    priceB2B: 18,
    unitB2B: 'Lot de 10 pièces',
    minQtyB2B: 1,
    stock: 'Sur commande (Délai 5 jours)',
    deliveryDelay: '3 à 5 jours ouvrés',
    description:
      'Panier décoratif et utilitaire tressé à la main par des artisanes du Kasaï à partir de fibres naturelles de raphia teintées avec des pigments végétaux locaux.',
    specs: [
      { label: 'Matière', value: '100% Raphia naturel' },
      { label: 'Dimensions', value: 'Diamètre 35 cm x Hauteur 28 cm' },
      { label: 'Fabrication', value: 'Fait main en RDC' }
    ],
    images: [
      'https://unsplash.com'
    ]
  },
  {
    id: 4,
    name: 'Farine de Manioc Panifiable (Fufu)',
    categoryLabel: 'Agriculture & Vivres',
    province: 'Kongo-Central',
    city: 'Mbanza-Ngungu',
    supplier: 'Ferme Nsioni',
    supplierRating: 4.7,
    supplierSales: 510,
    verified: true,
    priceB2C: 15,
    unitB2C: 'Sac 25kg',
    minQtyB2C: 1,
    priceB2B: 12,
    unitB2B: 'Sac 50kg',
    minQtyB2B: 20,
    stock: '15 Tonnes disponibles',
    deliveryDelay: '24h (Kinshasa & Kongo-Central)',
    description:
      'Farine de manioc blanche, fine et sans odeur, issue d’un séchage contrôlé garantissant une qualité sanitaire optimale pour les ménages, boulangeries et restaurants.',
    specs: [
      { label: 'Taux d’humidité', value: 'Inférieur à 12%' },
      { label: 'Origine', value: 'Mbanza-Ngungu, Kongo-Central' },
      { label: 'Usage', value: 'Fufu traditionnel & pâtisserie' }
    ],
    images: [
      'https://unsplash.com'
    ]
  }
];

export default function ProductDetail({ buyerMode = 'B2C', setBuyerMode, currency = 'CDF' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Recherche du produit correspondant à l'ID dans l'URL
  const product = PRODUCTS_DB.find((p) => String(p.id) === String(id)) || PRODUCTS_DB[0];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(buyerMode === 'B2B' ? product.minQtyB2B : product.minQtyB2C);
  const [deliveryMethod, setDeliveryMethod] = useState('domicile');
  const [mobileOperator, setMobileOperator] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [b2bNotes, setB2bNotes] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const EXCHANGE_RATE = 2850;

  useEffect(() => {
    setSelectedImage(product.images[0]);
    setQuantity(buyerMode === 'B2B' ? product.minQtyB2B : product.minQtyB2C);
    setOrderSubmitted(false);
  }, [product, buyerMode]);

  const formatPrice = (usdAmount) => {
    if (currency === 'USD') return usdAmount.toFixed(2) + ' $';
    return Math.round(usdAmount * EXCHANGE_RATE).toLocaleString('fr-FR') + ' FC';
  };

  const unitPrice = buyerMode === 'B2B' ? product.priceB2B : product.priceB2C;
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a1d] text-gray-900 dark:text-gray-100 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* FIL D'ARIANE & RETOUR */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate('/catalogue')}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-sky-500 transition"
          >
            <FaArrowLeft /> Retour au catalogue
          </button>

          {setBuyerMode && (
            <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-[#131936] border border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setBuyerMode('B2C')}
                className={
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition ' +
                  (buyerMode === 'B2C' ? 'bg-sky-500 text-white shadow' : 'text-gray-600 dark:text-gray-400')
                }
              >
                Tarif Particulier (B2C)
              </button>
              <button
                type="button"
                onClick={() => setBuyerMode('B2B')}
                className={
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition ' +
                  (buyerMode === 'B2B' ? 'bg-amber-400 text-gray-900 shadow' : 'text-gray-600 dark:text-gray-400')
                }
              >
                Tarif Gros / Entreprise (B2B)
              </button>
            </div>
          )}
        </div>

        {/* GRILLE PRINCIPALE : VISUELS + INFORMATIONS + COMMANDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLONNE GAUCHE : GALERIE PHOTOS (5 colonnes) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#131936] border border-gray-200 dark:border-gray-800 aspect-square shadow-sm">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#0a0e27]/90 text-xs font-bold flex items-center gap-1.5 shadow">
                <FaMapMarkerAlt className="text-amber-500" /> {product.province} ({product.city})
              </span>
            </div>

                        {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={
                      'w-20 h-20 rounded-2xl overflow-hidden border-2 transition ' +
                      (selectedImage === img ? 'border-sky-500 scale-105' : 'border-transparent opacity-70')
                    }
                  >
                    <img src={img} alt="Miniature" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* CARTE DU FOURNISSEUR */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#131936] border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-lg">
                    <FaStore />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base">{product.supplier}</h3>
                      {product.verified && <FaCheckCircle className="text-sky-500" title="Fournisseur Vérifié" />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.supplierSales} commandes livrées • Note {product.supplierRating}/5{' '}
                      <FaStar className="inline text-amber-400 mb-0.5" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : DÉTAILS & TUNNEL D'ACHAT / DEVIS (7 colonnes) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {product.categoryLabel}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black mt-1 text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  {product.stock}
                </span>
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <FaTruck className="text-sky-500" /> {product.deliveryDelay}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* SPÉCIFICATIONS TECHNIQUES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {product.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-[#131936] border border-gray-100 dark:border-gray-800"
                >
                  <div className="text-[11px] uppercase font-bold text-gray-400">{spec.label}</div>
                  <div className="text-sm font-semibold mt-0.5">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* BLOC ACTION : COMMANDE B2C OU DEVIS B2B */}
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#131936] border-2 border-sky-500/20 shadow-lg">
              {orderSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-3"
                >
                  <FaCheckCircle className="mx-auto text-5xl text-emerald-500" />
                  <h3 className="text-xl font-black">
                    {buyerMode === 'B2B' ? 'Demande de devis envoyée !' : 'Paiement Mobile Money initié !'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    {buyerMode === 'B2B'
                      ? 'Le fournisseur ' + product.supplier + ' a reçu votre demande pour ' + quantity + ' unité(s) et vous répondra sous 24h.'
                      : 'Veuillez valider la demande de paiement sur votre téléphone (' + phoneNumber + '). Vos fonds restent sécurisés sous séquestre jusqu’à la livraison.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOrderSubmitted(false)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-bold"
                  >
                    Modifier ma commande
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                  {/* Affichage du Prix Unitaire */}
                  <div className="flex flex-wrap justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-gray-500">
                        {buyerMode === 'B2B' ? 'Prix de gros unitaire' : 'Prix unitaire'}
                      </span>
                      <div className="text-3xl font-black text-sky-600 dark:text-sky-400">
                        {formatPrice(unitPrice)}
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        Conditionnement : {buyerMode === 'B2B' ? product.unitB2B : product.unitB2C}
                      </span>
                    </div>

                    {/* Sélecteur de quantité */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Quantité {buyerMode === 'B2B' ? '(Min. ' + product.minQtyB2B + ')' : ''}
                      </label>
                      <div className="flex items-center bg-white dark:bg-[#0a0e27] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              Math.max(buyerMode === 'B2B' ? product.minQtyB2B : 1, quantity - 1)
                            )
                          }
                          className="px-3.5 py-2 font-black text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={buyerMode === 'B2B' ? product.minQtyB2B : 1}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                          className="w-16 text-center font-bold text-sm bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3.5 py-2 font-black text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* FORMULAIRE SPÉCIFIQUE B2C (MOBILE MONEY + LIVRAISON) */}
                  {buyerMode === 'B2C' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                          Mode de réception
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('domicile')}
                            className={
                              'p-3 rounded-xl border text-left text-xs transition ' +
                              (deliveryMethod === 'domicile'
                                ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 font-bold'
                                : 'border-gray-200 dark:border-gray-700')
                            }
                          >
                            <div>Livraison à domicile</div>
                            <div className="text-sky-600 mt-0.5">+ {formatPrice(2)}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('relais')}
                            className={
                              'p-3 rounded-xl border text-left text-xs transition ' +
                              (deliveryMethod === 'relais'
                                ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 font-bold'
                                : 'border-gray-200 dark:border-gray-700')
                            }
                          >
                            <div>Point Relais YaBiso</div>
                            <div className="text-emerald-600 mt-0.5">+ {formatPrice(0.5)}</div>
                          </button>
                        </div>
                      </div>

                                            <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                          Paiement Mobile Money (Séquestre sécurisé)
                        </label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {[
                            { id: 'mpesa', name: 'M-Pesa' },
                            { id: 'airtel', name: 'Airtel' },
                            { id: 'orange', name: 'Orange' },
                            { id: 'afrimoney', name: 'Afrimoney' }
                          ].map((op) => (
                            <button
                              key={op.id}
                              type="button"
                              onClick={() => setMobileOperator(op.id)}
                              className={
                                'py-2 px-2 rounded-xl border text-xs font-bold text-center transition ' +
                                (mobileOperator === op.id
                                  ? 'border-amber-400 bg-amber-400/20 text-gray-900 dark:text-white'
                                  : 'border-gray-200 dark:border-gray-700 text-gray-500')
                              }
                            >
                              {op.name}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <FaMobileAlt className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Numéro Mobile Money (ex: 081 000 0000)"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* FORMULAIRE SPÉCIFIQUE B2B (DEVIS PRO) */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Nom de votre entreprise / hôtel *"
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Téléphone / WhatsApp Pro *"
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={b2bNotes}
                        onChange={(e) => setB2bNotes(e.target.value)}
                        placeholder="Précisions sur la livraison, fréquence souhaitée ou besoin d'échantillon..."
                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {/* TOTAL ESTIMÉ & BOUTONS D'ACTION */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Total estimé :</span>
                      <div className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatPrice(totalUsd)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className={
                          'px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition ' +
                          (buyerMode === 'B2B'
                            ? 'bg-amber-400 hover:bg-amber-500 text-gray-900'
                            : 'bg-sky-500 hover:bg-sky-600 text-white')
                        }
                      >
                        {buyerMode === 'B2B' ? (
                          <>
                            <FaFileInvoice /> Recevoir une facture proforma
                          </>
                        ) : (
                          <>
                            <FaShoppingCart /> Payer par Mobile Money
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="p-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center justify-center"
                        title="Négocier sur WhatsApp"
                      >
                        <FaWhatsapp size={20} />
                      </button>
                    </div>
                  </div>

                  {/* MENTION SÉQUESTRE */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
                    <FaLock className="text-sky-500 shrink-0" />
                    <span>
                      Protection YaBiso Séquestre : le fournisseur n’est payé qu’après confirmation de livraison.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
