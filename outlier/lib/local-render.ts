import { generateAxes, normalizeAxis, type Axis } from './local-engine';
import type { Layout } from '../app/wireframe';

function lean(axis: Axis, value: number) {
  if (value < 40) return 'left';
  if (value > 60) return 'right';
  return 'mid';
}

function findLean(
  axes: Axis[],
  values: Record<string, number>,
  keys: string[],
) {
  const axis = axes.find((item) =>
    keys.some((key) =>
      item.key.toLowerCase().includes(key) ||
      item.label.toLowerCase().includes(key),
    ),
  );
  if (!axis) return 'mid';
  return lean(axis, values[axis.key] ?? 50);
}

export function generateLayout(
  intent: string,
  axes: Axis[],
  values: Record<string, number>,
): Layout {
  const subject = intent.trim() || 'Hackathon signup landing page';
  const densityLean = findLean(axes, values, ['density']);
  const narrativeLean = findLean(axes, values, ['narrative', 'hook']);
  const vibeLean = findLean(axes, values, ['vibe', 'atmosphere', 'voice']);
  const midCount = axes.filter(
    (axis) => lean(axis, values[axis.key] ?? 50) === 'mid',
  ).length;
  const mostlyMid = axes.length > 0 && midCount >= axes.length - 1;

  const density = densityLean === 'left'
    ? 'sparse'
    : densityLean === 'right'
      ? 'dense'
      : 'medium';

  const heroStyle = mostlyMid
    ? 'minimal'
    : vibeLean === 'right' || narrativeLean === 'right'
      ? 'fullbleed'
      : vibeLean === 'left'
        ? 'split'
        : density === 'dense'
          ? 'bold'
          : 'minimal';

  const headline = mostlyMid
    ? `${subject}. Start here.`
    : narrativeLean === 'right'
      ? "Don't ask for the rules. Are you in?"
      : narrativeLean === 'left'
        ? '120 teams last year. $50k on the line.'
        : subject;

  const subheadline = mostlyMid
    ? 'Headline, blurb, button — the default that never gets remembered.'
    : density === 'sparse'
      ? 'One line. One door. Everything else can wait.'
      : density === 'dense'
        ? 'Tracks, prizes, judges, and the clock — all on the first screen.'
        : 'Enough to decide. Not enough to scare people off.';

  const ctaText = findLean(axes, values, ['path', 'signup']) === 'right'
    ? 'Pass the gate'
    : 'Sign up now';

  const accentColor = vibeLean === 'left' ? '#22c55e' : vibeLean === 'right' ? '#f97316' : '#f59e0b';

  const pool = [
    { type: 'stat' as const, title: '$50k prize pool', size: 'medium' as const },
    { type: 'text' as const, title: '48 hours to ship something you can demo', size: 'medium' as const },
    { type: 'list' as const, title: 'Tracks: AI / hardware / civic', size: 'small' as const },
    { type: 'image-placeholder' as const, title: 'Last year on the floor', size: 'large' as const },
    { type: 'stat' as const, title: '12 judges', size: 'small' as const },
    { type: 'text' as const, title: 'Signup closes Sunday 11:59pm', size: 'small' as const },
  ];

  const count = density === 'sparse' ? 1 : density === 'dense' ? 5 : 3;
  const blocks = mostlyMid
    ? [{ type: 'text' as const, title: 'A paragraph no one will remember', size: 'medium' as const }]
    : pool.slice(0, count);

  return { heroStyle, headline, subheadline, ctaText, blocks, accentColor, density };
}

const LEAKED = /this pass leans toward|rewrite the hero|around this direction|user's (new )?direction|more creative/i;

function isShortLabel(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length >= 1 && words.length <= 4;
}

function looksLikeInstruction(text: string, refinement: string) {
  const value = text.trim().toLowerCase();
  const hint = refinement.trim().toLowerCase();
  if (!value) return true;
  if (LEAKED.test(value)) return true;
  if (hint && hint.length > 2 && value.includes(hint)) return true;
  if (!isShortLabel(text)) return true;
  return false;
}

export function sanitizeAxes(rawAxes: unknown[], refinement = ''): Axis[] {
  const mapped = (rawAxes ?? []).map((item) =>
    normalizeAxis(item as Parameters<typeof normalizeAxis>[0]),
  );
  return mapped.slice(0, 3).map((axis, index) => {
    const fallback = generateAxes('Hackathon signup landing page')[index] ?? {
      key: `axis-${index}`,
      label: 'Focus',
      left: 'Evidence-first',
      right: 'Suspense-first',
    };
    return {
      key: axis.key || fallback.key,
      label: looksLikeInstruction(axis.label, refinement) ? fallback.label : axis.label,
      left: looksLikeInstruction(axis.left, refinement) ? fallback.left : axis.left,
      right: looksLikeInstruction(axis.right, refinement) ? fallback.right : axis.right,
    };
  });
}

const DIRECTION_SETS: Axis[][] = [
  [
    { key: 'narrative', label: 'Narrative focus', left: 'Evidence-first', right: 'Suspense-first' },
    { key: 'density', label: 'Density', left: 'One line only', right: 'Info wall' },
    { key: 'path', label: 'Signup path', left: 'One-click submit', right: 'Qualify first' },
  ],
  [
    { key: 'vibe', label: 'Atmosphere', left: 'Hacker terminal', right: 'Keynote stage' },
    { key: 'trust', label: 'Trust signal', left: 'Proof stack', right: 'Deliberate blank' },
    { key: 'density', label: 'Density', left: 'One line only', right: 'Info wall' },
  ],
  [
    { key: 'focus', label: 'Focus', left: 'One claim', right: 'Feature exhibit' },
    { key: 'pace', label: 'Pace', left: 'Still type', right: 'Film open' },
    { key: 'hierarchy', label: 'Hierarchy', left: 'Flat plane', right: 'Stacked drawers' },
  ],
];

export function refineAxesLocal(
  intent: string,
  currentAxes: Axis[],
  refinement: string,
): Axis[] {
  const hint = refinement.trim().toLowerCase();
  if (/suspense|mystery|curious/i.test(hint)) {
    return DIRECTION_SETS[0];
  }
  if (/terminal|hacker|geek/i.test(hint)) {
    return DIRECTION_SETS[1];
  }
  if (/creative|wild|bold/i.test(hint)) {
    return DIRECTION_SETS[2];
  }
  const extras = generateAxes(`${intent} ${refinement}`);
  if (extras.length === 3) return extras;
  return sanitizeAxes(currentAxes.length ? currentAxes : extras, refinement);
}
