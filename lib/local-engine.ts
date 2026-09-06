export type Axis = {
  key: string;
  label: string;
  left: string;
  right: string;
};

type Catalog = {
  match: RegExp;
  axes: Axis[];
};

const catalogs: Catalog[] = [
  {
    match: /hackathon|signup|landing|event/i,
    axes: [
      { key: 'narrative', label: 'Narrative focus', left: 'Evidence-first', right: 'Suspense-first' },
      { key: 'density', label: 'Density', left: 'One line only', right: 'Info wall' },
      { key: 'path', label: 'Signup path', left: 'One-click submit', right: 'Qualify first' },
      { key: 'vibe', label: 'Atmosphere', left: 'Hacker terminal', right: 'Keynote stage' },
    ],
  },
  {
    match: /shop|store|product|commerce|sku/i,
    axes: [
      { key: 'persuade', label: 'Persuasion', left: 'Spec sheet', right: 'Lifestyle first' },
      { key: 'price', label: 'Price signal', left: 'Price upfront', right: 'Hide the price' },
      { key: 'browse', label: 'Browsing', left: 'Single product', right: 'Shelf scan' },
    ],
  },
  {
    match: /portfolio|designer|gallery|exhibit/i,
    axes: [
      { key: 'voice', label: 'Authorship', left: 'Work speaks', right: 'Author on stage' },
      { key: 'pace', label: 'Pace', left: 'One per screen', right: 'Thumbnail flood' },
      { key: 'grid', label: 'Order', left: 'Strict grid', right: 'Deliberate offset' },
    ],
  },
  {
    match: /dashboard|admin|analytics|report/i,
    axes: [
      { key: 'agency', label: 'Agency', left: 'System decides', right: 'Filters open' },
      { key: 'density', label: 'Density', left: 'One-screen verdict', right: 'Raw table' },
      { key: 'nav', label: 'Navigation', left: 'Search only', right: 'Full tree' },
    ],
  },
  {
    match: /news|media|magazine|blog|article|read/i,
    axes: [
      { key: 'lead', label: 'Opening', left: 'Headline only', right: 'Cover story' },
      { key: 'index', label: 'Index', left: 'Single path', right: 'Related swirl' },
      { key: 'time', label: 'Time', left: 'Live feed', right: 'Archive' },
    ],
  },
];

const fallbackAxes: Axis[] = [
  { key: 'focus', label: 'Focus', left: 'One claim', right: 'Feature exhibit' },
  { key: 'trust', label: 'Trust signal', left: 'Proof stack', right: 'Deliberate blank' },
  { key: 'motion', label: 'Pace', left: 'Still type', right: 'Film open' },
  { key: 'hierarchy', label: 'Hierarchy', left: 'Flat plane', right: 'Stacked drawers' },
];

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(items: T[], seed: number) {
  const next = [...items];
  let s = seed || 1;
  for (let i = next.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function generateAxes(intent: string): Axis[] {
  const seed = hash(intent.trim() || 'default');
  const matched = catalogs.find((catalog) => catalog.match.test(intent));
  const pool = matched ? matched.axes : fallbackAxes;
  return seededShuffle(pool, seed).slice(0, 3);
}

export function describeAxisState(
  axes: Axis[],
  values: Record<string, number>,
) {
  return axes
    .map((axis) => {
      const value = values[axis.key] ?? 50;
      if (value < 40) return `${axis.label}: leaning "${axis.left}" (${value})`;
      if (value > 60) return `${axis.label}: leaning "${axis.right}" (${value})`;
      return `${axis.label}: mid-point between "${axis.left}" and "${axis.right}" (${value})`;
    })
    .join('\n');
}

function lean(axis: Axis, value: number) {
  if (value < 40) return { side: 'left' as const, pole: axis.left, value };
  if (value > 60) return { side: 'right' as const, pole: axis.right, value };
  return { side: 'mid' as const, pole: null, value };
}

export function generateSummary(
  intent: string,
  axes: Axis[],
  values: Record<string, number>,
) {
  const subject = intent.trim() || 'This page';
  const leans = axes.map((axis) => ({
    axis,
    ...lean(axis, values[axis.key] ?? 50),
  }));
  const midCount = leans.filter((item) => item.side === 'mid').length;

  if (midCount >= axes.length - (axes.length > 2 ? 1 : 0) && midCount > 0) {
    const mids = leans
      .filter((item) => item.side === 'mid')
      .map((item) => `"${item.axis.left}" and "${item.axis.right}"`)
      .join(', ');
    return `${subject} is parked at the safest midpoint. It wants ${mids} at once, so it commits to neither. This is the forgettable average.`;
  }

  const sentences = leans.map((item) => {
    if (item.side === 'mid') {
      return `${item.axis.label} is still in the middle, so ${item.axis.left} and ${item.axis.right} cancel out.`;
    }
    return `${item.axis.label} leans "${item.pole}".`;
  });

  return `${subject} will be built from these decisions. ${sentences.join(' ')}`;
}

export function normalizeAxis(raw: {
  key?: string;
  label?: string;
  left?: string | { name?: string };
  right?: string | { name?: string };
}): Axis {
  const left = typeof raw.left === 'string' ? raw.left : raw.left?.name ?? '';
  const right = typeof raw.right === 'string' ? raw.right : raw.right?.name ?? '';
  return {
    key: raw.key || 'axis',
    label: raw.label || 'Axis',
    left,
    right,
  };
}
