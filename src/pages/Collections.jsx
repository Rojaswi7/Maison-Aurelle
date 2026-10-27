import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Watch from '../components/Watch';
import Modal from '../components/Modal';
import ProductCard from '../components/ProductCard';
import { Reveal, SplitWords } from '../components/Motion';
import { Arrow } from '../components/Icons';
import { CATEGORIES, getModel, models } from '../data/collections';
import { configToParams, formatCHF, getComplication, getDial, leadTime, priceOf } from '../data/watch';
import { EASE, usePageTitle } from '../lib/misc';
import '../styles/collections.css';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'asc', label: 'Price — low to high' },
  { id: 'desc', label: 'Price — high to low' },
];

export default function Collections() {
  usePageTitle('Collections — Maison Aurelle');
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const active = getModel(params.get('model'));

  const list = useMemo(() => {
    const filtered = models.filter((m) => filter === 'All' || m.category === filter);
    if (sort === 'featured') return filtered;
    return [...filtered].sort((a, b) => (sort === 'asc' ? 1 : -1) * (priceOf(a.config) - priceOf(b.config)));
  }, [filter, sort]);

  // The quick view lives in the URL: it can be shared, and the back button closes it.
  const openModel = (m) => setParams({ model: m.id });
  const close = () => setParams({}, { replace: true });

  return (
    <div className="collections">
      <header className="container page-head">
        <Reveal as="p" className="eyebrow">
          Collections · {models.length} references
        </Reveal>
        <SplitWords as="h1" className="display" text="The *Collection*" animateNow delay={0.2} />
        <Reveal as="p" className="lede" delay={0.3}>
          Each reference is a starting point. Open any watch to see it up close, then make it entirely your own.
        </Reveal>
      </header>

      <div className="container toolbar">
        <div className="chips" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button key={c} className={`chip ${filter === c ? 'is-active' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>
              {filter === c && <motion.span layoutId="chip-bg" className="chip__bg" transition={{ duration: 0.5, ease: EASE }} />}
              <span className="chip__label">{c}</span>
            </button>
          ))}
        </div>
        <label className="select">
          <span className="sr-only">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="container results-count" aria-live="polite">
        Showing {list.length} {list.length === 1 ? 'reference' : 'references'}
      </p>

      <motion.ul layout className="container grid">
        <AnimatePresence mode="popLayout">
          {list.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <ProductCard model={m}>
                <button className="pcard__hit" onClick={() => openModel(m)} data-cursor="View" aria-label={`Quick view: ${m.name}`} />
              </ProductCard>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Modal open={!!active} onClose={close} label={active ? `${active.name} — quick view` : ''}>
        {active && <QuickView model={active} />}
      </Modal>
    </div>
  );
}

function QuickView({ model }) {
  const dial = getDial(model.config.dialId);
  return (
    <div className="qv">
      <div className="qv__stage" style={{ '--glow': dial.base }}>
        <Watch config={model.config} />
        <p className="qv__live">
          <span className="dot" /> Showing your local time
        </p>
      </div>
      <div className="qv__info">
        <p className="eyebrow">{model.category}</p>
        <h2 className="qv__name">{model.name}</h2>
        <p className="qv__tagline">{model.tagline}</p>
        <p className="qv__price">{formatCHF(priceOf(model.config))}</p>
        <dl className="specs">
          {Object.entries(model.specs).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt>Complication</dt>
            <dd>{getComplication(model.config.complication).name}</dd>
          </div>
          <div>
            <dt>Made to order</dt>
            <dd>Approx. {leadTime(model.config)} months</dd>
          </div>
        </dl>
        <div className="qv__actions">
          <Link to={`/configure?${configToParams(model.config)}`} className="btn btn--solid">
            Personalise this piece
          </Link>
          <Link to={`/appointment?model=${model.id}`} className="link-arrow">
            Request a private viewing <Arrow />
          </Link>
        </div>
      </div>
    </div>
  );
}
