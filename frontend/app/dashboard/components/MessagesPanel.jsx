'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contactAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function MessagesPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    try {
      const res = await contactAPI.getAll();
      setMessages(res.data.data);
    } catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    try {
      await contactAPI.markRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch { /* silent */ }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete message from "${name}"?`)) return;
    try {
      await contactAPI.delete(id);
      toast.success('Message deleted');
      setMessages(prev => prev.filter(m => m._id !== id));
      if (expanded === id) setExpanded(null);
    } catch { toast.error('Failed to delete'); }
  };

  const unread = messages.filter(m => !m.read).length;

  const toggle = (msg) => {
    setExpanded(expanded === msg._id ? null : msg._id);
    if (!msg.read) handleRead(msg._id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Messages</h2>
          <p className="text-slate-400 text-sm font-body mt-1">
            {messages.length} total · {unread > 0
              ? <span className="text-indigo-400">{unread} unread</span>
              : 'all read'}
          </p>
        </div>
        <button onClick={load} className="btn-ghost px-4 py-2 text-sm">↻ Refresh</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">✉️</div>
          <p>No messages yet. They'll appear here when someone uses your contact form.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <motion.div key={msg._id} layout className="glass-card overflow-hidden">
              {/* Header row */}
              <button
                onClick={() => toggle(msg)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full gradient-bg/30 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {msg.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-body font-medium ${msg.read ? 'text-slate-300' : 'text-white'}`}>
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    )}
                    {msg.subject && (
                      <span className="text-slate-500 text-sm truncate">— {msg.subject}</span>
                    )}
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-2">
                    <span>{msg.email}</span>
                    <span>·</span>
                    <span>{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <span className="text-slate-500 text-sm transition-transform duration-200"
                  style={{ transform: expanded === msg._id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▾
                </span>
              </button>

              {/* Expanded body */}
              <AnimatePresence>
                {expanded === msg._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-white/5">
                      <p className="text-slate-300 text-sm font-body leading-relaxed whitespace-pre-wrap mt-4 mb-5">
                        {msg.message}
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                          className="btn-primary text-xs px-4 py-2">
                          Reply ↗
                        </a>
                        <button onClick={() => handleDelete(msg._id, msg.name)}
                          className="btn-ghost text-xs px-4 py-2 text-red-400 hover:border-red-500/30">
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
