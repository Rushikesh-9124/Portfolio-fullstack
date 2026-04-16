'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aboutAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const inputCls = 'input-glass';
const labelCls = 'block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2';

function Field({ label, name, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} name={name} value={value || ''} onChange={onChange}
        placeholder={placeholder} className={inputCls} />
    </div>
  );
}

export default function AboutPanel({ onSaved }) {
  const [form, setForm] = useState({
    name: '', title: '', subtitle: '', bio: '', email: '', phone: '',
    location: '', github: '', linkedin: '', twitter: '', resume: '',
    avatar: '', yearsExperience: '', projectsCompleted: '', timeline: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    aboutAPI.get().then(res => {
      const d = res.data.data;
      setForm({ ...d, yearsExperience: d.yearsExperience || '', projectsCompleted: d.projectsCompleted || '' });
    }).catch(() => toast.error('Failed to load about data'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleTimelineChange = (i, field, val) => {
    setForm(p => {
      const tl = [...p.timeline];
      tl[i] = { ...tl[i], [field]: val };
      return { ...p, timeline: tl };
    });
  };

  const addTimelineItem = () => setForm(p => ({
    ...p,
    timeline: [...p.timeline, { year: '', title: '', company: '', description: '', type: 'work' }]
  }));

  const removeTimelineItem = (i) => setForm(p => ({
    ...p, timeline: p.timeline.filter((_, idx) => idx !== i)
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await aboutAPI.update(form);
      toast.success('About section updated!');
      onSaved?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="font-display text-2xl font-bold text-white mb-6">Manage About</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6">
          <h3 className="font-body font-semibold text-white mb-5 text-sm uppercase tracking-wider">Basic Info</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Alex Johnson" />
            <Field label="Title" name="title" value={form.title} onChange={handleChange} placeholder="Full Stack Developer" />
            <Field label="Subtitle" name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="AI/ML Engineer" />
            <Field label="Location" name="location" value={form.location} onChange={handleChange} placeholder="San Francisco, CA" />
            <Field label="Years Experience" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} type="number" />
            <Field label="Projects Completed" name="projectsCompleted" value={form.projectsCompleted} onChange={handleChange} type="number" />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Bio</label>
            <textarea name="bio" value={form.bio || ''} onChange={handleChange} rows={4}
              placeholder="Write a short bio about yourself..."
              className="input-glass resize-none" />
          </div>
          <div className="mt-4">
            <Field label="Avatar URL" name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        {/* Contact & Social */}
        <div className="glass-card p-6">
          <h3 className="font-body font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact & Social</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Field label="GitHub URL" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
            <Field label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            <Field label="Twitter URL" name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
            <Field label="Resume URL" name="resume" value={form.resume} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-body font-semibold text-white text-sm uppercase tracking-wider">Timeline / Journey</h3>
            <button type="button" onClick={addTimelineItem} className="btn-ghost text-xs px-4 py-2">
              + Add Entry
            </button>
          </div>
          <div className="space-y-4">
            {form.timeline.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className={labelCls}>Year</label>
                    <input value={item.year} onChange={e => handleTimelineChange(i, 'year', e.target.value)}
                      placeholder="2024" className="input-glass text-sm py-2" />
                  </div>
                  <div>
                    <label className={labelCls}>Type</label>
                    <select value={item.type} onChange={e => handleTimelineChange(i, 'type', e.target.value)}
                      className="input-glass text-sm py-2">
                      <option value="work">Work</option>
                      <option value="education">Education</option>
                      <option value="achievement">Achievement</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Title</label>
                    <input value={item.title} onChange={e => handleTimelineChange(i, 'title', e.target.value)}
                      placeholder="Senior Developer" className="input-glass text-sm py-2" />
                  </div>
                  <div>
                    <label className={labelCls}>Company</label>
                    <input value={item.company} onChange={e => handleTimelineChange(i, 'company', e.target.value)}
                      placeholder="Acme Corp" className="input-glass text-sm py-2" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <input value={item.description} onChange={e => handleTimelineChange(i, 'description', e.target.value)}
                    placeholder="Brief description..." className="input-glass text-sm py-2 flex-1" />
                  <button type="button" onClick={() => removeTimelineItem(i)}
                    className="px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm">✕</button>
                </div>
              </div>
            ))}
            {form.timeline.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-6">No timeline entries yet. Click "+ Add Entry" to start.</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary px-8 py-3 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </motion.div>
  );
}
