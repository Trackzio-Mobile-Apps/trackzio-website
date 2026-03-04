import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import trackzioLogo from '@/assets/trackzio-logo.jpg';

const navItems = [
  { label: 'Home', to: '/', event: '' },
  { label: 'Apps', to: '/apps', event: 'header_explore_apps' },
  { label: 'About Us', to: '/about', event: 'header_About us_apps' },
  { label: 'Blog', to: '/blog', event: 'header_blog_apps' },
  { label: 'Careers', to: '/careers', event: 'header_career_apps' },
  { label: 'Help Center', to: '/help', event: 'header_help center_apps' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 backdrop-blur-xl" style={{ backgroundColor: 'hsl(210 40% 98% / 0.85)' }}>
      <div className="container-site flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Trackzio Home">
          <img src={trackzioLogo} alt="Trackzio" className="h-8 rounded" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => item.event && trackEvent(item.event, { page_name: location.pathname })}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === item.to
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/apps"
            onClick={() => trackEvent('header_explore_apps', { page_name: location.pathname })}
            className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 glow"
          >
            Explore Apps
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
            aria-label="Mobile navigation"
          >
            <div className="container-site py-4 flex flex-col gap-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    setOpen(false);
                    item.event && trackEvent(item.event, { page_name: location.pathname });
                  }}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.to
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/apps"
                onClick={() => { setOpen(false); trackEvent('header_explore_apps', { page_name: location.pathname }); }}
                className="mt-2 flex h-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
              >
                Explore Apps
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
