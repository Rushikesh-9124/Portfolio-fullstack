'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '../../../store/useStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navItems = [
  { id: 'overview',      icon: '◎', label: 'Overview' },
  { id: 'about',         icon: '👤', label: 'About' },
  { id: 'skills',        icon: '⚡', label: 'Skills' },
  { id: 'projects',      icon: '🚀', label: 'Projects' },
  { id: 'certificates',  icon: '🏆', label: 'Certificates' },
  { id: 'messages',      icon: '✉️', label: 'Messages' },
];

export default function DashboardSidebar({ active, setActive }) {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 shrink-0 glass rounded-2xl p-5 flex flex-col h-[calc(100vh-3rem)] sticky top-6"
    >
      {/* Logo */}
      <Link href="/" className="font-display text-lg font-bold gradient-text mb-8 block">
        &lt;Portfolio /&gt;
      </Link>

      {/* User */}
      <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-white/5">
        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.[0] || 'A'}
        </div>
        <div className="overflow-hidden">
          <div className="text-white text-sm font-body font-medium truncate">{user?.name}</div>
          <div className="text-slate-500 text-xs truncate">{user?.role}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-all duration-200 text-left ${
              active === item.id
                ? 'gradient-bg text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="mt-6 space-y-2 pt-4 border-t border-white/10">
        <Link href="/" target="_blank">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <span>↗</span> View Portfolio
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>⎋</span> Logout
        </button>
      </div>
    </motion.aside>
  );
}
