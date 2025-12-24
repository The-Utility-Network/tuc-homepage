'use client';

import dynamic from 'next/dynamic';

const WaveConwayBackground = dynamic(
    () => import('@/components/WaveConwayBackground'),
    { ssr: false }
);

export default function DynamicBackground() {
    return <WaveConwayBackground />;
}
