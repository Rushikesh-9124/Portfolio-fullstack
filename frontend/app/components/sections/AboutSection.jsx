'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const typeColors = {
  work: 'bg-indigo-500',
  education: 'bg-violet-500',
  achievement: 'bg-cyan-500',
};

export default function AboutSection({ about }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (!about) return null;

  return (
    <section
      id="about"
      className="relative py-10 sm:py-16 md:py-20 px-4 overflow-hidden"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[250px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[350px] md:h-[400px] bg-violet-600/10 top-1/4 -right-20" />
      </div>

      <div className="container-custom max-w-6xl mx-auto">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <span className="text-indigo-400 font-mono text-xs sm:text-sm tracking-widest uppercase">
            Who I Am
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white mt-2 sm:mt-3">
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass-card p-4 sm:p-6 md:p-8">
              
              {/* Profile */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-6">
                {about.avatar ? (
                  <img
                    src={about.avatar}
                    alt={about.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-bg flex items-center justify-center text-white font-display text-2xl sm:text-3xl font-bold">
                    {about.name?.[0]}
                  </div>
                )}

                <div>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {about.name}
                  </h3>
                  <p className="gradient-text font-body text-sm sm:text-base">
                    {about.title}
                  </p>
                  {about.subtitle && (
                    <p className="text-slate-500 text-xs sm:text-sm">
                      {about.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {about.bio}
              </p>

              {/* Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { icon: '📍', label: 'Location', value: about.location },
                  { icon: '📧', label: 'Email', value: about.email },
                ]
                  .filter(i => i.value)
                  .map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span>{item.icon}</span>
                      <div>
                        <div className="text-slate-500 text-xs">
                          {item.label}
                        </div>
                        <div className="text-slate-300 break-words">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Social */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
  {about.github && (
    <a
      href={about.github}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-ghost text-xs px-3 py-1.5 whitespace-nowrap"
    >
      GitHub ↗
    </a>
  )}

  {about.linkedin && (
    <a
      href={about.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-ghost text-xs px-3 py-1.5 whitespace-nowrap"
    >
      LinkedIn ↗
    </a>
  )}

  {about.twitter && (
    <a
      href={about.twitter}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-ghost text-xs px-3 py-1.5 whitespace-nowrap"
    >
      Twitter ↗
    </a>
  )}
</div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6">
              Journey
            </h3>

            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-violet-500/40 to-transparent" />

              <div className="space-y-4 sm:space-y-6">
                {(about.timeline || []).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex gap-4 sm:gap-6 pl-8 sm:pl-10 relative"
                  >
                    <div className={`absolute left-1.5 sm:left-2 top-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-current ${typeColors[item.type] || 'bg-indigo-500'}`} />

                    <div className="glass-card p-3 sm:p-4 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-white">
                          {item.title}
                        </h4>
                        <span className="text-xs text-indigo-400 shrink-0">
                          {item.year}
                        </span>
                      </div>

                      <p className="text-indigo-300 text-xs sm:text-sm">
                        {item.company}
                      </p>

                      {item.description && (
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}