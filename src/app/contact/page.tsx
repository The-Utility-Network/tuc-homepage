import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | The Utility Company',
    description: 'Get in touch with The Utility Company. We are ready to help you navigate the complexities of industrial automation and blockchain integration.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column: Info */}
                    <div className="space-y-12">
                        <div>
                            <span className="section-heading text-utility-red">GET IN TOUCH</span>
                            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
                                Let's Build <br />
                                <span className="text-gray-500">The Future.</span>
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                                Whether you're interested in integrating Ledger1, exploring investment opportunities,
                                or simply want to learn more about our neuromimetic architecture, we're here to listen.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-xl border border-white/5">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">General Inquiries</h3>
                                <a href="mailto:info@theutilitycompany.co" className="text-2xl font-mono text-white hover:text-utility-red transition-colors">
                                    info@theutilitycompany.co
                                </a>
                            </div>

                            <div className="glass-panel p-6 rounded-xl border border-white/5">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Join the Community</h3>
                                <div className="flex gap-4">
                                    <a href="https://discord.gg/scHwVByn9m" target="_blank" className="px-4 py-2 bg-white/5 rounded-lg hover:bg-utility-red hover:text-white transition-colors">
                                        Discord
                                    </a>
                                    <a href="https://twitter.com/The_Utility_Co" target="_blank" className="px-4 py-2 bg-white/5 rounded-lg hover:bg-utility-red hover:text-white transition-colors">
                                        Twitter / X
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative">
                        {/* Decorative Glow */}
                        <div className="absolute -inset-4 bg-utility-red/20 blur-3xl opacity-20 rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
