import React, { useState, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

// Pages Espace Public & Acheteurs (RDC)
import Home from './pages/Home';
import CataloguePage from './pages/CataloguePage';
import DetailProduitPage from './pages/DetailProduitPage';
import AnnuairePage from './pages/AnnuairePage';
import ContactPage from './pages/ContactPage';
import AppelsOffres from './pages/AppelsOffres';
import DevenirFournisseur from './pages/DevenirFournisseur';

// Composants Sécurité, Auth & Expérience Utilisateur
import PrivateRoute from './components/PrivateRoute';
import ProfessionalSplashScreen from './components/ProfessionalSplashScreen';
import SecureLogin from './components/SecureLogin';
import SecureRegister from './components/SecureRegister';

// Vraies pages pro du tableau de bord fournisseur (structure dédiée src/pages/dashboard)
import {
  DashboardLayout, Overview, Products, Invoices, Analytics,
  Messaging, Profile, Payments, Moderation,
} from './pages/dashboard';

// =========================================================================
// COMPOSANT ROOT APPLICATION
// =========================================================================
const App = () => {
    const [splashDone, setSplashDone] = useState(() => {
    return sessionStorage.getItem('yabiso_splash_seen') === 'true';
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('yabiso_splash_seen', 'true');
    setSplashDone(true);
  };


  // États globaux partagés entre Navbar, Accueil, Catalogue et Fiche Produit
  const [buyerMode, setBuyerMode] = useState('B2C'); // 'B2C' (Particulier) ou 'B2B' (Entreprise/Gros)
  const [currency, setCurrency] = useState('CDF');   // 'CDF' (Franc Congolais) ou 'USD' (Dollar)

  return (
    <ThemeProvider>
      {/* Écran de chargement ignoré par défaut pour éviter les boucles infinies */}
      {!splashDone && (
        <ProfessionalSplashScreen onComplete={() => setSplashDone(true)} />
      )}

      {splashDone && (
        <div className="min-h-screen bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100">
          {/* Toast notifications pour l'application */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#070a1d] text-sky-600 dark:text-sky-400 font-bold">
                Chargement de YaBiso RDC...
              </div>
            }
          >
            <Routes>
              {/* ================= ROUTES ESPACE PUBLIC & ACHETEURS ================= */}
              <Route
                path="/"
                element={
                  <Home
                    buyerMode={buyerMode}
                    setBuyerMode={setBuyerMode}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                }
              />
              <Route
                path="/catalogue"
                element={
                  <CataloguePage
                    buyerMode={buyerMode}
                    setBuyerMode={setBuyerMode}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                }
              />
              <Route
                path="/produit/:id"
                element={
                  <DetailProduitPage
                    buyerMode={buyerMode}
                    setBuyerMode={setBuyerMode}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                }
              />
              <Route
                path="/appels-offres"
                element={
                  <AppelsOffres
                    buyerMode={buyerMode}
                    setBuyerMode={setBuyerMode}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                }
              />
              <Route
                path="/devenir-fournisseur"
                element={
                  <DevenirFournisseur
                    buyerMode={buyerMode}
                    setBuyerMode={setBuyerMode}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                }
              />
              <Route path="/fournisseurs" element={<AnnuairePage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* ================= ROUTES AUTHENTIFICATION (FOURNISSEURS) ================= */}
              <Route path="/login" element={<SecureLogin />} />
              <Route path="/register" element={<SecureRegister />} />

              {/* ================= ROUTES SÉCURISÉES (FOURNISSEUR & ADMIN) ================= */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                {/* Accueil du Tableau de Bord */}
                <Route index element={<Overview />} />

                {/* Gestion Catalogue Produits */}
                <Route path="mes-produits" element={<Products />} />

                {/* Gestion Commerciale & Facturation (B2B) */}
                <Route path="paiements" element={<Payments />} />
                <Route path="factures" element={<Invoices />} />

                {/* Statistiques d'impact réelles (catalogue, facturation) */}
                <Route path="statistiques" element={<Analytics />} />

                {/* Communications et Profil Fournisseur */}
                <Route path="messagerie" element={<Messaging />} />
                <Route path="mon-profil" element={<Profile />} />

                {/* Route Administration */}
                <Route path="moderation" element={<Moderation />} />
              </Route>

              {/* Redirection automatique pour les chemins erronés */}
              <Route
                path="*"
                element={
                  <Home
                    buyerMode={buyerMode}
                    setBuyerMode={setBuyerMode}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                }
              />
            </Routes>
          </Suspense>
        </div>
      )}
    </ThemeProvider>
  );
};

export default App;
