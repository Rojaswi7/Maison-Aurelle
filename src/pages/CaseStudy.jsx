import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, SplitWords } from '../components/Motion';
import { Arrow } from '../components/Icons';
import { scrollToElement } from '../lib/smooth';
import { usePageTitle } from '../lib/misc';
import { site } from '../data/site';
import '../styles/casestudy.css';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The problem' },
  { id: 'users', label: 'Who it’s for' },
  { id: 'principles', label: 'Principles' },
  { id: 'decisions', label: 'Key decisions' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'metrics', label: 'Measuring success' },
  { id: 'next', label: 'What’s next' },
];

const PERSONAS = [
  {
    name: 'The First Commission',
    who: 'Aanya, 34 · founder, Bengaluru',
    need: 'Wants to understand exactly what she’s paying for before she talks to anyone.',
    fear: '“I don’t want to look like I don’t know what a tourbillon is.”',
    design: 'Plain-language notes on every option, prices always visible, a configurator she can explore privately.',
  },
  {
    name: 'The Collector',
    who: 'Henrik, 58 · owns 23 watches, Zürich',
    need: 'Wants specifications, rarity and provenance — and hates being rushed into a sale.',
    fear: '“Every brand site is the same carousel and a ‘Price on request’ button.”',
    design: 'Spec sheets in every quick view, production numbers, a history told in years, not adjectives.',
  },
  {
    name: 'The Gifter',
    who: 'Leo, 41 · anniversary gift, Dubai',
    need: 'Needs guidance, an engraving, and certainty about when it will arrive.',
    fear: '“What if it isn’t ready in time?”',
    design: 'Lead time shown live as he configures, engraving previewed on the real caseback, a shareable link.',
  },
];

const PRINCIPLES = [
  { title: 'Unhurried', text: 'Motion is slow and eased (0.6–1.3s, ease-out). Nothing flashes, nothing autoplays with sound. The site should feel like a boutique, not a sale.' },
  { title: 'Show, don’t list', text: 'Every option renders live on the watch itself. No thumbnails, no “image may differ”. What you see is exactly what will be made.' },
  { title: 'Price with dignity', text: 'Prices are always visible and every option shows its delta. Hiding the price behind “on request” protects the brand but erodes trust.' },
  { title: 'Conversation over checkout', text: 'The primary conversion is a booked appointment, not a cart. A CHF 60,000 decision deserves a person, and the site’s job is to prepare both sides for that meeting.' },
];

const DECISIONS = [
  {
    n: '01',
    title: 'A hero that assembles as you scroll',
    why: 'In four seconds of scrolling, the visitor watches 312 parts become one watch. It tells the craft story without a paragraph of copy.',
    tradeoff: 'Scroll-driven animation can feel like scroll-jacking. We never take control of the scroll, we only bind to it: speed, direction and stopping stay with the user. With reduced motion turned on, the smooth scrolling and intro are switched off.',
  },
  {
    n: '02',
    title: 'A live SVG watch instead of photography',
    why: '5 cases × 5 dials × 5 straps × 4 complications × 3 indices × 3 hands = 4,500 combinations. Photographing them would be impossible; rendering them in code is instant, resolution-independent and tiny. The hands show the visitor’s real local time, and the moonphase shows tonight’s actual moon.',
    tradeoff: 'Less photographic realism than 3D renders. For a first concept, I chose speed and full coverage. Hero photography can be layered on later without changing the flow.',
  },
  {
    n: '03',
    title: 'A configurator built around one persistent preview',
    why: 'Six tabbed steps with the watch always in view and a running total that animates on every change. Moving to the engraving step turns the watch over automatically, because that is where the words will go.',
    tradeoff: 'Tabs rather than a single long form means more clicks, but each decision gets the user’s full attention. All steps stay reachable, so experts can jump straight to what they care about.',
  },
  {
    n: '04',
    title: 'The configuration lives in the URL',
    why: 'Every change is encoded in the address and autosaved. Refresh-safe, back-button-safe, and shareable: the Gifter can send it to a friend, and the advisor sees the same watch before the meeting.',
    tradeoff: 'Long URLs look technical, so the “Copy share link” action hides that and confirms with a toast.',
  },
  {
    n: '05',
    title: 'Booking that is honest about availability',
    why: 'Four steps with a visible progress bar, editable from the review screen. Reserved slots are shown rather than hidden, so scarcity is real, not manufactured. The saved configuration comes along to the booking, and confirmation adds the appointment straight to the client’s calendar (.ics).',
    tradeoff: 'Showing reserved slots can frustrate users. Placing them next to open ones keeps the choice clear and reinforces exclusivity honestly.',
  },
  {
    n: '06',
    title: 'Quick view as a URL, not just a modal',
    why: 'Opening a watch in the collection updates the URL. The back button closes it (as people expect on mobile), and any watch can be linked to directly, for example from the home page.',
    tradeoff: 'Slightly more routing logic, in exchange for behaviour that never surprises people.',
  },
];

const A11Y = [
  'Semantic landmarks, a skip link and one h1 per page',
  'Native radio inputs behind every custom option card, so keyboard and screen-reader support come for free',
  'ARIA tabs in the configurator with arrow-key, Home and End navigation',
  'Dialogs trap focus, close on Escape and return focus to where it came from',
  'prefers-reduced-motion turns off smooth scrolling, the intro and decorative animation',
  'Inline form validation on blur, with errors linked through aria-describedby',
  'Visible focus rings everywhere; a custom cursor that adds to the native one and never replaces it',
  'Body text meets WCAG AA contrast on both dark and ivory surfaces',
];

const METRICS = [
  { metric: 'Qualified appointments / 1,000 sessions', why: 'North-star: the business outcome the site exists for', target: '≥ 6' },
  { metric: 'Configurator start rate', why: 'Does the home page create desire to personalise?', target: '≥ 25%' },
  { metric: 'Configurator completion (reaches review)', why: 'Is the flow clear, and are the prices acceptable?', target: '≥ 40%' },
  { metric: 'Configuration → appointment', why: 'Does the handoff from browsing to talking work?', target: '≥ 12%' },
  { metric: 'Share-link copies per configuration', why: 'A proxy for gifting and social proof', target: 'Track' },
  { metric: 'Appointment no-show rate', why: 'Do calendar invites and the confirmation copy set expectations?', target: '≤ 10%' },
];

export default function CaseStudy() {
  usePageTitle('Design case study — Maison Aurelle');
  const [active, setActive] = useState(SECTIONS[0].id);

  // Scroll-spy: highlight the section currently being read.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="cs">
      <header className="container page-head cs__head">
        <Reveal as="p" className="eyebrow">
          Design case study · Concept project
        </Reveal>
        <SplitWords as="h1" className="display" text="Making a *CHF 60,000* decision feel personal — online." animateNow delay={0.2} />
        <Reveal className="cs__meta" delay={0.4}>
          {[
            ['Role', `${site.author} — product, UX & front-end`],
            ['Scope', 'Strategy, IA, interaction design, build'],
            ['Stack', 'React, Framer Motion, procedural SVG'],
            ['Status', 'Shipped concept · fictional brand'],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="cs__meta-k">{k}</p>
              <p className="cs__meta-v">{v}</p>
            </div>
          ))}
        </Reveal>
      </header>

      <div className="container cs__layout">
        <nav className="cs__toc" aria-label="Case study sections">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`cs__toc-link ${active === s.id ? 'is-active' : ''}`}
              aria-current={active === s.id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToElement(document.getElementById(s.id));
              }}
            >
              <span>0{i + 1}</span>
              {s.label}
            </a>
          ))}
        </nav>

        <article className="cs__content">
          <section id="overview" className="cs__section">
            <h2 className="cs__h2">Overview</h2>
            <p className="cs__lead">
              Maison Aurelle is a fictional Genevan watchmaker. I designed and built its digital flagship end to end, to show how product thinking and craft-level UI can
              turn a luxury catalogue into a <em>guided path from desire to a booked conversation.</em>
            </p>
            <div className="cs__cards">
              {[
                ['4,500', 'watch combinations, each rendered live'],
                ['6', 'steps from first click to a reserved appointment'],
                ['0', 'product photos — every watch is drawn in code'],
              ].map(([n, l]) => (
                <Reveal key={l} className="cs__card">
                  <p className="cs__card-n">{n}</p>
                  <p className="cs__card-l">{l}</p>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="problem" className="cs__section">
            <h2 className="cs__h2">The problem</h2>
            <p>
              Luxury watch websites tend to fail in one of two ways. Some are <strong>beautiful but inert</strong>: an editorial carousel, a “Price on request” button and a
              contact form. Others are <strong>functional but cheapening</strong>: e-commerce templates where a CHF 60,000 tourbillon sits in the same cart as a strap.
            </p>
            <p>
              Clients at this level are not short of money. They are short of <em>confidence</em>, in the object, the price and the process. The brand’s real goal is not an
              online sale. It is a well-prepared, high-intent conversation with an advisor.
            </p>
            <blockquote className="cs__hmw">How might we make an unhurried, high-value decision feel personal, informed and trustworthy, before a single word is exchanged?</blockquote>
          </section>

          <section id="users" className="cs__section">
            <h2 className="cs__h2">Who it’s for</h2>
            <p>Three archetypes, synthesised from collector forums, boutique-advisor interviews and luxury e-commerce reviews, shaped every decision.</p>
            <div className="personas">
              {PERSONAS.map((p) => (
                <Reveal key={p.name} className="persona">
                  <h3>{p.name}</h3>
                  <p className="persona__who">{p.who}</p>
                  <p>
                    <strong>Needs:</strong> {p.need}
                  </p>
                  <p className="persona__fear">{p.fear}</p>
                  <p>
                    <strong>So we designed:</strong> {p.design}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="principles" className="cs__section">
            <h2 className="cs__h2">Design principles</h2>
            <div className="principles">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.title} className="principle">
                  <span className="principle__n">0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="decisions" className="cs__section">
            <h2 className="cs__h2">Key decisions &amp; trade-offs</h2>
            <div className="decisions">
              {DECISIONS.map((d) => (
                <Reveal key={d.n} className="decision">
                  <span className="decision__n">{d.n}</span>
                  <div>
                    <h3>{d.title}</h3>
                    <p>{d.why}</p>
                    <p className="decision__trade">
                      <span>Trade-off</span>
                      {d.tradeoff}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="cs__try">
              <Link to="/" className="link-arrow">
                See the hero <Arrow />
              </Link>
              <Link to="/configure" className="link-arrow">
                Try the configurator <Arrow />
              </Link>
              <Link to="/appointment" className="link-arrow">
                Book a mock appointment <Arrow />
              </Link>
            </div>
          </section>

          <section id="accessibility" className="cs__section">
            <h2 className="cs__h2">Accessibility, built in</h2>
            <p>Luxury should never mean exclusive by accident. Accessibility was a requirement from the start, not a final pass.</p>
            <ul className="checklist">
              {A11Y.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          <section id="metrics" className="cs__section">
            <h2 className="cs__h2">Measuring success</h2>
            <p>As a concept there is no live data yet. These are the hypotheses I would instrument on day one, and the targets I would hold the design to.</p>
            <div className="table-wrap">
              <table className="metrics">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Why it matters</th>
                    <th scope="col">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((m) => (
                    <tr key={m.metric}>
                      <th scope="row">{m.metric}</th>
                      <td>{m.why}</td>
                      <td>{m.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="next" className="cs__section">
            <h2 className="cs__h2">What I’d do next</h2>
            <ol className="next">
              <li>
                <strong>Test with five collectors</strong> using the live prototype: can they configure, understand the price, and book without help?
              </li>
              <li>
                <strong>A/B test price visibility</strong>: always-visible prices against “on request” for the Haute Horlogerie line, measured by appointment quality, not volume.
              </li>
              <li>
                <strong>Hand off to the CRM</strong>, so the advisor opens the meeting with the client’s exact configuration already on the table.
              </li>
              <li>
                <strong>Wrist try-on with WebXR</strong>, scaled to the client’s real wrist size.
              </li>
              <li>
                <strong>Localise</strong> into French, German, Japanese and Arabic, including right-to-left layouts.
              </li>
            </ol>
            <p className="cs__sign">
              Thank you for reading. — {site.author}
              {site.email && site.email !== 'you@example.com' && (
                <>
                  {' '}
                  · <a href={`mailto:${site.email}`}>{site.email}</a>
                </>
              )}
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
