'use client';
import { motion } from 'framer-motion';

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          {icon}
        </div>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">{label}</div>
      </div>
      <div className="font-display text-4xl font-bold" style={{ color }}>{value}</div>
    </motion.div>
  );
}

export default function OverviewPanel({ stats }) {
  const cards = [
    { icon: '🚀', label: 'Projects',     value: stats.projects,     color: '#6366f1', delay: 0.05 },
    { icon: '⚡', label: 'Skills',       value: stats.skills,       color: '#8b5cf6', delay: 0.1  },
    { icon: '🏆', label: 'Certificates', value: stats.certificates, color: '#06b6d4', delay: 0.15 },
    { icon: '✉️', label: 'Messages',     value: stats.messages,     color: '#10b981', delay: 0.2  },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h2 className="font-display text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 font-body mt-1">Manage your portfolio content</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Quick tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="font-body font-semibold text-white mb-4">Quick Start Guide</h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Update your About section with your name, bio, and social links', section: 'about' },
            { step: '2', text: 'Add your technical skills with proficiency levels', section: 'skills' },
            { step: '3', text: 'Showcase your projects with descriptions and links', section: 'projects' },
            { step: '4', text: 'Upload your certifications to build credibility', section: 'certificates' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                {item.step}
              </div>
              <p className="text-slate-400 text-sm font-body leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
