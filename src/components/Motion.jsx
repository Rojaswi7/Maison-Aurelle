import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { EASE } from '../lib/misc';

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

export function Reveal({ children, delay = 0, y = 40, as = 'div', className, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

// Words rise out of a mask one by one. Wrap words in *asterisks* to italicise them.
export function SplitWords({ text, as = 'h2', className = '', delay = 0, animateNow = false }) {
  const Comp = motion[as];
  let open = false;
  const words = text.split(' ').map((word) => {
    const italic = open || word.includes('*');
    if ((word.match(/\*/g) ?? []).length % 2) open = !open;
    return { italic, clean: word.replace(/\*/g, '') };
  });
  const trigger = animateNow ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT };
  return (
    <Comp className={className} initial="hidden" {...trigger} transition={{ staggerChildren: 0.07, delayChildren: delay }} aria-label={text.replace(/\*/g, '')}>
      {words.map(({ italic, clean }, i) => {
        return (
          <span key={i} aria-hidden="true">
            <span className="split__mask">
              <motion.span
                className="split__word"
                variants={{ hidden: { y: '115%' }, show: { y: '0%', transition: { duration: 1.1, ease: EASE } } }}
              >
                {italic ? <em>{clean}</em> : clean}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </span>
        );
      })}
    </Comp>
  );
}

export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.3 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.3 });
  const move = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span ref={ref} className="magnetic" style={{ x, y }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  );
}

export function TiltCard({ children, className = '', max = 9 }) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,236,200,.16), transparent 55%)`;
  const move = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max);
    rx.set(-(py - 0.5) * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.div ref={ref} className={`tilt ${className}`} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }} onPointerMove={move} onPointerLeave={leave}>
      <motion.div className="tilt__glare" style={{ background: glare }} aria-hidden="true" />
      {children}
    </motion.div>
  );
}

const plain = (n) => n.toLocaleString('en-US');

export function CountUp({ to, duration = 2.2, format = plain }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEWPORT);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, format]);
  return <span ref={ref}>{format(0)}</span>;
}

// Rolls smoothly from the previous number to the new one.
export function AnimatedNumber({ value, format }) {
  const ref = useRef(null);
  const prev = useRef(value);
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(Math.round(v));
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, format]);
  return (
    <span ref={ref} aria-live="polite">
      {format(value)}
    </span>
  );
}

export function Marquee({ items }) {
  const row = items.map((item, i) => (
    <span key={i} className="marquee__item">
      {item}
      <span className="marquee__star" aria-hidden="true">
        ✦
      </span>
    </span>
  ));
  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="marquee__track" aria-hidden="true">
        {row}
        {row}
      </div>
    </div>
  );
}
