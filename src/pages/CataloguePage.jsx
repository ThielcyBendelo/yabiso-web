import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaFilter, FaMapMarkerAlt, FaCheckCircle,
  FaShoppingCart, FaFileInvoice, FaTimes, FaSortAmountDown,
  FaStore, FaArrowLeft
} from 'react-icons/fa';
import { PRODUCTS_DB, getProductImage } from '../data/productsData';
import prod1 from '../assets/prod1.jpeg';
import GlobalSearchModal from '../components/GlobalSearchModal'; // Vérifiez votre chemin d'import

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    if (!usdAmount && usdAmount !== 0) return 'Sur devis';
    if (currency === 'USD') return `${Number(usdAmount).toFixed(2)} $`;
    return `${Math.round(Number(usdAmount) * EXCHANGE_RATE).toLocaleString('fr-FR')} FC`;
  };

  const catalogProducts = useMemo(() => {
    return PRODUCTS_DB.map((item) => {
      const assetImg = typeof getProductImage === 'function' ? getProductImage(item.id) : null;
      const dbImg = Array.isArray(item.images) ? item.images[0] : item.image;
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#070a1d] text-gray-900 dark:text-gray-100 pb-10">
      
        {/* =====================================================================
          1. SIDEBAR DES FILTRES DESKTOP (Avec boutons Effacer & Appliquer fixes en bas)
         ===================================================================== */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-60 bg-white dark:bg-[#131936] border-r border-gray-200 dark:border-gray-800 z-40">
        
        {/* En-tête Sidebar */}
        <div className="h-12 px-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-sky-500 transition"
          >
            <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#0a0e27] flex items-center justify-center text-sky-500">
              <FaArrowLeft className="text-[11px]" />
            </span>
            <span>Accueil</span>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-500">
            YaBiso RDC
          </span>
        </div>

        {/* Zone scrollable des filtres */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 [scrollbar-width:thin]">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
            <h2 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
              <FaFilter className="text-sky-500 text-[10px]" /> Filtres
            </h2>
          </div>

          {/* Mot-clé */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
              Filtrer par mot-clé
            </label>
            <div className="relative">
              <FaSearch className="absolute left-2.5 top-2.5 text-gray-400 text-[11px]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Café, Miel, Pagne..."
                className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Catégories */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
              Catégorie
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-sky-500 text-white font-semibold shadow-xs'
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
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
              Province d'origine
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs font-medium focus:outline-none focus:border-sky-500"
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-sky-500 focus:ring-sky-500"
              />
              <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <FaCheckCircle className="text-sky-500 shrink-0" /> Vérifiés uniquement
              </span>
            </label>
          </div>
        </div>

        {/* BOUTONS APPLIQUER ET EFFACER EN BAS DE LA SIDEBAR DESKTOP */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131936] flex gap-2 shrink-0">
          <button
            type="button"
            onClick={resetFilters}
            className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Effacer
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition"
          >
            Appliquer ({filteredProducts.length})
          </button>
        </div>
      </aside>

            {/* =====================================================================
        {/* =====================================================================
          2. PETITE NAVBAR COMPACTE (h-12)
         ===================================================================== */}
      <header className="fixed top-0 left-0 lg:left-60 right-0 h-12 bg-white/95 dark:bg-[#0d122b]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-30 px-2.5 sm:px-4 flex items-center justify-between gap-2">      
        {/* Gauche : Bouton Retour Home (mobile) + Titre Catalogue */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/')}
            title="Retour à l'accueil"
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#131936] text-gray-700 dark:text-gray-200 hover:bg-sky-500 hover:text-white transition"
          >
            <FaArrowLeft className="text-xs" />
          </button>
          <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-gray-900 dark:text-white">
            Catalogue
          </h1>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#131936] text-gray-500 dark:text-gray-400">
            {filteredProducts.length}
          </span>
        </div>

        {/* Centre : Icône Recherche + Icône Tri côte à côte sur mobile / Barre complète sur desktop */}
        <div className="flex items-center gap-1.5 sm:flex-1 sm:max-w-md justify-center">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Recherche globale"
            className="w-8 sm:w-full h-8 px-0 sm:px-2.5 rounded-lg bg-gray-100 dark:bg-[#131936] border border-gray-200 dark:border-gray-700/80 hover:border-sky-500/60 flex items-center justify-center sm:justify-between text-gray-400 transition shrink-0 sm:shrink"
          >
            <span className="flex items-center gap-2 text-xs truncate">
              <FaSearch className="text-xs sm:text-[11px] text-sky-500 shrink-0" />
              <span className="hidden sm:inline truncate">Recherche globale...</span>
            </span>
          </button>

          {/* Bouton Tri : Icône seule sur mobile (w-8 h-8), texte + icône sur desktop */}
          <div className="relative w-8 sm:w-auto h-8 rounded-lg bg-gray-100 dark:bg-[#131936] border border-gray-200 dark:border-gray-700/80 flex items-center justify-center sm:px-2.5 shrink-0">
            <FaSortAmountDown className="text-xs sm:text-[11px] text-gray-600 dark:text-gray-300 pointer-events-none" />
            <span className="hidden sm:inline text-[11px] font-semibold text-gray-700 dark:text-gray-200 ml-1.5 pointer-events-none">
              {sortBy === 'popular' ? 'Populaires' : sortBy === 'price-asc' ? 'Prix ↑' : 'Prix ↓'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Trier les produits"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="popular">Populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Droite : Switch B2C/B2B + Bouton Filtres Mobile */}
        <div className="flex items-center gap-1.5 shrink-0">
          {setBuyerMode && (
            <div className="flex bg-gray-100 dark:bg-[#131936] p-0.5 rounded-lg border border-gray-200 dark:border-gray-800 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setBuyerMode('B2C')}
                className={`px-2 py-1 rounded-md transition ${
                  buyerMode === 'B2C' ? 'bg-sky-500 text-white' : 'text-gray-500'
                }`}
              >
                B2C
              </button>
              <button
                type="button"
                onClick={() => setBuyerMode('B2B')}
                className={`px-2 py-1 rounded-md transition ${
                  buyerMode === 'B2B' ? 'bg-amber-500 text-white' : 'text-gray-500'
                }`}
              >
                B2B
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 relative"
            aria-label="Filtres"
          >
            <FaFilter className="text-xs" />
            {(selectedCategory !== 'toutes' || selectedProvince !== 'Toutes' || onlyVerified) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </header>

      {/* =====================================================================
          3. CONTENU PRINCIPAL (Grille directe sous la navbar)
         ===================================================================== */}
      <main className="pt-14 lg:pl-60 px-2.5 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#131936] rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Aucun produit ne correspond à vos critères.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-bold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5"
            >
              <AnimatePresence>
                {filteredProducts.map((item) => {
                  const activePrice = buyerMode === 'B2B' ? item.priceB2B : item.priceB2C;
                  return (
                    <motion.article
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      key={item.id}
                      onClick={() => navigate(`/produit/${item.id}`)}
                      className="group cursor-pointer bg-white dark:bg-[#131936] rounded-xl border border-gray-200/90 dark:border-gray-800 overflow-hidden hover:border-sky-500/60 transition flex flex-col"
                    >
                      {/* Image compacte */}
                      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-[#0a0e27] overflow-hidden">
                        <img
                          src={item.image}
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

                      {/* Infos produit resserrées */}
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

                        {/* Prix & Action B2C/B2B compact */}
                        <div className="pt-1.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <span className="block font-extrabold text-xs sm:text-[13px] text-sky-600 dark:text-sky-400 truncate">
                              {formatPrice(activePrice)}
                            </span>
                            {buyerMode === 'B2B' && item.moq && (
                              <span className="block text-[9px] text-amber-500 font-semibold leading-none">
                                Min: {item.moq}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/produit/${item.id}`);
                            }}
                            title={buyerMode === 'B2B' ? 'Demander un devis' : 'Commander'}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] shrink-0 transition ${
                              buyerMode === 'B2B'
                                ? 'bg-amber-500 hover:bg-amber-600'
                                : 'bg-sky-500 hover:bg-sky-600'
                            }`}
                          >
                            {buyerMode === 'B2B' ? <FaFileInvoice /> : <FaShoppingCart />}
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>


            {/* =====================================================================
          4. TIROIR FILTRES MOBILE (Avec Catégories + Bouton Appliquer visible)
         ===================================================================== */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden flex">
            {/* Fond sombre */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Panneau latéral */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="relative w-72 max-w-[85vw] bg-white dark:bg-[#131936] h-full z-10 flex flex-col justify-between p-3.5 pb-24 overflow-y-auto"
            >
              <div className="space-y-4">
                {/* En-tête du tiroir */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
                  <h2 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <FaFilter className="text-sky-500" /> Filtres
                  </h2>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* 1. Mot-clé */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Mot-clé
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: Café, Miel, Pagne..."
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* 2. Catégories */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">
                    Catégorie
                  </label>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          selectedCategory === cat.id
                            ? 'bg-sky-500 text-white font-bold shadow-xs'
                            : 'bg-gray-50 dark:bg-[#0a0e27] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                                {/* 4. Fournisseur vérifié */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-xs font-semibold flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                    <FaCheckCircle className="text-sky-500 shrink-0" /> Fournisseurs vérifiés uniquement
                  </span>
                </label>
              </div>

              {/* Boutons Effacer & Appliquer collés au-dessus de la Bottom Nav */}
              <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-[#131936] flex gap-2 pt-3 pb-2 mt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Effacer
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-sm transition"
                >
                  Appliquer ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE EXTERNE DE RECHERCHE GLOBALE */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
