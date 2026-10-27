import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Close } from './Icons';
import { lockScroll } from '../lib/smooth';
import { EASE } from '../lib/misc';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Accessible dialog: focus moves in, is trapped, Escape closes, focus returns to the trigger.
export default function Modal({ open, onClose, label, variant = 'center', children }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const returnTo = document.activeElement;
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
      returnTo?.focus?.();
    };
  }, [open]);

  const drawer = variant === 'drawer';

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="modal" className={`modal modal--${variant}`} initial={{ opacity: 1 }} exit={{ opacity: 1, transition: { duration: 0.6 } }}>
          <motion.div className="modal__backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
          <motion.div
            ref={panelRef}
            className="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            data-lenis-prevent
            initial={drawer ? { x: '100%' } : { opacity: 0, y: 48, scale: 0.98 }}
            animate={drawer ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={drawer ? { x: '100%' } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <button className="modal__close icon-btn" onClick={onClose} aria-label="Close">
              <Close />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
