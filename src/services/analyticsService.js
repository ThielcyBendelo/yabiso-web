export const analyticsService = {
  // Enregistre une vue de page
  trackPageView: (pageName) => {
    console.log(`[LikuFi Analytics] Page consultée : ${pageName}`);
    // Plus tard : Axios.post('${import.meta.env.VITE_API_URL}/api/analytics/page', { page: pageName })
  },

  // Enregistre un clic sur un bouton d'action fournisseur (WhatsApp, Appel)
  trackSupplierClick: (supplierName, actionType) => {
    console.log(`[LikuFi Analytics] Action [${actionType}] déclenchée pour le fournisseur : ${supplierName}`);
    // Plus tard : Envoi vers le serveur Python pour incrémenter le compteur du dashboard
  }
};

export default analyticsService;
