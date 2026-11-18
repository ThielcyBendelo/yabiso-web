import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { init, send } from '@emailjs/browser';
//  Votre ligne d'import corrigée :
import { 
  FaEnvelope, FaLinkedin, FaInstagram, FaFacebook, 
  FaWhatsapp, FaUser, FaPaperPlane, FaMapMarkerAlt, FaPhone 
} from 'react-icons/fa';


import useIntersectionObserver from '../hooks/useIntersectionObserver';
import notificationService from '../services/notificationService';
import analyticsService from '../services/analyticsService';
import messagingService from '../services/messagingService'; // ✅ Importation simplifiée corrigée (Plus de 404)

export default function Contact() {
  const [elementRef, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) init(EMAILJS_PUBLIC_KEY);
  }, [EMAILJS_PUBLIC_KEY]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Envoi...' });
    
    // Suivi Analytics de soumission de formulaire
    analyticsService.trackSupplierClick("Formulaire Contact Général", "Soumission");

    // Fallback de messagerie si EmailJS n'est pas encore configuré
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      const mailtoLink = `mailto:support@likufi.cd?subject=Contact LikuFi de ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message)}`;
      window.location.href = mailtoLink;
      notificationService.success('Client de messagerie ouvert ! 🇨🇩');
      setStatus({ type: 'success', message: 'Envoyé via mailto !' });
      return;
    }

    try {
      await send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.name,
        to_reply: formData.email,
        message: formData.message,
        to_email: 'support@likufi.cd',
      });

      // Sauvegarde locale ou synchronisation via le service
      await messagingService.sendMessage({
        senderName: formData.name,
        senderEmail: formData.email,
        message: formData.message,
        timestamp: new Date().toISOString(),
      });

      notificationService.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '' });
      setStatus({ type: 'success', message: 'Envoyé !' });
    } catch (err) {
      notificationService.error("Erreur lors de l'envoi du message.");
      setStatus({ type: 'error', message: 'Erreur' });
    }
  };

  return (
    <section ref={elementRef} id="contact" className="py-20 px-6 bg-[var(--bg)] transition-colors duration-500 text-[var(--text-primary)]">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full border border-[var(--accent-1)]/30 bg-[var(--accent-1)]/10 text-[var(--accent-1)] text-xs font-bold uppercase tracking-widest">
            Assistance & Support
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-4">Entrons en Contact</h2>
          <div className="h-1.5 w-24 bg-[var(--accent-1)] mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* INFOS DE CONTACT (2 colonnes) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border-color)] shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Nos Coordonnées</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-[var(--bg)] border border-[var(--border-color)] rounded-2xl flex items-center justify-center text-[var(--accent-1)] shadow-sm group-hover:scale-110 transition-transform">
                    <FaEnvelope />
                  </div>
                  <p className="text-gray-300">support@likufi.cd</p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-[var(--bg)] border border-[var(--border-color)] rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                    <FaWorkspace />
                  </div>
                  <p className="text-gray-300">+243 977 644 971</p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-[var(--bg)] border border-[var(--border-color)] rounded-2xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt />
                  </div>
                  <p className="text-gray-300">Kinshasa, RD Congo</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-4">Suivez notre impact</p>
                <div className="flex gap-4">
                  {[FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--border-color)] flex items-center justify-center text-white hover:bg-[var(--accent-1)] hover:text-white transition-all shadow-sm">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FORMULAIRE (3 colonnes) */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-[var(--surface)] shadow-2xl rounded-[40px] p-8 md:p-12 border border-[var(--border-color)]">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-black uppercase text-[var(--muted-2)] mb-2 ml-2">Votre Nom / Entreprise</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-4 text-[var(--accent-1)]" />
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:border-[var(--accent-1)] text-white text-sm"
                      placeholder="Ets. Elikya" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[var(--muted-2)] mb-2 ml-2">Votre Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-4 text-[var(--accent-1)]" />
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:border-[var(--accent-1)] text-white text-sm"
                      placeholder="contact@entreprise.cd" 
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-black uppercase text-[var(--muted-2)] mb-2 ml-2">Votre Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required
                  className="w-full p-6 bg-[var(--bg)] border border-[var(--border-color)] rounded-3xl h-40 focus:outline-none focus:border-[var(--accent-1)] text-white text-sm"
                  placeholder="Expliquez-nous votre besoin ou vos difficultés d'inscription..." 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-[var(--accent-1)] hover:bg-[#ff5722] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl transform active:scale-95 duration-150"
              >
                <FaPaperPlane /> {status.type === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
