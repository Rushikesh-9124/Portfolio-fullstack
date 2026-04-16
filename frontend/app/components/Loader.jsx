'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      // Natural variable speed
      const increment = count < 85 ? Math.floor(Math.random() * 8) + 1 : 1;
      count += increment;

      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        setTimeout(onComplete, 1000); // 1s delay at 100% for impact
      }
      setProgress(count);
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col justify-between p-6 md:p-12 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%", 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* 1. Global Shimmer Style */}
      <style jsx global>{`
        @keyframes skeleton-pulse {
          0% { opacity: 0.05; }
          50% { opacity: 0.15; }
          100% { opacity: 0.05; }
        }
        .skeleton-item {
          background: white;
          animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          border-radius: 8px;
        }
      `}</style>

      {/* 2. Top Navigation Skeleton & Brand */}
      <div className="flex justify-between items-start relative z-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm md:text-lg font-semibold text-gray-300"
        >
          MyPortfolio
        </motion.div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-item h-2 w-12 hidden md:block" />
          ))}
        </div>
      </div>

      {/* 3. Center Content (Text + Ghost Layout) */}
      <div className="relative flex flex-col items-center justify-center flex-grow">
        {/* Ghost UI Skeleton Layer (Behind Text) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
            <div className="skeleton-item h-12 w-48 rounded-full mb-8" />
            <div className="skeleton-item h-24 w-full max-w-3xl mb-4" />
            <div className="skeleton-item h-4 w-64 mb-12" />
            <div className="flex gap-4">
                <div className="skeleton-item h-12 w-32" />
                <div className="skeleton-item h-12 w-32" />
            </div>
        </div>

        {/* The Welcome Text (From your screenshot) */}
        <div className="max-w-4xl relative z-10 w-full text-left md:text-center">
          <motion.h1 
            className="text-3xl sm:text-5xl md:text-6xl text-gray-200 leading-[1.1] tracking-tight font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to my portfolio! <br />
            <span className="text-gray-500">
              Here, you will explore a showcase of creativity, innovation, and passion.
            </span>
          </motion.h1>
        </div>
      </div>

      {/* 4. Bottom Footer (Loading + Bold Percentage) */}
      <div className="flex justify-between items-end relative z-20">
        <div className="flex flex-col gap-2">
            <motion.span 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-xs md:text-sm text-gray-400 font-mono tracking-widest uppercase"
            >
              Loading Assets...
            </motion.span>
            {/* Progress line */}
            <div className="h-[1px] w-32 bg-white/10 relative overflow-hidden">
                <motion.div 
                    className="absolute inset-0 bg-white"
                    style={{ scaleX: progress / 100, transformOrigin: 'left' }}
                />
            </div>
        </div>

        <motion.span
          className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-gray-300 leading-none tabular-nums select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {progress}%
        </motion.span>
      </div>

      {/* Subtle Background Grid (Matches Hero Screenshot) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:60px_60px]" />
    </motion.div>
  );
}