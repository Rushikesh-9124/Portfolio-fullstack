'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../lib/api';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  // useEffect(()=>{
  //   const token = localStorage.getItem("token");
  //   if(token.length != 0){
  //     redirect('/dashboard')
  //   }

  // }, [])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-indigo-600/20 -top-40 -left-40" />
      <div className="orb w-[400px] h-[400px] bg-violet-600/15 -bottom-20 -right-20" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="glass-strong rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="font-display text-2xl font-bold gradient-text">&lt;Portfolio /&gt;</Link>
            <h1 className="text-white font-display text-3xl font-bold mt-4">Welcome Back</h1>
            <p className="text-slate-400 font-body mt-2">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="admin@example.com"
                className="input-glass"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Password</label>
              <input
                name="password" type="password" value={form.password} onChange={handleChange} required
                placeholder="••••••••"
                className="input-glass"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-4 text-base mt-2 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

        </div>

        <p className="text-center text-slate-600 text-xs mt-6 font-mono">
          ← <Link href="/" className="hover:text-slate-400 transition-colors">Back to portfolio</Link>
        </p>
      </motion.div>
    </div>
  );
}
