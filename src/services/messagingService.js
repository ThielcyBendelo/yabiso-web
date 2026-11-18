import { apiFetch } from '../config/api';

export const messagingService = {
  // Envoie le message du formulaire de contact public (page Contact)
  sendMessage: async (messageData) => {
    console.log("[LikuFi Messaging] Envoi du message en cours...", messageData);
    
    // Simulation d'une attente réseau et d'une réponse de l'API Python
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation de réussite
        resolve({ success: true, message: "Votre message a été transmis avec succès au fournisseur !" });
      }, 1000);
    });
  },

  // --- Messagerie B2B réelle du tableau de bord fournisseur ---

  /** Récupère les vrais messages reçus par le fournisseur connecté (backend). */
  getMyMessages: async () => {
    return apiFetch('/messages');
  },

  /** Marque un message comme lu. */
  markAsRead: async (messageId) => {
    return apiFetch(`/messages/${messageId}/read`, { method: 'PATCH' });
  },

  /** Archive un message. */
  archiveMessage: async (messageId) => {
    return apiFetch(`/messages/${messageId}/archive`, { method: 'PATCH' });
  },
};

export default messagingService;
