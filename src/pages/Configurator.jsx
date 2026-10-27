import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Watch from '../components/Watch';
import Modal from '../components/Modal';
import { AnimatedNumber } from '../components/Motion';
import { useToast } from '../components/Toast';
import { LinkIcon } from '../components/Icons';
import {
  BASE_PRICE,
  ENGRAVING_MAX,
  ENGRAVING_PRICE,
  cases,
  complications,
  configFromParams,
  configToParams,
  defaultConfig,
  dials,
  formatCHF,
  getDial,
  handStyles,
  hasConfigParams,
  indexStyles,
  leadTime,
  lineItems,
  priceOf,
  reference,
  straps,
} from '../data/watch';
import { COMMISSION_KEY, EASE, storage, usePageTitle } from '../lib/misc';
import '../styles/configurator.css';

const metalSwatch = (c) => `linear-gradient(135deg, ${c.stops.join(', ')})`;
const STEEL = cases[0];

const STEPS = [
  { id: 'case', label: 'Case', title: 'Choose your metal', key: 'caseId', list: cases, swatch: metalSwatch },
  { id: 'dial', label: 'Dial', title: 'Select a dial', key: 'dialId', list: dials, swatch: (d) => `radial-gradient(circle at 35% 30%, ${d.base}, ${d.edge})` },
  {
    id: 'strap',
    label: 'Strap',
    title: 'Dress the wrist',
    key: 'strapId',
    list: straps,
    swatch: (s) => (s.type === 'bracelet' ? metalSwatch(STEEL) : `linear-gradient(135deg, ${s.color2}, ${s.color})`),
  },
  { id: 'comp', label: 'Complication', title: 'Add a complication', key: 'complication', list: complications },
  { id: 'details', label: 'Details', title: 'Refine the details' },
  { id: 'engrave', label: 'Engraving', title: 'Leave your mark' },
];

export default function Configurator() {
  usePageTitle('Configure your Aurelle — Maison Aurelle');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [cfg, setCfg] = useState(() => {
    const saved = storage.get(COMMISSION_KEY)?.config;
    return configFromParams(params, hasConfigParams(params) ? defaultConfig : saved ?? defaultConfig);
  });
  const [step, setStep] = useState(0);
  const [view, setView] = useState('front');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const tabRefs = useRef([]);

  // Every change is mirrored to the URL (shareable, refresh-safe) and autosaved.
  useEffect(() => {
    setParams(configToParams(cfg), { replace: true });
    storage.set(COMMISSION_KEY, { config: cfg, savedAt: Date.now() });
  }, [cfg, setParams]);

  const update = (key, value) => setCfg((c) => ({ ...c, [key]: value }));

  const goTo = (i, focus = false) => {
    setStep(i);
    // The engraving lives on the caseback, so turn the watch over to show it.
    setView(STEPS[i].id === 'engrave' ? 'back' : 'front');
    if (focus) tabRefs.current[i]?.focus();
  };

  const onTabKey = (e) => {
    const last = STEPS.length - 1;
    const next = { ArrowRight: step + 1, ArrowLeft: step - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    goTo((next + STEPS.length) % STEPS.length, true);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copied — your configuration travels with it.');
    } catch {
      toast('Copy the address bar to share this configuration.');
    }
  };

  const reserve = () => navigate('/appointment?from=configurator');

  const s = STEPS[step];
  const dial = getDial(cfg.dialId);
  const total = priceOf(cfg);

  return (
    <div className="cfg" style={{ '--glow': dial.base }}>
      <section className="cfg__stage" aria-label="Preview">
        <div className="cfg__stage-top">
          <p className="eyebrow">Your commission · {reference(cfg)}</p>
          <div className="seg" role="group" aria-label="Preview side">
            {[
              ['front', 'Dial'],
              ['back', 'Caseback'],
            ].map(([v, l]) => (
              <button key={v} className={`seg__btn ${view === v ? 'is-active' : ''}`} aria-pressed={view === v} onClick={() => setView(v)}>
                {view === v && <motion.span layoutId="seg-bg" className="seg__bg" transition={{ duration: 0.5, ease: EASE }} />}
                <span>{l}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="cfg__flip">
          <motion.div className="cfg__card" animate={{ rotateY: view === 'back' ? 180 : 0 }} transition={{ duration: 1.1, ease: EASE }}>
            <div className="cfg__face">
              <Watch config={cfg} />
            </div>
            <div className="cfg__face cfg__face--back">
              <Watch config={cfg} view="back" />
            </div>
          </motion.div>
        </div>
        <p className="cfg__caption">
          <span className="dot" /> {view === 'front' ? 'Live — keeping your local time' : 'Calibre AU-01, visible through sapphire'}
        </p>
      </section>

      <section className="cfg__panel" aria-label="Configure">
        <div className="cfg__tabs" role="tablist" aria-label="Configuration steps" onKeyDown={onTabKey}>
          {STEPS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === step}
              aria-controls={`panel-${t.id}`}
              tabIndex={i === step ? 0 : -1}
              className={`cfg__tab ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
              onClick={() => goTo(i)}
            >
              <span className="cfg__tab-n">0{i + 1}</span>
              {t.label}
              {i === step && <motion.span layoutId="tab-line" className="cfg__tab-line" transition={{ duration: 0.5, ease: EASE }} />}
            </button>
          ))}
        </div>

        <div className="cfg__body" data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              role="tabpanel"
              id={`panel-${s.id}`}
              aria-labelledby={`tab-${s.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p className="cfg__step-n">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="cfg__title">{s.title}</h2>

              {s.list && (
                <OptionList
                  name={s.label}
                  list={s.list}
                  value={cfg[s.key]}
                  onChange={(v) => update(s.key, v)}
                  swatch={s.swatch}
                  meta={s.id === 'comp' ? (o) => `${o.months} months` : undefined}
                />
              )}

              {s.id === 'details' && (
                <>
                  <OptionList name="Indices" legend list={indexStyles} value={cfg.indices} onChange={(v) => update('indices', v)} />
                  <OptionList name="Hands" legend list={handStyles} value={cfg.hands} onChange={(v) => update('hands', v)} />
                </>
              )}

              {s.id === 'engrave' && <Engraving value={cfg.engraving} onChange={(v) => update('engraving', v)} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="cfg__foot">
          <div className="cfg__price">
            <p className="cfg__total-label">Estimated total</p>
            <p className="cfg__total">
              <AnimatedNumber value={total} format={formatCHF} />
            </p>
            <p className="cfg__lead">Hand-made in approx. {leadTime(cfg)} months</p>
          </div>
          <div className="cfg__actions">
            <button className="btn btn--ghost" onClick={() => setSummaryOpen(true)}>
              Summary
            </button>
            {step < STEPS.length - 1 ? (
              <button className="btn btn--solid" onClick={() => goTo(step + 1)}>
                Next · {STEPS[step + 1].label}
              </button>
            ) : (
              <button className="btn btn--solid" onClick={() => setSummaryOpen(true)}>
                Review
              </button>
            )}
          </div>
        </div>
      </section>

      <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)} label="Your commission summary" variant="drawer">
        <Summary
          cfg={cfg}
          total={total}
          onShare={share}
          onReserve={reserve}
          onReset={() => {
            setCfg(defaultConfig);
            setSummaryOpen(false);
            goTo(0);
            toast('Configuration reset to the house default.');
          }}
        />
      </Modal>
    </div>
  );
}

function OptionList({ name, list, value, onChange, swatch, meta, legend = false }) {
  return (
    <fieldset className="opts">
      <legend className={legend ? 'opts__legend' : 'sr-only'}>{name}</legend>
      {list.map((o) => (
        <label key={o.id} className={`opt ${value === o.id ? 'is-selected' : ''}`}>
          <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
          {swatch && <span className="opt__swatch" style={{ background: swatch(o) }} />}
          <span className="opt__text">
            <span className="opt__name">{o.name}</span>
            <span className="opt__note">{o.note}</span>
          </span>
          <span className="opt__side">
            <span className="opt__price">{o.price ? `+ ${formatCHF(o.price)}` : 'Included'}</span>
            {meta && <span className="opt__meta">{meta(o)}</span>}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

function Engraving({ value, onChange }) {
  const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
  const ideas = ['TEMPUS FUGIT', 'TO THE NEXT CHAPTER', `FOR A. — ${today}`];
  return (
    <div className="engrave">
      <p className="cfg__hint">We’ve turned the watch over — your words will be hand-engraved around the sapphire caseback.</p>
      <label className="field">
        <span className="field__label">Your inscription</span>
        <input
          className="field__input"
          value={value}
          maxLength={ENGRAVING_MAX}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Up to 24 characters"
          aria-describedby="engrave-hint"
        />
        <span id="engrave-hint" className="field__hint">
          <span>{value.length} / {ENGRAVING_MAX}</span>
          <span>{value ? `+ ${formatCHF(ENGRAVING_PRICE)}` : 'Optional'}</span>
        </span>
      </label>
      <p className="opts__legend">Need inspiration?</p>
      <div className="chips">
        {ideas.map((idea) => (
          <button key={idea} className={`chip ${value === idea ? 'is-active' : ''}`} onClick={() => onChange(idea)}>
            {value === idea && <span className="chip__bg" />}
            <span className="chip__label">{idea}</span>
          </button>
        ))}
        {value && (
          <button className="chip chip--ghost" onClick={() => onChange('')}>
            <span className="chip__label">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Summary({ cfg, total, onShare, onReserve, onReset }) {
  return (
    <div className="summary">
      <p className="eyebrow">Your commission</p>
      <h2 className="summary__title">Aurelle {reference(cfg)}</h2>
      <div className="summary__watch" style={{ '--glow': getDial(cfg.dialId).base }}>
        <Watch config={cfg} />
      </div>
      <dl className="summary__list">
        <div className="summary__row">
          <dt>Base</dt>
          <dd>
            <span>Hand-finished calibre &amp; case</span>
            <span>{formatCHF(BASE_PRICE)}</span>
          </dd>
        </div>
        {lineItems(cfg).map((i) => (
          <div className="summary__row" key={i.group}>
            <dt>{i.group}</dt>
            <dd>
              <span>{i.name}</span>
              <span>{i.price ? formatCHF(i.price) : 'Included'}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="summary__total">
        <span>Estimated total</span>
        <strong>{formatCHF(total)}</strong>
      </div>
      <p className="summary__note">
        Excluding local taxes. A 30% deposit reserves your place at the bench; your watch is ready in approximately {leadTime(cfg)} months. Nothing is charged online.
      </p>
      <div className="summary__actions">
        <button className="btn btn--solid" onClick={onReserve}>
          Reserve with an advisor
        </button>
        <button className="btn btn--ghost" onClick={onShare}>
          <LinkIcon /> Copy share link
        </button>
        <button className="link-arrow summary__reset" onClick={onReset}>
          Start over
        </button>
      </div>
    </div>
  );
}
