import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch, FaMapMarkerAlt, FaStore, FaHandshake, FaLeaf,
  FaCheckCircle, FaArrowRight, FaMobileAlt, FaShieldAlt, FaTruck, FaWhatsapp
} from 'react-icons/fa';

export default function Hero({ buyerMode = 'B2C', setBuyerMode, currency = 'CDF' }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const EXCHANGE_RATE = 2850; // 1 USD = 2850 CDF

  const provinces = [
    'Kinshasa', 'Kongo-Central', 'Nord-Kivu', 'Sud-Kivu',
    'Lualaba', 'Haut-Katanga', 'Tshopo', 'Équateur'
  ];

  const featuredProducts = [
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
      province: 'Kasaï',
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
    }
  ];

  const basins = [
    { name: 'Kinshasa', specialty: 'Transformation, Mode & Artisanat', count: '140+ fournisseurs' },
    { name: 'Sud-Kivu', specialty: 'Café, Thé, Miel & Haricots', count: '95+ coopératives' },
    { name: 'Kongo-Central', specialty: 'Manioc, Fruits & Huile de palme', count: '110+ producteurs' },
    { name: 'Haut-Katanga', specialty: 'Maïs, Maraîchage & Élevage', count: '80+ fermes' }
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
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">
              Filtrer par bassin de production :
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {provinces.map((province) => (
                <button
                  key={province}
                  type="button"
                  onClick={() => handleProvinceClick(province)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-[#131936] hover:bg-amber-400 dark:hover:bg-amber-400 text-slate-700 dark:text-gray-300 hover:text-slate-900 transition"
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
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Sélection Vérifiée
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {buyerMode === 'B2B' ? 'Offres en Gros & Approvisionnement' : 'Produits Locaux Populaires'}
            </h2>
          </div>

          {setBuyerMode && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#131936] p-1 rounded-xl border border-slate-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setBuyerMode('B2C')}
                className={
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition ' +
                  (buyerMode === 'B2C'
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-600 dark:text-gray-400')
                }
              >
                Prix Détail (B2C)
              </button>
              <button
                type="button"
                onClick={() => setBuyerMode('B2B')}
                className={
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition ' +
                  (buyerMode === 'B2B'
                    ? 'bg-amber-400 text-slate-900 shadow'
                    : 'text-slate-600 dark:text-gray-400')
                }
              >
                Prix de Gros (B2B)
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#131936] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 dark:border-gray-800 flex flex-col justify-between transition"
            >
              <div>
                <div
                  onClick={() => navigate('/produit/' + product.id)}
                  className="relative h-48 overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-[#0a0e27]/90 text-slate-900 dark:text-white text-[11px] font-bold flex items-center gap-1 shadow">
                    <FaMapMarkerAlt className="text-amber-500" /> {product.province}
                  </span>
                  {product.verified && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                      <FaCheckCircle /> Vérifié
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase">
                    {product.category}
                  </span>
                  <h3
                    onClick={() => navigate('/produit/' + product.id)}
                    className="font-bold text-base mt-1 line-clamp-1 cursor-pointer hover:text-sky-500"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    Par {product.supplier}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800">
                    <div className="text-lg font-black text-sky-600 dark:text-sky-400">
                      {formatPrice(buyerMode === 'B2B' ? product.priceB2B : product.priceB2C)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      {buyerMode === 'B2B' ? product.unitB2B : product.unitB2C}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/produit/' + product.id)}
                  className={
                    'flex-1 py-2.5 rounded-xl font-bold text-xs transition ' +
                    (buyerMode === 'B2B'
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-900'
                      : 'bg-sky-500 hover:bg-sky-600 text-white')
                  }
                >
                  {buyerMode === 'B2B' ? 'Demander un devis' : 'Commander'}
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppProduct(product)}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center justify-center"
                  title="Discuter sur WhatsApp"
                >
                  <FaWhatsapp size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. EXPLORER PAR PROVINCE */}
      <section className="bg-slate-50 dark:bg-[#0b102b] py-16 px-4 border-y border-slate-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Richesses de nos terroirs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Explorez par Province</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">
              Chaque province de la RDC possède un savoir-faire unique. Commandez directement auprès des bassins de production.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {basins.map((prov) => (
              <div
                key={prov.name}
                onClick={() => handleProvinceClick(prov.name)}
                className="cursor-pointer bg-white dark:bg-[#131936] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 hover:border-sky-500 shadow-sm transition group"
              >
                <div className="flex justify-between items-center mb-3">
                  <FaLeaf className="text-sky-500 text-xl group-hover:scale-110 transition" />
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                    {prov.count}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{prov.name}</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{prov.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* 5. BANNIÈRE APPELS D'OFFRES B2B */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-sky-500 to-blue-600 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-4">
              <FaHandshake /> SPÉCIAL HÔTELS, SUPERMARCHÉS & RESTAURANTS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Vous avez un besoin régulier en produits locaux ?
            </h2>
            <p className="text-sky-100 text-sm sm:text-base mt-3">
              Publiez un appel d’offres gratuitement et recevez plusieurs devis chiffrés de nos coopératives et grossistes vérifiés en moins de 24h.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => navigate('/appels-offres')}
              className="px-7 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm text-center transition shadow-lg"
            >
              Publier un besoin (B2B)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
