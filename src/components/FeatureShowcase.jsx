import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStore, FaMapMarkerAlt, FaTruck, FaShieldAlt, FaArrowRight, FaWhatsapp, FaCheckCircle, FaImage, FaVideo, FaClock } from 'react-icons/fa';

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  // Données des onglets avec images réalistes
  const tabsData = [
    {
      id: "catalogue-immersif",
      label: "Catalogue Immersif",
      icon: "🛍️",
      colorClass: "from-emerald-500 to-emerald-600",
      badgeText: "Kivu & Kongo Central",
      title: "Découvrez les Meilleures Filières de Production",
      description: "Explorez notre catalogue interactif classé par provinces et filières. Visualisez les fiches complètes, volumes minimums de commande (MOQ) et contactez directement les coopératives.",
      stats: [
        { label: "Produits", value: "2,500+" },
        { label: "Fournisseurs", value: "500+" },
        { label: "Provinces", value: "26" }
      ],
      imageMockup: (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden flex flex-col md:flex-row border border-emerald-500/20">
          {/* Sidebar catégories */}
          <div className="w-full md:w-48 bg-slate-950 border-b md:border-b-0 md:border-r border-emerald-500/20 p-4 space-y-2">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-4">Filières</p>
            {['Café Kivu', 'Huile Palme', 'Cacao', 'Artisanat'].map((item, i) => (
              <div key={i} className={`p-3 rounded-lg text-sm font-medium transition-all ${i === 0 ? 'bg-emerald-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
                {item}
              </div>
            ))}
          </div>
          {/* Contenu produit */}
          <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-br from-emerald-900/20 to-slate-900">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full mb-4">
                CAFÉ ARABICA
              </span>
              <h4 className="text-2xl font-black text-white tracking-tight mb-2">Café Premium du Kivu</h4>
              <p className="text-sm text-slate-300">Produit à 1500m d'altitude par coopératives locales certifiées</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Prix de Gros</span>
                <span className="font-bold text-emerald-400">4.50 USD/Kg</span>
              </div>
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all">
                <FaWhatsapp /> Commander Maintenant
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "traçabilité",
      label: "Traçabilité Complète",
      icon: "✅",
      colorClass: "from-blue-500 to-blue-600",
      badgeText: "Transparence Garantie",
      title: "Chaque Produit Traçable d'Origine",
      description: "Système de traçabilité blockchain intégré. Consultez les certifications OCC, fiches techniques de laboratoire et documents RCCM des fournisseurs.",
      stats: [
        { label: "Certifications", value: "100%" },
        { label: "Documents", value: "Vérifiés" },
        { label: "Transparence", value: "Totale" }
      ],
      imageMockup: (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-blue-500/20 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-blue-400 text-xl" />
              <span className="text-sm font-bold text-blue-400 uppercase">Traçabilité Active</span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-slate-400">📦 Origine Certifiée:</p>
                <p className="text-blue-300 font-bold">Territoire de Mbanza-Ngungu</p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-slate-400">🧪 Analyse Qualité:</p>
                <p className="text-blue-300 font-bold">Humidité: 11.8% (Conforme)</p>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-slate-400">✓ Statut Vérification:</p>
                <p className="text-green-300 font-bold">Document Certifié OCC</p>
              </div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all">
            Voir Tous les Documents
          </button>
        </div>
      )
    },
    {
      id: "logistique",
      label: "Logistique Intégrée",
      icon: "🚚",
      colorClass: "from-purple-500 to-purple-600",
      badgeText: "Routes Optimisées",
      title: "Visualisez Tous les Flux de Transport",
      description: "Planifiez les livraisons depuis les centres de production ruraux vers les grands centres. Suivez barges fluviales et camionnage en temps réel.",
      stats: [
        { label: "Routes Actives", value: "48" },
        { label: "Délai Moyen", value: "6 jours" },
        { label: "Taux Fiabilité", value: "97%" }
      ],
      imageMockup: (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <FaTruck className="text-purple-400 text-2xl" />
            <div>
              <p className="text-xs text-purple-400 font-bold uppercase">Logistique Actuelle</p>
              <p className="text-sm text-slate-300">3 expéditions en transit</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { from: "Bumba (Équateur)", to: "Kinshasa", status: "En cours", time: "5 jours" },
              { from: "Goma (Nord-Kivu)", to: "Lubumbashi", status: "Planifié", time: "8 jours" },
              { from: "Kasai", to: "Kinshasa", status: "Complété", time: "4 jours" }
            ].map((route, i) => (
              <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                <div className="text-xs">
                  <p className="text-slate-300 font-semibold">{route.from} → {route.to}</p>
                  <p className="text-slate-500 text-[10px]">{route.time}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  route.status === 'En cours' ? 'bg-blue-500/20 text-blue-300' :
                  route.status === 'Planifié' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {route.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "négociation",
      label: "Espace de Négociation",
      icon: "🤝",
      colorClass: "from-pink-500 to-pink-600",
      badgeText: "Contrats B2B",
      title: "Négociez Directement en Ligne",
      description: "Interface sécurisée pour établir des contrats de volume, fixer les prix, et gérer les paiements progressifs avec traçabilité complète.",
      stats: [
        { label: "Contrats Actifs", value: "156" },
        { label: "Volume Négocié", value: "450T/mois" },
        { label: "Acheteurs", value: "89" }
      ],
      imageMockup: (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-pink-500/20">
          <div className="space-y-4">
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
              <p className="text-xs text-pink-400 font-bold uppercase mb-2">Contrat en Cours</p>
              <p className="text-sm font-bold text-white mb-3">500 Kg Café Kivu - Démarrage Immédiat</p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Prix Convenu:</span>
                  <span className="font-bold text-pink-300">4.20 USD/Kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Versement 1/3:</span>
                  <span className="font-bold text-green-400">✓ Reçu</span>
                </div>
                <div className="flex justify-between">
                  <span>Départ Prévu:</span>
                  <span className="font-bold">15 Septembre</span>
                </div>
              </div>
            </div>
            <button className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-all">
              Gérer le Contrat
            </button>
          </div>
        </div>
      )
    }
  ];

  const currentTab = tabsData[activeTab];

  return (
    <section className="py-24 bg-white dark:bg-[#0a0e27] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-sky-400 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-red-400 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Fonctionnalités Avancées
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Explorez Nos Services Innovants
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tableau de bord interactif avec onglets thématiques. Consultez à gauche, visualisez à droite.
          </p>
        </div>

        {/* Onglets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Menu des onglets à gauche */}
          <div className="space-y-3 flex flex-col">
            {tabsData.map((tab, idx) => (
              <motion.button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                  activeTab === idx
                    ? `bg-gradient-to-r ${tab.colorClass} text-white border-transparent shadow-lg`
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl">{tab.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{tab.label}</h3>
                  <p className={`text-xs ${activeTab === idx ? 'opacity-90' : 'opacity-60'}`}>
                    {activeTab === idx ? tab.title : tab.badgeText}
                  </p>
                </div>
                {activeTab === idx && <FaArrowRight className="mt-1" />}
              </motion.button>
            ))}
          </div>

          {/* Contenu à droite avec animation */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Texte */}
                <div>
                  <span className={`inline-block px-3 py-1 bg-gradient-to-r ${currentTab.colorClass} text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3`}>
                    {currentTab.badgeText}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                    {currentTab.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {currentTab.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {currentTab.stats.map((stat, idx) => (
                      <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-red-600">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r ${currentTab.colorClass} shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
                  >
                    Explorer Cette Fonctionnalité
                    <FaArrowRight />
                  </motion.button>
                </div>

                {/* Image/Mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="h-80 overflow-hidden rounded-xl shadow-lg"
                >
                  {currentTab.imageMockup}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-sky-500 to-red-500 dark:from-sky-600 dark:to-red-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <h3 className="text-2xl font-black mb-3">Prêt à Transformer Votre Activité ?</h3>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Rejoignez des centaines de fournisseurs et acheteurs qui utilisent YaBiso pour fluidifier leurs transactions.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all"
          >
            Commencer Maintenant
          </motion.button>
        </div>
      </div>
    </section>
  );
}
