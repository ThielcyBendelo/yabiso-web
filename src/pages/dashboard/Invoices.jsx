import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFileInvoiceDollar, FaPlus, FaTimes, FaCheckDouble, FaHourglassHalf,
} from 'react-icons/fa';
import invoiceService from '../../services/invoiceService';
import notificationService from '../../services/notificationService';
import EmptyState from './components/EmptyState';

const EMPTY_FORM = { clientName: '', invoiceType: 'Vente Gros', amountUsd: '', status: 'En attente' };

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getMyInvoices();
      setInvoices(data);
    } catch (error) {
      notificationService.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const totalValidated = invoices.filter((i) => i.status === 'Validé').reduce((sum, i) => sum + i.amount_usd, 0);
  const totalPending = invoices.filter((i) => i.status === 'En attente').reduce((sum, i) => sum + i.amount_usd, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await invoiceService.createInvoice({ ...form, amountUsd: parseFloat(form.amountUsd) });
      notificationService.success('Facture enregistrée avec succès.');
      setShowForm(false);
      setForm(EMPTY_FORM);
      fetchInvoices();
    } catch (error) {
      notificationService.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-white">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight uppercase italic">Facturation <span className="text-[var(--accent-1)]">B2B</span></h3>
          <p className="text-xs text-slate-400 font-medium">Enregistrez vos quittances et suivez vos encaissements.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
            showForm ? 'bg-slate-800 text-white' : 'bg-[var(--accent-1)] hover:bg-orange-600 text-white'
          }`}
        >
          {showForm ? <FaTimes /> : <FaPlus />}
          {showForm ? 'Annuler' : 'Nouvelle facture'}
        </button>
      </div>

      {/* Résumé financier réel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Encaissé</p>
          <h3 className="text-3xl font-black mt-2 text-emerald-400">{totalValidated.toFixed(2)} <span className="text-sm">USD</span></h3>
        </div>
        <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Encours (En attente)</p>
          <h3 className="text-3xl font-black mt-2 text-yellow-400">{totalPending.toFixed(2)} <span className="text-sm">USD</span></h3>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Factures</p>
            <h3 className="text-3xl font-black mt-2 italic">{invoices.length.toString().padStart(2, '0')}</h3>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-slate-500">
            <FaFileInvoiceDollar size={24} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-[#1c2541]/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nom du client</label>
              <input
                type="text" required placeholder="Ex: Alimentation Kin-Marché"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Type</label>
              <select
                value={form.invoiceType}
                onChange={(e) => setForm({ ...form, invoiceType: e.target.value })}
                className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all appearance-none"
              >
                <option>Vente Gros</option>
                <option>Commande</option>
                <option>Réappro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Montant (USD)</label>
              <input
                type="number" step="0.01" required placeholder="0.00"
                value={form.amountUsd}
                onChange={(e) => setForm({ ...form, amountUsd: e.target.value })}
                className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-4 bg-[#0b132b]/60 border border-white/5 rounded-2xl text-sm focus:border-[var(--accent-1)] outline-none transition-all appearance-none"
              >
                <option>En attente</option>
                <option>Validé</option>
                <option>Annulé</option>
              </select>
            </div>
            <button
              type="submit" disabled={submitting}
              className="md:col-span-2 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer la facture'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-[var(--accent-1)] rounded-full animate-spin mb-4" />
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState icon={FaFileInvoiceDollar} title="Aucune facture enregistrée." description="Ajoutez votre première quittance B2B avec le bouton ci-dessus." />
      ) : (
        <div className="bg-[#1c2541]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 bg-slate-950/20">
                  <th className="p-6">Client / Type</th>
                  <th className="p-6">Date Émission</th>
                  <th className="p-6">Montant (Net)</th>
                  <th className="p-6 text-center">État Flux</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200">{inv.client_name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{inv.invoice_type}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-slate-400 font-medium">
                      {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-6">
                      <span className="text-base font-black text-emerald-400">{inv.amount_usd.toFixed(2)} $</span>
                    </td>
                    <td className="p-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        inv.status === 'Validé'
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                          : 'bg-yellow-500/5 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {inv.status === 'Validé' ? <FaCheckDouble size={10} /> : <FaHourglassHalf size={10} />}
                        {inv.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
