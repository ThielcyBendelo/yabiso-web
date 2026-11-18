// Service Facturation B2B : enregistrement et consultation des factures du fournisseur (backend réel)
import { apiFetch } from '../config/api';

export const invoiceService = {
  /** Liste les factures enregistrées par le fournisseur connecté. */
  getMyInvoices: async () => {
    return apiFetch('/invoices');
  },

  /** Enregistre une nouvelle facture / quittance. */
  createInvoice: async ({ clientName, invoiceType, amountUsd, status }) => {
    return apiFetch('/invoices', {
      method: 'POST',
      body: JSON.stringify({
        client_name: clientName,
        invoice_type: invoiceType,
        amount_usd: amountUsd,
        status: status || 'En attente',
      }),
    });
  },
};

export default invoiceService;
