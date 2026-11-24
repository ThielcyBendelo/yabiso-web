import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TrustSubNavbar from '../components/TrustSubNavbar';
import GlobalSearchModal from '../components/GlobalSearchModal';
import { getProductImage } from '../data/productsData';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaWhatsapp,
  FaStore,
  FaStar,
  FaBoxes,
  FaUserPlus,
  FaAward,
  FaBars,
  FaTimes,
  FaTruck,
  FaShieldAlt,
  FaHandshake,
  FaEye,
  FaClock,
  FaFileContract
} from 'react-icons/fa';

const MOCK_SUPPLIERS = [
  {
    id: 'sup-1',
    code: 'YB-SUP-101',
    name: 'Coopérative Sopacdi Kivu',
    type: 'cooperative',
    typeLabel: 'Coopérative Agricole',
    province: 'Sud-Kivu',
    city: 'Kalehe / Bukavu',
    verified: true,
    rccm: 'CD/BKV/RCCM/21-B-0412',
    rating: 4.9,
    completedOrders: 320,
    productsCount: 14,
    capacity: '15 Tonnes / mois',
    responseDelay: '< 1h',
    specialties: ['Café Arabica', 'Cacao Bio', 'Haricots'],
    description:
      'Regroupement de plus de 5 000 petits producteurs de café et cacao autour du lac Kivu avec certification biologique et commerce équitable.',
    phone: '243810000001',
    coverImage: getProductImage(1),
    gallery: [getProductImage(1), getProductImage(8), getProductImage(7)]
  },
  {
    id: 'sup-2',
    code: 'YB-SUP-205',
    name: 'Ferme & Minoterie Nsioni',
    type: 'wholesaler',
    typeLabel: 'Grossiste & Producteur',
    province: 'Kongo-Central',
    city: 'Mbanza-Ngungu',
    verified: true,
    rccm: 'CD/KNG/RCCM/23-A-0891',
    rating: 4.8,
    completedOrders: 510,
    productsCount: 9,
    capacity: '40 Tonnes / mois',
    responseDelay: '< 30 min',
    specialties: ['Farine de Manioc', 'Maïs en grain', 'Arachides'],
    description:
      'Approvisionnement en gros de farine de manioc panifiable et céréales pour supermarchés, boulangeries et hôtels à Kinshasa.',
    phone: '243810000002',
    coverImage: getProductImage(4),
    gallery: [getProductImage(4), getProductImage(6), getProductImage(9)]
  },
  {
    id: 'sup-3',
    code: 'YB-SUP-312',
    name: 'Atelier Artisanal Mains d’Or',
    type: 'artisan',
    typeLabel: 'Artisan & Créateur',
    province: 'Kasaï',
    city: 'Tshikapa',
    verified: true,
    rccm: 'CD/TSH/RCCM/22-A-0194',
    rating: 4.9,
    completedOrders: 94,
    productsCount: 28,
    capacity: '300 Pièces / mois',
    responseDelay: '< 2h',
    specialties: ['Vannerie Raphia', 'Sculpture Bois', 'Tissus Kuba'],
    description:
      'Collectif d’artisans perpétuant le tissage traditionnel du raphia et la décoration intérieure authentique Made in Congo.',
    phone: '243810000003',
    coverImage: getProductImage(3),
    gallery: [getProductImage(3), getProductImage(16), getProductImage(23)]
  },
  {
    id: 'sup-4',
    code: 'YB-SUP-408',
    name: 'Rucher Mbandaka Bio',
    type: 'cooperative',
    typeLabel: 'Coopérative Apicole',
    province: 'Équateur',
    city: 'Mbandaka',
    verified: true,
    rccm: 'CD/MBK/RCCM/20-B-0332',
    rating: 4.7,
    completedOrders: 185,
    productsCount: 6,
    capacity: '2 500 Litres / mois',
    responseDelay: '< 2h',
    specialties: ['Miel de Forêt', 'Cire d’abeille', 'Propolis'],
    description:
      'Récolte durable de miel sauvage pur dans la cuvette centrale, conditionné en pots détail ou bidons de 20L.',
    phone: '243810000004',
    coverImage: getProductImage(2),
    gallery: [getProductImage(2), getProductImage(14), getProductImage(21)]
  },
  {
    id: 'sup-5',
    code: 'YB-SUP-519',
    name: 'Huilerie Moderne du Fleuve',
    type: 'wholesaler',
    typeLabel: 'Grossiste Industriel',
    province: 'Kongo-Central',
    city: 'Matadi',
    verified: false,
    rccm: 'En cours d’audit',
    rating: 4.5,
    completedOrders: 62,
    productsCount: 5,
    capacity: '12 000 Litres / mois',
    responseDelay: '< 3h',
    specialties: ['Huile de Palme Rouge', 'Huile Palmiste', 'Savon artisanal'],
    description:
      'Production et distribution d’huiles végétales locales en bidons de 5L et fûts de 25L pour professionnels et grossistes.',
    phone: '243810000005',
    coverImage: getProductImage(5),
    gallery: [getProductImage(5), getProductImage(22), getProductImage(25)]
  },
  {
    id: 'sup-6',
    code: 'YB-SUP-602',
    name: 'Créations Mode Gombe',
    type: 'artisan',
    typeLabel: 'Atelier Textile',
    province: 'Kinshasa',
    city: 'Gombe / Kinshasa',
    verified: true,
    rccm: 'CD/KNG/RCCM/24-B-0774',
    rating: 4.8,
    completedOrders: 215,
    productsCount: 42,
    capacity: '1 200 Pièces / mois',
    responseDelay: '< 1h',
    specialties: ['Pagnes Imprimés', 'Tenues Sur-Mesure', 'Accessoires'],
    description:
      'Confection textile locale et distribution de pagnes de qualité supérieure pour particuliers, entreprises et boutiques.',
    phone: '243810000006',
    coverImage: getProductImage(15),
    gallery: [getProductImage(15), getProductImage(16), getProductImage(3)]
  }
];

export default function AnnuairePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Navigation mobile & recherche globale
  const [mobileQuickMenuOpen, setMobileQuickMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filtres annuaire
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Toutes');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'tous');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Modale profil détaillé fournisseur
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const provinces = [
    'Toutes',
    'Kinshasa',
    'Kongo-Central',
    'Nord-Kivu',
    'Sud-Kivu',
    'Haut-Katanga',
    'Équateur',
    'Kasaï',
    'Tshopo'
  ];

  const supplierTypes = [
    { id: 'tous', label: 'Tous les profils' },
    { id: 'cooperative', label: 'Coopératives' },
    { id: 'wholesaler', label: 'Grossistes (B2B)' },
    { id: 'artisan', label: 'Artisans' }
  ];

  // Masquer MobileBottomNav quand la modale fournisseur est ouverte
  useEffect(() => {
    const isOpen = Boolean(selectedSupplier);
    document.body.dataset.mobileMenuOpen = isOpen ? 'true' : 'false';
    window.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: isOpen }));
    return () => {
      document.body.dataset.mobileMenuOpen = 'false';
      window.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: false }));
    };
  }, [selectedSupplier]);

  useEffect(() => {
    const urlType = searchParams.get('type');
    setSelectedType(urlType || 'tous');
  }, [searchParams]);

  const filteredSuppliers = useMemo(() => {
    return MOCK_SUPPLIERS.filter((sup) => {
      const cleanQuery = searchTerm.toLowerCase();
      const matchesSearch =
        sup.name.toLowerCase().includes(cleanQuery) ||
        sup.description.toLowerCase().includes(cleanQuery) ||
        sup.city.toLowerCase().includes(cleanQuery) ||
        sup.specialties.some((s) => s.toLowerCase().includes(cleanQuery));

      const matchesProvince =
        selectedProvince === 'Toutes' ||
        sup.province.toLowerCase() === selectedProvince.toLowerCase();

      const matchesType = selectedType === 'tous' || sup.type === selectedType;
      const matchesVerified = !onlyVerified || sup.verified;

      return matchesSearch && matchesProvince && matchesType && matchesVerified;
    });
  }, [searchTerm, selectedProvince, selectedType, onlyVerified]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('Toutes');
    setSelectedType('tous');
    setOnlyVerified(false);
  };

  const handleWhatsAppSupplier = (supplier) => {
    const cleanPhone = supplier.phone || '243810000000';
    const message = encodeURIComponent(
      `Bonjour ${supplier.name}, j’ai trouvé votre profil fournisseur (${supplier.code}) sur l’annuaire YaBiso RDC et j’aimerais échanger avec vous.`
    );
    window.open(`https://wa.me{cleanPhone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

    return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-0 pb-24">
      
      {/* 1. SOUS-NAVBAR DESKTOP */}
      <div className="hidden md:block">
        <TrustSubNavbar />
      </div>

      {/* 2. BARRE MOBILE COMPACTE PRO & MODERNE */}
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
            Fournisseurs RDC ({filteredSuppliers.length})
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Recherche globale"
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-gray-800 transition cursor-pointer"
            >
              <FaSearch className="text-xs" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/devenir-fournisseur')}
              className="px-2.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-sm shrink-0"
            >
              <FaUserPlus /> Inscrire
            </button>
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
                    onClick={() => { setMobileQuickMenuOpen(false); navigate('/appels-offres'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18214d] text-left text-xs font-bold"
                  >
                    <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500"><FaHandshake /></span>
                    <div>
                      <span className="block">Appels d'Offres B2B</span>
                      <span className="text-[10px] font-normal text-slate-500">Marchés & devis en gros</span>
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
                    onClick={() => { setMobileQuickMenuOpen(false); navigate('/securite'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18214d] text-left text-xs font-bold"
                  >
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><FaShieldAlt /></span>
                    <div>
                      <span className="block">Sécurité & Escrow</span>
                      <span className="text-[10px] font-normal text-slate-500">Vérification RCCM</span>
                    </div>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CONTENEUR PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 pt-0 sm:pt-4 space-y-2.5 sm:space-y-4">
        
        {/* 3. EN-TÊTE COMPACT DE L'ANNUAIRE */}
        <div className="bg-white dark:bg-[#0b102b] border-y sm:border border-slate-200/80 dark:border-gray-800 rounded-none sm:rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              <FaAward /> Réseau National Made in RDC 🇨🇩
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              Annuaire des Fournisseurs & Producteurs
            </h1>
            <p className="hidden sm:block text-xs text-slate-600 dark:text-gray-400 mt-0.5">
              Identifiez et contactez directement les coopératives agricoles, grossistes et artisans vérifiés dans chaque province de la RDC.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/devenir-fournisseur')}
            className="hidden sm:flex px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
          >
            <FaUserPlus /> Référencer mon entreprise
          </button>
        </div>

        {/* 4. BARRE DE FILTRES COMPACTE */}
        <div className="bg-white dark:bg-[#131936] p-3 sm:p-4 rounded-none sm:rounded-2xl border-y sm:border border-slate-200 dark:border-gray-800 shadow-sm space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
            <div className="md:col-span-5 relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom du fournisseur, café, manioc, raphia..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-xs outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-xs font-bold outline-none focus:border-sky-500"
              >
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov === 'Toutes' ? 'Toutes les provinces (RDC)' : `Province : ${prov}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2">
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-xs font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="accent-sky-500 w-3.5 h-3.5"
                />
                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-sky-500" /> Vérifiés RCCM
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {supplierTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-slate-50 dark:bg-[#0a0e27] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:border-sky-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. GRILLE DES FOURNISSEURS */}
        {filteredSuppliers.length === 0 ? (
          <div className="bg-white dark:bg-[#131936] rounded-none sm:rounded-2xl border-y sm:border border-slate-200 dark:border-gray-800 p-8 text-center space-y-3">
            <p className="text-sm font-bold text-slate-600 dark:text-gray-300">
              Aucun fournisseur ne correspond à ces critères de recherche.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-4">
            {filteredSuppliers.map((supplier) => (
              <motion.article
                key={supplier.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#131936] rounded-none sm:rounded-2xl border-y sm:border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* BANNIÈRE PHOTO DE COUVERTURE + PROFIL */}
                  <div className="relative h-28 sm:h-32 bg-slate-200 dark:bg-slate-800">
                    <img
                      src={supplier.coverImage}
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950/75 backdrop-blur-sm text-white text-[10px] font-bold">
                        {supplier.typeLabel}
                      </span>
                      {supplier.verified && (
                        <span className="px-2 py-0.5 rounded bg-sky-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow">
                          <FaCheckCircle /> Vérifié
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-amber-400 text-white font-black text-sm flex items-center justify-center border-2 border-white dark:border-[#131936] shadow shrink-0">
                          {supplier.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 text-white">
                          <h2 className="font-black text-sm sm:text-base truncate leading-tight">
                            {supplier.name}
                          </h2>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-200">
                            <FaMapMarkerAlt className="text-amber-400 text-[10px] shrink-0" />
                            <span className="truncate">{supplier.city}, {supplier.province}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950/75 text-amber-400 text-xs font-black shrink-0">
                        <FaStar className="text-[11px]" /> {supplier.rating}
                      </div>
                    </div>
                  </div>

                  {/* CORPS DE LA FICHE FOURNISSEUR */}
                  <div className="p-3.5 space-y-2.5">
                    <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2">
                      {supplier.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {supplier.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-bold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5">
                        {(supplier.gallery || []).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Produit"
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-gray-700"
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-right text-[11px]">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Capacité</span>
                          <span className="font-black text-slate-900 dark:text-white">{supplier.capacity}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Commandes</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">+{supplier.completedOrders}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PIED DE CARTE : 2 BOUTONS D'ACTION */}
                <div className="p-3 bg-slate-50/80 dark:bg-[#0a0e27]/80 border-t border-slate-100 dark:border-gray-800 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSupplier(supplier)}
                    className="py-2 px-3 rounded-lg bg-white dark:bg-[#131936] hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <FaEye className="text-sky-500" /> Profil & Catalogue ({supplier.productsCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppSupplier(supplier)}
                    className="py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <FaWhatsapp className="text-sm" /> Contacter Direct
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
        
      {/* ===================================================================== */}
      {/* MODALE DÉTAILS FOURNISSEUR (PLEIN ÉCRAN MOBILE VIA PORTAL)            */}
      {/* ===================================================================== */}
      {selectedSupplier &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full h-full sm:h-auto sm:max-w-xl sm:max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0b102b] rounded-none sm:rounded-2xl border-0 sm:border border-slate-200 dark:border-gray-800 shadow-2xl"
            >
              {/* Couverture */}
              <div className="relative h-36 bg-slate-800">
                <img
                  src={selectedSupplier.coverImage}
                  alt={selectedSupplier.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedSupplier(null)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 text-white hover:bg-slate-900 cursor-pointer"
                >
                  <FaTimes />
                </button>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500">
                    {selectedSupplier.code} • {selectedSupplier.typeLabel}
                  </span>
                  <h3 className="text-lg font-black mt-1">{selectedSupplier.name}</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-[#131936] p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Localisation</span>
                    <span className="font-bold">{selectedSupplier.province}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Capacité</span>
                    <span className="font-bold text-sky-500">{selectedSupplier.capacity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Réponse moy.</span>
                    <span className="font-bold flex items-center gap-1">
                      <FaClock className="text-amber-500" /> {selectedSupplier.responseDelay}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Statut RCCM</span>
                    <span className="font-mono font-bold text-emerald-500">{selectedSupplier.rccm}</span>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                  {selectedSupplier.description}
                </p>

                <div>
                  <span className="font-extrabold text-[11px] uppercase text-slate-400 block mb-2">
                    Aperçu de la production
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(selectedSupplier.gallery || []).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Galerie"
                        className="w-full h-24 rounded-xl object-cover border border-slate-200 dark:border-gray-800"
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSupplier(null);
                      navigate('/catalogue');
                    }}
                    className="py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaBoxes /> Voir ses produits
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWhatsAppSupplier(selectedSupplier)}
                    className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaWhatsapp /> Contacter WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* MODALE EXTERNE DE RECHERCHE GLOBALE */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
