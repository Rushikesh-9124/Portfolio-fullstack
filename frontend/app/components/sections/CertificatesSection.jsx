'use client';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

function CertModal({ cert, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(2,0,8,0.85)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="glass-strong rounded-2xl p-6 max-w-lg w-full"
          onClick={e => e.stopPropagation()}
        >
          {cert.image && (
            <img src={cert.image} alt={cert.title} className="w-full h-48 object-cover rounded-xl mb-5" />
          )}
          <h3 className="font-display text-xl font-bold text-white mb-2">{cert.title}</h3>
          <p className="text-indigo-300 font-body mb-1">{cert.issuer}</p>
          {cert.date && <p className="text-slate-500 text-sm mb-4">{cert.date}</p>}
          {cert.credentialId && (
            <p className="font-mono text-xs text-slate-400 mb-4">ID: {cert.credentialId}</p>
          )}
          <div className="flex gap-3">
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex-1 text-center py-2.5">
                Verify ↗
              </a>
            )}
            <button onClick={onClose} className="btn-ghost text-sm flex-1 py-2.5">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CertificatesSection({ certificates = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [selected, setSelected] = useState(null);

  return (
    <section id="certificates" className="section-padding relative" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase">Credentials</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">
            Certifi<span className="gradient-text">cations</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }}
              className="glass-card p-5 cursor-pointer"
              onClick={() => setSelected(cert)}
            >
              {cert.image ? (
                <div className="h-32 mb-4 overflow-hidden rounded-xl">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 mb-4 rounded-xl gradient-bg/20 border border-white/10 flex items-center justify-center">
                  <span className="text-4xl">🏆</span>
                </div>
              )}
              <h3 className="font-body font-semibold text-white text-sm mb-1 line-clamp-2">{cert.title}</h3>
              <p className="text-indigo-400 text-xs font-body">{cert.issuer}</p>
              {cert.date && <p className="text-slate-600 text-xs mt-1">{cert.date}</p>}
              <div className="mt-3 text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                View details →
              </div>
            </motion.div>
          ))}
        </div>

        {certificates.length === 0 && (
          <div className="text-center text-slate-500 py-12">No certificates added yet.</div>
        )}
      </div>

      {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
