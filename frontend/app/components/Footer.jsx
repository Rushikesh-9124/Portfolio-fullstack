'use client';
export default function Footer({ about }) {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-sm font-body">
        <div>
          © {new Date().getFullYear()} <span className="gradient-text font-semibold">{about?.name || 'Portfolio'}</span>. Built with Next.js & ❤️
        </div>
        <div className="flex gap-5">
          {about?.github && <a href={about.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>}
          {about?.linkedin && <a href={about.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>}
          {about?.twitter && <a href={about.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>}
        </div>
      </div>
    </footer>
  );
}
