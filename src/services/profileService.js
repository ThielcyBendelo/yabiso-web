// Service Profil Fournisseur : consultation, mise à jour, upload avatar/logo (backend réel)
import { apiFetch, resolveAssetUrl } from '../config/api';
import authService from './authService';

export const profileService = {
  /** Récupère le profil complet du fournisseur connecté. */
  getProfile: async () => {
    const data = await apiFetch('/profile');
    authService.updateStoredUser(data);
    return data;
  },

  /** Met à jour les champs éditables (manager_name, whatsapp_number, province, city, rccm, id_nat). */
  updateProfile: async (payload) => {
    const data = await apiFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    authService.updateStoredUser(data);
    return data;
  },

  /** Envoie une nouvelle image d'avatar/logo au backend. */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const data = await apiFetch('/profile/avatar', {
      method: 'POST',
      body: formData,
    });

    const currentUser = authService.getCurrentUser() || {};
    authService.updateStoredUser({ ...currentUser, avatar_url: data.avatar_url });
    return data.avatar_url;
  },

  resolveAvatarUrl: (avatarUrl) => resolveAssetUrl(avatarUrl),
};

export default profileService;
