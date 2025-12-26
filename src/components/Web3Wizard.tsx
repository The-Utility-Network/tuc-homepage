'use client';

import { useState, useEffect, useRef } from 'react';

type WizardSlide = {
    id: string;
    title: string;
    description: string;
    renderGraphics: (isActive: boolean) => React.ReactNode;
};

// --- Interactive Graphics Components ---

function LedgerGraphic() {
    const [blocks, setBlocks] = useState([false, false, false]); // [verified, verified, tested]

    // Auto-verify sequence on mount
    useEffect(() => {
        const timers = [
            setTimeout(() => setBlocks(b => [true, b[1], b[2]]), 500),
            setTimeout(() => setBlocks(b => [true, true, b[2]]), 1500),
            setTimeout(() => setBlocks(b => [true, true, true]), 2500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative cursor-pointer group" onClick={() => setBlocks([false, false, false])}>
            <div className="absolute inset-0 bg-utility-red/5 blur-[60px] animate-pulse" />
            <div className="flex flex-col gap-4 z-10 transition-transform duration-500 scale-90 group-hover:scale-100">
                {blocks.map((isVerified, i) => (
                    <div
                        key={i}
                        className={`w-56 h-16 rounded-lg border-2 flex items-center justify-between px-4 transition-all duration-700 transform 
                        ${isVerified
                                ? 'border-utility-red bg-utility-red/10 shadow-[0_0_30px_rgba(255,51,51,0.3)] scale-100'
                                : 'border-white/10 bg-black/50 translate-y-4 opacity-50 scale-95'}`}
                    >
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-16 h-2 rounded-full bg-white/10" />
                        </div>
                        {isVerified ? (
                            <div className="text-utility-red font-mono text-xs animate-[bounce_0.5s]">IMMUTABLE</div>
                        ) : (
                            <div className="text-gray-600 font-mono text-xs">PENDING...</div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8 text-xs text-gray-500 font-mono uppercase tracking-widest group-hover:text-utility-red transition-colors">
                Tap to Reset Chain
            </div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 400 400">
                <line x1="200" y1="140" x2="200" y2="160" stroke={blocks[1] ? "#FF3333" : "#333"} strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="220" x2="200" y2="240" stroke={blocks[2] ? "#FF3333" : "#333"} strokeWidth="2" strokeDasharray="4 4" />
            </svg>
        </div>
    );
}

function SmartContractGraphic() {
    const [executing, setExecuting] = useState(false);
    const [output, setOutput] = useState<'IDLE' | 'PAID'>('IDLE');

    const runContract = () => {
        if (executing) return;
        setExecuting(true);
        setOutput('IDLE');
        setTimeout(() => setOutput('PAID'), 2000);
        setTimeout(() => setExecuting(false), 3000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative" onClick={runContract}>
            {/* Input Trigger */}
            <div className={`absolute left-0 lg:left-10 top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${executing ? 'translate-x-[120px] opacity-0' : 'translate-x-0 opacity-100'}`}>
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-black hover:border-utility-red hover:shadow-[0_0_20px_rgba(255,51,51,0.4)] cursor-pointer transition-all">
                    <span className="text-2xl">⚡</span>
                </div>
                <div className="text-center mt-2 text-xs text-gray-400 font-mono">EVENT</div>
            </div>

            {/* The Contract Machine */}
            <div className="relative z-10 w-48 h-48 border border-white/10 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <div className={`absolute inset-0 bg-utility-red/10 transition-opacity duration-300 ${executing ? 'opacity-100' : 'opacity-0'}`} />

                {/* Gears */}
                <svg className={`w-32 h-32 text-gray-600 transition-colors duration-500 ${executing ? 'text-utility-red animate-[spin_3s_linear_infinite]' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M20 12C20 10.8954 19.1046 10 18 10V8.5C18 5.46243 15.5376 3 12.5 3C9.46243 3 7 5.46243 7 8.5V10C5.89543 10 5 10.8954 5 12V18C5 19.1046 5.89543 20 7 20H18C19.1046 20 20 19.1046 20 18V12ZM16 8.5V10H9V8.5C9 6.567 10.567 5 12.5 5C14.433 5 16 6.567 16 8.5ZM7 12V18H18V12H7Z" />
                </svg>

                <div className="absolute bottom-2 font-mono text-[10px] text-utility-red">
                    {executing ? 'EXECUTING LOGIC...' : 'AWAITING INPUT'}
                </div>
            </div>

            {/* Output */}
            <div className={`absolute right-0 lg:right-10 top-1/2 -translate-y-1/2 transition-all duration-500 ${output === 'PAID' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <div className="w-20 h-20 rounded-lg border-2 border-utility-red bg-utility-red/20 flex items-center justify-center text-utility-red font-bold shadow-[0_0_20px_rgba(255,51,51,0.5)] flex-col">
                    <div className="text-2xl mb-1">✓</div>
                    <div className="text-[10px]">PAID</div>
                </div>
            </div>

            <div className={`absolute bottom-8 text-xs text-gray-500 font-mono tracking-widest transition-opacity ${executing ? 'opacity-0' : 'opacity-100'}`}>
                CLICK TO TRIGGER
            </div>
        </div>
    );
}

function TokenizationGraphic() {
    const [tokenized, setTokenized] = useState(false);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative cursor-pointer group" onClick={() => setTokenized(!tokenized)}>
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Physical Object */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${tokenized ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-100 blur-0'}`}>
                    <div className="w-24 h-32 bg-[#5d4037] rounded-lg flex flex-col items-center justify-center border-2 border-[#8d6e63] shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
                        <div className="absolute top-0 w-full h-2 bg-[#3e2723]" />
                        <div className="text-4xl">🥃</div>
                        <div className="text-[10px] font-mono text-[#d7ccc8] mt-2">WHISKEY</div>
                    </div>
                </div>

                {/* Tokens */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-12 h-12 rounded-full border border-utility-red bg-utility-red/10 flex items-center justify-center text-utility-red font-bold shadow-[0_0_15px_rgba(255,51,51,0.4)] backdrop-blur-md transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)`}
                        style={{
                            transform: tokenized
                                ? `rotate(${i * 60}deg) translate(80px) rotate(-${i * 60}deg) scale(1)`
                                : `rotate(${i * 60}deg) translate(0px) rotate(-${i * 60}deg) scale(0)`,
                            opacity: tokenized ? 1 : 0
                        }}
                    >
                        <span className="text-[10px]">TUC</span>
                    </div>
                ))}
            </div>

            <div className={`mt-16 text-xs font-mono tracking-widest transition-colors ${tokenized ? 'text-utility-red' : 'text-gray-500 group-hover:text-white'}`}>
                {tokenized ? 'ASSET LIQUIDITY UNLOCKED' : 'CLICK TO TOKENIZE'}
            </div>
        </div>
    );
}

function WalletGraphic() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative group perspective-1000">
            {/* The Card */}
            <div className="w-80 h-48 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/20 relative overflow-hidden group-hover:border-utility-red/50 transition-all duration-500 shadow-2xl transform rotate-x-12 group-hover:rotate-x-0 group-hover:scale-105">
                <div className="absolute inset-0 bg-[url('https://grain-y-overlay.vercel.app/noise.svg')] opacity-20" />

                {/* Shiny Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="p-6 h-full flex flex-col justify-between relative z-10">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-utility-red/20 border border-utility-red flex items-center justify-center text-utility-red">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-gray-400 font-mono">BALANCE</div>
                            <div className="text-2xl font-bold font-mono text-white tracking-widest">$4,280.91</div>
                        </div>
                    </div>
                    <div>
                        <div className="font-mono text-sm text-gray-400 tracking-wider">0x71AC...9B2A</div>
                        <div className="text-[10px] text-utility-red mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="w-2 h-2 rounded-full bg-utility-red animate-pulse" />
                            IDENTITY VERIFIED
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Interaction */}
            <div className="absolute bottom-12 text-xs text-gray-500 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                ACCESS GRANTED
            </div>
        </div>
    );
}

function ConsensusGraphic() {
    const [synced, setSynced] = useState(false);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative cursor-crosshair"
            onMouseEnter={() => setSynced(true)}
            onMouseLeave={() => setSynced(false)}
        >
            <div className="relative w-64 h-64">
                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${synced ? 'border-utility-red bg-utility-red/20 text-utility-red shadow-[0_0_40px_rgba(255,51,51,0.5)]' : 'border-gray-700 bg-black text-gray-700'}`}>
                        <div className="font-bold text-xl tracking-tighter">TUC</div>
                    </div>
                </div>

                {/* Satellite Nodes */}
                {[0, 1, 2, 3, 4].map(i => {
                    const angle = (i * 72) * (Math.PI / 180);
                    const x = Math.cos(angle) * 100; // Radius
                    const y = Math.sin(angle) * 100;

                    return (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 z-10 transition-all duration-700"
                            style={{ transform: `translate(${x - 16}px, ${y - 16}px)` }}
                        >
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${synced ? 'border-utility-red bg-white text-black scale-110' : 'border-gray-800 bg-gray-900 text-gray-600'}`}>
                                <span className="text-[10px] font-bold">N{i}</span>
                            </div>

                            {/* Connection Lines */}
                            <div
                                className={`absolute top-1/2 left-1/2 h-[2px] bg-utility-red origin-left transition-all duration-500 ease-in-out`}
                                style={{
                                    width: synced ? '100px' : '0px',
                                    transform: `rotate(${i * 72 + 180}deg)`,
                                    opacity: synced ? 0.5 : 0
                                }}
                            />
                        </div>
                    )
                })}
            </div>

            <div className="absolute bottom-6 font-mono text-xs text-gray-500 uppercase tracking-widest text-center">
                {synced ? <span className="text-utility-red animate-pulse">NETWORK CONSENSUS REACHED</span> : 'HOVER TO SYNC NODES'}
            </div>
        </div>
    );
}

function MachineEconomyGraphic() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s + 1) % 4);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="flex items-center justify-between w-full max-w-sm px-8 relative">
                {/* Drone */}
                <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${step === 0 || step === 1 ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}>
                    <div className="w-20 h-20 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-4xl shadow-lg relative">
                        🛸
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${step === 0 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-700'}`} />
                    </div>
                    <span className="text-xs font-mono text-gray-400">BUYERBOT</span>
                </div>

                {/* Packet / Payment */}
                <div className="absolute left-0 right-0 top-10 flex justify-center pointer-events-none">
                    <div
                        className="w-10 h-10 rounded-full bg-utility-red flex items-center justify-center text-white text-md font-bold shadow-[0_0_20px_rgba(255,51,51,0.6)] transition-all duration-700 ease-in-out z-20"
                        style={{
                            transform: step === 1 ? 'translateX(70px)' : (step === 2 ? 'translateX(70px) scale(0)' : 'translateX(-70px) scale(1)'),
                            opacity: step === 3 ? 0 : 1
                        }}
                    >
                        $
                    </div>
                </div>

                {/* Connecting Line */}
                <div className="absolute left-28 right-28 top-20 h-[1px] bg-white/10 overflow-hidden">
                    <div className="w-full h-full bg-utility-red/50 animate-[progres_1s_ease-in-out_infinite]" />
                </div>

                {/* Charging Station */}
                <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${step > 1 ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}>
                    <div className="w-20 h-20 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-4xl shadow-lg relative">
                        ⚡
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${step === 3 ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                    </div>
                    <span className="text-xs font-mono text-gray-400">ENERGY_DAO</span>
                </div>
            </div>

            <div className="mt-16 h-8 text-center">
                {step === 0 && <span className="text-xs font-mono text-yellow-500 animate-pulse">NEGOTIATING PRICE...</span>}
                {step === 1 && <span className="text-xs font-mono text-utility-red">SENDING MICRO-PAYMENT...</span>}
                {step === 2 && <span className="text-xs font-mono text-green-500">PAYMENT CONFIRMED</span>}
                {step === 3 && <span className="text-xs font-mono text-white">DELIVERING 1.4 KWh</span>}
            </div>
        </div>
    );
}

// --- Main Wizard Component ---

export default function Web3Wizard() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const slides: WizardSlide[] = [
        {
            id: 'ledger',
            title: 'The Immutable Ledger',
            description: 'Imagine a digital stone tablet. Once data is verified by the network, it is linked cryptographically to the past. Click the blocks to verify the chain.',
            renderGraphics: () => <LedgerGraphic />
        },
        {
            id: 'smart-contract',
            title: 'Smart Contracts',
            description: 'Code is law. In our industrial ecosystem, contracts execute automatically when conditions are met. Try triggering the event below.',
            renderGraphics: () => <SmartContractGraphic />
        },
        {
            id: 'tokenization',
            title: 'Industrial Tokenization',
            description: 'We fragment ownership of real-world assets. A heavy barrel of whiskey becomes liquid digital tokens. Click the asset to tokenize it.',
            renderGraphics: () => <TokenizationGraphic />
        },
        {
            id: 'wallet',
            title: 'The Industrial Wallet',
            description: 'Your wallet holds your reputation, credentials, and money. It is your passport to the machine economy. Hover to verify identity.',
            renderGraphics: () => <WalletGraphic />
        },
        {
            id: 'consensus',
            title: 'Machine Consensus',
            description: 'Truth is established by the agreement of many independent nodes, not a central authority. Hover over the network to synchronize them.',
            renderGraphics: () => <ConsensusGraphic />
        },
        {
            id: 'future',
            title: 'The Machine Economy',
            description: 'Machines paying machines. No humans in the loop. Autonomous drones buying power from autonomous grids. This is the TUC standard.',
            renderGraphics: () => <MachineEconomyGraphic />
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            setIsOpen(false);
            setCurrentSlide(0);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };

    return (
        <>
            {/* Trigger Banner */}
            <div
                onClick={() => setIsOpen(true)}
                className="w-full bg-white/5 border-y border-white/10 p-6 sm:p-12 cursor-pointer group hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-utility-red/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-utility-red/20 flex items-center justify-center border border-utility-red/30 group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-8 h-8 text-utility-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-utility-red transition-colors">New to Industrial Web3?</h3>
                            <p className="text-gray-400">Launch the interactive wizard to understand the machine economy in 60 seconds.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-utility-red font-mono text-sm tracking-wider border border-utility-red/30 px-6 py-3 rounded-full hover:bg-utility-red hover:text-white transition-all">
                        START WIZARD <span className="text-lg">→</span>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-[fadeIn_0.3s]"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px] animate-[slideUp_0.4s_ease-out]">

                        {/* Left: Graphic Area - Now larger and interactive */}
                        <div className="w-full md:w-3/5 bg-gradient-to-br from-[#0f0f0f] to-[#050505] relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center p-8 select-none">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                            <div className="absolute inset-0 bg-utility-red/5 blur-[100px]" />

                            {/* Render the Active Graphic */}
                            <div className="w-full h-full max-w-md max-h-md relative z-10 flex items-center justify-center">
                                {slides[currentSlide].renderGraphics(true)}
                            </div>

                            {/* Slide Counter on Graphic Side */}
                            <div className="absolute top-6 left-6 font-mono text-xs text-utility-red/50 tracking-widest">
                                MODULE {String(currentSlide + 1).padStart(2, '0')} // {String(slides.length).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Right: Content Area */}
                        <div className="w-full md:w-2/5 p-10 flex flex-col justify-between bg-black relative">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                                    {slides[currentSlide].title}
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    {slides[currentSlide].description}
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-1">
                                    {slides.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 rounded-full transition-all duration-500 ${idx <= currentSlide ? 'bg-utility-red w-full' : 'bg-white/10 w-full'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={prevSlide}
                                        disabled={currentSlide === 0}
                                        className={`text-sm font-mono tracking-wider transition-colors ${currentSlide === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        ← PREV
                                    </button>

                                    <button
                                        onClick={nextSlide}
                                        className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-utility-red hover:text-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,51,51,0.5)] text-sm tracking-wide"
                                    >
                                        {currentSlide === slides.length - 1 ? 'COMPLETE' : 'NEXT STEP'}
                                    </button>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
