import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Watch from '../components/Watch';
import { Magnetic, Reveal, SplitWords } from '../components/Motion';
import { usePageTitle } from '../lib/misc';
import '../styles/atelier.css';

const TIMELINE = [
  { year: '1887', title: 'A bench by the Rhône', text: 'Aurèle Vautier, a cabinotier from Saint-Gervais, opens a two-person workshop above a bakery. The first Aurelle pocket watch takes eleven months.' },
  { year: '1924', title: 'The moon arrives', text: 'Our first moonphase calibre. Its lunar disc is hand-painted by Vautier’s daughter, Odile, who will run the Maison for forty years.' },
  { year: '1971', title: 'We said no', text: 'As quartz sweeps the industry, Aurelle refuses the battery. Production falls to nine watches a year. Three watchmakers stay.' },
  { year: '2003', title: 'Calibre AU-01', text: 'Our first movement designed entirely in-house: 312 components, 72 hours of reserve, and a balance bridge shaped like the letter A.' },
  { year: '2026', title: 'The open bench', text: 'Clients can now commission a watch online, then follow it from the bench — with a photograph from their watchmaker every week.' },
];

const METIERS = [
  { name: 'Guilloché', text: 'Patterns cut into gold by a hand-cranked rose engine from 1924.', hours: '38 h' },
  { name: 'Grand Feu enamel', text: 'Powdered glass, fired eight times at 800°C. One dial in three survives.', hours: '60 h' },
  { name: 'Anglage', text: 'Every bridge edge bevelled at 45° and polished by hand with wooden pegs.', hours: '52 h' },
  { name: 'Engraving', text: 'Inscriptions cut with a burin under magnification, letter by letter.', hours: '6 h' },
];

export default function Atelier() {
  usePageTitle('The Atelier — Maison Aurelle');
  return (
    <div className="atelier">
      <header className="container page-head atelier__head">
        <p className="atelier__ghost" aria-hidden="true">
          1887
        </p>
        <Reveal as="p" className="eyebrow">
          The Atelier
        </Reveal>
        <SplitWords as="h1" className="display" text="Patience is our *only* complication." animateNow delay={0.2} />
        <Reveal as="p" className="lede" delay={0.4}>
          For four generations and one hundred and thirty-nine years, eleven pairs of hands have done things the slow way. Here is what that has meant.
        </Reveal>
      </header>
      <Timeline />
      <section className="section metiers">
        <div className="container">
          <Reveal as="p" className="eyebrow">
            Les Métiers d’Art
          </Reveal>
          <SplitWords as="h2" className="h-xl" text="Four crafts, *hundreds* of hours." />
          <div className="metiers__grid">
            {METIERS.map((m, i) => (
              <Reveal key={m.name} className="metier" delay={i * 0.08}>
                <span className="metier__n">0{i + 1}</span>
                <h3 className="metier__name">{m.name}</h3>
                <p className="metier__text">{m.text}</p>
                <p className="metier__hours">
                  <span>{m.hours}</span> per watch
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--light founder">
        <div className="container founder__grid">
          <Reveal className="founder__watch">
            <Watch config={{ caseId: 'yellow', dialId: 'ivory', strapId: 'black', complication: 'small-seconds', indices: 'roman', hands: 'breguet', engraving: 'Aurèle Vautier · 1887' }} view="back" />
          </Reveal>
          <div>
            <SplitWords as="blockquote" className="founder__quote" text="“A watch should outlive the person who made it, *and the person who wears it.*”" />
            <Reveal as="p" className="founder__cite">
              Aurèle Vautier, founder — letter to his apprentice, 1891
            </Reveal>
            <Reveal>
              <Magnetic>
                <Link to="/configure" className="btn">
                  Commission your own
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

// Vertical scroll drives a horizontal journey through the Maison's history.
function Timeline() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useLayoutEffect(() => {
    const measure = () => trackRef.current && setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section ref={sectionRef} className="timeline" style={{ height: `calc(100vh + ${distance}px)` }} aria-label="Our history">
      <div className="timeline__sticky">
        <div className="container timeline__top">
          <p className="eyebrow">139 years in five moments</p>
          <div className="timeline__bar" aria-hidden="true">
            <motion.span style={{ scaleX: bar }} />
          </div>
        </div>
        <motion.ol ref={trackRef} className="timeline__track" style={{ x }}>
          {TIMELINE.map((t) => (
            <li key={t.year} className="moment">
              <p className="moment__year">{t.year}</p>
              <h3 className="moment__title">{t.title}</h3>
              <p className="moment__text">{t.text}</p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
