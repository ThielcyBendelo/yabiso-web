import React from 'react';
import NavbarSecured from '../components/NavbarSecured';
import Hero from '../components/Hero';
// import FeatureShowcase from '../components/FeatureShowcase'; 

export default function Home() {
  return (
    <>
      <NavbarSecured />
      <main className="bg-slate-950"> {/* Aligné avec le thème sombre de votre plateforme */}
        <Hero />
        {/* Section vitrine animée pour les producteurs et produits de RDC */}
        {/* <FeatureShowcase /> */}
      </main>
    </>
  );
}
