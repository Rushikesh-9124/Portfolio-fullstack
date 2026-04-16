'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useStore';
import { projectsAPI, skillsAPI, certificatesAPI, contactAPI } from '../../lib/api';
import DashboardSidebar from './components/DashboardSidebar';
import OverviewPanel from './components/OverviewPanel';
import AboutPanel from './components/AboutPanel';
import SkillsPanel from './components/SkillsPanel';
import ProjectsPanel from './components/ProjectsPanel';
import CertificatesPanel from './components/CertificatesPanel';
import MessagesPanel from './components/MessagesPanel';

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const [stats, setStats] = useState({ projects: 0, skills: 0, certificates: 0, messages: 0 });
  const [mobileNav, setMobileNav] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load stats for overview
  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.allSettled([
      projectsAPI.getAll(),
      skillsAPI.getAll(),
      certificatesAPI.getAll(),
      contactAPI.getAll(),
    ]).then(([proj, skills, certs, msgs]) => {
      setStats({
        projects:     proj.status     === 'fulfilled' ? proj.value.data.data.length     : 0,
        skills:       skills.status   === 'fulfilled' ? skills.value.data.data.length   : 0,
        certificates: certs.status    === 'fulfilled' ? certs.value.data.data.length    : 0,
        messages:     msgs.status     === 'fulfilled' ? msgs.value.data.data.length     : 0,
      });
    });
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const panels = {
    overview:     <OverviewPanel stats={stats} />,
    about:        <AboutPanel />,
    skills:       <SkillsPanel />,
    projects:     <ProjectsPanel />,
    certificates: <CertificatesPanel />,
    messages:     <MessagesPanel />,
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-indigo-600/10 -top-40 -left-40" />
        <div className="orb w-[500px] h-[500px] bg-violet-600/8 bottom-0 right-0" />
      </div>

      <div className="flex gap-6 p-6 relative z-10">
        {/* Sidebar — desktop */}
        <div className="hidden lg:block">
          <DashboardSidebar active={active} setActive={setActive} />
        </div>

        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 glass border-b border-white/5">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold gradient-text">&lt;Dashboard /&gt;</span>
            <button onClick={() => setMobileNav(!mobileNav)}
              className="p-2 rounded-lg glass text-slate-300">☰</button>
          </div>
          {mobileNav && (
            <div className="mt-3 space-y-1">
              {['overview','about','skills','projects','certificates','messages'].map(id => (
                <button key={id} onClick={() => { setActive(id); setMobileNav(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm capitalize transition-all ${
                    active === id ? 'gradient-bg text-white' : 'text-slate-400 hover:bg-white/5'
                  }`}>
                  {id}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 lg:mt-0 mt-16">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {panels[active]}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
