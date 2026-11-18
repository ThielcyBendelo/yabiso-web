import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FaTruck,
  FaPlane,
  FaShip,
  FaMotorcycle,
  FaMapMarkerAlt,
  FaSearch,
  FaCheckCircle,
  FaWhatsapp,
  FaBoxOpen,
  FaShieldAlt,
  FaClock,
  FaExchangeAlt
} from 'react-icons/fa';

const provincesRDC = [
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

const transportModes = [
  {
    id: 'air',
    name: 'Fret Aérien Cargo',
    label: 'Fret Aérien Cargo',
    subtitle: 'Rapide • Produits périssables & valeur',
    icon: FaPlane,
    ratePerKg: 3.2,
    baseFee: 15,
    delay: '24h à 48h'
  },
  {
    id: 'road',
    name: 'Transport Routier (Camion)',
    label: 'Transport Routier (Camion)',
    subtitle: 'Économique • Axes RN1, Est & Grand Katanga',
    icon: FaTruck,
    ratePerKg: 0.65,
    baseFee: 20,
    delay: '3 à 7 jours'
  },
  {
    id: 'river',
    name: 'Voie Fluviale / Lacustre',
    label: 'Voie Fluviale / Lacustre',
    subtitle: 'Gros volumes • Fleuve Congo & Lacs',
    icon: FaShip,
    ratePerKg: 0.35,
    baseFee: 18,
    delay: '7 à 14 jours'
  }
];

// Données simulées de suivi de colis
const mockTrackingData = {
  'LOG-304': {
    id: 'LOG-304',
    product: 'Café Arabica du Kivu (120 kg)',
    origin: 'Bukavu (Sud-Kivu)',
    destination: 'Kinshasa (Gombe)',
    mode: 'Fret Aérien Cargo',
    eta: 'Demain avant 16h00',
    steps: [
      { label: 'Colis récupéré chez la coopérative', date: 'Hier, 09:30', done: true },
      { label: 'Contrôle qualité & pesée au hub', date: 'Hier, 14:15', done: true },
      { label: 'Arrivé à l’aéroport de N’djili', date: 'Aujourd’hui, 10:40', done: true },
      { label: 'En cours de livraison finale', date: 'Estimé demain', done: false }
    ]
  }
};

export default function LogistiquePage({ currency = 'USD' }) {
  // Onglet actif ('simulator' ou 'tracking')
  const [activeSection, setActiveSection] = useState('simulator');

  // États du calculateur
  const [origin, setOrigin] = useState('Nord-Kivu');
  const [destination, setDestination] = useState('Kinshasa');
  const [weight, setWeight] = useState(50);
  const [selectedMode, setSelectedMode] = useState('air');
  const [withInsurance, setWithInsurance] = useState(true);

  // États du suivi de colis
  const [trackingInput, setTrackingInput] = useState('LOG-304');
  const [activeTracking, setActiveTracking] = useState(mockTrackingData['LOG-304']);
  const [trackingError, setTrackingError] = useState('');

  const exchangeRate = 2850; // Taux USD -> CDF
  const isSameProvince = origin === destination;
  const currentModeObj = transportModes.find((m) => m.id === selectedMode) || transportModes[0];

  // Inverser départ et destination
  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  // Calcul dynamique du tarif et des délais
  const estimation = useMemo(() => {
    if (isSameProvince) {
      const localCost = weight <= 25 ? 5 : weight <= 100 ? 12 : 25 + weight * 0.1;
      const insuranceCost = withInsurance ? localCost * 0.03 : 0;
      return {
        modeName: weight <= 25 ? 'Coursier Moto Express' : 'Camionnette Locale',
        delay: '2h à 6h (Même jour)',
        subtotal: localCost,
        insurance: insuranceCost,
        total: localCost + insuranceCost
      };
    }

    const subtotal = currentModeObj.baseFee + weight * currentModeObj.ratePerKg;
    const insurance = withInsurance ? subtotal * 0.03 : 0;

    return {
      modeName: currentModeObj.name,
      delay: currentModeObj.delay,
      subtotal,
      insurance,
      total: subtotal + insurance
    };
  }, [origin, destination, weight, selectedMode, withInsurance, isSameProvince, currentModeObj]);

  // Variables de compatibilité directe avec votre JSX
  const estimatedUSD = estimation.total;
  const estimatedCDF = Math.round(estimatedUSD * exchangeRate);

  // Recherche d'un colis
  const handleTrackSearch = (e) => {
    e.preventDefault();
    const code = trackingInput.trim().toUpperCase();
    if (mockTrackingData[code]) {
      setActiveTracking(mockTrackingData[code]);
      setTrackingError('');
    } else {
      setTrackingError('Code introuvable. Essayez le code de démonstration : LOG-304');
    }
  };

    const handleWhatsAppBooking = () => {
    const phone = '243811349537';
    const message =
      'Bonjour, je souhaite réserver un transport de ' +
      weight +
      ' kg de ' +
      origin +
      ' vers ' +
      destination +
      ' (Estimation : ' +
      estimatedUSD.toFixed(2) +
      '$).';
    const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e27] text-slate-900 dark:text-white pb-16">
      {/* EN-TÊTE COMPACT */}
      <section className="bg-gradient-to-r from-slate-900 via-[#131936] to-sky-950 text-white py-10 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-400 text-xs font-bold mb-3">
              <FaTruck /> Réseau Logistique & Fret RDC
            </span>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              Expédiez vos produits locaux partout au Congo
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Estimez vos frais de transport interprovincial (Air, Fleuve, Route) ou local en quelques secondes et suivez vos marchandises en temps réel.
            </p>
          </div>

          {/* Mini-barre de suivi rapide */}
          <form
            onSubmit={handleTrackSearch}
            className="w-full md:w-96 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15"
          >
            <label className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block mb-1.5">
              Suivre une expédition (ex: LOG-304)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Ex: LOG-304"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <FaSearch /> Suivre
              </button>
            </div>
            {trackingError && (
              <p className="text-[11px] text-amber-300 mt-1.5">{trackingError}</p>
            )}
          </form>
        </div>
      </section>

            {/* CONTENU PRINCIPAL : SIMULATEUR + RÉSUMÉ */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        {activeSection === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLONNE GAUCHE : CONFIGURATEUR DE TRAJET (7 colonnes) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#131936] rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-gray-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black">Simulateur de Tarifs & Délais</h2>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  Sélectionnez le bassin de départ, la destination et le poids total de la marchandise.
                </p>
              </div>

              {/* Sélection Départ / Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-gray-300 mb-1.5">
                    <FaMapMarkerAlt className="inline text-sky-500 mr-1" /> Province de départ
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-800 text-sm font-bold focus:outline-none focus:border-sky-500"
                  >
                    {provincesRDC.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bouton Inverser */}
                <div className="sm:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={swapLocations}
                    title="Inverser le trajet"
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0a0e27] hover:bg-sky-500 hover:text-white text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition cursor-pointer"
                  >
                    <FaExchangeAlt size={13} />
                  </button>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-gray-300 mb-1.5">
                    <FaMapMarkerAlt className="inline text-amber-500 mr-1" /> Province d’arrivée
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-800 text-sm font-bold focus:outline-none focus:border-sky-500"
                  >
                    {provincesRDC.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Jauge de poids (Kg) - PARTIE RESTAURÉE */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 dark:text-gray-300">
                    Poids total estimé (kg)
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black text-sm">
                    {weight} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1 kg (Colis)</span>
                  <span>500 kg (Palette)</span>
                  <span>1 000 kg (Tonne)</span>
                </div>
              </div>

                            {/* Choix du mode de transport */}
              {!isSameProvince ? (
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-gray-300">
                    Mode d’acheminement inter-provincial
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {transportModes.map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = selectedMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setSelectedMode(mode.id)}
                          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                            isSelected
                              ? 'border-sky-500 bg-sky-500/10'
                              : 'border-slate-200 dark:border-gray-800 hover:border-sky-500/50'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                            <Icon size={15} />
                          </div>
                          <div className="mt-2">
                            <div className="font-bold text-xs text-slate-900 dark:text-white">
                              {mode.label}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                              Délai : {mode.delay}
                            </div>
                            <div className="text-[11px] font-black text-sky-600 dark:text-sky-400 mt-1">
                              ~ {mode.ratePerKg} $ / kg
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <FaMotorcycle className="text-emerald-500 text-xl shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Livraison Urbaine Express (Même province)
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-gray-400">
                      Expédition rapide par coursier moto ou camionnette locale sous 2h à 24h.
                    </div>
                  </div>
                </div>
              )}
            </div> 


            {/* COLONNE DROITE : Résultat du devis & Action (5 colonnes) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#0a0e27] text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Estimation Instantanée
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300">
                    Taux : 1$ = {exchangeRate} FC
                  </span>
                </div>

                <div className="mt-5">
                  <div className="text-xs text-gray-400">Coût total estimé du transport</div>
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
                    {estimatedUSD.toFixed(2)} $
                  </div>
                  <div className="text-sm font-bold text-gray-300 mt-0.5">
                    ≈ {estimatedCDF.toLocaleString('fr-FR')} FC
                  </div>
                </div>

                               {/* Détails du trajet */}
                <div className="mt-6 space-y-2.5 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Itinéraire :</span>
                    <span className="font-bold text-right">
                      {origin} ➔ {destination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Poids facturé :</span>
                    <span className="font-bold">{weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Délai moyen :</span>
                    <span className="font-bold text-emerald-400">
                      {isSameProvince ? '2h - 24h' : currentModeObj?.delay}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assurance marchandise :</span>
                    <span className="font-bold text-sky-400 flex items-center gap-1">
                      <FaShieldAlt size={11} /> Incluse
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                                <button
                  type="button"
                  onClick={() => {
                    const message = `Bonjour, je souhaite réserver un transport de ${weight} kg de ${origin} vers ${destination} (Estimation : ${estimatedUSD.toFixed(2)}$).`;
                    window.open('https://wa.me' + encodeURIComponent(message), '_blank');
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                >
                  <FaWhatsapp size={17} />
                  <span>Réserver ce fret sur WhatsApp</span>
                </button>
                <p className="text-[10px] text-center text-gray-400">
                  Tarif indicatif incluant la manutention au départ et l’arrivée au hub.
                </p>
              </div>
            </div>
          </div>
        )}


                {/* ONGLET 2 : SUIVI DE COLIS EN TEMPS RÉEL */}
        {activeSection === 'tracking' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#131936] rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black">Suivi de Colis en Temps Réel</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Entrez votre numéro de bordereau (ex: LOG-304) pour localiser votre marchandise.
            </p>

            {/* Formulaire de recherche de suivi */}
            <form onSubmit={handleTrackSearch} className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Ex: LOG-304"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0a0e27] border border-slate-200 dark:border-gray-800 text-sm font-bold uppercase focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm transition cursor-pointer"
              >
                Rechercher le colis
              </button>
            </form>

            {/* Message d'erreur si code introuvable */}
            {trackingError && (
              <p className="mt-3 text-xs font-bold text-rose-500">
                {trackingError}
              </p>
            )}

            {/* Résultat du suivi */}
            {activeTracking && !trackingError && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-gray-800 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-[#0a0e27] p-4 rounded-2xl border border-slate-200 dark:border-gray-800">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400">Bordereau N°</div>
                    <div className="font-black text-sm text-sky-500">{activeTracking.id}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400">Trajet</div>
                    <div className="font-bold text-xs">
                      {activeTracking.origin} ➔ {activeTracking.destination}
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      {activeTracking.eta}
                    </span>
                  </div>
                </div>

                {/* Chronologie (Timeline) */}
                <div className="space-y-4 pl-2">
                  {activeTracking.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${
                          step.done
                            ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                            : 'bg-slate-300 dark:bg-gray-700'
                        }`}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {step.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-gray-400">
                          {activeTracking.mode} • {step.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
