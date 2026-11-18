import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaEnvelope, FaInstagram, FaFacebook, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Liste fixe pour le rendu dynamique des icônes de contact
  const socialLinks = [
    { label: 'Email', link: 'mailto:support@likufi.cd', icon: <FaEnvelope size={18} /> },
    { label: 'Facebook', link: 'https://facebook.com', icon: <FaFacebook size={18} /> },
    { label: 'Instagram', link: 'https://instagram.com', icon: <FaInstagram size={18} /> },
    { label: 'LinkedIn', link: 'https://linkedin.com', icon: <FaLinkedin size={18} /> },
    { label: 'WhatsApp', link: 'https://wa.me', icon: <FaWhatsapp size={18} /> }
  ];

  return (
    <footer className="bg-[var(--surface)] text-gray-300 py-16 mt-auto border-t border-[var(--border-color)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Bloc 1: Identité & Slogan National */}
          <div className="col-span-1">
            <h3 className="text-2xl font-black mb-4">
              <span className="bg-gradient-to-r from-emerald-500 via-yellow-400 to-[var(--accent-1)] text-transparent bg-clip-text tracking-wide uppercase">
                YaBiso
              </span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              "Le hub commercial de confiance dédié à la promotion et à la distribution de gros des produits locaux du terroir congolais."
            </p>
            <div className="mt-6 flex gap-3">
              <div className="h-1 w-8 bg-[var(--accent-1)] rounded-full"></div>
              <div className="h-1 w-2 bg-yellow-400 rounded-full"></div>
              <div className="h-1 w-2 bg-sky-400 rounded-full"></div>
            </div>
          </div>

          {/* Bloc 2: Navigation Acheteurs & Fournisseurs */}
          <div className="text-left">
            <h4 className="text-white font-black mb-6 uppercase text-xs tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" className="hover:text-[var(--accent-1)] transition-colors">Accueil</Link></li>
              <li><Link to="/catalogue" className="hover:text-[var(--accent-1)] transition-colors">Catalogue Produits</Link></li>
              <li><Link to="/fournisseurs" className="hover:text-[var(--accent-1)] transition-colors">Annuaire National</Link></li>
              <li><Link to="/login" className="hover:text-[var(--accent-1)] transition-colors">Espace Fournisseur</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--accent-1)] transition-colors">Support & Aide</Link></li>
            </ul>
          </div>

          {/* Bloc 3: Siège & Contact Technique */}
          <div className="text-left">
            <h4 className="text-white font-black mb-6 uppercase text-xs tracking-widest">Contact Pro</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-3">
                <div className="text-[var(--accent-1)]"><FaEnvelope /></div>
                <span className="text-gray-300 break-all">support@yabiso.cd</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="text-emerald-500"><FaWhatsapp /></div>
                <span className="text-gray-300">Kinshasa, RD Congo</span>
              </li>
              <li className="mt-4">
                <Link to="/register" className="inline-block px-5 py-2.5 bg-[var(--accent-1)] hover:bg-[#ff5722] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md transform active:scale-95">
                  Devenir Fournisseur →
                </Link>
              </li>
            </ul>
          </div>

          {/* Bloc 4: Réseaux Sociaux & Rayonnement */}
          <div className="text-left md:text-right">
            <h4 className="text-white font-black mb-6 uppercase text-xs tracking-widest">Suivre l'impact</h4>
            <div className="flex justify-start md:justify-end gap-2.5">
              {socialLinks.map((item) => (
                <a 
                  key={item.label} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border-color)] flex items-center justify-center text-white shadow-md hover:bg-[var(--accent-1)] hover:border-[var(--accent-1)] transition-all duration-300" 
                  title={item.label} 
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="mt-6 text-[10px] text-gray-400 uppercase font-bold tracking-widest flex items-center justify-start md:justify-end gap-1">
              <FaMapMarkerAlt className="text-emerald-500" /> Connecté aux 26 provinces de la RDC.
            </p>
          </div>
        </div>

        {/* Barre de Copyright Finale */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase text-center md:text-left leading-relaxed">
            © {currentYear} YaBiso <span className="mx-2 hidden md:inline">|</span> <br className="md:hidden" /> Valorisation & Distribution de gros du Made in DRC
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-black text-gray-400">
            <button className="hover:text-[var(--accent-1)] transition-colors">Mentions Légales</button>
            <button className="hover:text-[var(--accent-1)] transition-colors">Confidentialité</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
