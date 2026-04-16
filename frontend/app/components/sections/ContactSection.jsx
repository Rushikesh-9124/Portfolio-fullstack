'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { contactAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ContactSection({ about }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.send(form);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[400px] h-[400px] bg-pink-600/10 bottom-0 left-0" />
        <div className="orb w-[300px] h-[300px] bg-indigo-600/15 top-10 right-10" />
      </div>

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-pink-400 font-mono text-sm tracking-widest uppercase">Let's Connect</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto font-body">
            Have a project in mind? Let's build something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {[
              { icon: '📧', label: 'Email', value: about?.email, href: `mailto:${about?.email}` },
              { icon: '📍', label: 'Location', value: about?.location },
              { icon: '💼', label: 'LinkedIn', value: about?.linkedin ? 'Connect with me' : null, href: about?.linkedin },
            ].filter(i => i.value).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl gradient-bg/20 border border-white/10 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-mono uppercase tracking-wider">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      className="text-white font-body hover:text-indigo-300 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <div className="text-white font-body">{item.value}</div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-body font-medium">Available for work</span>
              </div>
              <p className="text-slate-400 text-sm font-body">
                Open to full-time roles, freelance projects, and collaborations.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Name</label>
                  <input
                    name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your name"
                    className="input-glass"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Email</label>
                  <input
                    name="email" value={form.email} onChange={handleChange} required type="email"
                    placeholder="your@email.com"
                    className="input-glass"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Subject</label>
                <input
                  name="subject" value={form.subject} onChange={handleChange}
                  placeholder="What's it about?"
                  className="input-glass"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="input-glass resize-none"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
