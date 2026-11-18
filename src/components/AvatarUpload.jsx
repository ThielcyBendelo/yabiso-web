import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaUser } from 'react-icons/fa';
import profileService from '../services/profileService';
import notificationService from '../services/notificationService';
import './AvatarUpload.css';

/**
 * Composant d'upload d'avatar/logo, branché sur le vrai endpoint backend
 * POST /api/profile/avatar. `avatarUrl` est l'URL déjà connue (ex: profil chargé par le parent).
 */
const AvatarUpload = ({ avatarUrl, onAvatarChange }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notificationService.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notificationService.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    // Aperçu local immédiat
    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);

    try {
      setLoading(true);
      const newAvatarUrl = await profileService.uploadAvatar(file);
      onAvatarChange?.(newAvatarUrl);
      notificationService.success('Avatar mis à jour avec succès');
    } catch (error) {
      notificationService.error(error.message || "Erreur lors de l'upload");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = preview || profileService.resolveAvatarUrl(avatarUrl);

  return (
    <div className="avatar-upload-container">
      <motion.div
        className="avatar-wrapper"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          borderColor: 'var(--accent-1)',
          backgroundColor: 'var(--surface)',
        }}
      >
        {displayAvatar ? (
          <img src={displayAvatar} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder bg-gradient-to-br from-emerald-500 to-sky-500">
            <FaUser size={40} color="white" />
          </div>
        )}

        <motion.div
          className="avatar-overlay"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <motion.div
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: loading ? 1 : 0, repeat: loading ? Infinity : 0 }}
          >
            <FaCamera size={24} color="white" />
          </motion.div>
        </motion.div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={loading}
        style={{ display: 'none' }}
      />

      <p className="avatar-hint text-slate-400">
        Cliquez pour changer votre avatar
      </p>
    </div>
  );
};

export default AvatarUpload;
