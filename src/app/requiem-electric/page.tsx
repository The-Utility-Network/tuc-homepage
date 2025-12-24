'use client';

import ParallaxHero from '@/components/ParallaxHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CircuitBackground from '@/components/CircuitBackground';
import RequiemContactForm from '@/components/RequiemContactForm';
import BackButton from '@/components/BackButton';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className={`relative z-10 py-24 px-6 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default function RequiemElectricPage() {
  return (
    <main className="bg-black min-h-screen text-gray-200 overflow-x-hidden selection:bg-[#FFD700] selection:text-black">
      <Navbar themeColor='#FFD700' />
      <BackButton color="#FFD700" />
      <ParallaxHero
        image="/artifacts/requiem_bg.png"
        title="REQUIEM ELECTRIC"
        subtitle="The Future of Distributed Energy & Community"
        color="#FFD700"
        medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/RE.png"
      />

      {/* Intro Section - Project Brief */}
      <div className="relative">
        <CircuitBackground />
        <AnimatedSection className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              POWER TO THE <span className="text-[#FFD700]">PEOPLE</span>.
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6 text-lg font-light leading-relaxed">
              <p>
                Electric Vehicles (EVs) are finally beginning to garner their fair share of the market.
                In the past year alone, more EVs were produced and sold in a single year than ever before.
                The growth rate of the industry is exponential, and the positive impact on the effort
                to curb climate change makes it an opportunity of a lifetime.
              </p>
              <p>
                Requiem Electric Charging Systems will meet the rising demands for safe and reliable access
                to lightning-fast EV charging. While public infrastructure will surely fulfill much of this
                demand for local residents, a unique implementation in private establishments could also be beneficial.
              </p>
              <p className="border-l-4 border-[#FFD700] pl-6 italic text-gray-400">
                "While this could be a purely private enterprise, we hope to create a sense of community
                around our installations by providing affordable and risk-free investment opportunities
                to local residents as well as a unique revenue stream for the local government without
                the need for taxation."
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="space-y-8">
            {/* Challenge & Solution Cards */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[#FFD700]">⚠️</span> THE CHALLENGE
              </h3>
              <p className="text-gray-400 mb-4">
                Monetization of electric vehicle charging at private commercial establishments
                with multiple stakeholders and beneficiaries. We hope to establish:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Revenue for Local Government</li>
                <li>• Subsidies for Installation Costs</li>
                <li>• Tax benefits for private investors</li>
                <li>• Add value to existing businesses</li>
              </ul>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[#FFD700]">💡</span> THE SOLUTION
              </h3>
              <p className="text-gray-400 mb-4">
                The hospitality industry and multi-family residential developments accommodate
                a great number of stationary vehicles within urban and rural areas.
                These vehicles are primarily parked overnight and for long hours in the day.
              </p>
              <p className="text-gray-300 font-medium">
                Requiem Electric is partnering with local businesses to electrify their parking spaces
                and generate additional revenue.
              </p>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>

      {/* Financial Breakdown Section */}
      <section className="bg-zinc-900/50 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-8">
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-8">OFFER <span className="text-[#FFD700]">PACKAGES</span></motion.h2>

              <motion.div variants={fadeInUp} className="glass-panel p-8 rounded-xl border border-white/10">
                <h4 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Budget Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Type II Charging System</span>
                    <span className="font-mono text-white">$2,500</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Site Planning</span>
                    <span className="font-mono text-white">$500</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Installation</span>
                    <span className="font-mono text-white">$2,000</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="text-[#FFD700]">Total Installation Cost</span>
                    <span className="font-mono text-[#FFD700]">$5,000</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex gap-4">
                <div className="flex-1 glass-panel p-6 rounded-xl text-center">
                  <div className="text-sm text-gray-400 mb-1">Down Payment</div>
                  <div className="text-2xl font-bold text-white">10% <span className="text-sm font-normal text-gray-500">($500)</span></div>
                </div>
                <div className="flex-1 glass-panel p-6 rounded-xl text-center">
                  <div className="text-sm text-gray-400 mb-1">Financed (1-Year Term)</div>
                  <div className="text-2xl font-bold text-white">90% <span className="text-sm font-normal text-gray-500">($4,500)</span></div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-8">FINANCIAL <span className="text-[#FFD700]">BENEFITS</span></motion.h2>

              <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/20">
                  <h4 className="font-bold text-[#FFD700] mb-2">Initial Share</h4>
                  <p className="text-3xl font-black text-white">10%</p>
                  <p className="text-xs text-gray-400 mt-2">Fixed Share of Weekly Revenue</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-2">Staking Share</h4>
                  <p className="text-3xl font-black text-white">+10%</p>
                  <p className="text-xs text-gray-400 mt-2">Expandable Share by Staking</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="glass-panel p-6 rounded-xl">
                <h4 className="font-bold text-white mb-4">Payment Method</h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                    Recommended Web3 Wallet: <strong className="text-white">MetaMask</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                    Primary Blockchain: <strong className="text-white">Ethereum</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                    Available Tokens: <strong className="text-white">USDC, USDT, ETH</strong>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Participants Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">PROJECT <span className="text-[#FFD700]">PARTICIPANTS</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto italic">
            "By investing in EV charging stations today, and tapping into hospitality’s natural link
            with transportation’s current energy transition towards electric vehicles, hotels will
            attract the guest of tomorrow ahead of time."
            <br /><span className="text-[#FFD700] not-italic text-sm mt-2 block">- Robert Monkman, HospitalityNet.org</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-8 rounded-2xl border-t-2 border-[#FFD700] group hover:bg-[#FFD700]/5 transition-colors">
            <div className="text-5xl font-black text-white/5 mb-4 group-hover:text-[#FFD700]/20 transition-colors">01</div>
            <h3 className="text-lg font-bold text-white mb-2">PROPERTY OWNER</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Local sole or incorporated proprietor providing hospitality/housing services.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>+ Quick Installation</li>
              <li>+ No disturbance to clients</li>
              <li>+ Web App Management</li>
              <li>+ Increased traffic</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-t-2 border-[#FFD700] group hover:bg-[#FFD700]/5 transition-colors">
            <div className="text-5xl font-black text-white/5 mb-4 group-hover:text-[#FFD700]/20 transition-colors">02</div>
            <h3 className="text-lg font-bold text-white mb-2">FINANCE PARTNER</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              State/Private Institution capable of funding upcoming installations.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>+ Secure Ethereum Blockchain</li>
              <li>+ Stake for Upgrades</li>
              <li>+ Gain up to 20%</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-t-2 border-[#FFD700] group hover:bg-[#FFD700]/5 transition-colors">
            <div className="text-5xl font-black text-white/5 mb-4 group-hover:text-[#FFD700]/20 transition-colors">03</div>
            <h3 className="text-lg font-bold text-white mb-2">NFT OWNER</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Private citizen who mints an NFT for the value of the installation's down payment.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>+ Listed on all major Markets</li>
              <li>+ Web3 Wallet Support</li>
              <li>+ Automated Returns</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-t-2 border-[#FFD700] group hover:bg-[#FFD700]/5 transition-colors">
            <div className="text-5xl font-black text-white/5 mb-4 group-hover:text-[#FFD700]/20 transition-colors">04</div>
            <h3 className="text-lg font-bold text-white mb-2">REQUIEM ELECTRIC</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Private Corporate Entity which installs, operates, and maintains the equipment.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>+ Zero-cost installation</li>
              <li>+ Lifetime Service</li>
              <li>+ "Sit back and earn"</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 relative bg-black/50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-16"
          >
            EXECUTION <span className="text-[#FFD700]">WORKFLOW</span>
          </motion.h2>

          <div className="relative border-l-2 border-[#FFD700]/30 ml-4 md:ml-0 md:border-l-0 md:grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "AGREEMENT", desc: "Establish a property-use and profit-sharing agreement with Property Owner. Prepare plans for installation site." },
              { step: "02", title: "PROCUREMENT", desc: "Procure EV charging equipment and prepare site for installation." },
              { step: "03", title: "TOKENIZATION", desc: "Mint NFTs for Property Owner, NFT Owner, and Finance Partner. Establish smart contract for automated revenue distribution." },
              { step: "04", title: "OPERATIONS", desc: "Complete Installation and start generating revenue. Smart contract automatically distributes revenue on a weekly basis." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative pl-12 md:pl-0 md:text-center mb-12 md:mb-0 group"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] top-0 w-3 h-3 bg-[#FFD700] rounded-full md:left-1/2 md:top-[-20px] md:-ml-1.5 shadow-[0_0_15px_#FFD700]"></div>

                <span className="text-6xl font-black text-white/5 absolute -top-8 left-0 md:left-1/2 md:-ml-16 -z-10 group-hover:text-[#FFD700]/10 transition-colors">{item.step}</span>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">GET <span className="text-[#FFD700]">STARTED</span></h2>
          <p className="text-gray-400 mb-12">Current estimated installation queue: <span className="text-[#FFD700]">3-4 Weeks</span></p>
          <RequiemContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
