import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp, FaStore,
  FaStar, FaBoxes, FaFilter, FaUserPlus, FaAward
} from 'react-icons/fa';

const MOCK_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Coopérative Sopacdi Kivu',
    type: 'cooperative',
    typeLabel: 'Coopérative Agricole',
    province: 'Sud-Kivu',
    city: 'Kalehe / Bukavu',
    verified: true,
    rating: 4.9,
    completedOrders: 320,
    productsCount: 14,
    specialties: ['Café Arabica', 'Cacao Bio', 'Haricots'],
    description: 'Regroupement de plus de 5 000 petits producteurs de café et cacao autour du lac Kivu avec certification biologique.',
    phone: '243000000001'
  },
  {
    id: 'sup-2',
    name: 'Ferme & Minoterie Nsioni',
    type: 'wholesaler',
    typeLabel: 'Grossiste & Producteur',
    province: 'Kongo-Central',
    city: 'Mbanza-Ngungu',
    verified: true,
    rating: 4.8,
    completedOrders: 510,
    productsCount: 9,
    specialties: ['Farine de Manioc', 'Maïs en grain', 'Arachides'],
    description: 'Approvisionnement en gros de farine de manioc panifiable et céréales pour supermarchés, boulangeries et hôtels à Kinshasa.',
    phone: '243000000002'
  },
  {
    id: 'sup-3',
    name: 'Atelier Artisanal Mains d’Or',
    type: 'artisan',
    typeLabel: 'Artisan & Créateur',
    province: 'Kasaï',
    city: 'Tshikapa',
    verified: true,
    rating: 4.9,
    completedOrders: 94,
    productsCount: 28,
    specialties: ['Vannerie Raphia', 'Sculpture Bois', 'Tissus Kuba'],
    description: 'Collectif d’artisans perpétuant le tissage traditionnel du raphia et la décoration intérieure authentique Made in Congo.',
    phone: '243000000003'
  },
  {
    id: 'sup-4',
    name: 'Rucher Mbandaka Bio',
    type: 'cooperative',
    typeLabel: 'Coopérative Apicole',
    province: 'Équateur',
    city: 'Mbandaka',
    verified: true,
    rating: 4.7,
    completedOrders: 185,
    productsCount: 6,
    specialties: ['Miel de Forêt', 'Cire d’abeille', 'Propolis'],
    description: 'Récolte durable de miel sauvage pur dans la cuvette centrale, conditionné en pots détail ou fûts industriels.',
    phone: '243000000004'
  },
  {
    id: 'sup-5',
    name: 'Huilerie Moderne du Fleuve',
    type: 'wholesaler',
    typeLabel: 'Grossiste Industriel',
    province: 'Kongo-Central',
    city: 'Matadi',
    verified: false,
    rating: 4.5,
    completedOrders: 62,
    productsCount: 5,
    specialties: ['Huile de Palme Rouge', 'Huile Palmiste', 'Savon artisanal'],
    description: 'Production et distribution d’huiles végétales locales en bidons de 5L et fûts de 25L pour professionnels.',
    phone: '243000000005'
  },
  {
    id: 'sup-6',
    name: 'Créations Mode Gombe',
    type: 'artisan',
    typeLabel: 'Atelier Textile',
    province: 'Kinshasa',
    city: 'Gombe / Kinshasa',
    verified: true,
    rating: 4.8,
    completedOrders: 215,
    productsCount: 42,
    specialties: ['Pagnes Imprimés', 'Tenues Sur-Mesure', 'Accessoires'],
    description: 'Confection textile locale et distribution de pagnes de qualité supérieure pour particuliers et boutiques.',
    phone: '243000000006'
  }
];

export default function AnnuairePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Toutes');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'tous');
  const [onlyVerified, setOnlyVerified] = useState(false);

  const provinces = [
    'Toutes', 'Kinshasa', 'Kongo-Central', 'Nord-Kivu',
    'Sud-Kivu', 'Haut-Katanga', 'Équateur', 'Kasaï', 'Tshopo'
  ];

  const supplierTypes = [
    { id: 'tous', label: 'Tous les profils' },
    { id: 'cooperative', label: 'Coopératives' },
    { id: 'wholesaler', label: 'Grossistes (B2B)' },
    { id: 'artisan', label: 'Artisans' }
  ];

  // Synchronisation avec les liens du menu déroulant de la Navbar
  useEffect(() => {
    const urlType = searchParams.get('type');
    if (urlType) {
      setSelectedType(urlType);
    } else {
      setSelectedType('tous');
    }
  }, [searchParams]);

  const filteredSuppliers = useMemo(() => {
    return MOCK_SUPPLIERS.filter((sup) => {
      const matchesSearch =
        sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesProvince =
        selectedProvince === 'Toutes' ||
        sup.province.toLowerCase() === selectedProvince.toLowerCase();

      const matchesType =
        selectedType === 'tous' || sup.type === selectedType;

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
    const message =
      'Bonjour ' +
      supplier.name +
      ', j’ai trouvé votre profil fournisseur sur l’annuaire YaBiso RDC et j’aimerais échanger avec vous.';
    const url = 'https://wa.me' + supplier.phone + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* EN-TÊTE DE L'ANNUAIRE */}
        <div className="bg-sky-50/80 dark:bg-[#0b102b] border border-sky-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3">
              <FaAward /> Réseau National Made in RDC 🇨🇩
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Annuaire des Fournisseurs & Producteurs
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 mt-2">
              Identifiez et contactez directement les coopératives agricoles, grossistes et artisans vérifiés dans chaque province de la RDC.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/devenir-fournisseur')}
            className="px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 transition shrink-0"
          >
            <FaUserPlus /> Référencer mon entreprise
          </button>
        </div>

        {/* BARRE DE FILTRES AVANCÉS */}
        <div className="bg-white dark:bg-[#131936] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Recherche mot-clé */}
            <div className="md:col-span-5 relative">
              <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un fournisseur, café, manioc, raphia..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Filtre par Province */}
            <div className="md:col-span-3 relative">
              <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-amber-500 text-sm" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-700 text-sm font-semibold focus:outline-none focus:border-sky-500"
              >
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov === 'Toutes' ? 'Toutes les provinces' : prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Badge Vérifié */}
            <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer select-none bg-sky-50 dark:bg-sky-900/20 px-4 py-2.5 rounded-xl border border-sky-100 dark:border-sky-800/50">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500"
                />
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                  <FaCheckCircle className="text-sky-500" /> Vérifiés uniquement
                </span>
              </label>
            </div>
          </div>

                    {/* Onglets par Type de Fournisseur */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-gray-800">
            <div className="flex flex-wrap gap-2">
              {supplierTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={
                    'px-4 py-1.5 rounded-full text-xs font-bold transition ' +
                    (selectedType === t.id
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-[#0a0e27] text-slate-600 dark:text-gray-300 hover:bg-slate-200')
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-slate-500">
              {filteredSuppliers.length} fournisseur(s) trouvé(s)
            </div>
          </div>
        </div>

        {/* GRILLE DES FOURNISSEURS */}
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#131936] rounded-3xl border border-dashed border-slate-300 dark:border-gray-700 px-4">
            <FaFilter className="mx-auto text-3xl text-slate-400 mb-3" />
            <h3 className="text-lg font-bold">Aucun fournisseur ne correspond à ces critères</h3>
            <p className="text-sm text-slate-500 mt-1">
              Essayez d’élargir votre recherche à toutes les provinces de la RDC.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <motion.div
                key={supplier.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#131936] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  {/* En-tête Carte */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl shrink-0">
                        <FaStore />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase text-sky-600 dark:text-sky-400">
                          {supplier.typeLabel}
                        </span>
                        <h2 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                          {supplier.name}
                        </h2>
                      </div>
                    </div>

                    {supplier.verified && (
                      <span className="px-2.5 py-1 rounded-lg bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-sm">
                        <FaCheckCircle /> Vérifié
                      </span>
                    )}
                  </div>

                  {/* Localisation & Note */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <FaMapMarkerAlt className="text-amber-500" /> {supplier.province} ({supplier.city})
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-gray-200">
                      <FaStar className="text-amber-400" /> {supplier.rating}/5 ({supplier.completedOrders} ventes)
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
                    {supplier.description}
                  </p>

                  {/* Spécialités */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {supplier.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0a0e27] text-slate-700 dark:text-gray-300 text-[11px] font-semibold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pied de carte : Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-gray-800 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/catalogue?search=' + encodeURIComponent(supplier.specialties[0]))}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <FaBoxes /> Voir ses produits ({supplier.productsCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppSupplier(supplier)}
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center justify-center"
                    title="Contacter sur WhatsApp"
                  >
                    <FaWhatsapp size={17} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
