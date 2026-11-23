import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS_DB, getProductImage } from '../data/productsData';
import background4 from '../assets/background4.jpeg';
import {
  FaSearch, FaMapMarkerAlt, FaStore, FaHandshake, FaLeaf,
  FaCheckCircle, FaArrowRight, FaMobileAlt, FaShieldAlt, FaTruck, FaWhatsapp, 
  FaChevronLeft, FaChevronRight, FaMapPin, FaFileInvoiceDollar, FaLock 
} from 'react-icons/fa';

export default function Hero({ buyerMode = 'B2C', setBuyerMode, currency = 'CDF' }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  // Déclarés UNE SEULE FOIS ici (supprimez les doublons vers la ligne 631)
  const rowRefs = useRef({});
  const categorySectionRefs = useRef({});

  const displayCategories = useMemo(() => {
  const uniqueCats = [
    ...new Set((PRODUCTS_DB || []).map((p) => p.categoryLabel).filter(Boolean))
  ];
  return uniqueCats.slice(0, 9);
}, []);

const productsSectionRef = useRef(null); // Repère toute la section des produits locaux
const categoryBarRef = useRef(null);     // Repère la position exacte de la barre
const [isCategoryBarFixed, setIsCategoryBarFixed] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    if (!productsSectionRef.current || !categoryBarRef.current) return;

    // Hauteur de votre Navbar principale en haut de l'écran (ex: 64px pour h-16, ou 56px pour h-14)
    const navbarHeight = 80; 

    const sectionRect = productsSectionRef.current.getBoundingClientRect();
    const barRect = categoryBarRef.current.getBoundingClientRect();

    // 1. L'utilisateur a atteint la barre de catégories
    const hasReachedBar = barRect.top <= navbarHeight;
    // 2. L'utilisateur n'a pas encore dépassé la fin de la section (avec une marge de 140px)
    const isStillInSection = sectionRect.bottom > navbarHeight + 140;

    setIsCategoryBarFixed(hasReachedBar && isStillInSection);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Vérification initiale
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


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

  // const featuredProducts = [
  // {
  //   id: 1,
  //   name: 'Café Arabica du Kivu (Torréfié)',
  //   category: 'Agro-alimentaire',
  //   province: 'Sud-Kivu',
  //   supplier: 'Coopérative Sopacdi',
  //   verified: true,
  //   priceB2C: 12,
  //   unitB2C: 'Sachet 500g',
  //   priceB2B: 9.5,
  //   unitB2B: 'Sac 10kg (Min. 5 sacs)',
  //   image: getProductImage(1)
  // },
  // {
  //   id: 2,
  //   name: 'Miel Pur de Forêt Équatoriale',
  //   category: 'Agriculture',
  //   province: 'Équateur',
  //   supplier: 'Rucher Mbandaka Bio',
  //   verified: true,
  //   priceB2C: 8,
  //   unitB2C: 'Pot 1 Litre',
  //   priceB2B: 6,
  //   unitB2B: 'Bidon 20L (Min. 2 bidons)',
  //   image: getProductImage(1)
  // },
  // {
  //   id: 3,
  //   name: 'Panier Artisanal Tressé Raphia',
  //   category: 'Artisanat',
  //   province: 'Kasaï-Central',
  //   supplier: 'Atelier Mains d’Or',
  //   verified: true,
  //   priceB2C: 25,
  //   unitB2C: 'Pièce unique',
  //   priceB2B: 18,
  //   unitB2B: 'Lot de 10 pièces',
  //   image: getProductImage(1)
  // },
  // {
  //   id: 4,
  //   name: 'Farine de Manioc Panifiable (Fufu)',
  //   category: 'Agriculture',
  //   province: 'Kongo-Central',
  //   supplier: 'Ferme Nsioni',
  //   verified: true,
  //   priceB2C: 15,
  //   unitB2C: 'Sac 25kg',
  //   priceB2B: 12,
  //   unitB2B: 'Sac 50kg (Min. 20 sacs)',
  //   image: getProductImage(1)
  // },

  // --- Nouveaux produits ajoutés (18 produits supplémentaires) ---
//   {
//     id: 5,
//     name: 'Huile de Palme Rouge Raffinée',
//     category: 'Agro-alimentaire',
//     province: 'Kwilu',
//     supplier: 'Huilerie du Kwilu',
//     verified: true,
//     priceB2C: 6,
//     unitB2C: 'Bidon 5 Litres',
//     priceB2B: 22,
//     unitB2B: 'Fût 25 Litres (Min. 10 fûts)',
//     image: getProductImage(1)
//   },
//   {
//     id: 6,
//     name: 'Farine de Maïs Blanc (Semoule)',
//     category: 'Agriculture',
//     province: 'Haut-Katanga',
//     supplier: 'Minoterie de Lubumbashi',
//     verified: true,
//     priceB2C: 18,
//     unitB2C: 'Sac 25kg',
//     priceB2B: 14.5,
//     unitB2B: 'Sac 25kg (Min. 50 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 7,
//     name: 'Fèves de Cacao Séchées (Grade A)',
//     category: 'Agriculture',
//     province: 'Nord-Kivu',
//     supplier: 'Coopérative Virunga Cacao',
//     verified: true,
//     priceB2C: 7,
//     unitB2C: 'Sachet 1kg',
//     priceB2B: 320,
//     unitB2B: 'Sac Jute 65kg (Min. 5 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 8,
//     name: 'Beurre de Karité Brut Non Raffiné',
//     category: 'Cosmétique',
//     province: 'Haut-Uele',
//     supplier: 'Association Femmes d’Isiro',
//     verified: true,
//     priceB2C: 9,
//     unitB2C: 'Pot 500g',
//     priceB2B: 110,
//     unitB2B: 'Carton 15kg (Min. 2 cartons)',
//     image: getProductImage(1)
//   },
//   {
//     id: 9,
//     name: 'Poissons Séchés Ndakala du Lac',
//     category: 'Agro-alimentaire',
//     province: 'Tanganyika',
//     supplier: 'Pêcherie Kalemie Nord',
//     verified: true,
//     priceB2C: 10,
//     unitB2C: 'Sachet 1kg',
//     priceB2B: 160,
//     unitB2B: 'Sac 20kg (Min. 5 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 10,
//     name: 'Chikwangue Emballée Sous Vide',
//     category: 'Agro-alimentaire',
//     province: 'Kinshasa',
//     supplier: 'Délice du Fleuve SARL',
//     verified: true,
//     priceB2C: 5,
//     unitB2C: 'Lot de 5 pièces',
//     priceB2B: 35,
//     unitB2B: 'Carton 50 pièces',
//     image: getProductImage(1)
//   },
//   {
//     id: 11,
//     name: 'Fromage Gouda Artisanal de Masisi',
//     category: 'Agro-alimentaire',
//     province: 'Nord-Kivu',
//     supplier: 'Laiterie des Volcans',
//     verified: true,
//     priceB2C: 14,
//     unitB2C: 'Meule 1kg',
//     priceB2B: 11,
//     unitB2B: 'Meule 1kg (Min. 10 meules)',
//     image: getProductImage(1)
//   },
//   {
//     id: 12,
//     name: 'Riz Blanc Local Décortiqué (Bumba)',
//     category: 'Agriculture',
//     province: 'Mongala',
//     supplier: 'Rizerie de la Mongala',
//     verified: false,
//     priceB2C: 22,
//     unitB2C: 'Sac 25kg',
//     priceB2B: 38,
//     unitB2B: 'Sac 50kg (Min. 20 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 13,
//     name: 'Piment Rouge Séché (Pilipili)',
//     category: 'Épices',
//     province: 'Kongo-Central',
//     supplier: 'Jardins de Mbanza-Ngungu',
//     verified: true,
//     priceB2C: 4,
//     unitB2C: 'Bocal 250g',
//     priceB2B: 45,
//     unitB2B: 'Sac 10kg (Min. 3 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 14,
//     name: 'Tissu Kuba Traditionnel Brodé',
//     category: 'Mode & Textile',
//     province: 'Kasaï-Central',
//     supplier: 'Artisans Royaux de Mushenge',
//     verified: true,
//     priceB2C: 45,
//     unitB2C: 'Panneau 1m x 0.6m',
//     priceB2B: 32,
//     unitB2B: 'Lot de 10 panneaux',
//     image: getProductImage(1)
//   },
//   {
//     id: 15,
//     name: 'Thé Noir des Hauts Plateaux',
//     category: 'Agro-alimentaire',
//     province: 'Sud-Kivu',
//     supplier: 'Plantations de Kalehe',
//     verified: true,
//     priceB2C: 6.5,
//     unitB2C: 'Boîte 250g',
//     priceB2B: 85,
//     unitB2B: 'Sac 15kg (Min. 2 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 16,
//     name: 'Arachides Décortiquées Grillées',
//     category: 'Agriculture',
//     province: 'Kwilu',
//     supplier: 'Coopérative Agro-Kikwit',
//     verified: false,
//     priceB2C: 5,
//     unitB2C: 'Sachet 1kg',
//     priceB2B: 75,
//     unitB2B: 'Sac 25kg (Min. 10 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 17,
//     name: 'Savon Noir Africain Liquide',
//     category: 'Cosmétique',
//     province: 'Kinshasa',
//     supplier: 'Kongo Botanica',
//     verified: true,
//     priceB2C: 7,
//     unitB2C: 'Flacon 500ml',
//     priceB2B: 48,
//     unitB2B: 'Carton 12 flacons',
//     image: getProductImage(1)
//   },
//   {
//     id: 18,
//     name: 'Haricots Rouges Secs Sélectionnés',
//     category: 'Agriculture',
//     province: 'Nord-Kivu',
//     supplier: 'Grenier de Lubero',
//     verified: true,
//     priceB2C: 16,
//     unitB2C: 'Sac 10kg',
//     priceB2B: 65,
//     unitB2B: 'Sac 50kg (Min. 10 sacs)',
//     image: getProductImage(1)
//   },
//   {
//     id: 19,
//     name: 'Briques Cuites Stabilisées (BTC)',
//     category: 'Construction',
//     province: 'Kinshasa',
//     supplier: 'Briqueterie Moderne de Maluku',
//     verified: true,
//     priceB2C: 0.45,
//     unitB2C: 'À l’unité',
//     priceB2B: 380,
//     unitB2B: 'Palette de 1000 briques',
//     image: getProductImage(1)
//   },
//   {
//     id: 20,
//     name: 'Jus d’Ananas Naturel Pressé',
//     category: 'Boissons',
//     province: 'Kongo-Central',
//     supplier: 'Vergers de Lukula',
//     verified: true,
//     priceB2C: 3.5,
//     unitB2C: 'Bouteille 1 Litre',
//     priceB2B: 28,
//     unitB2B: 'Casier 12 bouteilles',
//     image: getProductImage(1)
//   },
//   {
//     id: 21,
//     name: 'Planche de Bois Rouge (Afrormosia)',
//     category: 'Bois & Forêt',
//     province: 'Tshopo',
//     supplier: 'Scierie de Kisangani',
//     verified: true,
//     priceB2C: 28,
//     unitB2C: 'Planche 4m x 30cm',
//     priceB2B: 650,
//     unitB2B: 'Mètre cube (Min. 5 m³)',
//     image: getProductImage(1)
//   },
//   {
//     id: 22,
//     name: 'Gousses de Vanille Bourbon',
//     category: 'Épices',
//     province: 'Nord-Kivu',
//     supplier: 'Arômes de Beni',
//     verified: true,
//     priceB2C: 18,
//     unitB2C: 'Tube 50g (env. 15 gousses)',
//     priceB2B: 240,
//     unitB2B: 'Lot sous vide 1kg',
//     image: getProductImage(1)
//   }
// ];

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

// Liste des produits locaux RDC par défaut (si vous avez déjà un tableau `products` en props/state, il sera automatiquement fusionné)
const PRODUITS_LOCAUX_RDC = [
  'Farine de manioc (Fufu)',
  'Farine de maïs jaune',
  'Miel pur du Mayombe',
  'Miel de forêt (Équateur)',
  'Café Arabica du Kivu',
  'Café Robusta',
  'Cacao en fèves',
  'Huile de palme rouge',
  'Huile de palmiste',
  'Haricots rouges du Kivu',
  'Arachides décortiquées',
  'Pagne Wax & Raphia',
  'Piment pili-pili séché',
  'Poissons salés (Makayabu)',
  'Bananes plantains',
  'Soja en grains',
  'Thé noir du Kivu',
  'Jus naturels locaux',
  'Savon artisanal au beurre de karité',
  'Meubles en bois massif'
];

const [showSuggestions, setShowSuggestions] = useState(false);

const formatPrice = (usdAmount) => {
  if (!usdAmount) return '';
  if (currency === 'USD') return usdAmount.toFixed(2) + ' $';
  return Math.round(usdAmount * 2850).toLocaleString('fr-FR') + ' FC';
};

// Filtre uniquement dans PRODUCTS_DB les produits commençant par les lettres saisies
const filteredSuggestions = useMemo(() => {
  const query = (searchQuery || '').trim().toLowerCase();
  if (!query) return [];

  return PRODUCTS_DB.filter((product) =>
    product.name.toLowerCase().startsWith(query)
  ).slice(0, 8);
}, [searchQuery]);

    const handleSearch = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
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

const [activeTab, setActiveTab] = useState(platformFeatures[0]);

const scrollCategoryRow = (category, direction) => {
  const container = rowRefs.current[category];
  if (container) {
    const scrollAmount = direction === 'left' ? -520 : 520;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

// Navigation fluide vers la ligne de la catégorie cliquée
const handleCategoryClick = (category) => {
  setSelectedCategory(category);
  if (category === 'Tout' || category === 'Toutes') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const targetElement = categorySectionRefs.current[category];
  if (targetElement) {
    // Décalage de 130px pour ne pas masquer le titre sous la barre sticky
    const yOffset = -130;
    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

const basinsSliderRef = useRef(null);


  return (
<div className="bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 ">

      {/* 1. SECTION HERO PRINCIPALE : IMAGE ENTIÈRE SANS ZOOM */}
{/* 1. SECTION HERO PRINCIPALE : PLEIN ÉCRAN DESKTOP & IMAGE ENTIÈRE MOBILE */}
<section className="relative w-full bg-[#070a1d] md:min-h-[92vh] flex flex-col justify-between pt-[90px] md:pt-28 pb-10 md:pb-12 overflow-hidden">
  
  {/* Image d'arrière-plan : ratio naturel sans bande noire sur mobile, plein écran sur desktop */}
  <div className="relative md:absolute md:inset-0 w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-auto pointer-events-none">
    <img
     src={background4}
    alt="Valorisons nos produits locaux en RDC"
    className="w-full h-full object-cover object-center opacity-95 select-none"
    />
    {/* Dégradé de transition fluide vers le bleu nuit #070a1d */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#070a1d]" />
  </div>

  {/* HAUT DE LA SECTION : Badge discret (desktop) */}
  <div className="hidden md:block relative z-10 max-w-5xl mx-auto text-center px-6">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/45 backdrop-blur-md border border-white/25 text-white text-xs font-bold uppercase tracking-wider shadow-sm"
    >
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      <span>
        {buyerMode === 'B2B'
          ? 'Espace Pro : Approvisionnement en gros (Hôtels & Supermarchés)'
          : 'Le Hub B2C & B2B du Made in RDC 🇨🇩'}
      </span>
    </motion.div>
  </div>

    {/* BAS DE LA SECTION : Recherche au centre + Bassins Blur en bas */}
  <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4 sm:px-6 -mt-5 sm:-mt-8 md:mt-auto md:pt-24 lg:pt-32">
    
    {/* BARRE DE RECHERCHE RAPIDE TRANSPARENTE & BLUR + AUTOCOMPLÉTION PRODUCTS_DB */}
    <div className="hidden lg:block relative max-w-2xl mx-auto lg:my-16">
            <form
        onSubmit={(e) => {
          setShowSuggestions(false);
          handleSearch(e);
        }}
        className="bg-slate-900/70 md:bg-white/15 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-white/25 flex flex-col sm:flex-row gap-1.5 items-center"
      >
        {/* Champ texte (text-[16px] empêche le zoom sur mobile) */}
        <div className="w-full flex-1 flex items-center px-3 py-1.5 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/20">
          <input
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder={
              buyerMode === 'B2B'
                ? 'Ex: Maïs, café du Kivu...'
                : 'Tapez une lettre (ex: M, C, H...)'
            }
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setShowSuggestions(false);
                e.currentTarget.blur();
                handleSearch(e);
              }
            }}
            className="w-full bg-transparent text-white placeholder-white/85 focus:outline-none text-[16px] md:text-sm leading-normal drop-shadow-sm [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        {/* Province + Bouton Icône */}
        <div className="w-full sm:w-auto flex items-center justify-between gap-2 pl-3 pr-1 py-1 sm:py-0">
          <div className="flex items-center flex-1 sm:w-44">
            <FaMapMarkerAlt className="text-amber-400 mr-2 shrink-0 text-sm" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none cursor-pointer text-[16px] md:text-sm font-semibold truncate drop-shadow-sm"
            >
              <option value="" className="text-slate-900 bg-white">
                Toutes provinces
              </option>
              {provinces.map((prov) => (
                <option key={prov} value={prov} className="text-slate-900 bg-white">
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton Icône de recherche */}
          <button
            type="submit"
            aria-label="Rechercher"
            title="Rechercher"
            className="p-3 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white rounded-xl shadow-md shadow-sky-500/30 transition shrink-0 flex items-center justify-center"
          >
            <FaSearch className="text-sm" />
          </button>
        </div>
      </form>


      {/* MENU DÉROULANT CONNECTÉ À PRODUCTS_DB */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-slate-950/90 backdrop-blur-xl border border-white/25 rounded-2xl shadow-2xl overflow-hidden z-30 text-left divide-y divide-white/10 max-h-80 overflow-y-auto">
          {filteredSuggestions.map((item) => {
            const displayPrice = buyerMode === 'B2B' ? item.priceB2B : item.priceB2C;
            const displayUnit = buyerMode === 'B2B' ? item.unitB2B : item.unitB2C;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchQuery(item.name);
                    setShowSuggestions(false);
                    navigate(`/produit/${item.id}`);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm text-white hover:bg-white/15 flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0"
                      />
                    ) : (
                      <FaSearch className="text-amber-400 text-xs shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="truncate font-medium">
                        <strong className="text-amber-300 font-bold">
                          {item.name.slice(0, searchQuery.trim().length)}
                        </strong>
                        {item.name.slice(searchQuery.trim().length)}
                      </p>
                      {item.province && (
                        <p className="text-[11px] text-slate-300 truncate">
                          {item.province} {item.supplier ? `• ${item.supplier}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {displayPrice && (
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-bold text-emerald-400 whitespace-nowrap">
                        {formatPrice(displayPrice)}
                      </span>
                      {displayUnit && (
                        <span className="block text-[10px] text-slate-400 whitespace-nowrap">
                          {displayUnit}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>

    {/* FILTRAGE RAPIDE PAR PROVINCE EN BLUR TRANSPARENT */}
    {/* <div className="mt-6">
      <p className="text-xs text-white/90 uppercase tracking-widest font-bold mb-2.5 px-4 md:px-0 md:text-center drop-shadow">
        Filtrer par bassin de production :
      </p>

      <div className="flex flex-nowrap items-center justify-start gap-2 overflow-x-auto px-2 pb-2 max-w-3xl md:max-w-5xl mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => handleProvinceClick('ALL')}
          className="shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-bold rounded-full bg-amber-400/90 backdrop-blur-md border border-amber-300/60 text-slate-900 shadow-sm transition"
        >
          Toutes
        </button>

        {provinces.map((province) => (
          <button
            key={province}
            type="button"
            onClick={() => handleProvinceClick(province)}
            className="shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/15 hover:bg-amber-400/90 backdrop-blur-md border border-white/25 hover:border-amber-300 text-white hover:text-slate-900 shadow-sm transition"
          >
            {province}
          </button>
        ))}
      </div>
    </div> */}

    {/* BOUTONS D'ACTION PRINCIPAUX ALIGNÉS EN UNE SEULE LIGNE */}
        {/* BOUTONS D'ACTION PRINCIPAUX ALIGNÉS EN UNE SEULE LIGNE (MASQUÉS SUR MOBILE) */}
    <div className="hidden lg:flex lg:flex-nowrap mt-6 justify-center items-center gap-4 max-w-xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/catalogue')}
        className="w-full sm:w-auto px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition whitespace-nowrap"
      >
        <span className="truncate">Explorer le catalogue</span>
        <FaArrowRight className="shrink-0" />
      </button>

      <button
        type="button"
        onClick={() => navigate('/devenir-fournisseur')}
        className="w-full sm:w-auto px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border-2 border-sky-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition whitespace-nowrap"
      >
        <FaStore className="text-sky-300 shrink-0" />
        <span className="truncate">Devenir Fournisseur</span>
      </button>
    </div>

  </div>
</section>

            {/* 2. GARANTIES POUR LA RDC */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12">
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
      </section> */}

     
       {/* 3. PRODUITS LOCAUX VEDETTES */}
  <section
    ref={productsSectionRef}
    className="relative max-w-7xl mx-auto px-4 py-8 pt-5 border-b border-gray-200 dark:border-gray-800"
  >
    {/* En-tête principal */}
    <div className="mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
        Sélection Vérifiée • {displayCategories.length} Filières Locales
      </span>
      <h2 className="text-2xl sm:text-3xl font-black mt-0.5 text-slate-900 dark:text-white">
        {buyerMode === 'B2B' ? 'Offres en Gros & Approvisionnement' : 'Produits Locaux Populaires'}
      </h2>
    </div>

    {/* 🧭 CONTENEUR REPÈRE + BARRE DE NAVIGATION FIXED CONTEXTUELLE */}
    <div ref={categoryBarRef} className="min-h-[58px] mb-6">
      <div
        className={
          'py-3 bg-white/95 dark:bg-[#0a0e27]/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 transition-colors ' +
          (isCategoryBarFixed
            ? 'fixed top-20 left-0 right-0 z-40 px-4 sm:px-8 shadow-md'
            : 'relative -mx-4 px-4 shadow-sm')
        }
      >
        <div className={isCategoryBarFixed ? 'max-w-7xl mx-auto' : ''}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* FILTRES CATÉGORIES */}
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {displayCategories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={
                      'shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-bold rounded-full transition border ' +
                      (isActive
                        ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-[#131936] text-slate-700 dark:text-gray-300 border-slate-200/60 dark:border-gray-800 hover:border-sky-400')
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* SÉLECTEUR B2C / B2B */}
            {setBuyerMode && (
              <div className="flex items-center self-start md:self-auto shrink-0 gap-1 bg-slate-100 dark:bg-[#131936] p-1 rounded-xl border border-slate-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setBuyerMode('B2C')}
                  className={
                    'px-3 py-1 rounded-lg text-xs font-bold transition ' +
                    (buyerMode === 'B2C'
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white')
                  }
                >
                  Détail (B2C)
                </button>
                <button
                  type="button"
                  onClick={() => setBuyerMode('B2B')}
                  className={
                    'px-3 py-1 rounded-lg text-xs font-bold transition ' +
                    (buyerMode === 'B2B'
                      ? 'bg-amber-400 text-slate-900 shadow'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white')
                  }
                >
                  Gros (B2B)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* 📚 LES LIGNES PAR CATÉGORIE */}
    <div className="space-y-8">
      {displayCategories.map((category, index) => {
        const categoryProducts = (PRODUCTS_DB || []).filter(
          (p) => p.categoryLabel === category
        );

        if (categoryProducts.length === 0) return null;

        return (
          <div
            key={category}
            ref={(el) => (categorySectionRefs.current[category] = el)}
            className="scroll-mt-36"
          >
            {/* En-tête de la ligne catégorie */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-black">
                  {index + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {category}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#131936] text-slate-500 dark:text-gray-400">
                  {categoryProducts.length}
                </span>
              </div>

              {/* Boutons de défilement gauche/droite */}
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCategoryRow(category, 'left')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] hover:bg-sky-500 hover:text-white text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition"
                  aria-label={`Précédent ${category}`}
                >
                  <FaChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategoryRow(category, 'right')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#131936] hover:bg-sky-500 hover:text-white text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition"
                  aria-label={`Suivant ${category}`}
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* CARROUSEL DE PRODUITS */}
            <div
              ref={(el) => (rowRefs.current[category] = el)}
              className="flex flex-nowrap gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {categoryProducts.map((product) => {
                const activePrice = buyerMode === 'B2B' ? product.priceB2B : product.priceB2C;
                const activeUnit = buyerMode === 'B2B' ? product.unitB2B : product.unitB2C;

                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -3 }}
                    className="w-[230px] sm:w-[255px] shrink-0 snap-start bg-white dark:bg-[#131936] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 dark:border-gray-800 flex flex-col justify-between transition"
                  >
                    <div>
                      {/* Image compacte */}
                      <div
                        onClick={() => navigate('/produit/' + product.id)}
                        className="relative h-36 overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                      >
                        <img
                          src={getProductImage(product.id)}
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

                      {/* Contenu */}
                      <div className="p-3">
                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
                          {product.categoryLabel}
                        </span>
                        <h4
                          onClick={() => navigate('/produit/' + product.id)}
                          className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5 cursor-pointer hover:text-sky-500 transition"
                        >
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {product.supplier}
                        </p>
                      </div>
                    </div>

                    {/* Pied de carte : Prix dynamique */}
                    <div className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {activePrice} $
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 block">
                          / {activeUnit}
                        </span>
                      </div>
                                            <button
                        type="button"
                        onClick={() => navigate('/produit/' + product.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-600 hover:text-white dark:text-sky-400 dark:hover:text-white text-xs font-bold transition"
                      >
                        Voir
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </section>


      {/* SECTION : EXPLORATION PAR BASSIN DE PRODUCTION */}
{/* <section className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-200 dark:border-gray-800"> */}
  {/* En-tête avec boutons de navigation Desktop */}
  {/* <div className="flex justify-between items-end mb-5">
    <div>
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
        Carte Économique RDC
      </span>
      <h2 className="hidden sm:block text-2xl sm:text-3xl font-black mt-0.5">
  Explorer par Bassin de Production
</h2>
    </div> */}

    {/* Flèches de défilement (Desktop uniquement) */}
    {/* <div className="hidden md:flex items-center gap-1.5">
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
  </div> */}

  {/* CARROUSEL SUR UNE SEULE LIGNE (Mobile & Desktop) */}
  {/* <div
    ref={basinsSliderRef}
    className="flex flex-nowrap gap-3.5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
  >
    {basins.map((prov) => (
      <div
        key={prov.name}
        onClick={() => handleProvinceClick(prov.name)}
        className="w-[245px] sm:w-[270px] shrink-0 snap-start cursor-pointer bg-white dark:bg-[#131936] p-4 rounded-2xl border border-slate-200 dark:border-gray-800 hover:border-sky-500 dark:hover:border-sky-400 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
      >
        <div> */}
          {/* Ligne du haut : Icône + Badge Fournisseurs */}
          {/* <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition">
              <FaLeaf className="text-sm" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/20">
              {prov.count}
            </span>
          </div> */}

          {/* Nom de la province + Catégorie dominante */}
          {/* <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-sky-500 transition flex items-center justify-between">
            {prov.name}
            <FaArrowRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sky-500" />
          </h3> */}

          {/* Spécialités (limité à 2 lignes max pour garder une hauteur uniforme) */}
          {/* <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {prov.specialty}
          </p>
        </div> */}

        {/* Pied de carte : Villes clés (Hubs) */}
        {/* {prov.hubs && (
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
</section> */}

           {/* 5. BANNIÈRE APPELS D'OFFRES B2B (Compacte & Moderne) */}
{/* <section className="max-w-7xl mx-auto px-4 py-6">
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-5 sm:p-7 shadow-lg border border-sky-400/20">
     */}
    {/* Effet lumineux subtil en arrière-plan */}
    {/* <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5"> */}
      
      {/* Partie Gauche : Ruban défilant des cibles + Titre court */}
      {/* <div className="max-w-2xl"> */}
        {/* Mini-carrousel / Ruban défilant sur 1 ligne */}
        {/* <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
      </div> */}

      {/* Partie Droite : Bouton d'action compact */}
      {/* <div className="shrink-0">
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
</section> */}

{/* SECTION : FONCTIONNALITÉS AVANCÉES (ONGLETS INTERACTIFS) */}
{/* <section className="max-w-7xl mx-auto px-4 py-8 lg:py-10 border-b border-gray-200 dark:border-gray-800"> */}
  {/* En-tête de section */}
  {/* <div className="max-w-2xl mb-5 lg:mb-6">
    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
      Fonctionnalités Avancées
    </span>
    <h2 className="hidden sm:block sm:text-2xl lg:text-3xl font-black mt-0.5 text-slate-900 dark:text-white">
      Explorez Nos Services Innovants
    </h2>
    <p className="hidden sm:block sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
      Des outils pensés pour sécuriser vos achats, fluidifier la logistique et développer votre activité en RDC.
    </p>
  </div> */}

  {/* Grille Principale : Onglets à Gauche (5 col) | Aperçu à Droite (7 col) */}
  {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
     */}
    {/* COLONNE GAUCHE : 3 onglets en 1 seule ligne sur mobile (grid-cols-3), empilés sur desktop */}
    {/* <div className="lg:col-span-5 grid grid-cols-3 lg:flex lg:flex-col gap-2 lg:gap-3">
      {platformFeatures.map((feat) => {
        const Icon = feat.icon;
        const isSelected = activeTab.id === feat.id;

        return (
          <button
            key={feat.id}
            type="button"
            onClick={() => setActiveTab(feat)}
            className={
              'p-2.5 sm:p-3 lg:p-3.5 rounded-xl lg:rounded-2xl border transition-all duration-200 flex flex-col lg:flex-row items-center lg:items-center text-center lg:text-left gap-1.5 lg:gap-3.5 cursor-pointer ' +
              (isSelected
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                : 'bg-white dark:bg-[#131936] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:border-sky-400')
            }
          >
            <div
              className={
                'w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0 transition ' +
                (isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-sky-50 dark:bg-[#0a0e27] text-sky-500')
              }
            >
              <Icon className="text-sm lg:text-lg" />
            </div>

            <div className="min-w-0 w-full">
              <span
                className={
                  'hidden lg:block text-[10px] font-bold uppercase tracking-wider ' +
                  (isSelected ? 'text-sky-100' : 'text-amber-500')
                }
              >
                {feat.badge}
              </span>
              <span className="font-bold text-[11px] sm:text-xs lg:text-sm leading-tight line-clamp-2 lg:line-clamp-none block">
                {feat.tabTitle}
              </span>
            </div>
          </button>
        );
      })}
    </div> */}

    {/* COLONNE DROITE : Panneau de visualisation dynamique (compact sur mobile, complet à l'écran sur desktop) */}
    {/* <div className="lg:col-span-7 bg-white dark:bg-[#131936] rounded-2xl lg:rounded-3xl border border-slate-200 dark:border-gray-800 p-4 sm:p-5 lg:p-6 shadow-sm flex flex-col justify-between">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col justify-between h-full gap-3.5 lg:gap-4"
        > */}
          {/* Détails du service */}
          {/* <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[11px] font-bold mb-2">
              <activeTab.icon size={11} /> {activeTab.badge}
            </div>

            <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white leading-snug">
              {activeTab.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed">
              {activeTab.description}
            </p> */}

            {/* Liste des avantages */}
            {/* <ul className="mt-2.5 lg:mt-3 space-y-1.5">
              {activeTab.highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-gray-200 font-medium"
                >
                  <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={13} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Mini-aperçu visuel (Simule l'interface réelle de l'application) */}
          {/* <div className="rounded-xl lg:rounded-2xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200/80 dark:border-gray-800 p-3 lg:p-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1.5 truncate">
                <FaMobileAlt className="text-sky-500 shrink-0" />
                <span className="truncate">{activeTab.preview.header}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                <FaLock size={8} /> {activeTab.preview.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <div>
                <div className="text-xs sm:text-sm lg:text-base font-black text-slate-900 dark:text-white">
                  {activeTab.preview.amount}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  {activeTab.preview.supplier}
                </div>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-[#131936] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 self-start sm:self-center">
                {activeTab.preview.method}
              </div>
            </div>
          </div> */}

          {/* Bouton d'action */}
          {/* <div>
            <button
              type="button"
              onClick={() => navigate(activeTab.ctaLink)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400 hover:text-amber-500 transition cursor-pointer"
            >
              <span>{activeTab.ctaText}</span>
              <FaArrowRight size={11} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

  </div>
</section> */}
    </div>
  );
}