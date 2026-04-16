'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const CATEGORY_COLORS = {
  Frontend: { from: '#6366f1', to: '#818cf8', glow: 'rgba(99,102,241,0.3)' },
  Backend: { from: '#8b5cf6', to: '#a78bfa', glow: 'rgba(139,92,246,0.3)' },
  'AI/ML': { from: '#06b6d4', to: '#67e8f9', glow: 'rgba(6,182,212,0.3)' },
  Database: { from: '#10b981', to: '#6ee7b7', glow: 'rgba(16,185,129,0.3)' },
  DevOps: { from: '#f59e0b', to: '#fcd34d', glow: 'rgba(245,158,11,0.3)' },
  Other: { from: '#ec4899', to: '#f9a8d4', glow: 'rgba(236,72,153,0.3)' },
};

function SkillCard({ skill, index, inView }) {
  const colors = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ scale: 1.05 }}
      className="px-5 py-3 rounded-full text-xs font-medium flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
      style={{
        color: colors.from,
        boxShadow: `0 0 10px ${colors.glow}`
      }}
    >
      {skill.icon && <span>{skill.icon}</span>}
      <span className="text-white">{skill.name}</span>

      
    </motion.div>
  );
}

export default function SkillsSection({ skills = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  // 🔥 SORT BY LEVEL (important first)
  const sortedSkills = [...skills].sort((a, b) => b.level - a.level);

  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filtered =
    activeCategory === 'All'
      ? sortedSkills
      : sortedSkills.filter(s => s.category === activeCategory);

  // Group by category
  const grouped = filtered.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="section-padding relative" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[500px] h-[500px] bg-cyan-600/10 -top-20 -left-20" />
      </div>

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
            What I Know
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">
            My <span className="gradient-text">Skills</span>
          </h2>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowAll(false);
              }}
              className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        {Object.entries(grouped).map(([category, catSkills], catIdx) => (
          <div key={category} className="mb-6 ">

            {/* Category Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: catIdx * 0.1 }}
              className="flex items-center justify-center gap-3 mb-5"
            >
              <div
                className="w-8 h-0.5 rounded-full "
                style={{
                  background: `linear-gradient(90deg, ${
                    CATEGORY_COLORS[category]?.from || '#6366f1'
                  }, transparent)`
                }}
              />
              <h3
                className="font-body font-semibold text-sm tracking-wider uppercase"
                style={{
                  color: CATEGORY_COLORS[category]?.from || '#6366f1'
                }}
              >
                {category}
              </h3>
            </motion.div>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2">
              {(showAll ? catSkills : catSkills.slice(0, 6)).map((skill, i) => (
                <SkillCard key={skill._id || i} skill={skill} index={i} inView={inView} />
              ))}
            </div>

            {/* 🔥 Show More / Less */}
            {catSkills.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className="text-sm text-cyan-400 hover:underline"
                >
                  {showAll ? 'Show Less' : `Show More (${catSkills.length - 6}+ more)`}
                </button>
              </div>
            )}

          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            No skills added yet.
          </div>
        )}
      </div>
    </section>
  );
}