import './styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Portfolio — Full Stack Developer & AI Engineer',
  description: 'Personal portfolio showcasing projects, skills, and experience in Full Stack Development and AI/ML Engineering.',
  keywords: 'developer, portfolio, full stack, AI, ML, React, Next.js, Node.js',
  openGraph: {
    title: 'Portfolio — Full Stack Developer & AI Engineer',
    description: 'Personal portfolio showcasing projects, skills, and experience.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 10, 40, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#e2e8f0',
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '0.75rem',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#020008' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#020008' },
            },
          }}
        />
      </body>
    </html>
  );
}
