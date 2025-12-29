import React from 'react'

interface LegalDocumentProps {
    type: 'SAFE' | 'EQUITY' | 'NOTE'
    investorName: string
    entityName: string
    roundName: string
    amount: number
    valuation: number
    discount?: number
    sharePrice?: number
    date: string
    themeColor: string
}

export default function LegalDocument({
    type,
    investorName,
    entityName,
    roundName,
    amount,
    valuation,
    discount = 0,
    sharePrice,
    date,
    themeColor = '#ffffff'
}: LegalDocumentProps) {
    const formatUSD = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    return (
        <div className="relative w-full h-full bg-white text-black font-serif p-8 md:p-12 shadow-2xl overflow-hidden select-none">
            {/* Watermark / Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center transform -rotate-45"
                style={{
                    backgroundImage: `radial-gradient(${themeColor} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            >
                <h1 className="text-9xl font-bold uppercase tracking-widest text-black whitespace-nowrap">{entityName}</h1>
            </div>

            {/* Decorative Border (Guilloche style simulation) */}
            <div className="absolute inset-4 border-4 border-double border-black/20 pointer-events-none" />
            <div className="absolute inset-6 border border-black/10 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 text-center mb-12">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-black/20 rounded-full flex items-center justify-center">
                    <span className="font-bold text-2xl font-serif">§</span>
                </div>
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-2 font-serif">{type === 'SAFE' ? 'Simple Agreement for Future Equity' : type === 'EQUITY' ? 'Stock Purchase Agreement' : 'Convertible Note'}</h2>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-sans">Series: {roundName} • {entityName}</p>
            </div>

            {/* Content Body */}
            <div className="relative z-10 space-y-6 text-sm leading-relaxed text-justify max-w-2xl mx-auto">
                <p>
                    <span className="font-bold uppercase">This Agreement</span> ("Agreement") is made and entered into on <span className="font-mono bg-yellow-100/50 px-1">{date}</span>, by and between <span className="font-bold uppercase">{entityName}</span> (the "Company"), and <span className="font-bold uppercase">{investorName}</span> (the "Investor").
                </p>

                {type === 'SAFE' && (
                    <>
                        <p>
                            <strong>1. Events.</strong> (a) <u>Equity Financing</u>. If there is an Equity Financing before the termination of this Safe, on the initial closing of such Equity Financing, this Safe will automatically convert into the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Conversion Price.
                        </p>
                        <p>
                            <strong>2. Liquidity Event.</strong> If there is a Liquidity Event before the termination of this Safe, this Safe will automatically be entitled to receive a portion of Proceeds, equal to the greater of (i) the Purchase Amount (the "Cash-Out Amount") or (ii) the amount payable on the number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price (the "Conversion Amount").
                        </p>
                    </>
                )}

                {type === 'EQUITY' && (
                    <>
                        <p>
                            <strong>1. Purchase and Sale of Stock.</strong> Subject to the terms and conditions of this Agreement, the Investor agrees to purchase at the Closing and the Company agrees to sell and issue to the Investor at the Closing that number of shares of Series {roundName} Preferred Stock set forth below.
                        </p>
                        <p>
                            <strong>2. Purchase Price.</strong> The purchase price per share of the Shares shall be <span className="font-mono font-bold">{sharePrice ? formatUSD(sharePrice) : 'N/A'}</span>.
                        </p>
                    </>
                )}

                <div className="my-8 py-6 border-y-2 border-black/10 bg-gray-50 p-6">
                    <h3 className="text-center font-bold uppercase tracking-widest mb-6 font-sans text-xs text-gray-400">Transaction Summary</h3>
                    <div className="grid grid-cols-2 gap-y-4 font-mono text-sm">
                        <div className="text-gray-500">Investment Amount:</div>
                        <div className="text-right font-bold">{formatUSD(amount)}</div>

                        <div className="text-gray-500">{type === 'SAFE' ? 'Valuation Cap' : 'Pre-Money Valuation'}:</div>
                        <div className="text-right font-bold">{formatUSD(valuation)}</div>

                        {type === 'SAFE' && discount > 0 && (
                            <>
                                <div className="text-gray-500">Discount Rate:</div>
                                <div className="text-right font-bold">{discount}%</div>
                            </>
                        )}

                        {type === 'EQUITY' && (
                            <>
                                <div className="text-gray-500">Share Price:</div>
                                <div className="text-right font-bold">{sharePrice ? formatUSD(sharePrice) : '-'}</div>
                            </>
                        )}
                    </div>
                </div>

                <p>
                    <strong>3. Miscellaneous.</strong> This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements and understandings, whether written or oral, relating to the subject matter of this Agreement.
                </p>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none opacity-40">
                <div className="w-1/2 mx-auto border-t border-black mb-2"></div>
                <p className="text-[10px] font-mono uppercase">Authorized Electronic Record • {entityName} Legal Dept • ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>

            {/* Dynamic Theme Strip */}
            <div className="absolute top-0 left-0 bottom-0 w-2 opacity-50" style={{ backgroundColor: themeColor }} />
        </div>
    )
}
