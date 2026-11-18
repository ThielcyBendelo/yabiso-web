// Service Statistiques du Tableau de Bord : données réelles agrégées depuis MongoDB
import { apiFetch } from '../config/api';

export const dashboardService = {
  /** Récupère les statistiques réelles du fournisseur (produits, messages, factures). */
  getStats: async () => {
    return apiFetch('/dashboard/stats');
  },
};

export default dashboardService;
