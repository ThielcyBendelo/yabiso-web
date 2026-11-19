
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaFilter, FaMapMarkerAlt, FaCheckCircle,
  FaShoppingCart, FaFileInvoice, FaTimes, FaSortAmountDown, FaStore
} from 'react-icons/fa';
import { PRODUCTS_DB, getProductImage } from '../data/productsData';
import prod1 from '../assets/prod1.jpeg';

const getCategorySlug = (categoryLabel = '') => {
  const label = categoryLabel.toLowerCase();
  if (label.includes('agriculture') || label.includes('vivres')) return 'agriculture';
  if (label.includes('transform')) return 'transformation';
  if (label.includes('artisanat') || label.includes('déco')) return 'artisanat';
  if (label.includes('textile') || label.includes('mode')) return 'textiles';
  return 'autres';
};

export default function Catalogue({ buyerMode = 'B2C', setBuyerMode, currency = 'CDF' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'toutes');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('province') || 'Toutes');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const EXCHANGE_RATE = 2850;

  const categories = [
    { id: 'toutes', label: 'Toutes les catégories' },
    { id: 'agriculture', label: 'Agriculture & Vivres' },
    { id: 'transformation', label: 'Agro-alimentaire transformé' },
    { id: 'artisanat', label: 'Artisanat & Déco' },
    { id: 'textiles', label: 'Textiles & Mode' },
  ];

  const provinces = [
    'Toutes', 'Kinshasa', 'Kongo-Central', 'Nord-Kivu',
    'Sud-Kivu', 'Haut-Katanga', 'Équateur', 'Kasaï',
    'Kasaï-Central', 'Kasaï-Oriental', 'Tshopo', 'Ituri',
    'Kwilu', 'Kwango', 'Maï-Ndombe', 'Lualaba', 'Tanganyika'
  ];

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCat = searchParams.get('category');
    const urlProv = searchParams.get('province');
    if (urlSearch !== null) setSearchTerm(urlSearch);
    if (urlCat !== null) setSelectedCategory(urlCat);
    if (urlProv !== null) setSelectedProvince(urlProv);
  }, [searchParams]);

  const formatPrice = (usdAmount) => {
    if (currency === 'USD') return `${usdAmount.toFixed(2)} $`;
    return `${Math.round(usdAmount * EXCHANGE_RATE).toLocaleString('fr-FR')} FC`;
  };

  const catalogProducts = useMemo(() => {
    return PRODUCTS_DB.map((item) => {
      const assetImg = typeof getProductImage === 'function' ? getProductImage(item.id) : null;
      const dbImg = Array.isArray(item.images) ? item.images : item.image;
      return {
        ...item,
        category: item.category || getCategorySlug(item.categoryLabel),
        image: assetImg || dbImg || prod1
      };
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return catalogProducts
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.province.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === 'toutes' || item.category === selectedCategory;
        const matchesProvince =
          selectedProvince === 'Toutes' ||
          selectedProvince === '' ||
          item.province.toLowerCase() === selectedProvince.toLowerCase();
        const matchesVerified = !onlyVerified || item.verified;

        return matchesSearch && matchesCategory && matchesProvince && matchesVerified;
      })
      .sort((a, b) => {
        const priceA = buyerMode === 'B2B' ? a.priceB2B : a.priceB2C;
        const priceB = buyerMode === 'B2B' ? b.priceB2B : b.priceB2C;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        return 0;
      });
  }, [catalogProducts, searchTerm, selectedCategory, selectedProvince, onlyVerified, sortBy, buyerMode]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('toutes');
    setSelectedProvince('Toutes');
    setOnlyVerified(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a1d] text-gray-900 dark:text-gray-100 pb-16 ">
      
      {/* 1. SIDEBAR DES FILTRES COLLÉE AU COIN GAUCHE SOUS LA NAVBAR */}
      <aside className="hidden lg:block lg:fixed lg:left-0 lg:top-14 lg:bottom-0 lg:w-64 bg-white dark:bg-[#131936] border-r border-gray-200 dark:border-gray-800 z-30 overflow-y-auto [scrollbar-width:thin]">
        <div className="p-4 space-y-5 pb-20">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <FaFilter className="text-sky-500" /> Filtres
            </h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              Réinitialiser
            </button>
          </div>

          {/* Mot-clé */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Mot-clé</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: Café, Miel, Pagne..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Catégories */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Catégorie</label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-sky-500 text-white font-bold shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Province */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Province d'origine</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs font-medium focus:outline-none focus:border-sky-500"
            >
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov === 'Toutes' ? 'Toutes les provinces' : prov}
                </option>
              ))}
            </select>
          </div>

          {/* Fournisseur vérifié */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500"
              />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <FaCheckCircle className="text-sky-500 shrink-0" /> Fournisseurs vérifiés uniquement
              </span>
            </label>
          </div>
        </div>
      </aside>

      {/* 2. ZONE DE CONTENU À DROITE DE LA SIDEBAR */}
      <div className="w-full lg:pl-64">
        
        {/* En-tête du catalogue */}
        <div className="bg-gray-50 dark:bg-[#0b102b] border-b border-gray-200 dark:border-gray-800 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Catalogue Officiel Made in RDC 🇨🇩
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  {buyerMode === 'B2B' ? 'Approvisionnement en Gros (B2B)' : 'Marché des Produits Locaux (B2C)'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredProducts.length} produit(s) disponible(s) en direct des producteurs et artisans.
                </p>
              </div>

              {setBuyerMode && (
                <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#131936] border border-gray-200 dark:border-gray-700 shadow-sm self-start">
                  <button
                    type="button"
                    onClick={() => setBuyerMode('B2C')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      buyerMode === 'B2C'
                        ? 'bg-sky-500 text-white shadow'
                        : 'text-gray-600 dark:text-gray-300 hover:text-sky-500'
                    }`}
                  >
                    Particulier (Détail)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyerMode('B2B')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      buyerMode === 'B2B'
                        ? 'bg-amber-400 text-gray-900 shadow'
                        : 'text-gray-600 dark:text-gray-300 hover:text-amber-500'
                    }`}
                  >
                    Entreprise (Gros / Devis)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          
          {/* Bouton filtres mobile */}
          <div className="w-full mb-6 lg:hidden flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-[#131936] font-bold text-sm flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
            >
              <FaFilter className="text-sky-500" /> Filtrer les produits
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-[#131936] text-sm font-semibold border border-gray-200 dark:border-gray-700"
            >
              <option value="popular">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          {/* Zone résultats produits */}
          <main className="flex-1">
            {/* Barre de tri Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-6 bg-gray-50 dark:bg-[#131936] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Affichage en <strong className="text-gray-900 dark:text-white">{currency}</strong> • Tarifs{' '}
                <strong className="text-sky-600 dark:text-sky-400">{buyerMode}</strong>
              </div>
              <div className="flex items-center gap-2">
                <FaSortAmountDown className="text-gray-400 text-xs" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="popular">Popularité</option>
                  <option value="price-asc">Prix : Croissant</option>
                  <option value="price-desc">Prix : Décroissant</option>
                </select>
              </div>
            </div>

                        {/* Grille des produits : 1 ligne défilante sur mobile, 4 colonnes sur desktop */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-[#131936] rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 px-4">
                <FaStore className="mx-auto text-4xl text-gray-400 mb-3" />
                <h3 className="text-lg font-bold">Aucun produit ne correspond à votre recherche</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                  Essayez de modifier vos filtres ou publiez directement un appel d'offres pour que nos fournisseurs vous contactent.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm"
                  >
                    Voir tout le catalogue
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/appels-offres/nouveau')}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 text-gray-900 font-bold text-sm"
                  >
                    Publier un besoin
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-64 sm:w-72 md:w-auto shrink-0 snap-start bg-white dark:bg-[#131936] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <div
                        onClick={() => navigate(`/produit/${product.id}`)}
                        className="relative h-40 xl:h-44 bg-gray-100 cursor-pointer overflow-hidden group"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-white/95 dark:bg-[#0a0e27]/90 text-gray-900 dark:text-white text-[10px] font-bold flex items-center gap-1 shadow">
                          <FaMapMarkerAlt className="text-amber-500" /> {product.province}
                        </span>
                        {product.verified && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                            <FaCheckCircle /> Vérifié
                          </span>
                        )}
                      </div>

                      <div className="p-3.5">
                        <div className="flex justify-between items-center gap-1.5 text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400">
                          <span className="truncate">{product.categoryLabel}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 shrink-0">{product.stock}</span>
                        </div>

                        <h3
                          onClick={() => navigate(`/produit/${product.id}`)}
                          className="font-bold text-sm mt-1.5 text-gray-900 dark:text-white hover:text-sky-500 cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          Fournisseur : <span className="font-medium text-gray-700 dark:text-gray-300">{product.supplier}</span>
                        </p>

                        <div className="mt-3 p-2.5 rounded-xl bg-gray-50 dark:bg-[#0a0e27] border border-gray-100 dark:border-gray-800">
                          <div className="text-lg font-black text-sky-600 dark:text-sky-400">
                            {formatPrice(buyerMode === 'B2B' ? product.priceB2B : product.priceB2C)}
                          </div>
                          <div className="text-[11px] font-medium text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                            {buyerMode === 'B2B' ? product.unitB2B : product.unitB2C}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-3.5 pb-3.5 pt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/produit/${product.id}`)}
                        className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        {buyerMode === 'B2B' ? <FaFileInvoice /> : <FaShoppingCart />}
                        <span>{buyerMode === 'B2B' ? 'Demander un devis' : 'Voir & Commander'}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. TIROIR DE FILTRES MOBILE */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-80 max-w-full bg-white dark:bg-[#0a0e27] h-full p-6 overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                <h2 className="font-black text-lg">Filtres</h2>
                <button type="button" onClick={() => setMobileFiltersOpen(false)} className="p-2">
                  <FaTimes />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Catégorie</label>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                        selectedCategory === cat.id
                          ? 'bg-sky-500 text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Province</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#131936] text-sm"
                >
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov === 'Toutes' ? 'Toutes les provinces' : prov}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500"
                />
                <span className="text-sm font-semibold">Fournisseurs vérifiés uniquement</span>
              </label>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-bold"
                >
                  Effacer
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-sky-500 text-white text-sm font-bold"
                >
                  Appliquer ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
