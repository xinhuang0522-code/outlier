export type LayoutBlock = {
  type: 'text' | 'stat' | 'image-placeholder' | 'list';
  title: string;
  size: 'small' | 'medium' | 'large';
};

export type Layout = {
  heroStyle: 'minimal' | 'bold' | 'split' | 'fullbleed';
  headline: string;
  subheadline: string;
  ctaText: string;
  blocks: LayoutBlock[];
  accentColor: string;
  density: 'sparse' | 'medium' | 'dense';
};

const INK = '#2C3444';
const MUTED = '#7A8496';
const GRADIENT = 'linear-gradient(135deg, #F5A344, #E8622B)';
const FLOAT = '0 4px 16px rgba(44, 52, 68, 0.08)';

const sizeClass = {
  small: 'min-h-16 text-sm',
  medium: 'min-h-24 text-base',
  large: 'min-h-36 text-lg',
};

const gapClass = {
  sparse: 'gap-6',
  medium: 'gap-4',
  dense: 'gap-2',
};

function Hero({ layout }: { layout: Layout }) {
  const cta = (
    <button
      type="button"
      className="mt-4 rounded-full px-4 py-2 text-sm font-bold text-white"
      style={{ background: GRADIENT, boxShadow: FLOAT }}
    >
      {layout.ctaText}
    </button>
  );

  if (layout.heroStyle === 'split') {
    return (
      <div className="grid grid-cols-2 gap-4 p-6">
        <div>
          <div className="font-title text-2xl" style={{ color: INK }}>{layout.headline}</div>
          <div className="mt-2 text-sm" style={{ color: MUTED }}>{layout.subheadline}</div>
          {cta}
        </div>
        <div className="min-h-32 rounded-2xl bg-white" style={{ boxShadow: FLOAT }} />
      </div>
    );
  }

  if (layout.heroStyle === 'fullbleed') {
    return (
      <div className="rounded-2xl p-8 text-center text-white" style={{ background: GRADIENT }}>
        <div className="font-title text-3xl">{layout.headline}</div>
        <div className="mt-2 text-sm opacity-80">{layout.subheadline}</div>
        <button type="button" className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-bold" style={{ color: INK }}>
          {layout.ctaText}
        </button>
      </div>
    );
  }

  if (layout.heroStyle === 'bold') {
    return (
      <div className="p-6">
        <div className="font-title text-4xl leading-tight" style={{ color: INK }}>{layout.headline}</div>
        <div className="mt-3" style={{ color: MUTED }}>{layout.subheadline}</div>
        {cta}
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <div className="font-title text-xl" style={{ color: INK }}>{layout.headline}</div>
      <div className="mt-2 text-sm" style={{ color: MUTED }}>{layout.subheadline}</div>
      {cta}
    </div>
  );
}

function Block({ block }: { block: LayoutBlock; accent: string }) {
  const box = `rounded-2xl bg-white p-3 ${sizeClass[block.size]}`;
  const surface = { color: INK, boxShadow: FLOAT };

  if (block.type === 'stat') {
    return (
      <div className={box} style={surface}>
        <div className="font-mono text-2xl" style={{ color: '#E8622B' }}>88</div>
        <div style={{ color: MUTED }}>{block.title}</div>
      </div>
    );
  }

  if (block.type === 'image-placeholder') {
    return (
      <div className={`${box} flex items-center justify-center`} style={{ ...surface, color: MUTED }}>
        {block.title}
      </div>
    );
  }

  if (block.type === 'list') {
    return (
      <div className={box} style={surface}>
        <div className="mb-2 font-semibold">{block.title}</div>
        <div className="space-y-1 text-xs" style={{ color: MUTED }}>
          <div>— Item one</div>
          <div>— Item two</div>
          <div>— Item three</div>
        </div>
      </div>
    );
  }

  return <div className={box} style={surface}>{block.title}</div>;
}

export function Wireframe({ layout }: { layout: Layout }) {
  return (
    <div className="overflow-hidden text-left" style={{ color: INK }}>
      <Hero layout={layout} />
      <div className={`grid grid-cols-2 p-4 ${gapClass[layout.density]}`}>
        {layout.blocks.map((block, i) => (
          <div key={`${block.title}-${i}`} className={block.size === 'large' ? 'col-span-2' : ''}>
            <Block block={block} accent={layout.accentColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
