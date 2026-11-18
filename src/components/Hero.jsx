import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaMapMarkerAlt, FaStore, FaHandshake, FaLeaf,
  FaCheckCircle, FaArrowRight, FaMobileAlt, FaShieldAlt, FaTruck, FaWhatsapp, 
 FaChevronLeft, FaChevronRight, FaMapPin, FaFileInvoiceDollar, FaLock 
} from 'react-icons/fa';

export default function Hero({ buyerMode = 'B2C', setBuyerMode, currency = 'CDF' }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const EXCHANGE_RATE = 23000; // 1 USD = 2300 CDF

  const provinces = [
  'Équateur',
  'Haut-Katanga',
  'Haut-Uele',
  'Ituri',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Kinshasa',
  'Kongo-Central',
  'Kwilu',
  'Lomami',
  'Lualaba',
  'Maniema',
  'Mongala',
  'Nord-Kivu',
  'Sud-Kivu',
  'Sud-Ubangi',
  'Tanganyika',
  'Tshopo'
];

  const featuredProducts = [
  // --- Vos 4 produits initiaux ---
  {
    id: 1,
    name: 'Café Arabica du Kivu (Torréfié)',
    category: 'Agro-alimentaire',
    province: 'Sud-Kivu',
    supplier: 'Coopérative Sopacdi',
    verified: true,
    priceB2C: 12,
    unitB2C: 'Sachet 500g',
    priceB2B: 9.5,
    unitB2B: 'Sac 10kg (Min. 5 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 2,
    name: 'Miel Pur de Forêt Équatoriale',
    category: 'Agriculture',
    province: 'Équateur',
    supplier: 'Rucher Mbandaka Bio',
    verified: true,
    priceB2C: 8,
    unitB2C: 'Pot 1 Litre',
    priceB2B: 6,
    unitB2B: 'Bidon 20L (Min. 2 bidons)',
    image: 'https://unsplash.com'
  },
  {
    id: 3,
    name: 'Panier Artisanal Tressé Raphia',
    category: 'Artisanat',
    province: 'Kasaï-Central',
    supplier: 'Atelier Mains d’Or',
    verified: true,
    priceB2C: 25,
    unitB2C: 'Pièce unique',
    priceB2B: 18,
    unitB2B: 'Lot de 10 pièces',
    image: 'https://unsplash.com'
  },
  {
    id: 4,
    name: 'Farine de Manioc Panifiable (Fufu)',
    category: 'Agriculture',
    province: 'Kongo-Central',
    supplier: 'Ferme Nsioni',
    verified: true,
    priceB2C: 15,
    unitB2C: 'Sac 25kg',
    priceB2B: 12,
    unitB2B: 'Sac 50kg (Min. 20 sacs)',
    image: 'https://unsplash.com'
  },

  // --- Nouveaux produits ajoutés (18 produits supplémentaires) ---
  {
    id: 5,
    name: 'Huile de Palme Rouge Raffinée',
    category: 'Agro-alimentaire',
    province: 'Kwilu',
    supplier: 'Huilerie du Kwilu',
    verified: true,
    priceB2C: 6,
    unitB2C: 'Bidon 5 Litres',
    priceB2B: 22,
    unitB2B: 'Fût 25 Litres (Min. 10 fûts)',
    image: 'https://unsplash.com'
  },
  {
    id: 6,
    name: 'Farine de Maïs Blanc (Semoule)',
    category: 'Agriculture',
    province: 'Haut-Katanga',
    supplier: 'Minoterie de Lubumbashi',
    verified: true,
    priceB2C: 18,
    unitB2C: 'Sac 25kg',
    priceB2B: 14.5,
    unitB2B: 'Sac 25kg (Min. 50 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 7,
    name: 'Fèves de Cacao Séchées (Grade A)',
    category: 'Agriculture',
    province: 'Nord-Kivu',
    supplier: 'Coopérative Virunga Cacao',
    verified: true,
    priceB2C: 7,
    unitB2C: 'Sachet 1kg',
    priceB2B: 320,
    unitB2B: 'Sac Jute 65kg (Min. 5 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 8,
    name: 'Beurre de Karité Brut Non Raffiné',
    category: 'Cosmétique',
    province: 'Haut-Uele',
    supplier: 'Association Femmes d’Isiro',
    verified: true,
    priceB2C: 9,
    unitB2C: 'Pot 500g',
    priceB2B: 110,
    unitB2B: 'Carton 15kg (Min. 2 cartons)',
    image: 'https://unsplash.com'
  },
  {
    id: 9,
    name: 'Poissons Séchés Ndakala du Lac',
    category: 'Agro-alimentaire',
    province: 'Tanganyika',
    supplier: 'Pêcherie Kalemie Nord',
    verified: true,
    priceB2C: 10,
    unitB2C: 'Sachet 1kg',
    priceB2B: 160,
    unitB2B: 'Sac 20kg (Min. 5 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 10,
    name: 'Chikwangue Emballée Sous Vide',
    category: 'Agro-alimentaire',
    province: 'Kinshasa',
    supplier: 'Délice du Fleuve SARL',
    verified: true,
    priceB2C: 5,
    unitB2C: 'Lot de 5 pièces',
    priceB2B: 35,
    unitB2B: 'Carton 50 pièces',
    image: 'https://unsplash.com'
  },
  {
    id: 11,
    name: 'Fromage Gouda Artisanal de Masisi',
    category: 'Agro-alimentaire',
    province: 'Nord-Kivu',
    supplier: 'Laiterie des Volcans',
    verified: true,
    priceB2C: 14,
    unitB2C: 'Meule 1kg',
    priceB2B: 11,
    unitB2B: 'Meule 1kg (Min. 10 meules)',
    image: 'https://unsplash.com'
  },
  {
    id: 12,
    name: 'Riz Blanc Local Décortiqué (Bumba)',
    category: 'Agriculture',
    province: 'Mongala',
    supplier: 'Rizerie de la Mongala',
    verified: false,
    priceB2C: 22,
    unitB2C: 'Sac 25kg',
    priceB2B: 38,
    unitB2B: 'Sac 50kg (Min. 20 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 13,
    name: 'Piment Rouge Séché (Pilipili)',
    category: 'Épices',
    province: 'Kongo-Central',
    supplier: 'Jardins de Mbanza-Ngungu',
    verified: true,
    priceB2C: 4,
    unitB2C: 'Bocal 250g',
    priceB2B: 45,
    unitB2B: 'Sac 10kg (Min. 3 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 14,
    name: 'Tissu Kuba Traditionnel Brodé',
    category: 'Mode & Textile',
    province: 'Kasaï-Central',
    supplier: 'Artisans Royaux de Mushenge',
    verified: true,
    priceB2C: 45,
    unitB2C: 'Panneau 1m x 0.6m',
    priceB2B: 32,
    unitB2B: 'Lot de 10 panneaux',
    image: 'https://unsplash.com'
  },
  {
    id: 15,
    name: 'Thé Noir des Hauts Plateaux',
    category: 'Agro-alimentaire',
    province: 'Sud-Kivu',
    supplier: 'Plantations de Kalehe',
    verified: true,
    priceB2C: 6.5,
    unitB2C: 'Boîte 250g',
    priceB2B: 85,
    unitB2B: 'Sac 15kg (Min. 2 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 16,
    name: 'Arachides Décortiquées Grillées',
    category: 'Agriculture',
    province: 'Kwilu',
    supplier: 'Coopérative Agro-Kikwit',
    verified: false,
    priceB2C: 5,
    unitB2C: 'Sachet 1kg',
    priceB2B: 75,
    unitB2B: 'Sac 25kg (Min. 10 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 17,
    name: 'Savon Noir Africain Liquide',
    category: 'Cosmétique',
    province: 'Kinshasa',
    supplier: 'Kongo Botanica',
    verified: true,
    priceB2C: 7,
    unitB2C: 'Flacon 500ml',
    priceB2B: 48,
    unitB2B: 'Carton 12 flacons',
    image: 'https://unsplash.com'
  },
  {
    id: 18,
    name: 'Haricots Rouges Secs Sélectionnés',
    category: 'Agriculture',
    province: 'Nord-Kivu',
    supplier: 'Grenier de Lubero',
    verified: true,
    priceB2C: 16,
    unitB2C: 'Sac 10kg',
    priceB2B: 65,
    unitB2B: 'Sac 50kg (Min. 10 sacs)',
    image: 'https://unsplash.com'
  },
  {
    id: 19,
    name: 'Briques Cuites Stabilisées (BTC)',
    category: 'Construction',
    province: 'Kinshasa',
    supplier: 'Briqueterie Moderne de Maluku',
    verified: true,
    priceB2C: 0.45,
    unitB2C: 'À l’unité',
    priceB2B: 380,
    unitB2B: 'Palette de 1000 briques',
    image: 'https://unsplash.com'
  },
  {
    id: 20,
    name: 'Jus d’Ananas Naturel Pressé',
    category: 'Boissons',
    province: 'Kongo-Central',
    supplier: 'Vergers de Lukula',
    verified: true,
    priceB2C: 3.5,
    unitB2C: 'Bouteille 1 Litre',
    priceB2B: 28,
    unitB2B: 'Casier 12 bouteilles',
    image: 'https://unsplash.com'
  },
  {
    id: 21,
    name: 'Planche de Bois Rouge (Afrormosia)',
    category: 'Bois & Forêt',
    province: 'Tshopo',
    supplier: 'Scierie de Kisangani',
    verified: true,
    priceB2C: 28,
    unitB2C: 'Planche 4m x 30cm',
    priceB2B: 650,
    unitB2B: 'Mètre cube (Min. 5 m³)',
    image: 'https://unsplash.com'
  },
  {
    id: 22,
    name: 'Gousses de Vanille Bourbon',
    category: 'Épices',
    province: 'Nord-Kivu',
    supplier: 'Arômes de Beni',
    verified: true,
    priceB2C: 18,
    unitB2C: 'Tube 50g (env. 15 gousses)',
    priceB2B: 240,
    unitB2B: 'Lot sous vide 1kg',
    image: 'https://unsplash.com'
  }
];

  const basins = [
  { 
    name: 'Kinshasa', 
    specialty: 'Transformation, Mode, Cosmétiques & Artisanat', 
    count: '140+ fournisseurs',
    hubs: ['Gombe', 'Limete', 'Ngaliema', 'N’djili'],
    category: 'Industrie & Artisanat',
    logistics: 'Livraison locale & Fret aérien'
  },
  { 
    name: 'Kongo-Central', 
    specialty: 'Manioc, Fruits tropicaux, Ciment & Huile de palme', 
    count: '110+ producteurs',
    hubs: ['Matadi', 'Boma', 'Mbanza-Ngungu', 'Lukula'],
    category: 'Agroalimentaire & Matériaux',
    logistics: 'Axe routier RN1 & Ports maritimes'
  },
  { 
    name: 'Sud-Kivu', 
    specialty: 'Café Arabica, Thé, Quinquina, Miel & Haricots', 
    count: '95+ coopératives',
    hubs: ['Bukavu', 'Uvira', 'Kabare', 'Kalehe'],
    category: 'Cultures de rente & Vivrier',
    logistics: 'Fret aérien & Lac Kivu/Tanganyika'
  },
  { 
    name: 'Nord-Kivu', 
    specialty: 'Cacao, Vanille, Pommes de terre, Poireaux & Fromage', 
    count: '105+ coopératives',
    hubs: ['Goma', 'Beni', 'Butembo', 'Lubero'],
    category: 'Maraîchage & Export',
    logistics: 'Fret aérien & Axes routiers Est'
  },
  { 
    name: 'Haut-Katanga', 
    specialty: 'Farine de maïs, Maraîchage, Volaille & Élevage', 
    count: '80+ fermes',
    hubs: ['Lubumbashi', 'Likasi', 'Kasumbalesa', 'Kipushi'],
    category: 'Agro-industrie & Élevage',
    logistics: 'Fret ferroviaire, Routier & Aérien'
  },
  { 
    name: 'Kwilu', 
    specialty: 'Cossettes de manioc, Courges, Arachides & Huile de palme', 
    count: '75+ groupements',
    hubs: ['Kikwit', 'Bandundu', 'Bulungu', 'Idiofa'],
    category: 'Produits vivriers de base',
    logistics: 'Axe routier RN1 & Voie fluviale (Kwilu/Kasaï)'
  },
  { 
    name: 'Ituri', 
    specialty: 'Cacao, Café, Viande bovine, Poissons & Or artisanal', 
    count: '65+ producteurs',
    hubs: ['Bunia', 'Mahagi', 'Aru', 'Mambasa'],
    category: 'Élevage, Pêche & Cacao',
    logistics: 'Fret aérien & Lac Albert'
  },
  { 
    name: 'Tshopo', 
    specialty: 'Riz, Banane plantain, Bois d’œuvre & Poissons du fleuve', 
    count: '60+ fournisseurs',
    hubs: ['Kisangani', 'Isangi', 'Yangambi', 'Ubundu'],
    category: 'Sylviculture & Vivrier',
    logistics: 'Transport fluvial (Fleuve Congo) & Aérien'
  },
  { 
    name: 'Équateur', 
    specialty: 'Huile de palme, Cacao, Caoutchouc, Bois & Poissons fumés', 
    count: '55+ producteurs',
    hubs: ['Mbandaka', 'Lukolela', 'Basankusu', 'Bikoro'],
    category: 'Produits forestiers & Halieutiques',
    logistics: 'Baleinières & Barges (Fleuve Congo)'
  },
  { 
    name: 'Lualaba', 
    specialty: 'Maïs, Soja, Miel de forêt & Sous-traitance minière', 
    count: '50+ fournisseurs',
    hubs: ['Kolwezi', 'Fungurume', 'Kasaji', 'Mutshatsha'],
    category: 'Agro-industrie & Services B2B',
    logistics: 'Corridor Sud (Route & Rail)'
  },
  { 
    name: 'Kasaï-Central', 
    specialty: 'Maïs, Niébé, Ananas, Artisanat & Raphia', 
    count: '45+ coopératives',
    hubs: ['Kananga', 'Tshikapa', 'Demba', 'Dibaya'],
    category: 'Vivrier & Artisanat traditionnel',
    logistics: 'Fret aérien & Chemin de fer SNCC'
  },
  { 
    name: 'Tanganyika', 
    specialty: 'Poissons séchés (Ndakala), Riz, Maïs & Huile de palme', 
    count: '40+ groupements',
    hubs: ['Kalemie', 'Kongolo', 'Moba', 'Manono'],
    category: 'Pêche & Céréales',
    logistics: 'Lac Tanganyika, Rail & Aérien'
  }
];

// Données des onglets thématiques (adaptées au marché congolais)
const platformFeatures = [
  {
    id: 'escrow',
    tabTitle: 'Paiement Séquestre & Mobile Money',
    badge: '100% Sécurisé',
    icon: FaShieldAlt,
    title: 'Achetez sans peur grâce au blocage des fonds (Escrow)',
    description:
      'Payez par M-Pesa, Airtel Money, Orange Money ou carte. L’argent est sécurisé sur la plateforme et n’est versé au fournisseur qu’après confirmation de la livraison.',
    highlights: [
      'Intégration native M-Pesa, Airtel, Orange & Afrimoney',
      'Remboursement garanti en cas de non-conformité',
      'Double affichage instantané USD ($) et Franc Congolais (CDF)'
    ],
    ctaText: 'Découvrir la protection acheteur',
    ctaLink: '/securite',
    // Données pour la maquette visuelle à droite
    preview: {
      header: 'Transaction Sécurisée #CD-8492',
      status: 'Fonds bloqués sous séquestre',
      amount: '450.00 $ (1 282 500 FC)',
      supplier: 'Coopérative Sopacdi (Sud-Kivu)',
      method: 'M-Pesa RDC •••• 842'
    }
  },
  {
    id: 'logistics',
    tabTitle: 'Fret & Suivi Interprovincial',
    badge: 'Logistique RDC',
    icon: FaTruck,
    title: 'Suivez vos marchandises de la ferme jusqu’à votre entrepôt',
    description:
      'Estimez les délais et coûts de transport (aérien, fluvial ou routier) entre les bassins de production et les grands centres de consommation.',
    highlights: [
      'Calcul automatique des frais de fret par axe (RN1, Fleuve, Air)',
      'Notifications SMS et WhatsApp à chaque étape du trajet',
      'Partenaires transporteurs et coursiers vérifiés'
    ],
    ctaText: 'Simuler un tarif de livraison',
    ctaLink: '/logistique',
    preview: {
      header: 'Expédition #LOG-304',
      status: 'En transit • Arrivée estimée : Demain',
      amount: 'Axe : Goma (Nord-Kivu) ➔ Kinshasa',
      supplier: 'Fret Aérien Cargo • 120 kg',
      method: 'Étape 3/4 : Arrivé au Hub N’djili'
    }
  },
  {
    id: 'b2b',
    tabTitle: 'Devis & Facturation Pro (B2B)',
    badge: 'Espace Entreprise',
    icon: FaFileInvoiceDollar,
    title: 'Comparez plusieurs fournisseurs et générez vos factures',
    description:
      'Idéal pour les hôtels, supermarchés et chantiers : lancez un appel d’offres, négociez les prix de gros et téléchargez vos bons de commande conformes.',
    highlights: [
      'Réception de 3 à 5 devis comparatifs en moins de 24h',
      'Génération automatique de factures PDF avec RCCM / ID Nat',
      'Historique d’achats et réapprovisionnement en 1 clic'
    ],
    ctaText: 'Explorer l’espace B2B',
    ctaLink: '/appels-offres',
    preview: {
      header: 'Appel d’offres #RFQ-119',
      status: '4 Devis reçus • Meilleure offre : -18%',
      amount: 'Besoin : 2 Tonnes Farine de Maïs',
      supplier: 'Minoterie de Lubumbashi (Vérifié)',
      method: 'Livraison : Kolwezi • Paiement 30j'
    }
  }
];

  const formatPrice = (usdAmount) => {
    if (currency === 'USD') return usdAmount.toFixed(2) + ' $';
    return Math.round(usdAmount * EXCHANGE_RATE).toLocaleString('fr-FR') + ' FC';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      '/catalogue?search=' +
        encodeURIComponent(searchQuery) +
        '&province=' +
        encodeURIComponent(selectedProvince)
    );
  };

  const handleProvinceClick = (province) => {
    setSelectedProvince(province);
    navigate('/catalogue?province=' + encodeURIComponent(province));
  };

  const handleWhatsAppProduct = (product) => {
    const msg =
      'Bonjour ' +
      product.supplier +
      ', je suis intéressé par "' +
      product.name +
      '" (' +
      buyerMode +
      ') sur YaBiso RDC.';
    window.open('https://wa.me' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
  };

  // À placer à l'intérieur de votre composant :
const [selectedCategory, setSelectedCategory] = useState('Toutes');
const sliderRef = useRef(null);

// Extraction automatique des catégories uniques depuis featuredProducts
const categories = ['Toutes', ...new Set(featuredProducts.map((p) => p.category))];

// Filtrage des produits selon la catégorie sélectionnée
const filteredProducts = selectedCategory === 'Toutes'
  ? featuredProducts
  : featuredProducts.filter((product) => product.category === selectedCategory);

// Fonction pour défiler horizontalement avec les boutons sur Desktop
const scrollSlider = (direction) => {
  if (sliderRef.current) {
    const scrollAmount = direction === 'left' ? -320 : 320;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

{/* À placer dans la logique de votre composant */}
const basinsSliderRef = useRef(null);

const scrollBasins = (direction) => {
  if (basinsSliderRef.current) {
    const scrollAmount = direction === 'left' ? -300 : 300;
    basinsSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

const [activeTab, setActiveTab] = useState(platformFeatures[0]);

  return (
    <div className="bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100">
      
      {/* 1. SECTION HERO PRINCIPALE */}
      <section className="relative bg-gradient-to-b from-sky-50/90 via-white to-white dark:from-[#0b102b] dark:via-[#070a1d] dark:to-[#070a1d] pt-32 pb-16 px-4 sm:px-6 border-b border-slate-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              {buyerMode === 'B2B'
                ? 'Espace Pro : Approvisionnement en gros pour Hôtels & Supermarchés'
                : 'Le Hub B2C & B2B du Made in RDC 🇨🇩'}
            </span>
          </motion.div>

          {/* Titre Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            Valorisons nos{' '}
            <span className="text-sky-600 dark:text-sky-400">Produits</span>{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Locaux</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300/80 dark:bg-amber-400/30 -z-0 rounded"></span>
            </span>
          </motion.h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Achetez en direct auprès des coopératives agricoles, grossistes et artisans de la{' '}
            <strong className="text-sky-600 dark:text-sky-400">République Démocratique du Congo</strong> avec paiement Mobile Money sécurisé.
          </p>

          {/* BARRE DE RECHERCHE RAPIDE */}
          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-4xl mx-auto bg-white dark:bg-[#131936] p-2.5 rounded-2xl shadow-xl shadow-sky-900/5 border border-slate-200 dark:border-gray-700 flex flex-col md:flex-row gap-2 items-center"
          >
            <div className="w-full flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-gray-700 pb-2.5 md:pb-0">
              <FaSearch className="text-sky-500 mr-3 shrink-0" />
              <input
                type="text"
                placeholder={
                  buyerMode === 'B2B'
                    ? 'Ex: 50 sacs de maïs, café vert du Kivu...'
                    : 'Que cherchez-vous ? (ex: Miel pur, Farine de manioc, Pagne...)'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm"
              />
            </div>

            <div className="w-full md:w-60 flex items-center px-3 pb-2.5 md:pb-0">
              <FaMapMarkerAlt className="text-amber-500 mr-2.5 shrink-0" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-transparent text-slate-700 dark:text-gray-200 focus:outline-none cursor-pointer text-sm font-semibold"
              >
                <option value="" className="text-slate-900">Toutes les provinces</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov} className="text-slate-900">
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-500/20 transition shrink-0"
            >
              Rechercher
            </button>
          </form>

         {/* FILTRAGE RAPIDE PAR PROVINCE */}
<div className="mt-8">
  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3 px-4 md:px-0 md:text-center">
    Filtrer par bassin de production :
  </p>

  {/* 
    - flex-nowrap + overflow-x-auto : force une seule ligne défilante sur mobile
    - md:flex-wrap + md:justify-center : revient à l'affichage groupé sur tablette/PC
    - [scrollbar-width:none] + [&::-webkit-scrollbar]:hidden : masque la barre de défilement disgracieuse
  */}
  <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-2 overflow-x-auto px-4 md:px-0 pb-2 max-w-3xl mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
    
    {/* Bouton "Toutes les provinces" (Recommandé pour réinitialiser le filtre facilement) */}
    <button
      type="button"
      onClick={() => handleProvinceClick('ALL')}
      className="shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-full bg-amber-400 text-slate-900 shadow-sm transition"
    >
      Toutes
    </button>

    {provinces.map((province) => (
      <button
        key={province}
        type="button"
        onClick={() => handleProvinceClick(province)}
        className="shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-[#131936] hover:bg-amber-400 dark:hover:bg-amber-400 text-slate-700 dark:text-gray-300 hover:text-slate-900 transition"
      >
        {province}
      </button>
    ))}
  </div>
</div>


          {/* BOUTONS D'ACTION PRINCIPAUX */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/catalogue')}
              className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm flex items-center gap-2 shadow-sm transition"
            >
              <span>Explorer le catalogue</span>
              <FaArrowRight />
            </button>
            <button
              type="button"
              onClick={() => navigate('/devenir-fournisseur')}
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#131936] hover:bg-sky-50 border-2 border-sky-500 text-sky-600 dark:text-sky-400 font-bold text-sm flex items-center gap-2 transition"
            >
              <FaStore />
              <span>Devenir Fournisseur (Gratuit)</span>
            </button>
          </div>
        </div>
      </section>

            {/* 2. GARANTIES POUR LA RDC */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#131936] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <FaMobileAlt size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Mobile Money & Multi-devises</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Payez en CDF ou USD via M-Pesa, Airtel Money, Orange Money et Afrimoney.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#131936] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <FaShieldAlt size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Paiement Sécurisé (Séquestre)</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Vos fonds sont protégés et libérés au vendeur uniquement après livraison.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#131936] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <FaTruck size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Logistique Interprovinciale</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Achetez dans les provinces et recevez vos colis à Kinshasa, Lubumbashi ou Goma.
              </p>
            </div>
          </div>
        </div>
      </section>

     {/* 3. PRODUITS LOCAUX VEDETTES */}
<section className="max-w-7xl mx-auto px-4 py-10">
  {/* En-tête + Sélecteur B2C / B2B */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-5 gap-4">
    <div>
      <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
        Sélection Vérifiée
      </span>
      <h2 className="text-2xl sm:text-3xl font-black mt-0.5">
        {buyerMode === 'B2B' ? 'Offres en Gros & Approvisionnement' : 'Produits Locaux Populaires'}
      </h2>
    </div>

    <div className="flex items-center gap-3 self-end sm:self-auto">
      {setBuyerMode && (
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#131936] p-1 rounded-xl border border-slate-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setBuyerMode('B2C')}
            className={
              'px-3 py-1.5 rounded-lg text-xs font-bold transition ' +
              (buyerMode === 'B2C'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-600 dark:text-gray-400')
            }
          >
            Détail (B2C)
          </button>
          <button
            type="button"
            onClick={() => setBuyerMode('B2B')}
            className={
              'px-3 py-1.5 rounded-lg text-xs font-bold transition ' +
              (buyerMode === 'B2B'
                ? 'bg-amber-400 text-slate-900 shadow'
                : 'text-slate-600 dark:text-gray-400')
            }
          >
            Gros (B2B)
          </button>
        </div>
      )}

      {/* Boutons de défilement gauche/droite (visibles sur Desktop) */}
      <div className="hidden md:flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => scrollSlider('left')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] hover:bg-sky-500 hover:text-white text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition"
          aria-label="Précédent"
        >
          <FaChevronLeft size={12} />
        </button>
        <button
          type="button"
          onClick={() => scrollSlider('right')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] hover:bg-sky-500 hover:text-white text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition"
          aria-label="Suivant"
        >
          <FaChevronRight size={12} />
        </button>
      </div>
    </div>
  </div>

  {/* FILTRE PAR CATÉGORIE (Une seule ligne défilante Mobile & Desktop) */}
  <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-3 mb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
    {categories.map((category) => {
      const isActive = selectedCategory === category;
      return (
        <button
          key={category}
          type="button"
          onClick={() => setSelectedCategory(category)}
          className={
            'shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-bold rounded-full transition border ' +
            (isActive
              ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
              : 'bg-slate-100 dark:bg-[#131936] text-slate-700 dark:text-gray-300 border-transparent hover:border-sky-400')
          }
        >
          {category}
        </button>
      );
    })}
  </div>

  {/* CARROUSEL DE PRODUITS SUR UNE SEULE LIGNE (Mobile & Desktop) */}
  <div
    ref={sliderRef}
    className="flex flex-nowrap gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
  >
    {filteredProducts.map((product) => (
      <motion.div
        key={product.id}
        whileHover={{ y: -3 }}
        className="w-[230px] sm:w-[255px] shrink-0 snap-start bg-white dark:bg-[#131936] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 dark:border-gray-800 flex flex-col justify-between transition"
      >
        <div>
          {/* Image plus compacte (h-36 au lieu de h-48) */}
          <div
            onClick={() => navigate('/produit/' + product.id)}
            className="relative h-36 overflow-hidden bg-slate-100 cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
              loading="lazy"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 dark:bg-[#0a0e27]/90 text-slate-900 dark:text-white text-[10px] font-bold flex items-center gap-1 shadow">
              <FaMapMarkerAlt className="text-amber-500" /> {product.province}
            </span>
            {product.verified && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                <FaCheckCircle />
              </span>
            )}
          </div>

          {/* Contenu resserré (p-3) */}
          <div className="p-3">
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
              {product.category}
            </span>
            <h3
              onClick={() => navigate('/produit/' + product.id)}
              className="font-bold text-sm mt-0.5 line-clamp-1 cursor-pointer hover:text-sky-500"
              title={product.name}
            >
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">
              Par {product.supplier}
            </p>

            {/* Prix compact */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-gray-800 flex items-baseline justify-between gap-1">
              <span className="text-base font-black text-sky-600 dark:text-sky-400">
                {formatPrice(buyerMode === 'B2B' ? product.priceB2B : product.priceB2C)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                {buyerMode === 'B2B' ? product.unitB2B : product.unitB2C}
              </span>
            </div>
          </div>
        </div>

        {/* Boutons d'action compacts */}
        <div className="px-3 pb-3 flex gap-1.5">
          <button
            type="button"
            onClick={() => navigate('/produit/' + product.id)}
            className={
              'flex-1 py-2 rounded-xl font-bold text-xs transition ' +
              (buyerMode === 'B2B'
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-900'
                : 'bg-sky-500 hover:bg-sky-600 text-white')
            }
          >
            {buyerMode === 'B2B' ? 'Devis' : 'Commander'}
          </button>
          <button
            type="button"
            onClick={() => handleWhatsAppProduct(product)}
            className="px-2.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center justify-center"
            title="Discuter sur WhatsApp"
          >
            <FaWhatsapp size={15} />
          </button>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* SECTION : EXPLORATION PAR BASSIN DE PRODUCTION */}
<section className="max-w-7xl mx-auto px-4 py-10">
  {/* En-tête avec boutons de navigation Desktop */}
  <div className="flex justify-between items-end mb-5">
    <div>
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
        Carte Économique RDC
      </span>
      <h2 className="text-2xl sm:text-3xl font-black mt-0.5">
        Explorer par Bassin de Production
      </h2>
    </div>

    {/* Flèches de défilement (Desktop uniquement) */}
    <div className="hidden md:flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => scrollBasins('left')}
        className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] hover:bg-amber-400 hover:text-slate-900 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition"
        aria-label="Bassin précédent"
      >
        <FaChevronLeft size={12} />
      </button>
      <button
        type="button"
        onClick={() => scrollBasins('right')}
        className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] hover:bg-amber-400 hover:text-slate-900 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition"
        aria-label="Bassin suivant"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  </div>

  {/* CARROUSEL SUR UNE SEULE LIGNE (Mobile & Desktop) */}
  <div
    ref={basinsSliderRef}
    className="flex flex-nowrap gap-3.5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
  >
    {basins.map((prov) => (
      <div
        key={prov.name}
        onClick={() => handleProvinceClick(prov.name)}
        className="w-[245px] sm:w-[270px] shrink-0 snap-start cursor-pointer bg-white dark:bg-[#131936] p-4 rounded-2xl border border-slate-200 dark:border-gray-800 hover:border-sky-500 dark:hover:border-sky-400 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
      >
        <div>
          {/* Ligne du haut : Icône + Badge Fournisseurs */}
          <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition">
              <FaLeaf className="text-sm" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/20">
              {prov.count}
            </span>
          </div>

          {/* Nom de la province + Catégorie dominante */}
          <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-sky-500 transition flex items-center justify-between">
            {prov.name}
            <FaArrowRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sky-500" />
          </h3>

          {/* Spécialités (limité à 2 lignes max pour garder une hauteur uniforme) */}
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {prov.specialty}
          </p>
        </div>

        {/* Pied de carte : Villes clés (Hubs) */}
        {prov.hubs && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-gray-800/80 flex items-center gap-1 overflow-hidden">
            <FaMapPin className="text-[10px] text-slate-400 shrink-0" />
            <div className="flex gap-1 overflow-hidden">
              {prov.hubs.slice(0, 3).map((hub) => (
                <span
                  key={hub}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0a0e27] text-slate-600 dark:text-gray-300 whitespace-nowrap"
                >
                  {hub}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</section>

           {/* 5. BANNIÈRE APPELS D'OFFRES B2B (Compacte & Moderne) */}
<section className="max-w-7xl mx-auto px-4 py-6">
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-5 sm:p-7 shadow-lg border border-sky-400/20">
    
    {/* Effet lumineux subtil en arrière-plan */}
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      
      {/* Partie Gauche : Ruban défilant des cibles + Titre court */}
      <div className="max-w-2xl">
        {/* Mini-carrousel / Ruban défilant sur 1 ligne */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider">
            <FaHandshake size={11} /> Espace Pro B2B
          </span>
          {['Hôtels & Lodges', 'Restaurants', 'Supermarchés', 'Catering & Mines', 'Industries'].map((sector) => (
            <span
              key={sector}
              className="shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-white/15 text-sky-50 text-[10px] font-semibold backdrop-blur-sm"
            >
              {sector}
            </span>
          ))}
        </div>

        <h2 className="text-lg sm:text-2xl font-black leading-snug">
          Besoin de gros volumes ? Recevez des devis en moins de 24h.
        </h2>
        <p className="text-sky-100 text-xs sm:text-sm mt-1 line-clamp-2 sm:line-clamp-1">
          Publiez gratuitement votre demande et comparez les offres de nos coopératives vérifiées.
        </p>
      </div>

      {/* Partie Droite : Bouton d'action compact */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={() => navigate('/appels-offres')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
        >
          <span>Publier un besoin</span>
          <FaArrowRight size={12} />
        </button>
      </div>

    </div>
  </div>
</section>

{/* SECTION : FONCTIONNALITÉS AVANCÉES (ONGLETS INTERACTIFS) */}
<section className="max-w-7xl mx-auto px-4 py-12">
  {/* En-tête de section */}
  <div className="max-w-2xl mb-8">
    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
      Fonctionnalités Avancées
    </span>
    <h2 className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 dark:text-white">
      Explorez Nos Services Innovants
    </h2>
    <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1.5">
      Des outils pensés pour sécuriser vos achats, fluidifier la logistique et développer votre activité en RDC.
    </p>
  </div>

  {/* Grille Principale : Onglets à Gauche (5 col) | Aperçu à Droite (7 col) */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
    
    {/* COLONNE GAUCHE : Navigation par onglets (1 ligne défilante sur mobile, verticale sur desktop) */}
    <div className="lg:col-span-5 flex flex-nowrap lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {platformFeatures.map((feat) => {
        const Icon = feat.icon;
        const isSelected = activeTab.id === feat.id;

        return (
          <button
            key={feat.id}
            type="button"
            onClick={() => setActiveTab(feat)}
            className={
              'shrink-0 lg:shrink text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer ' +
              (isSelected
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                : 'bg-white dark:bg-[#131936] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:border-sky-400')
            }
          >
            <div
              className={
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ' +
                (isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-sky-50 dark:bg-[#0a0e27] text-sky-500')
              }
            >
              <Icon size={18} />
            </div>

            <div className="min-w-0">
              <span
                className={
                  'text-[10px] font-bold uppercase tracking-wider block ' +
                  (isSelected ? 'text-sky-100' : 'text-amber-500')
                }
              >
                {feat.badge}
              </span>
              <span className="font-bold text-xs sm:text-sm whitespace-nowrap lg:whitespace-normal block mt-0.5">
                {feat.tabTitle}
              </span>
            </div>
          </button>
        );
      })}
    </div>

    {/* COLONNE DROITE : Panneau de visualisation dynamique */}
    <div className="lg:col-span-7 bg-white dark:bg-[#131936] rounded-3xl border border-slate-200 dark:border-gray-800 p-5 sm:p-8 shadow-sm flex flex-col justify-between">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col justify-between h-full gap-6"
        >
          {/* Détails du service */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-bold mb-3">
              <activeTab.icon size={12} /> {activeTab.badge}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {activeTab.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-2.5 leading-relaxed">
              {activeTab.description}
            </p>

            {/* Liste des avantages */}
            <ul className="mt-4 space-y-2">
              {activeTab.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-gray-200 font-medium">
                  <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini-aperçu visuel (Simule l'interface réelle de l'application) */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200/80 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-2.5 mb-3">
              <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <FaMobileAlt className="text-sky-500" /> {activeTab.preview.header}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <FaLock size={9} /> {activeTab.preview.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {activeTab.preview.amount}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  {activeTab.preview.supplier}
                </div>
              </div>
              <div className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-[#131936] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 self-start sm:self-center">
                {activeTab.preview.method}
              </div>
            </div>
          </div>

          {/* Bouton d'action */}
          <div>
            <button
              type="button"
              onClick={() => navigate(activeTab.ctaLink)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400 hover:text-amber-500 transition cursor-pointer"
            >
              <span>{activeTab.ctaText}</span>
              <FaArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

  </div>
</section>
    </div>
  );
}
