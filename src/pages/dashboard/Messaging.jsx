import React, { useState, useEffect, useCallback } from 'react';
import { FaBuilding, FaClock, FaComments } from 'react-icons/fa';
import messagingService from '../../services/messagingService';
import notificationService from '../../services/notificationService';
import EmptyState from './components/EmptyState';

export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await messagingService.getMyMessages();
      setMessages(data.filter((m) => !m.is_archived));
    } catch (error) {
      notificationService.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkRead = async (id) => {
    try {
      await messagingService.markAsRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    } catch (error) {
      notificationService.error(error.message);
    }
  };

  const handleArchive = async (id) => {
    try {
      await messagingService.archiveMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      notificationService.success('Message archivé.');
    } catch (error) {
      notificationService.error(error.message);
    }
  };

  return (
    <div className="space-y-4 text-white">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Centre de Messages</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Communications Partenaires B2B</p>
        </div>
        <div className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
          SYSTEM_ONLINE
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={FaComments}
          title="Aucun message pour le moment."
          description="Les demandes de vos acheteurs B2B apparaîtront ici dès réception."
        />
      ) : (
        messages.map((m) => (
          <div
            key={m.id}
            className={`group relative bg-[#1c2541]/40 backdrop-blur-md border ${
              !m.is_read ? 'border-emerald-500/30 ring-1 ring-emerald-500/20' : 'border-white/10'
            } p-6 rounded-3xl hover:border-emerald-500/40 transition-all shadow-xl`}
          >
            {!m.is_read && (
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Nouveau</span>
              </div>
            )}

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-white/5">
                <FaBuilding size={20} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-black text-white text-base leading-none">{m.sender_name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{m.sender_location || 'RD Congo'}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <FaClock size={10} /> {new Date(m.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <span className="inline-block px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                  Priorité {m.priority}
                </span>

                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6 italic border-l-2 border-white/10 pl-4">
                  "{m.content}"
                </p>

                <div className="flex gap-3">
                  {!m.is_read && (
                    <button
                      onClick={() => handleMarkRead(m.id)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95"
                    >
                      Marquer comme lu
                    </button>
                  )}
                  <button
                    onClick={() => handleArchive(m.id)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                  >
                    Archiver
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
