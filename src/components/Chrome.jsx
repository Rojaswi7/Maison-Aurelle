import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Star } from './Icons';
import { lockScroll } from '../lib/smooth';
import { EASE, intro } from '../lib/misc';

// A soft ring that trails the pointer and grows over interactive elements.
export function Cursor() {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    setEnabled(true);
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame;
    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target.closest?.('[data-cursor], a, button, label, select, [role="tab"]');
      setActive(!!target);
      setLabel(target?.dataset?.cursor ?? '');
    };
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    loop();
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={ref} className={`cursor ${active ? 'is-active' : ''} ${label ? 'has-label' : ''}`} aria-hidden="true">
      <span className="cursor__ring">
        <span className="cursor__label">{label}</span>
      </span>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

// First-visit intro: a counter fills while the fonts settle, then a curtain lifts.
export function Loader() {
  const [show, setShow] = useState(intro.pending);
  const countRef = useRef(null);

  useEffect(() => {
    if (!show) return undefined;
    lockScroll(true);
    let frame;
    let start;
    let done;
    const step = (t) => {
      start ??= t;
      const k = Math.min(1, (t - start) / 1700);
      if (countRef.current) countRef.current.textContent = String(Math.round((1 - Math.pow(1 - k, 3)) * 100)).padStart(3, '0');
      if (k < 1) frame = requestAnimationFrame(step);
      else done = setTimeout(() => setShow(false), 300);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
      lockScroll(false);
    };
  }, [show]);

  const finish = () => {
    intro.pending = false;
    try {
      sessionStorage.setItem('aurelle:intro', '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence onExitComplete={finish}>
      {show && (
        <motion.div className="loader" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: EASE }} aria-hidden="true">
          <motion.div className="loader__mark" initial={{ opacity: 0, scale: 0.6, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: EASE }}>
            <Star size={22} />
          </motion.div>
          <motion.p className="loader__word" initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={{ opacity: 1, letterSpacing: '0.5em' }} transition={{ duration: 1.6, ease: EASE }}>
            MAISON AURELLE
          </motion.p>
          <p className="loader__count">
            <span ref={countRef}>000</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
