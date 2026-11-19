// src/data/productsData.js
// Base de données centralisée (prête à être remplacée ou synchronisée avec Supabase)
// 1. Vite scanne automatiquement toutes les images du dossier src/assets/
const assetModules = import.meta.glob('../assets/*.{jpeg,jpg,png,webp,avif}', { eager: true });

// 2. Récupère l'image par défaut (prod1)
const fallbackImage =
  assetModules['../assets/prod1.jpeg']?.default ||
  assetModules['../assets/prod1.jpg']?.default ||
  assetModules['../assets/prod1.png']?.default ||
  assetModules['../assets/prod1.webp']?.default ||
  '';

// 3. Fonction automatique : cherche "prod{id}" (ex: prod2.jpeg) et bascule sur prod1.jpeg si absent
export const getProductImage = (id) => {
  const extensions = ['jpeg', 'jpg', 'png', 'webp', 'avif'];
  for (const ext of extensions) {
    const path = `../assets/prod${id}.${ext}`;
    if (assetModules[path]?.default) {
      return assetModules[path].default;
    }
  }
  return fallbackImage;
};


const INITIAL_PRODUCTS = [
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
    images: ['https://unsplash.com']
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
    images: ['https://unsplash.com']
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
    images: ['https://unsplash.com']
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
    images: ['https://unsplash.com']
  }
];

// 96 produits locaux supplémentaires (IDs 5 à 100) pour atteindre exactement 100 produits locaux RDC
const EXTRA_RDC_CATALOG = [
  ['Huile de Palme Rouge Raffinée', 'Agro-alimentaire transformé', 'Équateur', 'Lisala', 'Palmeraies du Fleuve', 18, 14, 'Bidon 20L'],
  ['Farine de Maïs Jaune Supérieure', 'Agriculture & Vivres', 'Haut-Katanga', 'Lubumbashi', 'Minoterie du Katanga', 22, 17.5, 'Sac 25kg'],
  ['Haricots Rouges du Kivu', 'Agriculture & Vivres', 'Nord-Kivu', 'Rutshuru', 'Coopérative Virunga', 28, 23, 'Sac 50kg'],
  ['Cacao Fermenté en Fèves (Grade A)', 'Agriculture & Vivres', 'Nord-Kivu', 'Beni', 'Esco Kivu Bio', 65, 55, 'Sac 50kg'],
  ['Arachides Décortiquées Rouges', 'Agriculture & Vivres', 'Kasaï-Central', 'Kananga', 'Agri-Kasaï', 24, 19, 'Sac 25kg'],
  ['Riz Blanc Local de Bumba', 'Agriculture & Vivres', 'Mongala', 'Bumba', 'Rizières de la Mongala', 26, 21, 'Sac 25kg'],
  ['Thé Noir Orthodoxe du Kivu', 'Agro-alimentaire transformé', 'Nord-Kivu', 'Masisi', 'Plantations Pfunda-Kivu', 10, 7.5, 'Boîte 1kg'],
  ['Poissons Salés (Makayabu du Fleuve)', 'Agriculture & Vivres', 'Maï-Ndombe', 'Inongo', 'Pêcheries du Lac', 35, 29, 'Carton 15kg'],
  ['Piment Pili-Pili Séché en Poudre', 'Agro-alimentaire transformé', 'Kongo-Central', 'Matadi', 'Épices du Bas-Fleuve', 9, 6.5, 'Pot 1kg'],
  ['Beurre de Karité Brut Pur', 'Agro-alimentaire transformé', 'Ituri', 'Bunia', 'Femmes de l’Ituri', 14, 10.5, 'Pot 1kg'],
  ['Pagne Wax Hollandais/Congolais Sotexki', 'Textiles & Mode', 'Tshopo', 'Kisangani', 'Atelier Textile Boyoma', 20, 15, 'Pièce 6 yards'],
  ['Tissu Raphia Kuba Brodé', 'Textiles & Mode', 'Kasaï', 'Mweka', 'Artisans Royaux Kuba', 45, 36, 'Pièce unique'],
  ['Bananes Plantains Fraîches (Régime)', 'Agriculture & Vivres', 'Kongo-Central', 'Lukula', 'Coopérative Mayombe', 12, 9, 'Régime 20kg'],
  ['Soja en Grains Triés', 'Agriculture & Vivres', 'Sud-Kivu', 'Uvira', 'Agri-Ruzizi', 21, 16.5, 'Sac 50kg'],
  ['Chikwangue Emballée Sous Vide', 'Agro-alimentaire transformé', 'Kinshasa', 'N’sele', 'Saveurs de Kin', 15, 11, 'Lot de 20 pièces'],
  ['Jus Naturel de Gingembre & Ananas', 'Agro-alimentaire transformé', 'Kinshasa', 'Limete', 'TropiCongo Drinks', 12, 9, 'Pack 12 bouteilles'],
  ['Confiture de Mangue & Passion', 'Agro-alimentaire transformé', 'Kongo-Central', 'Kisantu', 'Vergers de l’Inkisi', 7, 5, 'Pot 500g'],
  ['Savon Noir Artisanal à l’Huile de Palmiste', 'Artisanat & Déco', 'Kinshasa', 'Ngaliema', 'Cosmétique Bantu', 6, 4.2, 'Lot de 6 pains'],
  ['Sculpture Masque Pende en Bois d’Ébène', 'Artisanat & Déco', 'Kwilu', 'Gungu', 'Sculpteurs du Kwilu', 55, 42, 'Pièce unique'],
  ['Charbon Écologique (Briquettes Bio)', 'Agro-alimentaire transformé', 'Kinshasa', 'Maluku', 'EcoEnergie RDC', 10, 7.5, 'Sac 25kg'],
  ['Huile de Palmiste Vierge', 'Agro-alimentaire transformé', 'Tshuapa', 'Boende', 'Huilerie Équatoriale', 19, 15, 'Bidon 20L'],
  ['Fèves de Vanille Bourbon du Kivu', 'Agriculture & Vivres', 'Nord-Kivu', 'Beni', 'Vanille des Volcans', 40, 32, 'Lot 250g'],
  ['Pommes de Terre de Masisi', 'Agriculture & Vivres', 'Nord-Kivu', 'Masisi', 'Coopérative des Montagnes', 18, 14, 'Sac 50kg'],
  ['Oignons Rouges Frais', 'Agriculture & Vivres', 'Nord-Kivu', 'Lubero', 'Maraîchers de Lubero', 22, 17, 'Sac 40kg'],
  ['Tomates Fraîches en Caisse', 'Agriculture & Vivres', 'Kongo-Central', 'Kasangulu', 'Serres du Kongo', 14, 10.5, 'Caisse 20kg'],
  ['Ananas Pain de Sucre Bio', 'Agriculture & Vivres', 'Kongo-Central', 'Boma', 'Fruitière de Boma', 16, 12, 'Carton 12 fruits'],
  ['Avocats Hass d’Exportation', 'Agriculture & Vivres', 'Sud-Kivu', 'Kabare', 'Vergers du Lac', 18, 13.5, 'Carton 10kg'],
  ['Farine de Soja Enrichie (Protéines)', 'Agro-alimentaire transformé', 'Haut-Katanga', 'Likasi', 'NutriKatanga', 16, 12.5, 'Sac 10kg'],
  ['Pâte d’Arachide Grillée (Mwamba)', 'Agro-alimentaire transformé', 'Kasaï-Oriental', 'Mbuji-Mayi', 'Délice du Kasaï', 8, 6, 'Pot 1kg'],
  ['Poisson Fumé (Mbisi ya Kaukisa)', 'Agro-alimentaire transformé', 'Équateur', 'Mbandaka', 'Fumoirs du Congo', 38, 31, 'Carton 10kg'],
  ['Chenilles Séchées (Mbinzo)', 'Agriculture & Vivres', 'Kwango', 'Kenge', 'Coopérative Kwango', 25, 20, 'Sac 5kg'],
  ['Champignons Séchés de Forêt', 'Agriculture & Vivres', 'Tshopo', 'Yangambi', 'Cueillette Forestière', 20, 15, 'Sachet 2kg'],
  ['Vin de Palme Pasteurisé (Nsamba)', 'Agro-alimentaire transformé', 'Kongo-Central', 'Tshela', 'Caves du Mayombe', 14, 10, 'Pack 6 bouteilles'],
  ['Sirop d’Hibiscus (Bissap Pur)', 'Agro-alimentaire transformé', 'Kinshasa', 'Gombe', 'Nectar RDC', 10, 7.5, 'Pack 6 bouteilles'],
  ['Curcuma Frais & Moulu', 'Agro-alimentaire transformé', 'Kongo-Central', 'Songololo', 'Épices Naturelles', 9, 6.8, 'Sachet 1kg'],
  ['Gingembre Frais Lavé', 'Agriculture & Vivres', 'Kongo-Central', 'Madimba', 'Ferme Agro-Bio', 15, 11.5, 'Sac 25kg'],
  ['Noix de Coco Fraîches', 'Agriculture & Vivres', 'Kongo-Central', 'Muanda', 'Cocoteraies de la Côte', 14, 10.5, 'Sac 30 pièces'],
  ['Huile Vierge de Noix de Coco', 'Agro-alimentaire transformé', 'Kongo-Central', 'Muanda', 'BioCoco RDC', 16, 12, 'Bidon 5L'],
  ['Sucre Roux de Canne de Kwilu-Ngongo', 'Agro-alimentaire transformé', 'Kongo-Central', 'Kwilu-Ngongo', 'Sucrerie Locale', 32, 27, 'Sac 50kg'],
  ['Sel Iodé Marin Raffiné', 'Agro-alimentaire transformé', 'Kongo-Central', 'Matadi', 'Salines de l’Atlantique', 12, 9.5, 'Sac 25kg'],
  ['Lait Frais Pasteurisé & Yaourt', 'Agro-alimentaire transformé', 'Nord-Kivu', 'Goma', 'Laiterie des Volcans', 15, 11.5, 'Caisse 12L'],
  ['Fromage Gouda Artisanal de Goma', 'Agro-alimentaire transformé', 'Nord-Kivu', 'Goma', 'Fromagerie du Kivu', 22, 17, 'Meule 2kg'],
['Œufs Frais de Ferme (Plateau)', 'Agriculture & Vivres', 'Kinshasa', 'Mont-Ngafula', 'Aviculture Moderne Kin', 6.5, 5.2, 'Plateau 30 œufs'],
['Poulet de Chair Fermier Surgelé', 'Agriculture & Vivres', 'Haut-Katanga', 'Lubumbashi', 'Fermes Avicoles Sud', 34, 28, 'Carton 10 poulets'],
['Bœuf Séché Épicé (Kilishi)', 'Agro-alimentaire transformé', 'Ituri', 'Mahagi', 'Boucherie de l’Ituri', 24, 19, 'Sachet 2kg'],
['Robe Moderne en Pagne & Bogolan', 'Textiles & Mode', 'Kinshasa', 'Bandalungwa', 'Maison Couture Kin', 35, 26, 'Pièce'],
['Chemise Homme Col Mao en Lin & Raphia', 'Textiles & Mode', 'Kinshasa', 'Lingwala', 'Style Congo', 28, 21, 'Pièce'],
['Sac à Main Cuir & Tissage Kuba', 'Textiles & Mode', 'Kinshasa', 'Gombe', 'Maroquinerie Bantu', 42, 33, 'Pièce'],
['Sandales Artisanales en Cuir Tanné', 'Textiles & Mode', 'Sud-Kivu', 'Bukavu', 'Cordonnerie du Lac', 25, 19, 'Paire'],
['Collier Perles Traditionnelles & Cuivre', 'Artisanat & Déco', 'Haut-Katanga', 'Lubumbashi', 'Bijoux du Cuivre', 18, 13, 'Lot de 5'],
['Bracelet en Cuivre Massif Gravé', 'Artisanat & Déco', 'Lualaba', 'Kolwezi', 'Artisans du Lualaba', 15, 11, 'Pièce'],
['Tableau Peinture Populaire Kinoise', 'Artisanat & Déco', 'Kinshasa', 'Matete', 'Collectif Peintres Kin', 60, 45, 'Toile 80x60cm'],
['Fauteuil en Rotin Tressé Main', 'Artisanat & Déco', 'Tshopo', 'Kisangani', 'Vannerie Boyoma', 75, 58, 'Pièce'],
['Table Basse en Bois de Wenge', 'Artisanat & Déco', 'Mai-Ndombe', 'Kutu', 'Menuiserie Ébéniste', 120, 95, 'Pièce'],
['Statuette en Malachite Polie', 'Artisanat & Déco', 'Haut-Katanga', 'Likasi', 'Pierres du Katanga', 35, 26, 'Pièce'],
['Nappe de Table Brodée à la Main', 'Artisanat & Déco', 'Kasaï-Central', 'Kananga', 'Broderie Kasaïenne', 22, 16, 'Pièce'],
['Coussin Décoratif Velours du Kasaï', 'Artisanat & Déco', 'Kasaï', 'Luebo', 'Déco Tradition RDC', 19, 14, 'Lot de 2'],
['Tapis Tressé en Fibres de Sisal', 'Artisanat & Déco', 'Tanganyika', 'Kalemie', 'Artisanat Tanganyika', 48, 37, 'Tapis 200x150cm'],
['Poterie en Argile Cuite (Jarre)', 'Artisanat & Déco', 'Kongo-Central', 'Mbanza-Ngungu', 'Potiers du Kongo', 16, 12, 'Pièce'],
['Lotion Hydratante au Beurre de Cacao', 'Agro-alimentaire transformé', 'Kinshasa', 'Kintambo', 'Natura Congo', 11, 8, 'Flacon 500ml'],
['Huile Capillaire Ricin & Moringa', 'Agro-alimentaire transformé', 'Kinshasa', 'Lemba', 'AfroCare RDC', 9, 6.5, 'Flacon 250ml'],
['Poudre de Feuilles de Moringa Bio', 'Agro-alimentaire transformé', 'Kongo-Central', 'Inkisi', 'PhytoRDC', 12, 9, 'Sachet 500g'],
['Tisane Artemisia Annua Séchée', 'Agro-alimentaire transformé', 'Nord-Kivu', 'Butembo', 'Maison Artemisia Kivu', 10, 7.5, 'Sachet 250g'],
['Huile Essentielle d’Eucalyptus Citronné', 'Agro-alimentaire transformé', 'Sud-Kivu', 'Kabare', 'Distillerie du Kivu', 18, 14, 'Flacon 100ml'],
['Cire d’Abeille Pure Filtrée', 'Agriculture & Vivres', 'Équateur', 'Bikoro', 'Apiculture Équateur', 14, 10.5, 'Bloc 1kg'],
['Noix de Cajou Grillées & Salées', 'Agro-alimentaire transformé', 'Kwango', 'Popokabaka', 'Cajou du Kwango', 16, 12.5, 'Sachet 1kg'],
['Noix de Macadamia du Kivu', 'Agriculture & Vivres', 'Nord-Kivu', 'Beni', 'Vergers Macadamia', 24, 19, 'Sachet 1kg'],
['Poivre Noir Sauvage de Voatsiperifery RDC', 'Agro-alimentaire transformé', 'Tshopo', 'Isangi', 'Épices Forestières', 18, 13.5, 'Sachet 500g'],
['Gousses de Cardamome Verte', 'Agriculture & Vivres', 'Sud-Kivu', 'Idjwi', 'Île d’Idjwi Bio', 22, 17, 'Sachet 500g'],
['Sorgho Rouge en Grains', 'Agriculture & Vivres', 'Tanganyika', 'Kongolo', 'Céréales du Sud', 19, 15, 'Sac 50kg'],
['Millet (Petit Mil) Décortiqué', 'Agriculture & Vivres', 'Lomami', 'Kabinda', 'Fermes de Lomami', 21, 16.5, 'Sac 50kg'],
['Sésame Blanc Nettoye', 'Agriculture & Vivres', 'Bas-Uele', 'Buta', 'Coopérative Uele', 30, 24, 'Sac 50kg'],
['Graines de Courge Décortiquées', 'Agriculture & Vivres', 'Maniema', 'Kindu', 'Agri-Maniema', 26, 21, 'Sac 25kg'],
['Niébé (Haricot Blanc Local)', 'Agriculture & Vivres', 'Sankuru', 'Lodja', 'Grenier du Sankuru', 23, 18, 'Sac 50kg'],
['Maïs Blanc Grain Entier', 'Agriculture & Vivres', 'Lualaba', 'Dilolo', 'Coopérative Maïs Sud', 18, 14, 'Sac 50kg'],
['Farine de Banane Plantain Sans Gluten', 'Agro-alimentaire transformé', 'Kongo-Central', 'Lukula', 'NutriMayombe', 14, 10.5, 'Sac 10kg'],
['Chips de Banane Plantain Croustillantes', 'Agro-alimentaire transformé', 'Kinshasa', 'Masina', 'SnackCongo', 10, 7.5, 'Carton 24 sachets'],
['Biscuits Secs au Manioc & Vanille', 'Agro-alimentaire transformé', 'Kinshasa', 'Limete', 'Biscuiterie Locale', 12, 9, 'Carton 20 paquets'],
['Chocolat Noir 75% Cacao Virunga', 'Agro-alimentaire transformé', 'Nord-Kivu', 'Goma', 'Chocolaterie Virunga', 15, 11.5, 'Lot de 5 tablettes'],
['Pâte de Cacao Pure Non Sucrée', 'Agro-alimentaire transformé', 'Nord-Kivu', 'Beni', 'Cacao Transform RDC', 20, 15.5, 'Bloc 2kg'],
['Café Robusta Corsé de l’Uele', 'Agro-alimentaire transformé', 'Haut-Uele', 'Isiro', 'Caféiers de l’Uele', 11, 8.5, 'Sac 5kg'],
['Nectar de Corossol Naturel', 'Agro-alimentaire transformé', 'Kinshasa', 'Ngaba', 'Fruits du Fleuve', 13, 9.5, 'Pack 12 bouteilles'],
['Vinaigre de Banane Artisanal', 'Agro-alimentaire transformé', 'Sud-Kivu', 'Uvira', 'Fermentation Bio', 8, 6, 'Pack 6 bouteilles'],
['Sauce Piquante Verte (Pili-Pili & Ail)', 'Agro-alimentaire transformé', 'Kinshasa', 'Kalamu', 'Saveurs piquantes', 9, 6.8, 'Pack 12 pots'],
['Bouillon Culinaire Naturel aux Légumes', 'Agro-alimentaire transformé', 'Kinshasa', 'Limete', 'Cuisine Saine RDC', 11, 8.5, 'Boîte 100 cubes'],
['Tomates Séchées à l’Huile d’Arachide', 'Agro-alimentaire transformé', 'Nord-Kivu', 'Goma', 'Conserverie du Lac', 12, 9, 'Pot 1kg'],
['Miel Blanc d’Acacia des Plateaux', 'Agriculture & Vivres', 'Kwango', 'Kahemba', 'Ruchers des Plateaux', 11, 8.5, 'Pot 1kg'],
['Propolis Brute Purifiée', 'Agriculture & Vivres', 'Sud-Kivu', 'Kalehe', 'Apithérapie Kivu', 25, 19, 'Sachet 250g'],
['Aloe Vera Gel Pur Stabilisé', 'Agro-alimentaire transformé', 'Kongo-Central', 'Kisantu', 'Botanique RDC', 10, 7.5, 'Flacon 500ml'],
['Savon Liquide Vaisselle Citronnelle', 'Agro-alimentaire transformé', 'Kinshasa', 'Limete', 'CleanCongo', 8, 6, 'Bidon 5L'],
['Sac Cabas Écologique en Toile de Jute', 'Textiles & Mode', 'Kinshasa', 'Gombe', 'EcoSac RDC', 12, 8.5, 'Lot de 10 sacs'],
['Chapeau Tressé en Fibres de Palmier', 'Textiles & Mode', 'Maï-Ndombe', 'Mushie', 'Chapellerie Locale', 14, 10, 'Pièce'],
['Corbeille à Linge en Osier Tressé', 'Artisanat & Déco', 'Équateur', 'Mbandaka', 'Artisans du Fleuve', 28, 21, 'Pièce'],
['Lustre Suspension en Bambou Naturel', 'Artisanat & Déco', 'Kongo-Central', 'Matadi', 'Design Bambou RDC', 35, 27, 'Pièce'],
['Mortier et Pilon en Bois Dur Sculpté', 'Artisanat & Déco', 'Tshopo', 'Kisangani', 'Artisanat Cuisine', 20, 15, 'Ensemble'],
['Djembé Traditionnel en Bois & Peau', 'Artisanat & Déco', 'Kasaï-Oriental', 'Mbuji-Mayi', 'Percussions Congo', 45, 35, 'Pièce']
];

// Dans BASE_PRODUCTS (IDs 1 à 4) :
const BASE_PRODUCTS = [
  {
    id: 1,
    name: 'Café Arabica du Kivu (Torréfié)',
    // ... vos autres propriétés ...
    images: [getProductImage(1)] // Charge prod1.jpeg
  },
  {
    id: 2,
    name: 'Miel Pur de Forêt Équatoriale',
    // ... vos autres propriétés ...
    images: [getProductImage(2)] // Charge prod1.jpeg maintenant, puis prod2.jpeg dès que vous l'ajoutez !
  },
  {
    id: 3,
    name: 'Panier Artisanal Tressé Raphia',
    // ... vos autres propriétés ...
    images: [getProductImage(3)]
  },
  {
    id: 4,
    name: 'Farine de Manioc Panifiable (Fufu)',
    // ... vos autres propriétés ...
    images: [getProductImage(4)]
  }
];

// À la ligne 268 de src/data/productsData.js :
const GENERATED_PRODUCTS = EXTRA_RDC_CATALOG.map((item, idx) => {
  const [name, categoryLabel, province, city, supplier, priceB2C, priceB2B, unitB2C, unitB2B] = item;
  const id = idx + 5; // IDs de 5 à 100

  return {
    id,
    name,
    categoryLabel,
    province,
    city,
    supplier,
    supplierRating: Number((4.6 + (idx % 4) * 0.1).toFixed(1)),
    supplierSales: 50 + idx * 6,
    verified: true,
    priceB2C,
    unitB2C,
    minQtyB2C: 1,
    priceB2B,
    unitB2B: unitB2B || `Lot Gros (${unitB2C})`,
    minQtyB2B: 5,
    stock: `${(idx % 12) + 2} Tonnes / Lots disponibles`,
    deliveryDelay: '24h à 72h selon la province',
    description: `${name} produit localement à ${city} (${province}) par ${supplier}. Sélectionné et contrôlé pour garantir une qualité optimale aux ménages, hôtels et distributeurs en République Démocratique du Congo.`,
    specs: [
      { label: 'Catégorie', value: categoryLabel },
      { label: 'Origine', value: `${city}, ${province}` },
      { label: 'Producteur', value: supplier },
      { label: 'Certification', value: '100% Produit Local RDC' }
    ],
    images: [getProductImage(id)]
  };
});

export const PRODUCTS_DB = [...INITIAL_PRODUCTS, ...GENERATED_PRODUCTS];
