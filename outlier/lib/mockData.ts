export type Axis = {
  key: string;
  label: string;
  left: string;
  right: string;
};

export type AxisSetName = 'initial' | 'invite' | 'urgency';

export const AXIS_SETS: Record<AxisSetName, Axis[]> = {
  initial: [
    { key: 'structure', label: 'Structure', left: 'Grid', right: 'Collage' },
    { key: 'weight', label: 'Weight', left: 'Type', right: 'Image' },
    { key: 'pace', label: 'Pace', left: 'Instant', right: 'Journey' },
  ],
  invite: [
    { key: 'voice', label: 'Voice', left: 'Corporate', right: 'Handwritten' },
    { key: 'proof', label: 'Proof', left: 'Logos', right: 'Names' },
    { key: 'access', label: 'Access', left: 'Open', right: 'Gated' },
  ],
  urgency: [
    { key: 'urgency', label: 'Urgency', left: 'Stated', right: 'Ambient' },
    { key: 'crowd', label: 'Crowd', left: 'Count', right: 'Faces' },
    { key: 'time', label: 'Time', left: 'Countdown', right: 'Live' },
  ],
};

export const SET_ORDER: AxisSetName[] = ['initial', 'invite', 'urgency'];

export const REFINE_TRIGGERS: { match: string[]; set: AxisSetName }[] = [
  { match: ['invite', 'ad', 'personal', 'human'], set: 'invite' },
  { match: ['late', 'urgen', 'miss', 'fomo', 'scarce'], set: 'urgency' },
];

/** Available preview images under /public/previews/ */
export const PREVIEW_IMAGES: {
  setName: AxisSetName;
  point: [number, number, number];
  file: string;
}[] = [
  { setName: 'initial', point: [0, 0, 0], file: 'initial-000.png' },
  { setName: 'initial', point: [0, 50, 50], file: 'initial-0-50-50.png' },
  { setName: 'initial', point: [50, 50, 50], file: 'initial-50-50-50.png' },
  { setName: 'initial', point: [50, 50, 100], file: 'initial-50-50-100.png' },
  { setName: 'initial', point: [100, 50, 50], file: 'initial-100-50-50.png' },
  { setName: 'initial', point: [100, 100, 100], file: 'initial-100-100-100.png' },
  { setName: 'invite', point: [0, 0, 0], file: 'invite-000.png' },
  { setName: 'invite', point: [50, 0, 0], file: 'invite-50-0-0.png' },
  { setName: 'invite', point: [50, 0, 50], file: 'invite-50-0-50.png' },
  { setName: 'invite', point: [50, 50, 50], file: 'invite-50-50-50.png' },
  { setName: 'invite', point: [100, 50, 50], file: 'invite-100-50-50.png' },
  { setName: 'invite', point: [100, 100, 100], file: 'invite-100.png' },
  { setName: 'urgency', point: [0, 0, 0], file: 'urgency-000.png' },
  { setName: 'urgency', point: [0, 50, 50], file: 'urgency-0-50-50.png' },
  { setName: 'urgency', point: [50, 50, 50], file: 'urgency-50-50-50.png' },
  { setName: 'urgency', point: [100, 50, 50], file: 'urgency-100-50-50.png' },
  { setName: 'urgency', point: [100, 100, 100], file: 'urgency-100.png' },
];

export const INITIAL_AXES = AXIS_SETS.initial;

export function snapTo50(value: number) {
  return Math.round(value / 50) * 50;
}

export function pad3(value: number) {
  return String(snapTo50(value)).padStart(3, '0');
}

/** Filename stem: initial-0-50-50 */
export function previewStem(setName: AxisSetName, point: [number, number, number]) {
  return `${setName}-${point[0]}-${point[1]}-${point[2]}`;
}

export function midValues(axes: Axis[]) {
  const values: Record<string, number> = {};
  axes.forEach((axis) => {
    values[axis.key] = 50;
  });
  return values;
}

export function axisValuesFrom(axes: Axis[], values: Record<string, number>) {
  return axes.map((axis) => values[axis.key] ?? 50);
}

/**
 * Resolve /previews/... path.
 * Exact match on point / `{set}-{v1}-{v2}-{v3}.png` (and legacy short names),
 * else nearest available image in the same set by abs-diff sum.
 */
export function lookupPreviewSrc(setName: AxisSetName, axisValues: number[]): string {
  const target = [0, 1, 2].map((i) => snapTo50(axisValues[i] ?? 50)) as [
    number,
    number,
    number,
  ];

  const stems = [
    `${previewStem(setName, target)}.png`,
    `${setName}-${pad3(target[0])}-${pad3(target[1])}-${pad3(target[2])}.png`,
  ];
  if (target[0] === target[1] && target[1] === target[2]) {
    stems.push(`${setName}-${pad3(target[0])}.png`);
    stems.push(`${setName}-${target[0]}.png`);
  }

  const available = PREVIEW_IMAGES.filter((img) => img.setName === setName);
  const exactHit =
    available.find((img) => stems.includes(img.file)) ??
    available.find(
      (img) =>
        img.point[0] === target[0] &&
        img.point[1] === target[1] &&
        img.point[2] === target[2],
    );

  if (exactHit) return `/previews/${exactHit.file}`;

  let best = available[0] ?? PREVIEW_IMAGES[0];
  let bestDistance = Infinity;
  for (const img of available) {
    const distance =
      Math.abs(img.point[0] - target[0]) +
      Math.abs(img.point[1] - target[1]) +
      Math.abs(img.point[2] - target[2]);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = img;
    }
  }

  return `/previews/${best.file}`;
}

export function nextAxisSet(current: AxisSetName): AxisSetName {
  if (current === 'initial') return 'invite';
  if (current === 'invite') return 'urgency';
  return 'invite';
}

export function matchRefine(
  text: string,
  currentSet: AxisSetName,
): { setName: AxisSetName; axes: Axis[] } {
  const needle = text.toLowerCase();
  const hit = REFINE_TRIGGERS.find((trigger) =>
    trigger.match.some((token) => needle.includes(token)),
  );
  const setName = hit?.set ?? nextAxisSet(currentSet);
  return { setName, axes: AXIS_SETS[setName] };
}
