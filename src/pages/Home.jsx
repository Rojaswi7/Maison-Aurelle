import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Watch from '../components/Watch';
import ProductCard from '../components/ProductCard';
import { CountUp, Magnetic, Marquee, Reveal, SplitWords } from '../components/Motion';
import { Arrow } from '../components/Icons';
import { getModel } from '../data/collections';
import { cases, configToParams, defaultConfig, dials } from '../data/watch';
import { EASE, intro, usePageTitle } from '../lib/misc';
import '../styles/home.css';

const HERO_CONFIG = { caseId: 'rose', dialId: 'midnight', strapId: 'black', complication: 'moonphase', indices: 'baton', hands: 'dauphine', engraving: '' };

const CALLOUTS = [
  { n: '01', title: 'Calibre AU-01', text: '312 components, assembled by a single watchmaker. Seventy-two hours of power.', range: [0.08, 0.3] },
  { n: '02', title: 'Sunburst dial', text: 'Brushed by hand from the centre outwards, then lacquered in eleven coats.', range: [0.3, 0.5] },
  { n: '03', title: 'Box sapphire', text: 'A domed crystal, anti-reflective on both faces, set by hand.', range: [0.5, 0.7] },
];

export default function Home() {
  usePageTitle('Maison Aurelle — Haute Horlogerie, Genève');
  return (
    <>
      <Hero />
      <Marquee items={['Hand-finished in Genève', '72-hour power reserve', 'Côtes de Genève', 'Grand Feu enamel', '88 pieces a year', 'Serviced for life']} />
      <Featured />
      <Craft />
      <DialPlay />
      <Voices />
      <CtaBand />
    </>
  );
}

function Hero() {
  const ref = useRef(null);
  const [delay] = useState(() => (intro.pending ? 2.2 : 0.2));
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const explodeRaw = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const explode = useSpring(explodeRaw, { stiffness: 110, damping: 26, mass: 0.4 });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.12], [0, -50]);
  const watchScale = useTransform(scrollYProgress, [0, 0.72, 1], [0.94, 1.04, 0.86]);
  const watchY = useTransform(scrollYProgress, [0.72, 1], ['0vh', '-7vh']);
  const finaleOpacity = useTransform(scrollYProgress, [0.76, 0.9], [0, 1]);
  const finaleY = useTransform(scrollYProgress, [0.76, 0.9], [40, 0]);
  const rail = useTransform(scrollYProgress, [0.08, 0.7], [0, 1]);
  const calloutsOpacity = useTransform(scrollYProgress, [0.7, 0.76], [1, 0]);

  return (
    <section ref={ref} className="hero" aria-label="Introduction">
      <div className="hero__sticky">
        <div className="hero__glow" aria-hidden="true" />

        <motion.div className="hero__title" style={{ opacity: titleOpacity, y: titleY }}>
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 1 }}>
            Haute Horlogerie · Genève · Depuis 1887
          </motion.p>
          <h1 className="display hero__h1">
            {[
              'Time,',
              <>
                <em>composed</em> by hand.
              </>,
            ].map((line, i) => (
              <span className="line-mask" key={i}>
                <motion.span className="line" initial={{ y: '115%' }} animate={{ y: '0%' }} transition={{ duration: 1.3, ease: EASE, delay: delay + 0.1 + i * 0.12 }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div className="hero__watch-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: EASE, delay }}>
          <motion.div className="hero__watch" style={{ scale: watchScale, y: watchY }}>
            <Watch config={HERO_CONFIG} explode={explode} label="A Maison Aurelle Lune Céleste assembling as you scroll" />
          </motion.div>
        </motion.div>

        <motion.div className="hero__callouts" style={{ opacity: calloutsOpacity }}>
          <div className="hero__rail" aria-hidden="true">
            <motion.span style={{ scaleY: rail }} />
          </div>
          {CALLOUTS.map((c) => (
            <Callout key={c.n} progress={scrollYProgress} {...c} />
          ))}
        </motion.div>

        <motion.div className="hero__finale" style={{ opacity: finaleOpacity, y: finaleY }}>
          <h2 className="hero__finale-title">
            Three hundred and twelve parts. <em>One heartbeat.</em>
          </h2>
          <div className="hero__ctas">
            <Magnetic>
              <Link to="/configure" className="btn btn--solid">
                Begin your commission
              </Link>
            </Magnetic>
            <Link to="/collections" className="link-arrow">
              Explore the collection <Arrow />
            </Link>
          </div>
        </motion.div>

        <motion.div className="hero__scroll" style={{ opacity: titleOpacity }} aria-hidden="true">
          <span>Scroll to assemble</span>
          <span className="hero__scroll-line" />
        </motion.div>
      </div>
    </section>
  );
}

function Callout({ progress, n, title, text, range: [a, b] }) {
  const opacity = useTransform(progress, [a, a + 0.05, b - 0.05, b], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, a + 0.05, b - 0.05, b], [24, 0, 0, -24]);
  return (
    <motion.div className="callout" style={{ opacity, y }}>
      <p className="callout__n">{n} / 03</p>
      <h3 className="callout__title">{title}</h3>
      <p className="callout__text">{text}</p>
    </motion.div>
  );
}

function Featured() {
  const picks = ['lune', 'eternel', 'classique'].map(getModel);
  return (
    <section className="section featured">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal as="p" className="eyebrow">
              The Collection
            </Reveal>
            <SplitWords as="h2" className="h-xl" text="Eight references. *No* two alike." />
          </div>
          <Reveal>
            <Link to="/collections" className="link-arrow">
              View all references <Arrow />
            </Link>
          </Reveal>
        </div>
        <div className="featured__grid">
          {picks.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.12}>
              <Link to={`/collections?model=${m.id}`} className="card-link" data-cursor="View" aria-label={`View ${m.name}`}>
                <ProductCard model={m} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', title: 'Conception', text: 'Every reference begins as a graphite drawing at ten times scale. Proportions are argued over for weeks before a single tool is cut.', meta: '240 hours' },
  { n: '02', title: 'The movement', text: 'Plates and bridges are milled in-house, then each of the 312 components is inspected under a loupe — and rejected if it would not please the eye.', meta: '312 components' },
  { n: '03', title: 'Finishing', text: 'Côtes de Genève, perlage, black polish and hand-bevelled angles. The parts nobody sees receive the same care as the ones everybody does.', meta: '96 hours' },
  { n: '04', title: 'Regulation', text: 'Each watch is tested for 21 days in six positions and three temperatures before it is allowed to leave the bench.', meta: '21 days' },
];

function Craft() {
  return (
    <section className="section section--light craft">
      <div className="container craft__grid">
        <div className="craft__visual">
          <div className="craft__watch">
            <Watch config={{ ...HERO_CONFIG, engraving: 'Fait main à Genève' }} view="back" label="The caseback, showing the hand-finished movement" />
          </div>
          <p className="craft__caption">Calibre AU-01 seen through the sapphire caseback — live.</p>
        </div>
        <div className="craft__content">
          <Reveal as="p" className="eyebrow">
            The Craft
          </Reveal>
          <SplitWords as="h2" className="h-xl" text="What happens in the *nine months* you wait." />
          <ol className="craft__steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} className="craft__step" delay={i * 0.05}>
                <span className="craft__n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
                <span className="craft__meta">{s.meta}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
      <div className="container stats">
        {[
          { to: 312, label: 'Components per calibre' },
          { to: 72, label: 'Hours of power reserve' },
          { to: 1887, label: 'The year it began', format: String },
          { to: 88, label: 'Watches made each year' },
        ].map((s, i) => (
          <Reveal key={s.label} className="stat" delay={i * 0.08}>
            <p className="stat__num">
              <CountUp to={s.to} format={s.format} />
            </p>
            <p className="stat__label">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function DialPlay() {
  const [dialId, setDialId] = useState('forest');
  const [caseId, setCaseId] = useState('yellow');
  const config = { ...defaultConfig, dialId, caseId, strapId: 'cognac', complication: 'date', indices: 'roman', hands: 'leaf' };
  const dial = dials.find((d) => d.id === dialId);

  return (
    <section className="section playground" style={{ '--glow': dial.base }}>
      <div className="container playground__grid">
        <div className="playground__copy">
          <Reveal as="p" className="eyebrow">
            Make it yours
          </Reveal>
          <SplitWords as="h2" className="h-xl" text="Four thousand five hundred ways to say *mine.*" />
          <Reveal as="p" className="lede">
            Try it here. Every change renders instantly, on a watch that keeps the real time.
          </Reveal>
          <Reveal className="swatches">
            <fieldset>
              <legend>Dial — {dial.name}</legend>
              <div className="swatches__row">
                {dials.map((d) => (
                  <label key={d.id} className="swatch" title={d.name}>
                    <input type="radio" name="play-dial" className="sr-only" checked={dialId === d.id} onChange={() => setDialId(d.id)} />
                    <span className="swatch__dot" style={{ background: `radial-gradient(circle at 35% 30%, ${d.base}, ${d.edge})` }} />
                    <span className="sr-only">{d.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Case — {cases.find((c) => c.id === caseId).name}</legend>
              <div className="swatches__row">
                {cases.map((c) => (
                  <label key={c.id} className="swatch" title={c.name}>
                    <input type="radio" name="play-case" className="sr-only" checked={caseId === c.id} onChange={() => setCaseId(c.id)} />
                    <span className="swatch__dot" style={{ background: `linear-gradient(135deg, ${c.stops.join(', ')})` }} />
                    <span className="sr-only">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </Reveal>
          <Reveal>
            <Magnetic>
              <Link to={`/configure?${configToParams(config)}`} className="btn">
                Continue in the configurator
              </Link>
            </Magnetic>
          </Reveal>
        </div>
        <div className="playground__watch">
          <Watch config={config} />
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  { q: 'I asked for my daughter’s birth time on the caseback. They set the moon to the night she was born.', who: 'Private client', where: 'Singapore' },
  { q: 'The appointment felt less like a sale and more like being welcomed into a family workshop.', who: 'Collector since 2014', where: 'Milan' },
  { q: 'Fourteen months for a tourbillon, and a photograph from the bench every week. Worth every one.', who: 'Private client', where: 'New York' },
];
const QUOTE_MS = 6500;

function Voices() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % QUOTES.length), QUOTE_MS);
    return () => clearTimeout(t);
  }, [index, paused]);

  const go = (d) => setIndex((i) => (i + d + QUOTES.length) % QUOTES.length);
  const quote = QUOTES[index];

  return (
    <section
      className="section voices"
      aria-roledescription="carousel"
      aria-label="Client stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container voices__inner">
        <Reveal as="p" className="eyebrow">
          Letters to the Maison
        </Reveal>
        <div className="voices__stage" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease: EASE }}>
              <blockquote className="voices__quote">“{quote.q}”</blockquote>
              <figcaption className="voices__who">
                {quote.who} <span>· {quote.where}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="voices__controls">
          <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous story">
            <Arrow dir="left" />
          </button>
          <div className="voices__dots">
            {QUOTES.map((_, i) => (
              <button key={i} className={`voices__dot ${i === index ? 'is-active' : ''}`} onClick={() => setIndex(i)} aria-label={`Story ${i + 1}`} aria-current={i === index}>
                {i === index && <span key={index} style={{ animationDuration: `${QUOTE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} />}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={() => go(1)} aria-label="Next story">
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <SplitWords as="h2" className="display cta-band__title" text="Every Aurelle begins with a *conversation.*" />
        <Reveal className="cta-band__side">
          <p>In Genève, Paris, London, Dubai or Tokyo — or by private video call, wherever you are.</p>
          <div className="cta-band__actions">
            <Magnetic>
              <Link to="/appointment" className="btn btn--solid">
                Book an appointment
              </Link>
            </Magnetic>
            <Link to="/configure" className="link-arrow">
              Or start configuring <Arrow />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
