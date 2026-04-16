'use client';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

export default function HeroSection({ about }) {
  const name = about?.name || 'Your Name';
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="">
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-indigo-600/20 -top-32 -left-32" style={{ animationDelay: '0s' }} />
        <div className="orb w-[500px] h-[500px] bg-violet-600/15 top-1/2 -right-40" style={{ animationDelay: '2s' }} />
        <div className="orb w-[400px] h-[400px] bg-cyan-600/10 bottom-0 left-1/3" style={{ animationDelay: '4s' }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container-custom relative z-10  text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-300 font-body">Available for opportunities</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none"
        >
          <span className="text-white">Hi, I'm </span>
          <span className="gradient-text text-glow">{name}</span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl md:text-3xl text-slate-400 mb-8 font-body font-light h-10"
        >
          <TypeAnimation
            sequence={[
              'Full Stack Developer', 2000,
              'AI/ML Engineer', 2000,
              'UI/UX Enthusiast', 2000,
              'Problem Solver', 2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="gradient-text-cyan"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg leading-relaxed font-body"
        >
          {about?.bio || 'Building beautiful, high-performance applications with modern technologies. Passionate about AI, clean code, and exceptional user experiences.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button onClick={() => scrollTo('#projects')} className="btn-primary text-base px-8 py-4 glow-indigo">
            View My Work ↓
          </button>
          <button onClick={() => scrollTo('#contact')} className="btn-ghost text-base px-8 py-4">
            Get In Touch
          </button>
          {about?.resume && (
            <a href={about.resume} target="_blank" rel="noopener noreferrer">
              <button className="btn-ghost text-base px-8 py-4">
                Download CV ↗
              </button>
            </a>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: about?.yearsExperience || '5+', label: 'Years Exp.' },
            { value: about?.projectsCompleted || '30+', label: 'Projects' },
            { value: '100%', label: 'Dedication' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-body">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
    </div>
  );
    
}
