'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { certificatesAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const EMPTY = { title: '', issuer: '', date: '', credentialId: '', credentialUrl: '', image: '', category: 'General' };

function CertForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 border border-indigo-500/20 mb-6">
      <h3 className="font-body font-semibold text-white mb-5">
        {initial.title ? `Edit: ${initial.title}` : 'New Certificate'}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: 'Title *', name: 'title', placeholder: 'AWS Certified Developer' },
          { label: 'Issuer *', name: 'issuer', placeholder: 'Amazon Web Services' },
          { label: 'Date', name: 'date', placeholder: 'Jan 2024' },
          { label: 'Category', name: 'category', placeholder: 'Cloud' },
          { label: 'Credential ID', name: 'credentialId', placeholder: 'ABC-123-DEF' },
          { label: 'Credential URL', name: 'credentialUrl', placeholder: 'https://...' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">{f.label}</label>
            <input name={f.name} value={form[f.name] || ''} onChange={handleChange}
              placeholder={f.placeholder} className="input-glass" />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Image URL</label>
        <input name="image" value={form.image || ''} onChange={handleChange}
          placeholder="https://... (certificate image)" className="input-glass" />
      </div>
      {form.image && (
        <div className="mb-4">
          <img src={form.image} alt="Preview" className="h-32 object-cover rounded-xl border border-white/10" />
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} disabled={saving || !form.title || !form.issuer}
          className="btn-primary px-6 py-2 text-sm disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Certificate'}
        </button>
        <button onClick={onCancel} className="btn-ghost px-6 py-2 text-sm">Cancel</button>
      </div>
    </motion.div>
  );
}

export default function CertificatesPanel() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCert, setEditCert] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await certificatesAPI.getAll();
      setCerts(res.data.data);
    } catch { toast.error('Failed to load certificates'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await certificatesAPI.create(form);
      toast.success('Certificate added!');
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await certificatesAPI.update(editCert._id, form);
      toast.success('Certificate updated!');
      setEditCert(null);
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await certificatesAPI.delete(id);
      toast.success('Certificate deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Manage Certificates</h2>
          <p className="text-slate-400 text-sm font-body mt-1">{certs.length} certificates total</p>
        </div>
        {!showForm && !editCert && (
          <button onClick={() => setShowForm(true)} className="btn-primary px-5 py-2.5 text-sm">
            + Add Certificate
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <CertForm initial={EMPTY} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map(cert => (
            <div key={cert._id}>
              {editCert?._id === cert._id ? (
                <CertForm initial={cert} onSave={handleUpdate} onCancel={() => setEditCert(null)} saving={saving} />
              ) : (
                <motion.div layout className="glass-card p-4 flex gap-4 group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 flex items-center justify-center">
                    {cert.image
                      ? <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                      : <span className="text-2xl">🏆</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body font-semibold text-white text-sm truncate">{cert.title}</h3>
                    <p className="text-indigo-300 text-xs mt-0.5">{cert.issuer}</p>
                    <div className="flex gap-2 mt-1">
                      {cert.date && <span className="text-slate-500 text-xs">{cert.date}</span>}
                      {cert.category && <span className="text-slate-600 text-xs">· {cert.category}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditCert(cert); setShowForm(false); }}
                      className="px-2.5 py-1 rounded-lg text-xs text-indigo-400 hover:bg-indigo-500/10 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(cert._id, cert.title)}
                      className="px-2.5 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && certs.length === 0 && (
        <div className="text-center text-slate-500 py-12 glass-card">
          No certificates yet. Click "+ Add Certificate" to get started.
        </div>
      )}
    </motion.div>
  );
}
