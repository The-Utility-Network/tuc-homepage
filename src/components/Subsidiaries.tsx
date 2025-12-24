import Link from 'next/link';

const subsidiaries = [
  {
    name: 'Ledger1',
    description: 'Neuromimetic Business Architecture defining the future of AI-driven enterprise operations.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/Ledger1.png',
    url: '/ledger1',
    color: '#DC2626',
  },
  {
    name: 'The Graine Ledger',
    description: 'An automated distillery that allows members to customize their whiskey barrels using NFT technology.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/TGL.png',
    url: '/the-graine-ledger',
    color: '#F97316',
  },
  {
    name: 'Arthaneeti',
    description: 'An AI-powered platform designed for meaningful political and social engagement, leveraging NFTs.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/AR.png',
    url: '/arthaneeti',
    color: '#3B82F6',
  },
  {
    name: 'Requiem Electric',
    description: 'A smart-contract-enabled cooperative EV charging network that empowers stakeholders.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/RE.png',
    url: '/requiem-electric',
    color: '#FFD700',
  },
  {
    name: 'Cornucopia Robotics',
    description: 'Revolutionizing farming and food production through robotics and automation.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/CornucopiaRobotics.png',
    url: '/cornucopia-robotics',
    color: '#EC4899',
  },
  {
    name: 'Osiris Protocol',
    description: 'Enterprise-grade blockchain solutions and onchain data pipelines.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/OP.png',
    url: '/osiris-protocol',
    color: '#A855F7',
  },
  {
    name: 'Vulcan Forge',
    description: 'Revolutionizing manufacturing with tokenized 3D printing and distributed production.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/VulcanForge2.png',
    url: '/vulcan-forge',
    color: '#F97316',
  },
  {
    name: 'Elysium Athletica',
    description: 'Next-gen sports ecosystem focused on tokenized operations and immersive AR experiences.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/Elysium.png',
    url: '/elysium-athletica',
    color: '#f54029',
  },
  {
    name: 'The Loch Ness Botanical Society',
    description: 'Blockchain-based agricultural yield appropriation and aquaponic grow spot sponsorship.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/TLN.png',
    url: '/lochness-botanical-society',
    color: '#2ECC71',
  },
  {
    name: 'DigiBazaar',
    description: 'The home of the creative revolution and the $2 sweep mechanism for asset discovery.',
    image: 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions/DigiBazaarMedallion.png',
    url: '/digibazaar',
    color: '#EF4444',
  }
];

export default function Subsidiaries() {
  return (
    <section id="subsidiaries" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="section-heading">OUR SUBSIDIARIES</span>
          <h2 className="section-title mt-4">Building the Future</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Innovative companies driving automation, sustainability, and community empowerment across diverse industries.
          </p>
        </div>

        {/* Subsidiaries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subsidiaries.map((sub, index) => (
            <a
              key={sub.name}
              href={sub.url}
              target={sub.url.startsWith('http') ? '_blank' : undefined}
              rel={sub.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group relative flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Medallion Image */}
              <div className="relative w-48 h-48 mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <div
                  className="absolute inset-4 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ background: sub.color }}
                />
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="relative w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-sm glass-panel p-6 rounded-2xl border-t border-white/10 group-hover:border-[color:var(--color)] transition-colors duration-300"
                style={{ '--color': sub.color } as React.CSSProperties}>
                <h3
                  className="text-xl font-bold mb-3 transition-colors duration-300"
                  style={{ color: sub.color }}
                >
                  {sub.name}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {sub.description}
                </p>

                <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-gray-500 group-hover:text-white transition-colors">
                  <span>EXPLORE</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
