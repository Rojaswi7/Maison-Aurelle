import { useEffect, useId, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { getCase, getDial, getStrap } from '../data/watch';

// The whole watch is procedural SVG: every combination of options renders
// instantly, at any resolution, with the hands showing the real local time.

const CX = 200;
const CY = 340;
const SUB = 394; // centre of the complication at six o'clock
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Manrope', system-ui, sans-serif";
const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const COMP_LABEL = { 'small-seconds': 'AUTOMATIQUE', date: 'AUTOMATIQUE', moonphase: 'PHASE DE LUNE', tourbillon: 'TOURBILLON' };
const GOLD = '#d9bd84';

const polar = (r, deg, cy = CY) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), cy + r * Math.sin(a)];
};
const circlePath = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
const seg = ([x1, y1], [x2, y2]) => `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`;

const SUNBURST = (() => {
  let even = '';
  let odd = '';
  for (let i = 0; i < 144; i++) {
    const s = seg(polar(6, i * 2.5), polar(118, i * 2.5));
    if (i % 2) odd += s;
    else even += s;
  }
  return [even, odd];
})();
const ROSETTE = Array.from({ length: 40 }, (_, i) => circlePath(...polar(52, i * 9), 52)).join('');
const OPALINE = Array.from({ length: 26 }, (_, i) => circlePath(CX, CY, 6 + i * 4.4)).join('');
const AZURAGE = Array.from({ length: 11 }, (_, i) => circlePath(CX, SUB, 3 + i * 2.1)).join('');
const MINUTE_TRACK = Array.from({ length: 60 }, (_, i) => seg(polar(i % 5 ? 106 : 103, i * 6), polar(110, i * 6))).join('');
const SUB_TICKS = Array.from({ length: 12 }, (_, i) => seg(polar(i % 3 ? 20.5 : 18, i * 30, SUB), polar(23.5, i * 30, SUB))).join('');
const STARS = [[180, 388], [188, 380], [214, 383], [222, 392], [196, 384], [207, 378]];

function moonFraction(date = new Date()) {
  const synodic = 29.530588853;
  const days = (date.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
  return (((days % synodic) + synodic) % synodic) / synodic;
}

export default function Watch({ config, view = 'front', live = true, explode, label, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const ids = { id: (n) => `${n}-${uid}`, url: (n) => `url(#${n}-${uid})` };
  const metal = getCase(config.caseId);
  const dial = getDial(config.dialId);
  const strap = getStrap(config.strapId);
  const comp = config.complication;

  const idle = useMotionValue(0);
  const p = explode ?? idle;
  const strapTopY = useTransform(p, [0, 1], [0, -64]);
  const strapBotY = useTransform(p, [0, 1], [0, 64]);
  const dialOpacity = useTransform(p, [0, 1], [1, 0.1]);
  const dialScale = useTransform(p, [0, 1], [1, 1.07]);
  const handsOpacity = useTransform(p, [0, 0.75], [1, 0]);
  const crystalY = useTransform(p, [0, 1], [0, -110]);
  const crystalOpacity = useTransform(p, [0, 0.8], [1, 0]);

  const hourRef = useRef(null);
  const minRef = useRef(null);
  const secRef = useRef(null);
  const subRef = useRef(null);
  const cageRef = useRef(null);

  useEffect(() => {
    const rot = (el, deg, cy = CY) => el && el.setAttribute('transform', `rotate(${deg.toFixed(3)} ${CX} ${cy})`);
    const paint = (h, m, s) => {
      rot(hourRef.current, h * 30);
      rot(minRef.current, m * 6);
      rot(secRef.current, s * 6);
      rot(subRef.current, s * 6, SUB);
      rot(cageRef.current, s * 6, SUB);
    };
    if (!live) {
      paint(10 + 9.6 / 60, 9.6, 36); // the classic 10:10 display
      return undefined;
    }
    let frame;
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      paint((now.getHours() % 12) + m / 60, m, s);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [live, comp, view, config.hands]);

  const handFill = dial.hands ?? ids.url('hand');
  const hideIndex = comp === 'date' ? [3] : [6];
  const centreSeconds = comp === 'date' || comp === 'moonphase';
  // Numerals reach further in than batons, so the logo steps down to give XII room.
  const brandShift = config.indices === 'baton' ? 0 : 5;
  const starY = CY - 80 + (config.indices === 'baton' ? 0 : 9);
  const aria = label ?? `${metal.name} watch, ${dial.name} dial, ${strap.name}`;

  const defs = (
    <defs>
      <linearGradient id={ids.id('case')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={metal.stops[0]} />
        <stop offset=".38" stopColor={metal.stops[1]} />
        <stop offset=".62" stopColor={metal.stops[2]} />
        <stop offset="1" stopColor={metal.stops[3]} />
      </linearGradient>
      <linearGradient id={ids.id('case2')} x1="1" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor={metal.stops[0]} />
        <stop offset=".4" stopColor={metal.stops[1]} />
        <stop offset=".65" stopColor={metal.stops[2]} />
        <stop offset="1" stopColor={metal.stops[3]} />
      </linearGradient>
      <linearGradient id={ids.id('hand')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={metal.hand[0]} />
        <stop offset="1" stopColor={metal.hand[1]} />
      </linearGradient>
      <radialGradient id={ids.id('dial')} cx=".5" cy=".42" r=".62">
        <stop offset="0" stopColor={dial.base} />
        <stop offset=".7" stopColor={dial.mid} />
        <stop offset="1" stopColor={dial.edge} />
      </radialGradient>
      <radialGradient id={ids.id('glass')} cx=".32" cy=".2" r=".75">
        <stop offset="0" stopColor="#fff" stopOpacity=".22" />
        <stop offset=".45" stopColor="#fff" stopOpacity=".04" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={ids.id('moon')} cx=".4" cy=".35" r=".7">
        <stop offset="0" stopColor="#fff4cf" />
        <stop offset="1" stopColor="#c79d45" />
      </radialGradient>
      <linearGradient id={ids.id('shade')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity=".5" />
        <stop offset=".22" stopColor="#000" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".09" />
        <stop offset=".78" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id={ids.id('bridge')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d6cebf" />
        <stop offset=".5" stopColor="#8d8476" />
        <stop offset="1" stopColor="#cbc2b2" />
      </linearGradient>
      <linearGradient id={ids.id('cotesGrad')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#3f3b35" />
        <stop offset=".5" stopColor="#8a8378" />
        <stop offset="1" stopColor="#3f3b35" />
      </linearGradient>
      <pattern id={ids.id('cotes')} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
        <rect width="16" height="16" fill={ids.url('cotesGrad')} />
      </pattern>
      <pattern id={ids.id('croc')} width="18" height="13" patternUnits="userSpaceOnUse">
        <rect x="1" y="1" width="16" height="11" rx="4" fill="rgba(255,255,255,.035)" stroke="rgba(0,0,0,.45)" strokeWidth="1" />
      </pattern>
      <filter id={ids.id('shadow')} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.6" floodOpacity=".45" />
      </filter>
      <clipPath id={ids.id('strapTop')}>
        <path d="M157 0 L243 0 L250 224 L150 224 Z" />
      </clipPath>
      <clipPath id={ids.id('strapBot')}>
        <path d="M150 456 L250 456 L243 680 L157 680 Z" />
      </clipPath>
      <clipPath id={ids.id('dialClip')}>
        <circle cx={CX} cy={CY} r="116" />
      </clipPath>
      <clipPath id={ids.id('window')}>
        <circle cx={CX} cy={CY} r="92" />
      </clipPath>
      <clipPath id={ids.id('moonClip')}>
        <path d="M172 404 A28 28 0 0 1 228 404 Z" />
      </clipPath>
      <path id={ids.id('arcTop')} d={`M${CX - 100} ${CY} A100 100 0 0 1 ${CX + 100} ${CY}`} />
      <path id={ids.id('arcBottom')} d={`M${CX - 107} ${CY} A107 107 0 0 0 ${CX + 107} ${CY}`} />
      <path id={ids.id('arcRotor')} d={`M${CX - 62} ${CY} A62 62 0 0 1 ${CX + 62} ${CY}`} />
    </defs>
  );

  const body = (
    <>
      <motion.g style={{ y: strapTopY }}>
        <Strap top strap={strap} ids={ids} />
      </motion.g>
      <motion.g style={{ y: strapBotY }}>
        <Strap strap={strap} ids={ids} />
      </motion.g>
      {[[132, 194], [248, 194], [132, 436], [248, 436]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="20" height="50" rx="9" fill={ids.url('case')} stroke={metal.edge} strokeWidth=".8" />
      ))}
      <rect x="326" y="331" width="10" height="18" fill={ids.url('case')} />
      <rect x="333" y="321" width="17" height="38" rx="4" fill={ids.url('case2')} stroke={metal.edge} strokeWidth=".8" />
      <path d={Array.from({ length: 10 }, (_, i) => `M335 ${324 + i * 3.4}H348`).join('')} stroke="#000" strokeOpacity=".22" strokeWidth=".8" />
      <circle cx={CX} cy={CY} r="132" fill={ids.url('case')} stroke={metal.edge} strokeWidth="1" />
      <circle cx={CX} cy={CY} r="126" fill={ids.url('case2')} />
    </>
  );

  if (view === 'back') {
    return (
      <svg className={`watch ${className}`} viewBox="0 0 400 680" role="img" aria-label={`${aria} — caseback`}>
        {defs}
        {body}
        <circle cx={CX} cy={CY} r="121" fill={ids.url('case')} stroke="#000" strokeOpacity=".3" strokeWidth=".6" />
        <text fontFamily={SERIF} fontStyle="italic" fontSize="14" letterSpacing="1.5" fill={metal.engrave} textAnchor="middle">
          <textPath href={`#${ids.id('arcTop')}`} startOffset="50%">
            {config.engraving ? config.engraving.toUpperCase() : ''}
          </textPath>
        </text>
        <text fontFamily={SANS} fontSize="6.5" letterSpacing="2.6" fill={metal.engrave} textAnchor="middle">
          <textPath href={`#${ids.id('arcBottom')}`} startOffset="50%">
            {`N° 0427 · ${metal.hallmark} · SAPHIR · 30M`}
          </textPath>
        </text>
        {Array.from({ length: 6 }, (_, i) => {
          const [x, y] = polar(115, i * 60 + 30);
          return <Screw key={i} x={x} y={y} color={metal.stops[1]} />;
        })}
        <circle cx={CX} cy={CY} r="95" fill={ids.url('hand')} />
        <g clipPath={ids.url('window')}>
          <Movement ids={ids} rotor />
        </g>
        <circle cx={CX} cy={CY} r="92" fill={ids.url('glass')} />
      </svg>
    );
  }

  const moonX = CX + (0.5 - moonFraction()) * 112;

  return (
    <svg className={`watch ${className}`} viewBox="0 0 400 680" role="img" aria-label={aria}>
      {defs}
      {body}
      {explode && (
        <g clipPath={ids.url('dialClip')}>
          <Movement ids={ids} />
        </g>
      )}

      <motion.g style={{ opacity: dialOpacity, scale: dialScale }}>
        <circle cx={CX} cy={CY} r="119" fill={ids.url('case')} stroke="#000" strokeOpacity=".4" strokeWidth=".8" />
        <circle cx={CX} cy={CY} r="116" fill={ids.url('dial')} />
        <g clipPath={ids.url('dialClip')}>
          {dial.texture === 'sunburst' && (
            <>
              <path d={SUNBURST[0]} stroke="#fff" strokeOpacity=".06" strokeWidth="1.4" />
              <path d={SUNBURST[1]} stroke="#000" strokeOpacity=".1" strokeWidth="1.4" />
            </>
          )}
          {dial.texture === 'guilloche' && <path d={ROSETTE} fill="none" stroke={dial.ink} strokeOpacity=".09" strokeWidth=".6" />}
          {dial.texture === 'opaline' && <path d={OPALINE} fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="1.6" />}
        </g>
        <path d={MINUTE_TRACK} stroke={dial.ink} strokeOpacity=".75" strokeWidth=".8" />
        <circle cx={CX} cy={CY} r="110" fill="none" stroke={dial.ink} strokeOpacity=".35" strokeWidth=".5" />

        {comp === 'small-seconds' && (
          <g>
            <circle cx={CX} cy={SUB} r="25" fill="#000" fillOpacity=".12" />
            <path d={AZURAGE} fill="none" stroke={dial.ink} strokeOpacity=".1" strokeWidth=".6" />
            <circle cx={CX} cy={SUB} r="25" fill="none" stroke={dial.ink} strokeOpacity=".4" strokeWidth=".6" />
            <path d={SUB_TICKS} stroke={dial.ink} strokeOpacity=".8" strokeWidth=".8" />
            <g ref={subRef}>
              <line x1={CX} y1={SUB + 5} x2={CX} y2={SUB - 21} stroke={dial.accent} strokeWidth="1.1" strokeLinecap="round" />
              <circle cx={CX} cy={SUB} r="2" fill={dial.accent} />
            </g>
          </g>
        )}
        {comp === 'date' && (
          <g>
            <rect x="258" y="331" width="25" height="18" rx="1.5" fill="#f8f5ee" stroke={metal.hand[1]} strokeWidth="1.6" />
            <text x="270.5" y="344.3" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fontWeight="600" fill="#1c1a17">
              {new Date().getDate()}
            </text>
          </g>
        )}
        {comp === 'moonphase' && (
          <g>
            <path d="M169 405 A31 31 0 0 1 231 405 Z" fill={ids.url('hand')} />
            <g clipPath={ids.url('moonClip')}>
              <rect x="170" y="374" width="60" height="32" fill="#0c1838" />
              {STARS.map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r=".8" fill="#ead9a6" />
              ))}
              <circle cx={moonX} cy="397" r="11" fill={ids.url('moon')} />
            </g>
          </g>
        )}
        {comp === 'tourbillon' && (
          <g>
            <circle cx={CX} cy={SUB} r="31" fill={ids.url('hand')} />
            <circle cx={CX} cy={SUB} r="29" fill="#0b0a09" />
            <g ref={cageRef}>
              {[0, 120, 240].map((a) => {
                const [x, y] = polar(26, a, SUB);
                return <line key={a} x1={CX} y1={SUB} x2={x} y2={y} stroke={metal.hand[0]} strokeWidth="3.2" strokeLinecap="round" />;
              })}
              <Balance x={CX} y={SUB} r={15} />
              <circle cx={CX} cy={SUB} r="4" fill={metal.hand[1]} />
              <Jewel x={CX} y={SUB} />
            </g>
          </g>
        )}

        <Indices type={config.indices} hide={hideIndex} ink={dial.ink} fill={ids.url('hand')} />

        <path
          d={`M200 ${starY - 6}L201.5 ${starY - 1.5}L206 ${starY}L201.5 ${starY + 1.5}L200 ${starY + 6}L198.5 ${starY + 1.5}L194 ${starY}L198.5 ${starY - 1.5}Z`}
          fill={dial.hands ?? metal.hand[0]}
        />
        <text x={CX + 2} y={CY - 56 + brandShift} textAnchor="middle" fontFamily={SERIF} fontSize="15" fontWeight="500" letterSpacing="4.5" fill={dial.ink}>
          AURELLE
        </text>
        <text x={CX + 1} y={CY - 45 + brandShift} textAnchor="middle" fontFamily={SANS} fontSize="5.4" letterSpacing="2.6" fill={dial.ink} fillOpacity=".75">
          GENÈVE
        </text>
        <text
          x={CX + 1}
          y={comp === 'date' ? CY + 50 : CY - 27}
          textAnchor="middle"
          fontFamily={SANS}
          fontSize="4.8"
          letterSpacing="2.2"
          fill={dial.ink}
          fillOpacity=".55"
        >
          {COMP_LABEL[comp]}
        </text>
      </motion.g>

      <motion.g style={{ opacity: handsOpacity }} filter={ids.url('shadow')}>
        <g ref={hourRef}>
          <Hand type={config.hands} length={62} width={5.4} fill={handFill} />
        </g>
        <g ref={minRef}>
          <Hand type={config.hands} length={96} width={4.4} fill={handFill} />
        </g>
        {centreSeconds && (
          <g ref={secRef}>
            <line x1={CX} y1={CY + 24} x2={CX} y2={CY - 104} stroke={dial.accent} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx={CX} cy={CY + 18} r="3.2" fill={dial.accent} />
            <circle cx={CX} cy={CY} r="3.4" fill={dial.accent} />
          </g>
        )}
        <circle cx={CX} cy={CY} r={centreSeconds ? 1.6 : 4.6} fill={centreSeconds ? '#111' : handFill} />
      </motion.g>

      <motion.g style={{ y: crystalY, opacity: crystalOpacity }}>
        <circle cx={CX} cy={CY} r="116" fill={ids.url('glass')} />
        <path d={`M${CX - 96} ${CY - 40} A104 104 0 0 1 ${CX + 30} ${CY - 100}`} fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

function Strap({ top = false, strap, ids }) {
  const y0 = top ? 0 : 456;
  const clip = ids.url(top ? 'strapTop' : 'strapBot');

  if (strap.type === 'bracelet') {
    const rows = Array.from({ length: 10 }, (_, i) => (top ? 224 - (i + 1) * 23 : 456 + i * 23));
    return (
      <g clipPath={clip}>
        <rect x="140" y={y0} width="120" height="224" fill={ids.url('case2')} />
        {rows.map((y) => (
          <g key={y}>
            <rect x="148" y={y} width="104" height="21" rx="3" fill={ids.url('case2')} stroke="#000" strokeOpacity=".35" strokeWidth=".6" />
            <rect x="177" y={y + 1} width="46" height="19" rx="3" fill={ids.url('case')} stroke="#000" strokeOpacity=".3" strokeWidth=".6" />
          </g>
        ))}
        <rect x="140" y={y0} width="120" height="224" fill={ids.url('shade')} />
      </g>
    );
  }

  return (
    <g clipPath={clip}>
      <rect x="140" y={y0} width="120" height="224" fill={strap.color} />
      <rect x="140" y={y0} width="120" height="224" fill={strap.color2} opacity=".35" />
      {strap.croc && <rect x="140" y={y0} width="120" height="224" fill={ids.url('croc')} />}
      {strap.type === 'rubber' && (
        <path d={Array.from({ length: 24 }, (_, i) => `M140 ${y0 + 6 + i * 9.5}H260`).join('')} stroke="#000" strokeOpacity=".16" strokeWidth="1.2" />
      )}
      <rect x="140" y={y0} width="120" height="224" fill={ids.url('shade')} />
      {strap.stitch && (
        <path
          d={top ? 'M163 0 L157.5 214 M237 0 L242.5 214' : 'M157.5 466 L163 680 M242.5 466 L237 680'}
          stroke={strap.stitch}
          strokeWidth="1.1"
          strokeDasharray="4 3"
          fill="none"
        />
      )}
      {!top && (
        <>
          <rect x="146" y="574" width="108" height="16" rx="3" fill={strap.color} stroke="#000" strokeOpacity=".45" />
          <rect x="146" y="574" width="108" height="16" rx="3" fill={ids.url('shade')} />
        </>
      )}
    </g>
  );
}

function Indices({ type, hide, ink, fill }) {
  return Array.from({ length: 12 }, (_, i) => {
    if (hide.includes(i)) return null;
    if (type === 'baton') {
      const t = `rotate(${i * 30} ${CX} ${CY})`;
      const h = i % 3 === 0 ? 20 : 15;
      if (i === 0) {
        return (
          <g key={i}>
            <rect x={CX - 7} y={CY - 101} width="5" height={h} rx="1" fill={fill} stroke="#000" strokeOpacity=".35" strokeWidth=".4" />
            <rect x={CX + 2} y={CY - 101} width="5" height={h} rx="1" fill={fill} stroke="#000" strokeOpacity=".35" strokeWidth=".4" />
          </g>
        );
      }
      return <rect key={i} x={CX - 2.6} y={CY - 101} width="5.2" height={h} rx="1" fill={fill} stroke="#000" strokeOpacity=".35" strokeWidth=".4" transform={t} />;
    }
    if (type === 'roman') {
      return (
        <text
          key={i}
          x={CX}
          y={CY - 85}
          transform={`rotate(${i * 30} ${CX} ${CY})`}
          textAnchor="middle"
          fontFamily={SERIF}
          fontWeight="600"
          fontSize={i % 3 === 0 ? 17 : 14}
          fill={ink}
        >
          {ROMAN[i]}
        </text>
      );
    }
    const [x, y] = polar(88, i * 30);
    return (
      <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontStyle="italic" fontWeight="500" fontSize={i % 3 === 0 ? 21 : 17} fill={ink}>
        {i === 0 ? 12 : i}
      </text>
    );
  });
}

function Hand({ type, length: L, width: w, fill }) {
  if (type === 'leaf') {
    return (
      <path
        d={`M${CX} ${CY - L}C${CX + w * 1.9} ${CY - L * 0.55} ${CX + w * 1.2} ${CY - 6} ${CX} ${CY + 12}C${CX - w * 1.2} ${CY - 6} ${CX - w * 1.9} ${CY - L * 0.55} ${CX} ${CY - L}Z`}
        fill={fill}
        stroke="#000"
        strokeOpacity=".3"
        strokeWidth=".5"
      />
    );
  }
  if (type === 'breguet') {
    const ry = CY - L * 0.68;
    const rr = w + 1.4;
    return (
      <g fill={fill}>
        <rect x={CX - 1.3} y={ry + rr - 1} width="2.6" height={CY - ry - rr + 13} rx="1.3" />
        <circle cx={CX} cy={ry} r={rr} fill="none" stroke={fill} strokeWidth="2.2" />
        <path d={`M${CX - 1.7} ${ry - rr + 0.6}L${CX} ${CY - L}L${CX + 1.7} ${ry - rr + 0.6}Z`} />
      </g>
    );
  }
  const right = `M${CX} ${CY - L}L${CX + w} ${CY - 4}L${CX} ${CY + 12}Z`;
  return (
    <g>
      <path d={`M${CX} ${CY - L}L${CX - w} ${CY - 4}L${CX} ${CY + 12}Z`} fill={fill} />
      <path d={right} fill={fill} />
      <path d={right} fill="#000" opacity=".28" />
    </g>
  );
}

function Gear({ x, y, r, teeth, dur, reverse }) {
  const pitch = (Math.PI * r) / teeth;
  return (
    <g className="spin" style={{ transformOrigin: `${x}px ${y}px`, animationDuration: `${dur}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={GOLD} strokeWidth="4" strokeDasharray={`${pitch} ${pitch}`} />
      <circle cx={x} cy={y} r={r - 2} fill="none" stroke={GOLD} strokeWidth="2.4" />
      {[0, 72, 144, 216, 288].map((a) => (
        <line key={a} x1={x} y1={y} x2={x + (r - 3) * Math.cos((a * Math.PI) / 180)} y2={y + (r - 3) * Math.sin((a * Math.PI) / 180)} stroke={GOLD} strokeWidth="2" />
      ))}
      <circle cx={x} cy={y} r={r * 0.3} fill={GOLD} />
    </g>
  );
}

function Balance({ x, y, r }) {
  return (
    <g>
      <path d={circlePath(x, y, r * 0.55) + circlePath(x, y, r * 0.35)} fill="none" stroke={GOLD} strokeWidth=".5" opacity=".7" />
      <g className="balance" style={{ transformOrigin: `${x}px ${y}px` }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={GOLD} strokeWidth="3" />
        <line x1={x - r} y1={y} x2={x + r} y2={y} stroke={GOLD} strokeWidth="1.6" />
        <line x1={x} y1={y - r} x2={x} y2={y + r} stroke={GOLD} strokeWidth="1.6" />
        {[45, 135, 225, 315].map((a) => (
          <circle key={a} cx={x + r * Math.cos((a * Math.PI) / 180)} cy={y + r * Math.sin((a * Math.PI) / 180)} r="1.6" fill="#f3e2b5" />
        ))}
      </g>
    </g>
  );
}

const Jewel = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r="3.4" fill="#9d1532" />
    <circle cx={x - 1} cy={y - 1} r="1" fill="#fff" opacity=".7" />
  </g>
);

const Screw = ({ x, y, color = '#2b3f7a' }) => (
  <g>
    <circle cx={x} cy={y} r="3.2" fill={color} stroke="#000" strokeOpacity=".45" strokeWidth=".6" />
    <line x1={x - 2.2} y1={y - 1} x2={x + 2.2} y2={y + 1} stroke="#000" strokeOpacity=".55" strokeWidth=".9" />
  </g>
);

function Movement({ ids, rotor = false }) {
  const x = CX;
  const y = CY;
  return (
    <g>
      <circle cx={x} cy={y} r="122" fill="#4f4a43" />
      <circle cx={x} cy={y} r="122" fill={ids.url('cotes')} opacity=".6" />
      <Gear x={x - 44} y={y - 22} r={30} teeth={32} dur={16} />
      <Gear x={x + 28} y={y - 44} r={19} teeth={20} dur={10} reverse />
      <Gear x={x + 50} y={y + 6} r={13} teeth={14} dur={6} />
      <Gear x={x + 14} y={y + 50} r={24} teeth={26} dur={12} reverse />
      <path d={`M${x - 86} ${y - 4}Q${x - 14} ${y - 84} ${x + 60} ${y - 62}`} stroke={ids.url('bridge')} strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d={`M${x + 76} ${y - 24}Q${x + 46} ${y + 40} ${x - 4} ${y + 76}`} stroke={ids.url('bridge')} strokeWidth="16" strokeLinecap="round" fill="none" />
      <Balance x={x - 50} y={y + 46} r={22} />
      <path d={`M${x - 94} ${y + 66}L${x - 50} ${y + 46}`} stroke={ids.url('bridge')} strokeWidth="11" strokeLinecap="round" />
      {[[x - 44, y - 22], [x + 28, y - 44], [x + 14, y + 50], [x - 50, y + 46], [x + 50, y + 6]].map(([jx, jy]) => (
        <Jewel key={`${jx}${jy}`} x={jx} y={jy} />
      ))}
      {[[x - 86, y - 4], [x + 60, y - 62], [x + 76, y - 24], [x - 4, y + 76], [x - 94, y + 66]].map(([sx, sy]) => (
        <Screw key={`${sx}${sy}`} x={sx} y={sy} />
      ))}
      {rotor && (
        <g className="spin" style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '28s' }}>
          <path
            d={`M${x - 90} ${y}A90 90 0 0 1 ${x + 90} ${y}L${x + 22} ${y}A22 22 0 0 0 ${x - 22} ${y}Z`}
            fill={ids.url('case')}
            opacity=".94"
            stroke="#000"
            strokeOpacity=".35"
          />
          <text fontFamily={SANS} fontSize="7.5" letterSpacing="3.5" fill="#000" fillOpacity=".42" textAnchor="middle">
            <textPath href={`#${ids.id('arcRotor')}`} startOffset="50%">
              MAISON AURELLE · GENÈVE
            </textPath>
          </text>
          <circle cx={x} cy={y} r="12" fill={ids.url('case2')} stroke="#000" strokeOpacity=".4" />
          <Jewel x={x} y={y} />
        </g>
      )}
    </g>
  );
}
