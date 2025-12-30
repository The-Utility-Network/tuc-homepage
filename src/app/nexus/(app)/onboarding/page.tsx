'use client'

import { useState } from 'react'
import { CheckCircle, Circle, User, FileText, PenTool, Flag } from 'lucide-react'
import AccreditationWizard from '@/components/nexus/onboarding/AccreditationWizard'
import SigningInterface from '@/components/nexus/SigningInterface'
import { generateHtmlDocument, DocumentVariables } from '@/lib/document-generator'
import { createClient } from '@/lib/supabase'

type OnboardingStep = 'welcome' | 'identity' | 'accreditation' | 'document_review' | 'signature' | 'complete'

interface OnboardingState {
    currentStep: OnboardingStep
    completedSteps: OnboardingStep[]
    identity?: {
        legalName: string
        email: string
        phone: string
        address: string
        city: string
        state: string
        zipCode: string
        country: string
        citizenship: string
    }
    accreditationId?: string
    generatedDocumentId?: string
    generatedDocumentHtml?: string
}

export default function OnboardingPage() {
    const [state, setState] = useState<OnboardingState>({
        currentStep: 'welcome',
        completedSteps: [],
    })

    const markStepComplete = (step: OnboardingStep) => {
        setState(prev => ({
            ...prev,
            completedSteps: [...prev.completedSteps, step],
        }))
    }

    const goToStep = (step: OnboardingStep) => {
        setState(prev => ({ ...prev, currentStep: step }))
    }

    const handleIdentityComplete = async (data: any) => {
        setState(prev => ({ ...prev, identity: data }))

        // Save residence information to investor profile
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const isUSPerson = data.country === 'United States' &&
                (data.citizenship === 'US Citizen' || data.citizenship === 'Permanent Resident')

            await supabase
                .from('investor_profiles')
                .upsert({
                    id: user.id,
                    residence_state: data.state || 'NM',
                    residence_country: data.country,
                    is_us_person: isUSPerson,
                    onboarding_step: 'accreditation',
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'id'
                })
        }

        markStepComplete('identity')
        goToStep('accreditation')
    }

    const handleAccreditationComplete = async (data: any) => {
        markStepComplete('accreditation')

        // Generate subscription agreement
        const variables: DocumentVariables = {
            ENTITY_NAME: 'The Utility Company',
            ENTITY_STATE: 'Delaware',
            DATE: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            INVESTOR_NAME: state.identity?.legalName || 'Investor Name',
            INVESTOR_ADDRESS: state.identity?.address || '',
            COMPANY_SIGNATORY_NAME: 'John Doe',
            COMPANY_SIGNATORY_TITLE: 'CEO',
            GOVERNING_LAW_STATE: 'Delaware',
            ROUND_NAME: 'Series A',
            SECURITY_TYPE: 'Preferred Stock',
            SHARE_COUNT: '1000',
            SHARE_PRICE: '100',
            INVESTMENT_AMOUNT: '100000',
            PAYMENT_DEADLINE: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            ACCREDITATION_REASON: data.determination?.reasoning?.[0] || 'Meeting income/net worth requirements',
            PRE_MONEY_VALUATION: '10000000',
            CLOSING_DATE: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        }

        const html = await generateHtmlDocument('subscription', variables)

        setState(prev => ({
            ...prev,
            accreditationId: data.accreditationId,
            generatedDocumentHtml: html,
        }))

        goToStep('document_review')
    }

    const handleDocumentReviewComplete = () => {
        markStepComplete('document_review')
        goToStep('signature')
    }

    const handleSignatureComplete = () => {
        markStepComplete('signature')
        goToStep('complete')
    }

    const renderStep = () => {
        switch (state.currentStep) {
            case 'welcome':
                return <WelcomeStep onContinue={() => goToStep('identity')} />
            case 'identity':
                return <IdentityStep onComplete={handleIdentityComplete} />
            case 'accreditation':
                return <AccreditationWizard onComplete={handleAccreditationComplete} />
            case 'document_review':
                return (
                    <DocumentReviewStep
                        documentHtml={state.generatedDocumentHtml || ''}
                        onContinue={handleDocumentReviewComplete}
                    />
                )
            case 'signature':
                return (
                    <SigningInterface
                        documentId={state.generatedDocumentId || 'temp-id'}
                        documentHtml={state.generatedDocumentHtml || ''}
                        documentType="subscription_agreement"
                        onSigningComplete={handleSignatureComplete}
                    />
                )
            case 'complete':
                return <CompleteStep />
            default:
                return null
        }
    }

    const steps: { key: OnboardingStep; label: string; icon: any }[] = [
        { key: 'welcome', label: 'Welcome', icon: Flag },
        { key: 'identity', label: 'Identity', icon: User },
        { key: 'accreditation', label: 'Accreditation', icon: CheckCircle },
        { key: 'document_review', label: 'Review', icon: FileText },
        { key: 'signature', label: 'Sign', icon: PenTool },
        { key: 'complete', label: 'Complete', icon: CheckCircle },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black">
            {/* Progress Indicator - Only show after welcome */}
            {state.currentStep !== 'welcome' && state.currentStep !== 'accreditation' && state.currentStep !== 'signature' && (
                <div className="bg-black/40 border-b border-white/10 py-6">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="flex items-center justify-between">
                            {steps.map(({ key, label, icon: Icon }, index) => {
                                const isActive = key === state.currentStep
                                const isComplete = state.completedSteps.includes(key)
                                const isPast = steps.findIndex(s => s.key === state.currentStep) > index

                                return (
                                    <div key={key} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center flex-1">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isComplete || isPast
                                                    ? 'bg-green-500 text-white'
                                                    : isActive
                                                        ? 'bg-[#F54029] text-white'
                                                        : 'bg-white/10 text-white/40'
                                                    }`}
                                            >
                                                {isComplete || isPast ? <CheckCircle size={20} /> : <Icon size={20} />}
                                            </div>
                                            <span
                                                className={`mt-2 text-xs font-medium ${isActive ? 'text-white' : 'text-white/40'
                                                    }`}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`h-0.5 flex-1 mx-2 transition-all ${isComplete || isPast ? 'bg-green-500' : 'bg-white/10'
                                                    }`}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Step Content */}
            <div className="py-12">
                {renderStep()}
            </div>
        </div>
    )
}

function WelcomeStep({ onContinue }: { onContinue: () => void }) {
    return (
        <div className="max-w-3xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                <Flag className="text-[#F54029] mx-auto mb-6" size={64} />
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Investor Onboarding</h1>
                <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                    We're excited to have you join us as an investor. This onboarding process will guide you through
                    the necessary steps to verify your identity, determine your accreditation status, and complete
                    your investment documentation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 bg-white/5 rounded-xl">
                        <User className="text-[#F54029] mx-auto mb-3" size={32} />
                        <h3 className="text-white font-bold mb-2">Identity Verification</h3>
                        <p className="text-white/60 text-sm">Provide your basic information</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-xl">
                        <CheckCircle className="text-[#F54029] mx-auto mb-3" size={32} />
                        <h3 className="text-white font-bold mb-2">Accreditation</h3>
                        <p className="text-white/60 text-sm">Determine your investor status</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-xl">
                        <PenTool className="text-[#F54029] mx-auto mb-3" size={32} />
                        <h3 className="text-white font-bold mb-2">Documentation</h3>
                        <p className="text-white/60 text-sm">Review and sign agreements</p>
                    </div>
                </div>

                <p className="text-white/40 text-sm mb-8">
                    This process typically takes 10-15 minutes to complete.
                </p>

                <button
                    onClick={onContinue}
                    className="px-12 py-4 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all font-medium text-lg"
                >
                    Begin Onboarding
                </button>
            </div>
        </div>
    )
}

function IdentityStep({ onComplete }: { onComplete: (data: any) => void }) {
    const [formData, setFormData] = useState({
        legalName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        citizenship: 'US Citizen',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onComplete(formData)
    }

    const updateField = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="max-w-3xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 pb-6 border-b border-white/10 mb-8">
                    <User className="text-[#F54029]" size={32} />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Identity Verification</h2>
                        <p className="text-white/60 text-sm mt-1">
                            Please provide your personal information
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Legal Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.legalName}
                                onChange={(e) => updateField('legalName', e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={(e) => updateField('address', e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => updateField('city', e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.state}
                                    onChange={(e) => updateField('state', e.target.value)}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    ZIP Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.zipCode}
                                    onChange={(e) => updateField('zipCode', e.target.value)}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Country *
                            </label>
                            <select
                                required
                                value={formData.country}
                                onChange={(e) => updateField('country', e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            >
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Citizenship *
                            </label>
                            <select
                                required
                                value={formData.citizenship}
                                onChange={(e) => updateField('citizenship', e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            >
                                <option value="US Citizen">US Citizen</option>
                                <option value="Permanent Resident">Permanent Resident</option>
                                <option value="Foreign National">Foreign National</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all font-medium"
                    >
                        Continue to Accreditation
                    </button>
                </form>
            </div>
        </div>
    )
}

function DocumentReviewStep({ documentHtml, onContinue }: { documentHtml: string; onContinue: () => void }) {
    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 pb-6 border-b border-white/10 mb-8">
                    <FileText className="text-[#F54029]" size={32} />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Review Subscription Agreement</h2>
                        <p className="text-white/60 text-sm mt-1">
                            Please review the agreement before signing
                        </p>
                    </div>
                </div>

                <div
                    className="h-[600px] overflow-y-auto bg-white p-8 rounded-lg mb-6 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: documentHtml }}
                />

                <button
                    onClick={onContinue}
                    className="w-full py-4 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all font-medium"
                >
                    Proceed to Signature
                </button>
            </div>
        </div>
    )
}

function CompleteStep() {
    return (
        <div className="max-w-3xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-500" size={48} />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Onboarding Complete!</h1>
                <p className="text-white/60 text-lg mb-8">
                    Thank you for completing the investor onboarding process. Your information is being reviewed by
                    our team.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                    <h3 className="text-white font-bold mb-3">Next Steps:</h3>
                    <ol className="text-left text-white/80 space-y-2 list-decimal list-inside">
                        <li>Our compliance team will review your accreditation status</li>
                        <li>You'll receive an email confirmation within 1-2 business days</li>
                        <li>Once approved, you can begin investing in opportunities</li>
                        <li>Access your investor dashboard to track your portfolio</li>
                    </ol>
                </div>

                <a
                    href="/nexus/dashboard"
                    className="inline-block px-12 py-4 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all font-medium"
                >
                    Go to Dashboard
                </a>
            </div>
        </div>
    )
}
