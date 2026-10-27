export const CATEGORIES = ['All', 'Dress', 'Complications', 'Haute Horlogerie', 'Sport'];

export const models = [
  {
    id: 'lune',
    name: 'Lune Céleste',
    category: 'Complications',
    tagline: 'A moon that keeps faith for 122 years.',
    limited: 'Limited · 88 pieces',
    config: { caseId: 'rose', dialId: 'midnight', strapId: 'black', complication: 'moonphase', indices: 'baton', hands: 'dauphine', engraving: '' },
    specs: { Diameter: '40 mm', Thickness: '10.4 mm', Movement: 'Calibre AU-03, automatic', Reserve: '72 hours', Water: '30 m' },
  },
  {
    id: 'eternel',
    name: 'Tourbillon Éternel',
    category: 'Haute Horlogerie',
    tagline: 'One minute, one revolution, fourteen months at the bench.',
    limited: 'Unique pieces · 6 a year',
    config: { caseId: 'platinum', dialId: 'obsidian', strapId: 'black', complication: 'tourbillon', indices: 'breguet', hands: 'leaf', engraving: '' },
    specs: { Diameter: '41 mm', Thickness: '11.2 mm', Movement: 'Calibre AU-T1, manual', Reserve: '96 hours', Water: '30 m' },
  },
  {
    id: 'classique',
    name: 'Aurelle Classique',
    category: 'Dress',
    tagline: 'The purest expression of the house.',
    config: { caseId: 'steel', dialId: 'ivory', strapId: 'navy', complication: 'small-seconds', indices: 'roman', hands: 'breguet', engraving: '' },
    specs: { Diameter: '39 mm', Thickness: '8.9 mm', Movement: 'Calibre AU-01, manual', Reserve: '72 hours', Water: '30 m' },
  },
  {
    id: 'riviera',
    name: 'Riviera',
    category: 'Sport',
    tagline: 'Built for the lake, finished for the evening.',
    config: { caseId: 'steel', dialId: 'midnight', strapId: 'bracelet', complication: 'date', indices: 'baton', hands: 'dauphine', engraving: '' },
    specs: { Diameter: '40 mm', Thickness: '9.8 mm', Movement: 'Calibre AU-02, automatic', Reserve: '72 hours', Water: '120 m' },
  },
  {
    id: 'jardin',
    name: 'Jardin Secret',
    category: 'Dress',
    tagline: 'Green guilloché, cut like a hedge maze.',
    config: { caseId: 'yellow', dialId: 'forest', strapId: 'cognac', complication: 'small-seconds', indices: 'roman', hands: 'leaf', engraving: '' },
    specs: { Diameter: '38 mm', Thickness: '8.6 mm', Movement: 'Calibre AU-01, manual', Reserve: '72 hours', Water: '30 m' },
  },
  {
    id: 'heritage',
    name: 'Héritage 1887',
    category: 'Complications',
    tagline: 'Our founder’s pocket watch, re-drawn for the wrist.',
    limited: 'Limited · 137 pieces',
    config: { caseId: 'yellow', dialId: 'ivory', strapId: 'black', complication: 'moonphase', indices: 'roman', hands: 'breguet', engraving: '' },
    specs: { Diameter: '39 mm', Thickness: '10.1 mm', Movement: 'Calibre AU-03, automatic', Reserve: '72 hours', Water: '30 m' },
  },
  {
    id: 'aurore',
    name: 'Aurore',
    category: 'Dress',
    tagline: 'The colour of Lake Geneva at six in the morning.',
    config: { caseId: 'rose', dialId: 'salmon', strapId: 'black', complication: 'date', indices: 'breguet', hands: 'breguet', engraving: '' },
    specs: { Diameter: '38 mm', Thickness: '9.2 mm', Movement: 'Calibre AU-02, automatic', Reserve: '72 hours', Water: '30 m' },
  },
  {
    id: 'nocturne',
    name: 'Nocturne',
    category: 'Sport',
    tagline: 'Black titanium, for the hours after midnight.',
    config: { caseId: 'titanium', dialId: 'obsidian', strapId: 'rubber', complication: 'date', indices: 'baton', hands: 'leaf', engraving: '' },
    specs: { Diameter: '41 mm', Thickness: '10.0 mm', Movement: 'Calibre AU-02, automatic', Reserve: '72 hours', Water: '100 m' },
  },
];

export const getModel = (id) => models.find((m) => m.id === id);
