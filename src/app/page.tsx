'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Pillars from '@/components/Pillars';
import About from '@/components/About';
import Features from '@/components/Features';
import BasaltHQ from '@/components/BasaltHQ';
import Subsidiaries from '@/components/Subsidiaries';
import Services from '@/components/Services';
import Osiris from '@/components/Osiris';
import Partners from '@/components/Partners';
import Philosophy from '@/components/Philosophy';
import NetworkStateSection from '@/components/NetworkStateSection';
import SeoLinks from '@/components/SeoLinks';
import Footer from '@/components/Footer';

// Dynamic import for client-only canvas component
const WaveConwayBackground = dynamic(
  () => import('@/components/WaveConwayBackground'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <WaveConwayBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Pillars />
        <About />
        <Subsidiaries />
        <Services />
        <Features />
        <BasaltHQ />
        <Osiris />
        <Partners />
        <Philosophy />
        <NetworkStateSection />
        <SeoLinks />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
