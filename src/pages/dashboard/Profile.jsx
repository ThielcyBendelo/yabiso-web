import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheckCircle, FaWhatsapp, FaIdCard, FaFingerprint, FaBriefcase, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import profileService from '../../services/profileService';
import authService from '../../services/authService';
import notificationService from '../../services/notificationService';
import AvatarUpload from '../../components/AvatarUpload';

const PROVINCES = [
  'Kinshasa', 'Kongo Central', 'Nord-Kivu', 'Sud-Kivu',
  'Lualaba', 'Haut-Katanga', 'Tshopo', 'Équateur', 'Kasaï-Central',
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileService.getProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          manager_name: data.manager_name || '',
          whatsapp_number: data.whatsapp_number || '',
          province: data.province || '',
          city: data.city || '',
          rccm: data.rccm || '',
          id_nat: data.id_nat || '',
        });
      })
      .catch((err) => notificationService.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = (avatarUrl) => {
    setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(form);
      setProfile(updated);
      notificationService.success('Profil mis à jour avec succès.');
    } catch (error) {
      notificationService.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile || !form) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl text-white">

      {/* Header Profil avec Statut de Vérification */}
      <div className={`bg-gradient-to-r ${profile.is_verified ? 'from-emerald-500/20' : 'from-yellow-500/20'} to-transparent p-6 rounded-3xl border ${profile.is_verified ? 'border-emerald-500/20' : 'border-yellow-500/20'} flex flex-col md:flex-row items-center gap-6`}>
        <div className={`w-20 h-20 ${profile.is_verified ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-yellow-500 shadow-yellow-500/20'} rounded-3xl flex items-center justify-center text-white shadow-2xl`}>
          <FaShieldAlt size={32} />
        </div>
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              {profile.is_verified ? 'Profil Vérifié' : 'Vérification en cours'}
            </h3>
            {profile.is_verified && <FaCheckCircle className="text-emerald-400" />}
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
            {profile.is_verified
              ? 'Votre établissement est conforme aux normes de transparence YaBiso.'
              : 'Votre dossier RCCM / ID NAT est en cours de contrôle par notre équipe de modération.'}
          </p>
        </div>
      </div>

      {/* Avatar / Logo */}
      <div className="bg-[#1c2541]/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 self-start">Logo / Avatar de l'entreprise</h3>
        <AvatarUpload avatarUrl={profile.avatar_url} onAvatarChange={handleAvatarChange} />
      </div>

      {/* Formulaire de Données */}
      <form onSubmit={handleSubmit} className="bg-[#1c2541]/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 opacity-5 text-white pointer-events-none">
          <FaFingerprint size={200} />
        </div>

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FaBriefcase className="text-[var(--accent-1)]" /> Raison Sociale (Lecture seule)
              </label>
              <input
                type="text" disabled value={profile.company_name || ''}
                className="w-full p-4 rounded-2xl bg-[#141d36]/60 border border-white/5 text-slate-500 text-sm font-bold cursor-not-allowed italic"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FaUser className="text-sky-400" /> Nom du Responsable
              </label>
              <input
                type="text" value={form.manager_name}
                onChange={(e) => setForm({ ...form, manager_name: e.target.value })}
                className="w-full p-4 rounded-2xl bg-[#0b132b]/60 border border-white/5 text-white text-sm font-bold focus:border-[var(--accent-1)] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FaWhatsapp className="text-emerald-500" /> Liaison WhatsApp Directe
              </label>
              <input
                type="text" value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                className="w-full p-4 rounded-2xl bg-[#0b132b]/60 border border-white/5 text-white text-sm font-bold focus:border-[var(--accent-1)] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" /> Province
              </label>
              <select
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                className="w-full p-4 rounded-2xl bg-[#0b132b]/60 border border-white/5 text-white text-sm focus:border-[var(--accent-1)] outline-none transition-all appearance-none"
              >
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" /> Ville / Territoire
              </label>
              <input
                type="text" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-4 rounded-2xl bg-[#0b132b]/60 border border-white/5 text-white text-sm focus:border-[var(--accent-1)] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FaIdCard className="text-blue-400" /> Numéro RCCM Officiel
              </label>
              <input
                type="text" value={form.rccm}
                onChange={(e) => setForm({ ...form, rccm: e.target.value })}
                className="w-full p-4 rounded-2xl bg-[#0b132b]/60 border border-white/5 text-white text-sm focus:border-[var(--accent-1)] outline-none transition-all font-mono tracking-wider"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <FaFingerprint className="text-purple-400" /> Identification Nationale (ID NAT)
              </label>
              <input
                type="text" value={form.id_nat}
                onChange={(e) => setForm({ ...form, id_nat: e.target.value })}
                className="w-full p-4 rounded-2xl bg-[#0b132b]/60 border border-white/5 text-white text-sm focus:border-[var(--accent-1)] outline-none transition-all font-mono tracking-wider"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] text-slate-500 font-bold uppercase max-w-sm leading-relaxed">
              Toute modification des données légales nécessite une nouvelle validation par nos services de modération.
            </p>
            <button
              type="submit" disabled={saving}
              className="w-full md:w-auto px-8 py-4 bg-[var(--accent-1)] hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? 'Synchronisation...' : 'Synchroniser les données'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
