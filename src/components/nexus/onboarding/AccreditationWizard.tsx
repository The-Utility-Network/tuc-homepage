'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, User, DollarSign, FileText, Award, Building } from 'lucide-react'
import { determineAccreditation, AccreditationCriteria, InvestorType } from '@/lib/accreditation-logic'
import DocumentUploader from './DocumentUploader'

const STEPS = [
    'Investor Type',
    'Income Verification',
    'Net Worth Assessment',
    'Professional Credentials',
    'Entity Information',
    'Document Upload',
    'Summary',
]

export default function AccreditationWizard({ onComplete }: { onComplete?: (data: any) => void }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [responses, setResponses] = useState<Partial<AccreditationCriteria>>({})
    const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([])
    const [determination, setDetermination] = useState<ReturnType<typeof determineAccreditation> | null>(null)

    const updateResponse = (key: keyof AccreditationCriteria, value: any) => {
        setResponses(prev => ({ ...prev, [key]: value }))
    }

    const nextStep = () => {
        // Skip irrelevant steps based on investor type
        let next = currentStep + 1

        if (currentStep === 0) {
            // Skip entity step if not entity
            if (responses.investorType === 'individual') {
                // Go to income verification
                next = 1
            } else if (responses.investorType === 'entity') {
                // Skip to entity information
                next = 4
            } else if (responses.investorType === 'trust') {
                // Go directly to entity information (trust details)
                next = 4
            }
        } else if (currentStep === 3 && responses.investorType !== 'individual') {
            // Skip professional credentials if not individual
            next = 4
        } else if (currentStep === 4 && responses.investorType === 'individual') {
            // Skip entity info if individual
            next = 5
        }

        if (next >= STEPS.length) {
            // Calculate determination
            const result = determineAccreditation(responses as AccreditationCriteria)
            setDetermination(result)
            next = STEPS.length - 1 // Go to summary
        }

        setCurrentStep(Math.min(next, STEPS.length - 1))
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(0, prev - 1))
    }

    const handleComplete = async () => {
        const data = {
            responses,
            determination,
            uploadedDocuments,
        }

        // TODO: Submit to API
        try {
            const response = await fetch('/api/accreditation/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok && onComplete) {
                onComplete(data)
            }
        } catch (error) {
            console.error('Failed to submit accreditation:', error)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <Step1InvestorType responses={responses} updateResponse={updateResponse} />
            case 1:
                return <Step2IncomeVerification responses={responses} updateResponse={updateResponse} />
            case 2:
                return <Step3NetWorth responses={responses} updateResponse={updateResponse} />
            case 3:
                return <Step4Credentials responses={responses} updateResponse={updateResponse} />
            case 4:
                return <Step5EntityInfo responses={responses} updateResponse={updateResponse} />
            case 5:
                return <Step6DocumentUpload uploadedDocuments={uploadedDocuments} setUploadedDocuments={setUploadedDocuments} determination={determination} />
            case 6:
                return <Step7Summary responses={responses} determination={determination} uploadedDocuments={uploadedDocuments} />
            default:
                return null
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 0:
                return !!responses.investorType
            case 1:
                return responses.annualIncome !== undefined || responses.jointIncome !== undefined
            case 2:
                return responses.netWorth !== undefined
            case 3:
                return true // Optional step
            case 4:
                if (responses.investorType === 'entity') {
                    return responses.entityAssets !== undefined
                }
                return responses.trustAssets !== undefined
            case 5:
                return true // Documents optional for now
            default:
                return true
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        {STEPS.map((step, index) => {
                            const isActive = index === currentStep
                            const isComplete = index < currentStep

                            // Determine if step should be shown based on investor type
                            let shouldShow = true
                            if (index === 1 || index === 2 || index === 3) {
                                shouldShow = responses.investorType === 'individual'
                            } else if (index === 4) {
                                shouldShow = responses.investorType === 'entity' || responses.investorType === 'trust'
                            }

                            if (!shouldShow && !isActive && !isComplete) {
                                return null
                            }

                            return (
                                <div key={step} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isComplete
                                                ? 'bg-green-500 text-white'
                                                : isActive
                                                    ? 'bg-[#F54029] text-white ring-4 ring-[#F54029]/20'
                                                    : 'bg-white/10 text-white/40'
                                                }`}
                                        >
                                            {isComplete ? (
                                                <CheckCircle size={20} />
                                            ) : (
                                                <span className="text-sm font-bold">{index + 1}</span>
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs font-medium text-center ${isActive ? 'text-white' : 'text-white/40'
                                                }`}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 mx-2 transition-all ${isComplete ? 'bg-green-500' : 'bg-white/10'
                                                }`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 min-h-[500px]">
                    {renderStep()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>

                    {currentStep === STEPS.length - 1 ? (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-medium"
                        >
                            <CheckCircle size={20} />
                            Complete Accreditation
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="flex items-center gap-2 px-6 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                        >
                            Continue
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Step 1: Investor Type
function Step1InvestorType({ responses, updateResponse }: any) {
    const types: { value: InvestorType; label: string; icon: any; description: string }[] = [
        {
            value: 'individual',
            label: 'Individual Investor',
            icon: User,
            description: 'Investing as an individual or with a spouse',
        },
        {
            value: 'entity',
            label: 'Entity / Corporation',
            icon: Building,
            description: 'LLC, Corporation, Partnership, or other legal entity',
        },
        {
            value: 'trust',
            label: 'Trust',
            icon: FileText,
            description: 'Revocable or irrevocable trust',
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <User className="text-[#F54029]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-white">Investor Type</h2>
                    <p className="text-white/60 text-sm mt-1">
                        How will you be investing in this opportunity?
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {types.map(({ value, label, icon: Icon, description }) => (
                    <button
                        key={value}
                        onClick={() => updateResponse('investorType', value)}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${responses.investorType === value
                                ? 'border-[#F54029] bg-[#F54029]/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                    >
                        <Icon
                            className={`mb-4 ${responses.investorType === value ? 'text-[#F54029]' : 'text-white/40'
                                }`}
                            size={32}
                        />
                        <h3 className="text-white font-bold mb-2">{label}</h3>
                        <p className="text-white/60 text-sm">{description}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

// Step 2: Income Verification
function Step2IncomeVerification({ responses, updateResponse }: any) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <DollarSign className="text-[#F54029]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-white">Income Verification</h2>
                    <p className="text-white/60 text-sm mt-1">
                        Provide your income for the past 2 years
                    </p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <p className="text-sm text-white/80 leading-relaxed">
                    To qualify as an accredited investor based on income, you must have earned:
                </p>
                <ul className="list-disc list-inside text-sm text-white/60 mt-2 space-y-1 ml-4">
                    <li>Individual income exceeding $200,000 in each of the past 2 years, OR</li>
                    <li>Joint income with spouse exceeding $300,000 in each of the past 2 years</li>
                </ul>
                <p className="text-sm text-white/60 mt-2">
                    With reasonable expectation of reaching the same income level in the current year.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Individual Annual Income (USD)
                    </label>
                    <input
                        type="number"
                        value={responses.annualIncome || ''}
                        onChange={(e) => updateResponse('annualIncome', parseFloat(e.target.value))}
                        placeholder="200,000"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#F54029] focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-white/40 mt-1">Average income for the past 2 years</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Joint Annual Income with Spouse (USD) - Optional
                    </label>
                    <input
                        type="number"
                        value={responses.jointIncome || ''}
                        onChange={(e) => updateResponse('jointIncome', parseFloat(e.target.value))}
                        placeholder="300,000"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#F54029] focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-white/40 mt-1">Combined income with spouse for the past 2 years</p>
                </div>

                {(responses.annualIncome >= 200_000 || responses.jointIncome >= 300_000) && (
                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                        <CheckCircle size={20} />
                        <span className="text-sm">Meets income requirements for accredited investor status</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// Step 3: Net Worth Assessment
function Step3NetWorth({ responses, updateResponse }: any) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <DollarSign className="text-[#F54029]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-white">Net Worth Assessment</h2>
                    <p className="text-white/60 text-sm mt-1">
                        Calculate your net worth excluding primary residence
                    </p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <p className="text-sm text-white/80 leading-relaxed">
                    To qualify as an accredited investor based on net worth:
                </p>
                <ul className="list-disc list-inside text-sm text-white/60 mt-2 space-y-1 ml-4">
                    <li>Individual or joint net worth exceeding $1,000,000</li>
                    <li>Excluding the value of your primary residence</li>
                    <li>Can include other real estate, investments, businesses, etc.</li>
                </ul>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Net Worth (USD) - Excluding Primary Residence
                    </label>
                    <input
                        type="number"
                        value={responses.netWorth || ''}
                        onChange={(e) => updateResponse('netWorth', parseFloat(e.target.value))}
                        placeholder="1,000,000"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#F54029] focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-white/40 mt-1">
                        Total assets minus liabilities, excluding primary residence value and mortgage
                    </p>
                </div>

                {responses.netWorth >= 1_000_000 && (
                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                        <CheckCircle size={20} />
                        <span className="text-sm">Meets net worth requirements for accredited investor status</span>
                    </div>
                )}

                {responses.netWorth >= 5_000_000 && (
                    <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-lg p-4">
                        <Award size={20} />
                        <span className="text-sm">Qualifies as a Qualified Purchaser ($5M+ net worth)</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// Step 4: Professional Credentials
function Step4Credentials({ responses, updateResponse }: any) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <Award className="text-[#F54029]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-white">Professional Credentials</h2>
                    <p className="text-white/60 text-sm mt-1">
                        Do you hold any professional securities licenses?
                    </p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <p className="text-sm text-white/80">
                    Holders of Series 7, 65, or 82 licenses in good standing automatically qualify as accredited investors.
                </p>
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={responses.hasSeriesLicense || false}
                        onChange={(e) => {
                            updateResponse('hasSeriesLicense', e.target.checked)
                            if (!e.target.checked) {
                                updateResponse('licenseType', undefined)
                            }
                        }}
                        className="w-5 h-5 accent-[#F54029] cursor-pointer"
                    />
                    <span className="text-white/80 group-hover:text-white transition-colors">
                        I hold a Series 7, 65, or 82 license in good standing
                    </span>
                </label>

                {responses.hasSeriesLicense && (
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            License Type
                        </label>
                        <select
                            value={responses.licenseType || ''}
                            onChange={(e) => updateResponse('licenseType', e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none transition-colors"
                        >
                            <option value="">Select license type</option>
                            <option value="Series 7">Series 7 - General Securities Representative</option>
                            <option value="Series 65">Series 65 - Investment Adviser Representative</option>
                            <option value="Series 82">Series 82 - Private Securities Offerings Representative</option>
                        </select>
                    </div>
                )}

                {responses.hasSeriesLicense && (
                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                        <CheckCircle size={20} />
                        <span className="text-sm">Professional license qualifies you as an accredited investor</span>
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-xs text-white/60">
                        You will need to upload a copy of your license during the document upload step.
                    </p>
                </div>
            </div>
        </div>
    )
}

// Step 5: Entity Information
function Step5EntityInfo({ responses, updateResponse }: any) {
    const isEntity = responses.investorType === 'entity'
    const isTrust = responses.investorType === 'trust'

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <Building className="text-[#F54029]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {isEntity ? 'Entity' : 'Trust'} Information
                    </h2>
                    <p className="text-white/60 text-sm mt-1">
                        Provide details about your {isEntity ? 'entity' : 'trust'}
                    </p>
                </div>
            </div>

            {isEntity ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Entity Total Assets (USD)
                        </label>
                        <input
                            type="number"
                            value={responses.entityAssets || ''}
                            onChange={(e) => updateResponse('entityAssets', parseFloat(e.target.value))}
                            placeholder="5,000,000"
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#F54029] focus:outline-none transition-colors"
                        />
                        <p className="text-xs text-white/40 mt-1">
                            Entities with $5M+ in assets qualify as accredited investors
                        </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={responses.allOwnersAccredited || false}
                            onChange={(e) => updateResponse('allOwnersAccredited', e.target.checked)}
                            className="w-5 h-5 accent-[#F54029] cursor-pointer"
                        />
                        <span className="text-white/80 group-hover:text-white transition-colors">
                            All equity owners are accredited investors
                        </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={responses.is501c3 || false}
                            onChange={(e) => updateResponse('is501c3', e.target.checked)}
                            className="w-5 h-5 accent-[#F54029] cursor-pointer"
                        />
                        <span className="text-white/80 group-hover:text-white transition-colors">
                            This is a 501(c)(3) organization
                        </span>
                    </label>

                    {(responses.entityAssets >= 5_000_000 || responses.allOwnersAccredited) && (
                        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                            <CheckCircle size={20} />
                            <span className="text-sm">Entity qualifies as an accredited investor</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Trust Total Assets (USD)
                        </label>
                        <input
                            type="number"
                            value={responses.trustAssets || ''}
                            onChange={(e) => updateResponse('trustAssets', parseFloat(e.target.value))}
                            placeholder="5,000,000"
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#F54029] focus:outline-none transition-colors"
                        />
                        <p className="text-xs text-white/40 mt-1">
                            Trusts with $5M+ in assets qualify as accredited investors
                        </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={responses.trustorAccredited || false}
                            onChange={(e) => updateResponse('trustorAccredited', e.target.checked)}
                            className="w-5 h-5 accent-[#F54029] cursor-pointer"
                        />
                        <span className="text-white/80 group-hover:text-white transition-colors">
                            Trust was formed by an accredited investor (revocable trust)
                        </span>
                    </label>

                    {(responses.trustAssets >= 5_000_000 || responses.trustorAccredited) && (
                        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                            <CheckCircle size={20} />
                            <span className="text-sm">Trust qualifies as an accredited investor</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Step 6: Document Upload
function Step6DocumentUpload({ uploadedDocuments, setUploadedDocuments, determination }: any) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <FileText className="text-[#F54029]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-white">Document Upload</h2>
                    <p className="text-white/60 text-sm mt-1">
                        Upload verification documents (optional but recommended)
                    </p>
                </div>
            </div>

            {determination && determination.verificationNeeded.length > 0 && (
                <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-6">
                    <h3 className="text-blue-400 font-bold mb-3">Recommended Documents:</h3>
                    <ul className="list-disc list-inside text-sm text-white/80 space-y-2">
                        {determination.verificationNeeded.map((doc, i) => (
                            <li key={i}>{doc}</li>
                        ))}
                    </ul>
                </div>
            )}

            <DocumentUploader
                uploadedDocuments={uploadedDocuments}
                onDocumentsChange={setUploadedDocuments}
            />
        </div>
    )
}

// Step 7: Summary
function Step7Summary({ responses, determination, uploadedDocuments }: any) {
    if (!determination) return null

    const statusColors = {
        non_accredited: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        accredited: 'text-green-400 bg-green-400/10 border-green-400/20',
        qualified_purchaser: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    }

    const statusIcons = {
        non_accredited: AlertCircle,
        accredited: CheckCircle,
        qualified_purchaser: Award,
    }

    const StatusIcon = statusIcons[determination.status]
    const statusLabel = {
        non_accredited: 'Non-Accredited Investor',
        accredited: 'Accredited Investor',
        qualified_purchaser: 'Qualified Purchaser',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <CheckCircle className="text-[#F54029]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-white">Accreditation Summary</h2>
                    <p className="text-white/60 text-sm mt-1">
                        Review your accreditation determination
                    </p>
                </div>
            </div>

            {/* Status Banner */}
            <div className={`rounded-xl border-2 p-6 ${statusColors[determination.status]}`}>
                <div className="flex items-center gap-4">
                    <StatusIcon size={48} />
                    <div>
                        <h3 className="text-2xl font-bold">{statusLabel[determination.status]}</h3>
                        <p className="text-sm opacity-80 mt-1">
                            Based on the information you provided
                        </p>
                    </div>
                </div>
            </div>

            {/* Reasoning */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Determination Reasoning:</h3>
                <ul className="space-y-2">
                    {determination.reasoning.map((reason: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                            <span className="text-[#F54029] mt-1">•</span>
                            <span>{reason}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Documents */}
            {uploadedDocuments.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-4">Uploaded Documents: {uploadedDocuments.length}</h3>
                    <div className="text-sm text-white/60">
                        Documents will be reviewed by the admin team.
                    </div>
                </div>
            )}

            {/* Next Steps */}
            <div className="bg-[#F54029]/10 border border-[#F54029]/20 rounded-lg p-6">
                <h3 className="text-[#F54029] font-bold mb-3">Next Steps:</h3>
                <ol className="list-decimal list-inside text-sm text-white/80 space-y-2">
                    <li>Your accreditation status will be reviewed by our compliance team</li>
                    <li>You may be contacted for additional documentation</li>
                    <li>Upon approval, you'll gain access to investment opportunities</li>
                    <li>You can update your accreditation information at any time</li>
                </ol>
            </div>
        </div>
    )
}
