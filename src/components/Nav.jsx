import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Star } from './Icons';
import { lockScroll } from '../lib/smooth';
import { EASE } from '../lib/misc';

const LINKS = [
  { to: '/collections', label: 'Collections' },
  { to: '/configure', label: 'Configure' },
  { to: '/atelier', label: 'Atelier' },
  { to: '/case-study', label: 'Case Study' },
];
const MOBILE_LINKS = [{ to: '/', label: 'Home' }, ...LINKS, { to: '/appointment', label: 'Appointment' }];

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Maison Aurelle — home">
      <span className="brand__mark">
        <Star size={11} />
      </span>
      <span className="brand__word">Maison Aurelle</span>
    </Link>
  );
}

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
    setSolid(y > 24);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${solid ? 'nav--solid' : ''} ${hidden && !open ? 'nav--hidden' : ''} ${open ? 'nav--open' : ''}`}>
        <div className="nav__inner">
          <Brand />
          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/appointment" className="btn btn--sm nav__cta">
            Book an appointment
          </Link>
          <button
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <nav aria-label="Mobile">
              {MOBILE_LINKS.map((l, i) => (
                <motion.div key={l.to} initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: EASE }}>
                  <NavLink to={l.to} end className={({ isActive }) => `menu__link ${isActive ? 'is-active' : ''}`}>
                    <span className="menu__num">0{i + 1}</span>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.p className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              Rue du Rhône, Genève · By appointment
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
