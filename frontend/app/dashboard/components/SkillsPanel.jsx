'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillsAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Frontend', 'Backend', 'AI/ML', 'Database', 'DevOps', 'Language', 'Other'];
const CAT_COLORS = {
  Frontend: '#6366f1', Backend: '#8b5cf6', 'AI/ML': '#06b6d4',
  Database: '#10b981', DevOps: '#f59e0b', Other: '#ec4899'
};

const EMPTY = { name: '', category: 'Frontend', level: 75, icon: '', color: '' };

function SkillForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 border border-indigo-500/20"
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Skill Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="React.js" className="input-glass" />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-glass">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
            Proficiency: {form.level}%
          </label>
          <input type="range" name="level" min="0" max="100" value={form.level} onChange={handleChange}
            className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Icon (emoji)</label>
          <input name="icon" value={form.icon} onChange={handleChange} placeholder="⚛️" className="input-glass" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} disabled={saving || !form.name}
          className="btn-primary px-6 py-2 text-sm disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Skill'}
        </button>
        <button onClick={onCancel} className="btn-ghost px-6 py-2 text-sm">Cancel</button>
      </div>
    </motion.div>
  );
}

export default function SkillsPanel() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const load = async () => {
    try {
      const res = await skillsAPI.getAll();
      setSkills(res.data.data);
    } catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await skillsAPI.create(form);
      toast.success('Skill added!');
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await skillsAPI.update(editId, form);
      toast.success('Skill updated!');
      setEditId(null);
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await skillsAPI.delete(id);
      toast.success('Skill deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = filterCat === 'All' ? skills : skills.filter(s => s.category === filterCat);
  const grouped = filtered.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Manage Skills</h2>
          <p className="text-slate-400 text-sm font-body mt-1">{skills.length} skills total</p>
        </div>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditId(null); }} className="btn-primary px-5 py-2.5 text-sm">
            + Add Skill
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="mb-6">
            <SkillForm initial={EMPTY} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
          </div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-body transition-all ${
              filterCat === cat ? 'gradient-bg text-white' : 'glass text-slate-400 hover:text-white'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      ) : (
        Object.entries(grouped).map(([cat, catSkills]) => (
          <div key={cat} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-0.5 rounded-full" style={{ background: CAT_COLORS[cat] || '#6366f1' }} />
              <h3 className="text-xs font-mono uppercase tracking-wider" style={{ color: CAT_COLORS[cat] || '#6366f1' }}>{cat}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {catSkills.map(skill => (
                <div key={skill._id}>
                  {editId === skill._id ? (
                    <SkillForm
                      initial={{ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon || '', color: skill.color || '' }}
                      onSave={handleUpdate}
                      onCancel={() => setEditId(null)}
                      saving={saving}
                    />
                  ) : (
                    <motion.div layout className="glass-card p-4 flex items-center gap-3 group">
                      <span className="text-xl shrink-0">{skill.icon || '◈'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-white text-sm font-body font-medium truncate">{skill.name}</span>
                          <span className="font-mono text-xs shrink-0" style={{ color: CAT_COLORS[skill.category] }}>{skill.level}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${CAT_COLORS[skill.category] || '#6366f1'}, ${CAT_COLORS[skill.category] || '#6366f1'}99)` }} />
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => { setEditId(skill._id); setShowForm(false); }}
                          className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors text-xs">✎</button>
                        <button onClick={() => handleDelete(skill._id, skill.name)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors text-xs">✕</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center text-slate-500 py-12 glass-card">
          No skills yet. Click "+ Add Skill" to get started.
        </div>
      )}
    </motion.div>
  );
}
