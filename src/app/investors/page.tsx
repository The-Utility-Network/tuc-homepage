import InvestorHero from '@/components/website/investors/InvestorHero'
import NexusFeatures from '@/components/website/investors/NexusFeatures'
import MarketOpportunity from '@/components/website/investors/MarketOpportunity'
import SubsidiaryAlpha from '@/components/website/investors/SubsidiaryAlpha'
import ConvergenceThesis from '@/components/website/investors/ConvergenceThesis'
import InvestorReferences from '@/components/website/investors/InvestorReferences'
import NexusFlywheel from '@/components/website/investors/NexusFlywheel'
import StrategicRoadmap from '@/components/website/investors/StrategicRoadmap'
import InstitutionalDeepDive from '@/components/website/investors/InstitutionalDeepDive'
import PortalPreview from '@/components/website/investors/PortalPreview'
import VenturePipeline from '@/components/website/investors/VenturePipeline'
import GlobalImpact from '@/components/website/investors/GlobalImpact'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Investors | The Utility Company',
    description: 'The future of vesting. Institutional grade infrastructure for modern asset management.',
}

export default function InvestorsPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar themeColor="#F54029" />
            <InvestorHero />
            <MarketOpportunity />
            <ConvergenceThesis />
            <NexusFlywheel />
            <SubsidiaryAlpha />
            <VenturePipeline />
            <StrategicRoadmap />
            <GlobalImpact />
            <InstitutionalDeepDive />
            <PortalPreview />
            <NexusFeatures />
            <InvestorReferences />
            <Footer />
        </main>
    )
}
