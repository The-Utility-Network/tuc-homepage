const partnerCategories = [
    { name: 'Animal & Plant Conservation', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/A&P.jpg' },
    { name: 'Children\'s Health', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Childrens.jpg' },
    { name: 'Environmental Awareness', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Enivonmental.jpg' },
    { name: 'Financial Literacy', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/FinancialLiteracy.jpg' },
    { name: 'Gender Equality', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/GenderEquality.jpg' },
    { name: 'Independent Artists & Creators', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Independent.jpg' },
    { name: 'Indigenous Rights & Access', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Indigenous.jpg' },
    { name: 'Justice & Peace', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Justice.jpg' },
    { name: 'Medical Access', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/MedicalAccess.jpg' },
    { name: 'Mental Health & Wellness', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/MentalHealth.jpg' },
    { name: 'Minority Rights & Access', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Minority.jpg' },
    { name: 'Nature & Habitat', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/N&H.jpg' },
    { name: 'Research Initiatives', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Research.jpg' },
    { name: 'Spirituality & Self-Discovery', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Spirituality.jpg' },
    { name: 'Veterans Community', image: 'https://theutilitycompany.co/theme/default/assets/images/partner-badges/Veterans.jpg' },
];

export default function Partners() {
    return (
        <section id="partners" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="section-heading">PARTNER PROGRAM</span>
                    <h2 className="section-title mt-4">15 Impact Categories</h2>
                    <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
                        At The Utility Company, we believe that partnerships are fundamental to Web3.
                        We cultivate partnerships across 15 different categories to sustain positive
                        change in society and the environment.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                    {partnerCategories.map((category) => (
                        <div
                            key={category.name}
                            className="group relative aspect-square glass-panel rounded-xl overflow-hidden cursor-pointer hover:border-[#F54029]/50 transition-all duration-300"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                style={{ backgroundImage: `url(${category.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-xs font-bold text-white leading-tight uppercase tracking-wider">
                                    {category.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partner CTA */}
                <div className="glass-panel rounded-2xl p-8 md:p-12 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        The Graine Ledger Partner Program
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        NFT creators and projects have a unique opportunity to integrate with our
                        automated distillery. Join our ecosystem and showcase your commitment to
                        making a real impact.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://forms.gle/rmkiFt6tFWCky8f57"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            APPLY TODAY
                        </a>
                        <a
                            href="https://theutilitycompany.co/partner-program/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
