'use client';

import { useEffect, useState } from 'react';
import { lookupPreviewSrc, type AxisSetName } from '@/lib/mockData';

export type WireframePreviewProps = {
  setName: AxisSetName;
  axisValues: number[];
  loading?: boolean;
};

export function WireframePreview({
  setName,
  axisValues,
  loading,
}: WireframePreviewProps) {
  const targetSrc = lookupPreviewSrc(setName, axisValues);
  const [displaySrc, setDisplaySrc] = useState(targetSrc);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (targetSrc === displaySrc) {
      setOpacity(1);
      return;
    }

    setOpacity(0);
    const timer = window.setTimeout(() => {
      setDisplaySrc(targetSrc);
      setOpacity(1);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [targetSrc, displaySrc]);

  return (
    <div className="float-card flex min-h-full items-center justify-center overflow-hidden p-6 lg:p-10">
      {loading ? (
        <p
          className="font-title px-4 py-10 text-center text-2xl"
          style={{ color: '#2C3444' }}
        >
          Generating...
        </p>
      ) : (
        <div
          className="w-full overflow-hidden rounded-2xl"
          style={{
            background: '#F4F6FA',
            boxShadow: '0 4px 16px rgba(44, 52, 68, 0.08)',
          }}
        >
          <img
            src={displaySrc}
            alt={`${setName} preview`}
            className="block h-auto w-full"
            style={{
              opacity,
              transition: 'opacity 200ms ease',
            }}
          />
        </div>
      )}
    </div>
  );
}
