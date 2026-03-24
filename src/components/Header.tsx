import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import trackzioLogo from '@/assets/trackzio-logo.jpg';
import { apps } from '@/lib/appData';

const megaMenuApps = apps
  .filter(app => ['coinzy', 'banknotes', 'insecto', 'habiteazy', 'rockzy'].includes(app.id))
  .map(app => ({ id: app.id, name: app.name, tagline: app.tagline, logo: app.logo, hasPage: true }));

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
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownTimer = useRef<ReturnType<typeof setTimeout>>();

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
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen(prev => !prev);
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
                </button>
              ) : (
                <Link
                  to={item.to}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    item.event && trackEvent(item.event, { page_name: location.pathname });
                  }}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    location.pathname === item.to
                      ? 'text-primary font-bold'
                      : 'text-muted-foreground font-medium hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setDropdownOpen(prev => !prev); trackEvent('header_explore_apps', { page_name: location.pathname }); }}
            className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 glow"
          >
            Explore Apps
          </button>
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

      {/* Mega Menu Dropdown — viewport centered */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block fixed w-[min(92vw,520px)] rounded-2xl border border-border/30 z-50 overflow-hidden"
            style={{
              left: '25%',
              transform: 'translateX(-50%)',
              top: 'calc(4rem + 4px)',
              background: 'hsl(38 35% 97%)',
              boxShadow: '0 20px 60px -12px hsla(0 0% 0% / 0.12), 0 4px 16px -4px hsla(0 0% 0% / 0.06)',
            }}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-4 px-1">Our Apps</p>
              <div className="grid grid-cols-3 gap-2">
                {megaMenuApps.map(app => (
                  <Link
                    key={app.id}
                    to={`/apps/${app.id}`}
                    onClick={() => { setDropdownOpen(false); window.scrollTo(0, 0); }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all duration-150 hover:bg-muted/50 hover:border-border/40 active:scale-[0.98]"
                  >
                    <img src={app.logo} alt={app.name} className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground leading-tight">{app.name}</div>
                      <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-1">{app.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div key={item.to}>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileAppsOpen(prev => !prev);
                        item.event && trackEvent(item.event, { page_name: location.pathname });
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAppsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileAppsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-1 px-2 py-2">
                            {megaMenuApps.map(app => (
                              <Link
                                key={app.id}
                                to={`/apps/${app.id}`}
                                onClick={() => { setMobileAppsOpen(false); setOpen(false); window.scrollTo(0, 0); }}
                                className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-muted/50"
                              >
                                <img src={app.logo} alt={app.name} className="w-8 h-8 rounded-lg shrink-0" />
                                <span className="text-sm font-medium text-foreground">{app.name}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      setOpen(false);
                      window.scrollTo(0, 0);
                      item.event && trackEvent(item.event, { page_name: location.pathname });
                    }}
                    className={`px-3 py-2.5 text-sm rounded-md transition-colors ${
                      location.pathname === item.to
                        ? 'text-primary font-bold'
                        : 'text-muted-foreground font-medium hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileAppsOpen(prev => !prev);
                  trackEvent('header_explore_apps', { page_name: location.pathname });
                }}
                className="mt-2 flex h-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                Explore Apps
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
