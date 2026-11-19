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
import Logistique from './pages/Logistique';
import SecuritePage from './pages/Securite';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

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

  // Détection automatique si un fournisseur est connecté (via localStorage/sessionStorage)
  const isAuthenticated = Boolean(
    localStorage.getItem('token') ||
    localStorage.getItem('yabiso_user') ||
    sessionStorage.getItem('token')
  );

   return (
    <ThemeProvider>
      {/* Écran de chargement */}
      {!splashDone && (
        <ProfessionalSplashScreen onComplete={handleSplashComplete} />
      )}

      {splashDone && (
        <div className="min-h-screen bg-white dark:bg-[#070a1d] text-slate-900 dark:text-gray-100 pb-24 lg:pb-0 flex flex-col">
          {/* Toast notifications */}
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
              <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#070a1d]">
                {/* Boule de connexion animée */}
                <div className="relative flex items-center justify-center w-20 h-20">
                  <span className="absolute inset-0 rounded-full bg-sky-500/25 dark:bg-sky-400/20 animate-ping" />
                  <span className="absolute inset-2 rounded-full border-2 border-transparent border-t-sky-500 border-r-amber-400 animate-spin" />
                  <span className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 via-sky-400 to-amber-300 shadow-[0_0_24px_rgba(14,165,233,0.75)] animate-pulse" />
                </div>
              </div>
            }
          >
            <PageTransition>
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
                <Route
                  path="/logistique"
                  element={
                    <Logistique
                      buyerMode={buyerMode}
                      setBuyerMode={setBuyerMode}
                      currency={currency}
                      setCurrency={setCurrency}
                    />
                  }
                />
                <Route path="/securite" element={<SecuritePage />} />
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
                  <Route index element={<Overview />} />
                  <Route path="mes-produits" element={<Products />} />
                  <Route path="paiements" element={<Payments />} />
                  <Route path="factures" element={<Invoices />} />
                  <Route path="statistiques" element={<Analytics />} />
                  <Route path="messagerie" element={<Messaging />} />
                  <Route path="mon-profil" element={<Profile />} />
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
            </PageTransition>
          </Suspense>

          <Footer isAuthenticated={isAuthenticated} />

          {/* BARRE DE NAVIGATION INFÉRIEURE FLOTTANTE LIQUID GLASS (MOBILE) */}
          <MobileBottomNav isAuthenticated={isAuthenticated} />
        </div>
      )}
    </ThemeProvider>
  );
};

export default App;
