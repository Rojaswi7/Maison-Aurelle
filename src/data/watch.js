// Every option a client can choose, and the pricing / URL logic built on top of it.

export const BASE_PRICE = 14800;
export const ENGRAVING_PRICE = 350;
export const ENGRAVING_MAX = 24;

export const cases = [
  {
    id: 'steel',
    name: '904L Steel',
    note: 'Mirror-polished, the most luminous of steels',
    price: 0,
    stops: ['#fbfbfa', '#a3a5a9', '#e9e8e5', '#5d5f63'],
    edge: '#47494d',
    hand: ['#ffffff', '#9da0a5'],
    engrave: 'rgba(0,0,0,.5)',
    hallmark: 'ACIER 904L',
  },
  {
    id: 'rose',
    name: '18k Or Aurore',
    note: 'Our proprietary rose gold, warm and fade-resistant',
    price: 18500,
    stops: ['#fde4d3', '#bf8263', '#f4c9ad', '#7a4632'],
    edge: '#5b3222',
    hand: ['#ffe6d6', '#b9785a'],
    engrave: 'rgba(60,25,10,.55)',
    hallmark: 'OR ROSE 18K',
  },
  {
    id: 'yellow',
    name: '18k Yellow Gold',
    note: 'The classic Genevan gold, hand-satinated flanks',
    price: 21000,
    stops: ['#fff3c8', '#c7a049', '#f6dd95', '#77581b'],
    edge: '#5a4012',
    hand: ['#fff4cf', '#bf9640'],
    engrave: 'rgba(60,40,0,.55)',
    hallmark: 'OR JAUNE 18K',
  },
  {
    id: 'titanium',
    name: 'Black Titanium',
    note: 'Grade 5 titanium with a DLC finish, 40% lighter',
    price: 6200,
    stops: ['#5d5f63', '#1c1d20', '#3d3f43', '#0a0a0c'],
    edge: '#000000',
    hand: ['#f4f4f4', '#a9acb1'],
    engrave: 'rgba(210,214,220,.55)',
    hallmark: 'TITANE GR.5',
  },
  {
    id: 'platinum',
    name: '950 Platinum',
    note: 'The rarest metal, marked by a single diamond at six',
    price: 32000,
    stops: ['#ffffff', '#b6bcc3', '#eef1f4', '#7c838b'],
    edge: '#5a6169',
    hand: ['#ffffff', '#a8b0b8'],
    engrave: 'rgba(0,0,0,.45)',
    hallmark: 'PT 950',
  },
];

export const dials = [
  {
    id: 'midnight',
    name: 'Midnight Sunburst',
    note: 'Hand-brushed rays under eleven coats of lacquer',
    price: 0,
    base: '#24457f',
    mid: '#132a52',
    edge: '#07122a',
    ink: '#ece5d6',
    accent: '#d6b47a',
    texture: 'sunburst',
  },
  {
    id: 'ivory',
    name: 'Grand Feu Enamel',
    note: 'Fired eight times at 800°C; one in three survives',
    price: 4200,
    base: '#fbf7ee',
    mid: '#f1e9d8',
    edge: '#d8cbb0',
    ink: '#1c1a17',
    accent: '#1f2f6e',
    hands: '#1f2f6e',
    texture: 'enamel',
  },
  {
    id: 'forest',
    name: 'Forest Guilloché',
    note: 'Rose-engine turned on a 1920s Lienhard lathe',
    price: 2800,
    base: '#3a6a52',
    mid: '#1f4232',
    edge: '#0d2119',
    ink: '#f0e7cf',
    accent: '#d9bd84',
    texture: 'guilloche',
  },
  {
    id: 'salmon',
    name: 'Salmon Opaline',
    note: 'A soft, grained finish from the 1940s archive',
    price: 2400,
    base: '#f6cdb5',
    mid: '#e5a888',
    edge: '#b8735a',
    ink: '#3a2117',
    accent: '#3a2117',
    hands: '#2b1a12',
    texture: 'opaline',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Guilloché',
    note: 'Deep black with a barleycorn rosette',
    price: 1800,
    base: '#2e2e31',
    mid: '#18181a',
    edge: '#050506',
    ink: '#dcc38f',
    accent: '#c8a46a',
    texture: 'guilloche',
  },
];

export const straps = [
  { id: 'black', name: 'Black Alligator', note: 'Hand-stitched in our Genève atelier', price: 0, type: 'leather', croc: true, color: '#141211', color2: '#2b2622', stitch: '#3c3530' },
  { id: 'cognac', name: 'Cognac Alligator', note: 'Hand-patinated over three days', price: 0, type: 'leather', croc: true, color: '#6e3a1b', color2: '#a7622f', stitch: '#e0c08e' },
  { id: 'navy', name: 'Navy Calfskin', note: 'Softly grained, lined in silk', price: 0, type: 'leather', croc: false, color: '#17213a', color2: '#2a3a63', stitch: '#c8a46a' },
  { id: 'rubber', name: 'Sand Rubber', note: 'Vulcanised, vanilla-scented', price: 450, type: 'rubber', color: '#a8977a', color2: '#cdbd9f' },
  { id: 'bracelet', name: 'Matching Bracelet', note: 'Seven-row, hand-polished links', price: 6800, type: 'bracelet' },
];

export const complications = [
  { id: 'small-seconds', name: 'Petite Seconde', note: 'A sub-dial at six — the purist’s choice', price: 0, months: 6 },
  { id: 'date', name: 'Date à Guichet', note: 'A framed aperture at three o’clock', price: 1200, months: 6 },
  { id: 'moonphase', name: 'Phase de Lune', note: 'Accurate to one day in 122 years', price: 9800, months: 9 },
  { id: 'tourbillon', name: 'Tourbillon Volant', note: 'A flying cage, one revolution per minute', price: 48000, months: 14 },
];

export const indexStyles = [
  { id: 'baton', name: 'Applied Baton', note: 'Faceted and hand-polished', price: 900 },
  { id: 'roman', name: 'Roman Numerals', note: 'Painted in raised relief', price: 0 },
  { id: 'breguet', name: 'Breguet Numerals', note: 'Italic arabic figures', price: 0 },
];

export const handStyles = [
  { id: 'dauphine', name: 'Dauphine', note: 'Faceted to catch the light', price: 0 },
  { id: 'leaf', name: 'Feuille', note: 'A slender leaf silhouette', price: 0 },
  { id: 'breguet', name: 'Breguet', note: 'Pierced “pomme” tips, flame-blued', price: 400 },
];

export const defaultConfig = {
  caseId: 'rose',
  dialId: 'midnight',
  strapId: 'cognac',
  complication: 'small-seconds',
  indices: 'baton',
  hands: 'dauphine',
  engraving: '',
};

const find = (list, id) => list.find((x) => x.id === id) ?? list[0];
export const getCase = (id) => find(cases, id);
export const getDial = (id) => find(dials, id);
export const getStrap = (id) => find(straps, id);
export const getComplication = (id) => find(complications, id);
export const getIndices = (id) => find(indexStyles, id);
export const getHands = (id) => find(handStyles, id);

export function lineItems(cfg) {
  const items = [
    { group: 'Case', ...pick(getCase(cfg.caseId)) },
    { group: 'Dial', ...pick(getDial(cfg.dialId)) },
    { group: 'Strap', ...pick(getStrap(cfg.strapId)) },
    { group: 'Complication', ...pick(getComplication(cfg.complication)) },
    { group: 'Indices', ...pick(getIndices(cfg.indices)) },
    { group: 'Hands', ...pick(getHands(cfg.hands)) },
  ];
  if (cfg.engraving) items.push({ group: 'Engraving', name: `“${cfg.engraving}”`, price: ENGRAVING_PRICE });
  return items;
}
const pick = ({ name, price }) => ({ name, price });

export const priceOf = (cfg) => BASE_PRICE + lineItems(cfg).reduce((sum, i) => sum + i.price, 0);
export const leadTime = (cfg) => getComplication(cfg.complication).months;

const chf = new Intl.NumberFormat('de-CH');
export const formatCHF = (n) => `CHF ${chf.format(n)}`;

// A short, stable reference so a configuration feels like a real commission.
export function reference(cfg) {
  const lists = [cases, dials, straps, complications, indexStyles, handStyles];
  const keys = ['caseId', 'dialId', 'strapId', 'complication', 'indices', 'hands'];
  const digits = keys.map((k, i) => Math.max(0, lists[i].findIndex((o) => o.id === cfg[k])) + 1).join('');
  return `AU-${digits.slice(0, 3)}.${digits.slice(3)}`;
}

// URL <-> config, so every configuration is a shareable link.
const PARAMS = { caseId: 'case', dialId: 'dial', strapId: 'strap', complication: 'comp', indices: 'idx', hands: 'hands', engraving: 'engr' };
const LISTS = { caseId: cases, dialId: dials, strapId: straps, complication: complications, indices: indexStyles, hands: handStyles };

export const hasConfigParams = (params) => Object.values(PARAMS).some((p) => params.has(p));

export function configFromParams(params, base = defaultConfig) {
  const cfg = { ...defaultConfig, ...base };
  for (const [key, param] of Object.entries(PARAMS)) {
    const value = params.get(param);
    if (value == null) continue;
    if (key === 'engraving') cfg.engraving = value.slice(0, ENGRAVING_MAX);
    else if (LISTS[key].some((o) => o.id === value)) cfg[key] = value;
  }
  return cfg;
}

export function configToParams(cfg) {
  const params = new URLSearchParams();
  for (const [key, param] of Object.entries(PARAMS)) if (cfg[key]) params.set(param, cfg[key]);
  return params;
}
