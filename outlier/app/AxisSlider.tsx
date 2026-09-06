import type { Axis } from '@/lib/mockData';

type AxisSliderProps = {
  axis: Axis;
  value: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
};

export function AxisSlider({ axis, value, onChange, onCommit }: AxisSliderProps) {
  return (
    <div className="float-card p-5">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div className="text-lg font-medium" style={{ color: '#2C3444' }}>{axis.label}</div>
        <div className="font-mono text-xs" style={{ color: '#7A8496' }}>{axis.key} · {value}</div>
      </div>
      <div className="mb-4 flex justify-between gap-6 text-sm" style={{ color: '#7A8496' }}>
        <span>{axis.left}</span>
        <span className="text-right">{axis.right}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseUp={(e) => onCommit(Number((e.target as HTMLInputElement).value))}
        onTouchEnd={(e) => onCommit(Number((e.target as HTMLInputElement).value))}
        className="axis-slider w-full"
        style={{ ['--slider-progress' as string]: `${value}%` }}
      />
    </div>
  );
}
