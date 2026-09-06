'use client';

import { useState } from 'react';
import {
  AXIS_SETS,
  axisValuesFrom,
  matchRefine,
  midValues,
  type Axis,
  type AxisSetName,
} from '@/lib/mockData';
import { AxisSlider } from './AxisSlider';
import { ChatBar } from './ChatBar';
import { HistoryPanel } from './HistoryPanel';
import { WireframePreview } from './WireframePreview';

const DEFAULT_INTENT = 'Hackathon signup landing page';

type HistoryItem = {
  prompt: string;
  setName: AxisSetName;
  axes: Axis[];
  values: Record<string, number>;
  /** Values used for the preview image; frozen across refine until a slider moves. */
  previewValues: number[];
  previewSetName: AxisSetName;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home() {
  const [step, setStep] = useState<'landing' | 'workspace'>('landing');
  const [intent, setIntent] = useState(DEFAULT_INTENT);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refinement, setRefinement] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyCollapsed, setHistoryCollapsed] = useState(false);

  const current = history[currentIndex];

  function patchCurrent(patch: Partial<HistoryItem>) {
    setHistory((prev) =>
      prev.map((item, index) => (index === currentIndex ? { ...item, ...patch } : item)),
    );
  }

  async function showPreset(
    setName: AxisSetName,
    axes: Axis[],
    values: Record<string, number>,
  ) {
    setLoading(true);
    await wait(400);
    patchCurrent({
      values,
      previewSetName: setName,
      previewValues: axisValuesFrom(axes, values),
    });
    setLoading(false);
  }

  function onGenerate() {
    const axes = AXIS_SETS.initial;
    const nextValues = midValues(axes);
    const previewValues = axisValuesFrom(axes, nextValues);
    setHistory([
      {
        prompt: intent.trim() || DEFAULT_INTENT,
        setName: 'initial',
        axes,
        values: nextValues,
        previewSetName: 'initial',
        previewValues,
      },
    ]);
    setCurrentIndex(0);
    setRefinement('');
    setHistoryCollapsed(false);
    setStep('workspace');
  }

  function onNew() {
    setStep('landing');
    setIntent(DEFAULT_INTENT);
    setHistory([]);
    setCurrentIndex(0);
    setRefinement('');
    setLoading(false);
    setHistoryCollapsed(false);
  }

  function commitValue(key: string, raw: number) {
    if (!current) return;
    const next = { ...current.values, [key]: raw };
    patchCurrent({ values: next });
    showPreset(current.setName, current.axes, next);
  }

  async function onRefine() {
    const text = refinement.trim();
    if (!text || loading || !current) return;
    const { setName, axes } = matchRefine(text, current.setName);
    const nextValues = midValues(axes);
    const record: HistoryItem = {
      prompt: text,
      setName,
      axes,
      values: nextValues,
      // Keep the current preview until the user moves a new axis.
      previewSetName: current.previewSetName,
      previewValues: current.previewValues,
    };
    setLoading(true);
    await wait(400);
    setHistory((prev) => [...prev, record]);
    setCurrentIndex(history.length);
    setRefinement('');
    setLoading(false);
  }

  return (
    <div className="min-h-screen" style={{ background: '#F4F6FA', color: '#2C3444' }}>
      {step === 'landing' ? (
        <div key="landing" className="fade-in flex min-h-screen items-center justify-center px-6">
          <div className="flex w-full max-w-2xl flex-col items-center">
            <img src="/logo.png" alt="outlier" className="mb-12 w-[120px]" />
            <div className="w-full">
              <ChatBar
                size="large"
                value={intent}
                onChange={setIntent}
                onSubmit={onGenerate}
                placeholder={DEFAULT_INTENT}
                buttonLabel="Generate"
              />
            </div>
          </div>
        </div>
      ) : (
        <div key="workspace" className="fade-in flex h-screen flex-col">
          <header
            className="flex h-14 items-center gap-4 border-b border-[#E8EBF0] px-6"
            style={{ background: '#FFFFFF' }}
          >
            <img src="/logo-mark.png" alt="outlier" className="h-8 w-auto" />
            <button
              type="button"
              onClick={onNew}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
              style={{ color: '#2C3444', background: '#F4F6FA' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              New
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
            <HistoryPanel
              items={history}
              currentIndex={currentIndex}
              collapsed={historyCollapsed}
              onToggle={() => setHistoryCollapsed((open) => !open)}
              onSelect={setCurrentIndex}
            />

            <div className="min-h-[50vh] flex-1 overflow-y-auto p-6 lg:min-h-0">
              <WireframePreview
                setName={current?.previewSetName ?? 'initial'}
                axisValues={current?.previewValues ?? [50, 50, 50]}
                loading={loading}
              />
            </div>

            <div className="flex min-h-0 flex-col p-6 lg:h-full lg:w-1/3 lg:overflow-y-auto">
              <div className="space-y-4">
                {(current?.axes ?? []).map((axis) => (
                  <AxisSlider
                    key={axis.key}
                    axis={axis}
                    value={current?.values[axis.key] ?? 50}
                    onChange={(value) => {
                      if (!current) return;
                      patchCurrent({
                        values: { ...current.values, [axis.key]: value },
                      });
                    }}
                    onCommit={(value) => commitValue(axis.key, value)}
                  />
                ))}
              </div>
              <div className="mt-6 lg:mt-auto lg:pt-6">
                <ChatBar
                  compact
                  value={refinement}
                  onChange={setRefinement}
                  onSubmit={onRefine}
                  placeholder="Happy with this? Try a new direction, e.g. 'add more suspense'"
                  buttonLabel="Send"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
