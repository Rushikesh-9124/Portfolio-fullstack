'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '../../store/useStore';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certificates', label: 'Certs' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-3'
      }`}
    >
      {/* Proper container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* NAV BAR */}
        <div className="glass w-full rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            className="font-display text-sm sm:text-lg md:text-xl font-bold gradient-text truncate max-w-[60%]"
          >
            &lt; Portfolio /&gt;
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <button className="btn-ghost text-sm px-4 py-2">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-slate-400 hover:text-white px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="btn-primary text-sm px-5 py-2">
                  Admin
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`h-0.5 bg-white ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`${menuOpen ? 'opacity-0' : ''} h-0.5 bg-white`} />
              <span className={`h-0.5 bg-white ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* MOBILE MENU (FIXED POSITION) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute left-0 right-0 mt-2 px-4 sm:px-6"
            >
              <div className="glass rounded-xl p-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    {link.label}
                  </button>
                ))}

                <div className="pt-3 border-t border-white/10">
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard">
                        <button className="btn-primary w-full text-sm py-2.5">
                          Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full mt-2 text-sm text-slate-400 py-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login">
                      <button className="btn-primary w-full text-sm py-2.5">
                        Admin Login
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
}