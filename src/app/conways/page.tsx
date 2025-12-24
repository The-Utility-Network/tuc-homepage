'use client';

import dynamic from 'next/dynamic';

const WaveConwayBackground = dynamic(
    () => import('@/components/WaveConwayBackground'),
    { ssr: false }
);

export default function ConwaysPage() {
    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden">
            {/* Full screen Conway animation - Override opacity to 100% for screenshot */}
            <div className="fixed inset-0 [&>canvas]:!opacity-100">
                <WaveConwayBackground />
            </div>

            {/* Instructions overlay - fades out after 5s */}
            <div className="absolute top-4 left-4 right-4 z-50 text-white/80 text-sm font-mono bg-black/50 p-4 rounded-lg backdrop-blur-sm animate-fade-out pointer-events-none">
                <p className="mb-2">📸 <strong>Screenshot Capture Page</strong></p>
                <p>Wait for the pattern to develop, then take a screenshot for the OG image background.</p>
                <p className="text-white/50 mt-2">This message will fade...</p>
            </div>

            <style jsx>{`
                @keyframes fadeOut {
                    0%, 80% { opacity: 1; }
                    100% { opacity: 0; }
                }
                .animate-fade-out {
                    animation: fadeOut 8s forwards;
                }
            `}</style>
        </div>
    );
}
