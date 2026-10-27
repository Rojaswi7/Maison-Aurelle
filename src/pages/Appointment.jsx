import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Watch from '../components/Watch';
import { Arrow, CalendarIcon, Check, Pin, Video } from '../components/Icons';
import { getModel } from '../data/collections';
import { formatCHF, priceOf, reference } from '../data/watch';
import { COMMISSION_KEY, EASE, storage, usePageTitle } from '../lib/misc';
import '../styles/appointment.css';

const BOUTIQUES = [
  { id: 'geneve', city: 'Genève', address: 'Rue du Rhône · Flagship & atelier', note: 'Includes a visit to the bench' },
  { id: 'paris', city: 'Paris', address: 'Place Vendôme' },
  { id: 'london', city: 'London', address: 'New Bond Street' },
  { id: 'dubai', city: 'Dubai', address: 'Gate Village, DIFC' },
  { id: 'tokyo', city: 'Tokyo', address: 'Ginza' },
  { id: 'virtual', city: 'Private video call', address: 'From anywhere in the world', virtual: true },
];
const SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
const INTERESTS = ['A configured commission', 'Discovering the collection', 'A bespoke, unique piece', 'Servicing an Aurelle'];
const STEP_LABELS = ['Boutique', 'Date & time', 'Your details', 'Confirm'];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const VALIDATORS = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Please tell us your name.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'This email doesn’t look quite right.'),
  phone: (v) => (!v || /^\+?[\d\s()-]{7,}$/.test(v) ? '' : 'Please use digits, spaces and an optional +.'),
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const longDate = (s) => fromIso(s).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

// Deterministic "already booked" slots so availability feels real but stays stable.
const isBooked = (key) => {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h) % 3 === 0;
};

export default function Appointment() {
  usePageTitle('Private appointment — Maison Aurelle');
  const [params] = useSearchParams();
  const model = getModel(params.get('model'));
  const commission = useMemo(() => storage.get(COMMISSION_KEY)?.config ?? null, []);
  const fromConfigurator = params.get('from') === 'configurator';

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [form, setForm] = useState({
    boutique: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    interest: fromConfigurator ? INTERESTS[0] : model ? INTERESTS[1] : '',
    notes: model ? `I’d like to see the ${model.name}.` : '',
    bringCommission: fromConfigurator,
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const errors = Object.fromEntries(Object.entries(VALIDATORS).map(([k, fn]) => [k, fn(form[k])]));
  const showError = (k) => (touched[k] || submitted) && errors[k];
  const boutique = BOUTIQUES.find((b) => b.id === form.boutique);

  const canContinue = [!!form.boutique, !!(form.date && form.time), !errors.name && !errors.email && !errors.phone, true][step];

  const go = (to) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };
  const next = () => {
    if (step === 2 && !canContinue) {
      setSubmitted(true);
      return;
    }
    if (canContinue) go(step + 1);
  };

  const confirm = () => {
    setStatus('sending');
    setTimeout(() => setStatus('done'), 1400);
  };

  if (status === 'done') return <Confirmation form={form} boutique={boutique} />;

  return (
    <div className="appt container">
      <header className="appt__head">
        <p className="eyebrow">Private appointment</p>
        <h1 className="display appt__title">
          A conversation, <em>not a checkout.</em>
        </h1>
        <p className="lede">Forty-five unhurried minutes with an advisor and a tray of watches. No obligation, ever.</p>
      </header>

      <ol className="progress" aria-label="Booking progress">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className={`progress__step ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`} aria-current={i === step ? 'step' : undefined}>
            <button className="progress__btn" disabled={i > step} onClick={() => go(i)}>
              <span className="progress__dot">{i < step ? <Check size={12} /> : i + 1}</span>
              <span className="progress__label">{label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="appt__body">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-labelledby={`appt-step-${step}`}
          >
            <h2 id={`appt-step-${step}`} className="appt__step-title">
              {['Where shall we meet?', 'Choose a moment', 'How may we reach you?', 'Shall we confirm?'][step]}
            </h2>

            {step === 0 && (
              <fieldset className="boutiques">
                <legend className="sr-only">Boutique</legend>
                {BOUTIQUES.map((b) => (
                  <label key={b.id} className={`boutique ${form.boutique === b.id ? 'is-selected' : ''}`}>
                    <input type="radio" name="boutique" className="sr-only" checked={form.boutique === b.id} onChange={() => setForm((f) => ({ ...f, boutique: b.id, time: '' }))} />
                    <span className="boutique__icon">{b.virtual ? <Video /> : <Pin />}</span>
                    <span className="boutique__city">{b.city}</span>
                    <span className="boutique__addr">{b.address}</span>
                    {b.note && <span className="boutique__note">{b.note}</span>}
                    <span className="boutique__check" aria-hidden="true">
                      <Check size={12} />
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            {step === 1 && (
              <div className="when">
                <Calendar value={form.date} onChange={(d) => setForm((f) => ({ ...f, date: d, time: '' }))} />
                <div className="slots">
                  <p className="slots__label">{form.date ? longDate(form.date) : 'Select a date to see availability'}</p>
                  {form.date && (
                    <div className="slots__grid" role="radiogroup" aria-label="Available times">
                      {SLOTS.map((t) => {
                        const booked = isBooked(`${form.boutique}${form.date}${t}`);
                        return (
                          <button
                            key={t}
                            role="radio"
                            aria-checked={form.time === t}
                            disabled={booked}
                            className={`slot ${form.time === t ? 'is-selected' : ''}`}
                            onClick={() => set('time', t)}
                          >
                            {t}
                            {booked && <span className="slot__tag">Reserved</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="slots__tz">{boutique?.virtual ? 'Times shown in your local time zone.' : `Times shown in ${boutique?.city ?? 'boutique'} local time.`}</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="details">
                <div className="details__grid">
                  {[
                    ['name', 'Full name', 'text', 'name'],
                    ['email', 'Email', 'email', 'email'],
                    ['phone', 'Phone (optional)', 'tel', 'tel'],
                  ].map(([k, label, type, auto]) => (
                    <label key={k} className={`field ${showError(k) ? 'has-error' : ''}`}>
                      <span className="field__label">{label}</span>
                      <input
                        className="field__input"
                        type={type}
                        autoComplete={auto}
                        value={form[k]}
                        onChange={(e) => set(k, e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, [k]: true }))}
                        aria-invalid={!!showError(k)}
                        aria-describedby={showError(k) ? `err-${k}` : undefined}
                      />
                      {showError(k) && (
                        <span id={`err-${k}`} className="field__error" role="alert">
                          {errors[k]}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                <fieldset className="interest">
                  <legend className="field__label">I’m interested in</legend>
                  <div className="chips">
                    {INTERESTS.map((i) => (
                      <button key={i} type="button" className={`chip ${form.interest === i ? 'is-active' : ''}`} aria-pressed={form.interest === i} onClick={() => set('interest', i)}>
                        {form.interest === i && <span className="chip__bg" />}
                        <span className="chip__label">{i}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                {commission && (
                  <label className={`bring ${form.bringCommission ? 'is-selected' : ''}`}>
                    <input type="checkbox" className="sr-only" checked={form.bringCommission} onChange={(e) => set('bringCommission', e.target.checked)} />
                    <span className="bring__watch">
                      <Watch config={commission} live={false} />
                    </span>
                    <span className="bring__text">
                      <span className="bring__title">Bring my configuration</span>
                      <span className="bring__sub">
                        Aurelle {reference(commission)} · {formatCHF(priceOf(commission))}
                      </span>
                    </span>
                    <span className="bring__toggle" aria-hidden="true" />
                  </label>
                )}
                <label className="field">
                  <span className="field__label">Anything we should prepare? (optional)</span>
                  <textarea className="field__input" rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                </label>
              </div>
            )}

            {step === 3 && (
              <dl className="review">
                {[
                  ['Boutique', `${boutique.city} — ${boutique.address}`, 0],
                  ['When', `${longDate(form.date)} at ${form.time}`, 1],
                  ['Guest', `${form.name} · ${form.email}${form.phone ? ` · ${form.phone}` : ''}`, 2],
                  ['Purpose', form.interest || 'An open conversation', 2],
                  ...(form.bringCommission && commission ? [['Configuration', `Aurelle ${reference(commission)} — ${formatCHF(priceOf(commission))}`, 2]] : []),
                  ...(form.notes ? [['Notes', form.notes, 2]] : []),
                ].map(([k, v, s]) => (
                  <div key={k} className="review__row">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                    <button className="review__edit" onClick={() => go(s)} aria-label={`Edit ${k}`}>
                      Edit
                    </button>
                  </div>
                ))}
              </dl>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="appt__nav">
        {step > 0 ? (
          <button className="link-arrow link-arrow--back" onClick={() => go(step - 1)}>
            <Arrow dir="left" /> Back
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button className="btn btn--solid" onClick={next} disabled={step < 2 && !canContinue}>
            Continue
          </button>
        ) : (
          <button className="btn btn--solid" onClick={confirm} disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <span className="spinner" aria-hidden="true" /> Reserving…
              </>
            ) : (
              'Confirm appointment'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Calendar({ value, onChange }) {
  const today = startOfDay(new Date());
  const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);
  const [month, setMonth] = useState(() => (value ? fromIso(value) : new Date(today.getFullYear(), today.getMonth(), 1)));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const canPrev = first > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= max;
  const shift = (d) => setMonth(new Date(month.getFullYear(), month.getMonth() + d, 1));

  return (
    <div className="cal">
      <div className="cal__head">
        <button className="icon-btn" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">
          <Arrow dir="left" />
        </button>
        <p className="cal__month" aria-live="polite">
          {first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
        <button className="icon-btn" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month">
          <Arrow />
        </button>
      </div>
      <div className="cal__grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="cal__dow" aria-hidden="true">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const day = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const id = iso(day);
          const closed = day.getDay() === 0;
          const disabled = day <= today || day > max || closed;
          return (
            <button
              key={id}
              className={`cal__day ${value === id ? 'is-selected' : ''}`}
              disabled={disabled}
              aria-pressed={value === id}
              aria-label={`${day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}${closed ? ', closed' : ''}`}
              onClick={() => onChange(id)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="cal__legend">Boutiques are closed on Sundays. Bookings open 60 days ahead.</p>
    </div>
  );
}

function downloadIcs(form, boutique) {
  const [y, m, d] = form.date.split('-');
  const [hh, mm] = form.time.split(':');
  const end = String(Number(hh) + 1).padStart(2, '0');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maison Aurelle//Appointments//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@maison-aurelle`,
    `DTSTAMP:${stamp}Z`,
    `DTSTART:${y}${m}${d}T${hh}${mm}00`,
    `DTEND:${y}${m}${d}T${end}${mm}00`,
    'SUMMARY:Maison Aurelle — private appointment',
    `LOCATION:${boutique.virtual ? 'Video call (link to follow by email)' : `${boutique.address}, ${boutique.city}`}`,
    'DESCRIPTION:Forty-five unhurried minutes with your Aurelle advisor.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'maison-aurelle-appointment.ics' });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Confirmation({ form, boutique }) {
  const first = form.name.trim().split(' ')[0];
  return (
    <div className="appt container confirm">
      <motion.svg className="confirm__mark" viewBox="0 0 80 80" aria-hidden="true">
        <motion.circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE }} />
        <motion.path d="M26 41l9 9 19-20" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.9, ease: EASE }} />
      </motion.svg>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}>
        <p className="eyebrow">Appointment confirmed</p>
        <h1 className="display confirm__title">
          We look forward to <em>welcoming you,</em> {first}.
        </h1>
        <p className="lede">
          {longDate(form.date)} at {form.time} · {boutique.city}. A confirmation is on its way to {form.email}
          {boutique.virtual ? ', with your private video link.' : '.'}
        </p>
        <div className="confirm__actions">
          <button className="btn btn--solid" onClick={() => downloadIcs(form, boutique)}>
            <CalendarIcon /> Add to calendar
          </button>
          <Link to="/" className="link-arrow">
            Return to the Maison <Arrow />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
