import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Meet The Team | The Utility Company',
    description: 'The innovators and engineers driving Industrial Automation as a Service.',
};

export default function TeamPage() {
    const leadership = [
        { name: 'Krishna Patel', title: 'Founder & CEO (TUC)', role: 'Systems Architecture & Vision', image: '/team/member1.png' },
        { name: 'Eric Turner', title: 'Chief Executive Officer (BasaltHQ)', role: 'Strategic Development & Sales', image: '/team/member6.png' },
        { name: 'Michael Milton', title: 'Chief Marketing Officer (BasaltHQ)', role: 'Creative Direction & Brand', image: '/team/member3.png' },
        { name: 'Shahir Monjour', title: 'Senior VP, Engineering (BasaltHQ)', role: 'Full-Stack Integration', image: '/team/member4.png' },
        { name: 'John Garcia', title: 'Senior VP, AI Research (BasaltHQ)', role: 'Agentic Systems & Machine Learning', image: '/team/member5.png' },
        { name: 'Milan Joshi', title: 'Founder & CTO (Requiem Electric)', role: 'Hardware & Mechatronics', image: '/team/Milan.png' },
        { name: 'Kerul Patel', title: 'CTO (TUC)', role: 'Core Infrastructure & Networking', image: '/team/Kerul.png' },
    ];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#F54029] selection:text-white">
            <Navbar />
            
            <div className="relative pt-40 pb-32 px-6 overflow-hidden">
                {/* Background Details */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[#F54029]/5 blur-[150px] rounded-full pointer-events-none" />
                
                <div className="relative max-w-7xl mx-auto z-10">
                    <div className="text-center mb-24 animate-fadeInUp">
                        <span className="text-[#F54029] font-mono tracking-widest text-sm mb-4 block">SYS.ROSTER</span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Architects of the
                            <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Autonomous Future.</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mt-8">
                            A collective of engineers, theorists, and operators deploying Industrial Automation as a Service across the physical world.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {leadership.map((member, i) => (
                            <div 
                                key={member.name}
                                className="group relative glass-panel rounded-2xl p-6 overflow-hidden border border-white/5 hover:border-[#F54029]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(245,64,41,0.2)]"
                                style={{ animationFillMode: 'both', animationDelay: `${i * 100}ms` }}
                            >
                                {/* Hover background glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#F54029]/0 to-[#F54029]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative z-10">
                                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-6 bg-black/50 border border-white/10 group-hover:border-[#F54029]/50 transition-colors duration-500">
                                        <div 
                                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale-[0.8]"
                                            style={{ backgroundImage: `url(${member.image})` }}
                                        />
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#F54029] transition-colors">{member.name}</h3>
                                    <p className="text-xs text-[#F54029] font-mono tracking-tight mb-4">{member.title}</p>
                                    
                                    <div className="pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Focus Area</span>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{member.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
