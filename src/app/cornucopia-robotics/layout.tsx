import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cornucopia Robotics | Automated Precision Agriculture | The Utility Company',
    description: 'Cornucopia Robotics applies the I3AS framework to agriculture through autonomous swarm intelligence. We deploy solar-powered drone swarms for fully autonomous planting, treatment, and harvesting, managing crop lifecycles with sub-millimeter precision to rewrite the equation of food security.',
    keywords: ['Cornucopia Robotics', 'Precision Agriculture', 'Autonomous Farming', 'Agricultural Robotics', 'Drone Swarms', 'Smart Farming', 'AgTech', 'Food Security', 'Vertical Farming', 'NFT Land Ownership'],
    openGraph: {
        title: 'Cornucopia Robotics | The Harvest Algorithm',
        description: 'Deploying autonomous swarm intelligence for zero-labor farming. From hyper-localized urban vertical towers to robotically managed plots, we are automating abundance.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cornucopia Robotics | Precision Agriculture',
        description: 'Automated precision agriculture using autonomous drone swarms. Zero labor, hyper-local, and blockchain-verified.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
