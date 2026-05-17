'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const PitchDeckViewer = dynamic(
    () => import('@/components/PitchDeckViewer'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-2 border-[#F54029]/20 rounded-full" />
                        <div className="absolute inset-0 border-2 border-transparent border-t-[#F54029] rounded-full animate-spin" />
                        <Loader2 className="absolute inset-0 m-auto text-[#F54029]/40 animate-spin" size={20} style={{ animationDirection: 'reverse' }} />
                    </div>
                    <p className="text-xs font-mono tracking-wider text-white/30 uppercase">Initializing Viewer...</p>
                </div>
            </div>
        ),
    }
)

export default function PitchDeckViewerWrapper() {
    return <PitchDeckViewer />
}
