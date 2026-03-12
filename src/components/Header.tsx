import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import trackzioLogo from '@/assets/trackzio-logo.jpg';
import { apps } from '@/lib/appData';

const navItems = [
  { label: 'Home', to: '/', event: '' },
  { label: 'Our Apps', to: '/#apps', event: 'header_explore_apps', hasDropdown: true },
  { label: 'About Us', to: '/about', event: 'header_About us_apps' },
  { label: 'Blog', to: '/blog', event: 'header_blog_apps' },
  { label: 'Careers', to: '/careers', event: 'header_career_apps' },
  { label: 'Help Center', to: '/help', event: 'header_help center_apps' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleAppsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#apps');
    }
  };

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimer.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(dropdownTimer.current);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="container-site flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Trackzio Home">
          <img src={trackzioLogo} alt="Trackzio" className="h-8 rounded" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map(item => (
            <div
              key={item.to}
              className="relative"
              onMouseEnter={item.hasDropdown ? handleDropdownEnter : undefined}
              onMouseLeave={item.hasDropdown ? handleDropdownLeave : undefined}
            >
              {item.hasDropdown ? (
                <a
                  href="/#apps"
                  onClick={(e) => {
                    handleAppsClick(e);
                    item.event && trackEvent(item.event, { page_name: location.pathname });
                  }}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    location.pathname === '/apps'
                      ? 'text-primary font-bold'
                      : 'text-muted-foreground font-medium hover:text-primary'
                  }`}
                >
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </a>
              ) : (
                <Link
                  to={item.to}
                  onClick={() => item.event && trackEvent(item.event, { page_name: location.pathname })}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.to
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )}

              {/* Dropdown for Our Apps */}
              {item.hasDropdown && (
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-[35%] mt-1 rounded-2xl bg-card border border-border/40 p-4 z-50"
                      style={{ boxShadow: 'var(--shadow-card)', width: 'min(90vw, 780px)' }}
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="grid grid-cols-4 gap-3">
                        {apps.map(app => (
                          <Link
                            key={app.id}
                            to={`/apps/${app.id}`}
                            onClick={() => setDropdownOpen(false)}
                            className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-muted/60 transition-colors group"
                          >
                            <img src={app.logo} alt={app.name} className="w-12 h-12 rounded-xl mb-3 shrink-0" />
                            <div className="text-sm font-semibold text-foreground mb-1">{app.name}</div>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-auto line-clamp-2 min-h-[2.5rem]">{app.tagline}</p>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline mt-3">
                              Explore <ArrowRight size={11} />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/#apps"
            onClick={(e) => { handleAppsClick(e); trackEvent('header_explore_apps', { page_name: location.pathname }); }}
            className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 glow"
          >
            Explore Apps
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-muted-foreground hover:text-primary"
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
            className="md:hidden overflow-hidden border-t border-border/40 bg-background"
            aria-label="Mobile navigation"
          >
            <div className="container-site py-4 flex flex-col gap-1">
              {navItems.map(item => (
                item.hasDropdown ? (
                  <a
                    key={item.to}
                    href="/#apps"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      if (location.pathname === '/') {
                        document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/#apps');
                      }
                      item.event && trackEvent(item.event, { page_name: location.pathname });
                    }}
                    className="px-3 py-2.5 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      setOpen(false);
                      item.event && trackEvent(item.event, { page_name: location.pathname });
                    }}
                    className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.to
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <a
                href="/#apps"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  if (location.pathname === '/') {
                    document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/#apps');
                  }
                  trackEvent('header_explore_apps', { page_name: location.pathname });
                }}
                className="mt-2 flex h-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                Explore Apps
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
