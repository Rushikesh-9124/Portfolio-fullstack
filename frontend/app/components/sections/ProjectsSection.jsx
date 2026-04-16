'use client';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

const CATEGORIES = ['All', 'Web App', 'Mobile', 'AI/ML', 'API', 'Other'];

/* =========================
   PROJECT CARD
========================= */
function ProjectCard({ project, index, inView }) {
  return (
    <motion.div
      style={{
        position: 'sticky',
        top: '120px',
        zIndex: index + 1,
        marginTop: index === 0 ? '0px' : '80px',
      }}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden group flex flex-col md:flex-row min-h-[260px] md:h-[300px]"
    >
      {/* IMAGE */}
      <div className="w-full md:w-1/2 h-[180px] md:h-full relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-violet-900/40">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="font-display text-5xl md:text-6xl font-bold gradient-text opacity-20">
              {project.title?.[0]}
            </div>
          </div>
        )}

        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-mono bg-indigo-500/80 text-white backdrop-blur-sm">
            ★ Featured
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#020008]/80 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              {project.title}
            </h3>
            <span className="text-xs font-mono text-slate-500 shrink-0">
              {project.category}
            </span>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
            {(project.techStack || []).slice(0, 5).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 text-[10px] sm:text-xs font-mono rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 text-center whitespace-nowrap"
            >
              GitHub ↗
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 text-center whitespace-nowrap"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* =========================
   MAIN SECTION
========================= */
export default function ProjectsSection({ projects = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  // ✅ SORT: Featured projects first
  const sorted = [...filtered].sort((a, b) => {
    return (b.featured === true) - (a.featured === true);
  });

  return (
    <section
      id="projects"
      className="relative py-16 sm:py-20 md:py-24 px-4"
      ref={ref}
    >
      <div className="container-custom max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            My <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8 sm:mb-10 md:mb-12 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                activeFilter === cat
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* STACK */}
        <AnimatePresence>
          <div
            className="flex flex-col relative"
            style={{
              paddingBottom: `${(sorted.length - 1) * 5}px`,
            }}
          >
            {sorted.map((project, i) => (
              <ProjectCard
                key={project._id || i}
                project={project}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        </AnimatePresence>

        {/* Empty */}
        {sorted.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No projects found.
          </div>
        )}
      </div>
    </section>
  );
}
