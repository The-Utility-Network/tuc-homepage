'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

const THEME_COLOR = '#F59E0B';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const sections = [
    {
        id: 'introduction',
        title: '1. Agreement to Terms',
        content: `
**PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING OUR SERVICES.**

These Terms of Service ("Terms," "Agreement") constitute a legally binding contract between you ("User," "you," "your") and **The Utility Company LLC**, a New Mexico limited liability company, together with its subsidiaries, affiliates, and related entities (collectively, "Company," "we," "our," "us"). These Terms govern your access to and use of all websites, applications, platforms, products, and services offered by the Company, including but not limited to those operated under the following brands:

- **BasaltHQ** — AI-driven enterprise platforms and business intelligence
- **Osiris Protocol** — Decentralized identity and financial infrastructure
- **Requiem Electric** — Sustainable energy systems and microgrids
- **The Graine Ledger** — Tokenized physical assets and automated distillery
- **DigiBazaar** — Peer-to-peer marketplace for digital and physical goods
- **Cornucopia Robotics** — Agricultural automation and robotics
- **Arthaneeti** — Political governance infrastructure and DAOs
- **Elysium Athletica** — Human performance optimization
- **The Utility Network** — Network state infrastructure and citizenship

(Collectively, the "Services")

**BY ACCESSING OR USING ANY OF OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS.** If you do not agree to these Terms, you must not access or use the Services.

**Effective Date:** December 26, 2024
**Last Updated:** December 26, 2024
        `
    },
    {
        id: 'eligibility',
        title: '2. Eligibility & Account Registration',
        content: `
**2.1 Eligibility Requirements**

To access and use the Services, you must:

(a) Be at least 18 years of age, or the age of legal majority in your jurisdiction, whichever is higher;

(b) Have the legal capacity to enter into a binding contract;

(c) Not be a person barred from using the Services under the laws of your jurisdiction of residence or any other applicable jurisdiction;

(d) Not be located in, under the control of, or a national or resident of any country subject to United States sanctions or embargoes;

(e) Not be listed on any United States government list of prohibited or restricted parties, including but not limited to the Specially Designated Nationals List administered by the Office of Foreign Assets Control (OFAC);

(f) Comply with all applicable laws and regulations in connection with your use of the Services.

**2.2 Account Registration**

Certain Services require you to create an account. When registering an account, you agree to:

(a) Provide accurate, current, and complete information as prompted by the registration process;

(b) Maintain and promptly update your account information to keep it accurate, current, and complete;

(c) Maintain the security and confidentiality of your login credentials and accept responsibility for all activities that occur under your account;

(d) Notify us immediately of any unauthorized use of your account or any other breach of security;

(e) Not share your account credentials with any third party or permit any third party to access your account;

(f) Not create multiple accounts for fraudulent purposes or to circumvent restrictions or bans.

**2.3 Account Termination**

We reserve the right to suspend or terminate your account at any time, with or without notice, for:

(a) Violation of these Terms or any applicable policies;
(b) Engagement in fraudulent, illegal, or abusive conduct;
(c) Failure to pay applicable fees when due;
(d) Extended periods of inactivity;
(e) Upon your request;
(f) As required by law or legal process.

Upon termination, your right to use the Services will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnification, and limitations of liability.
        `
    },
    {
        id: 'services',
        title: '3. Description of Services',
        content: `
**3.1 General Description**

The Company provides a suite of technology products and services spanning enterprise software, decentralized finance, sustainable energy, tokenized assets, e-commerce, robotics, governance tools, and wellness platforms. Specific terms for individual Services may be provided in supplemental agreements, which are incorporated herein by reference.

**3.2 Modifications to Services**

We reserve the right to modify, suspend, or discontinue any Service, or any part thereof, at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of any Service.

**3.3 Service Availability**

While we strive to maintain continuous availability, we do not guarantee that the Services will be available at all times or that access will be uninterrupted. Services may be subject to scheduled maintenance, unscheduled downtime, force majeure events, or circumstances beyond our reasonable control.

**3.4 Beta Features**

From time to time, we may offer beta, pilot, or experimental features ("Beta Features"). Beta Features are provided "as is" without warranty of any kind. We may discontinue Beta Features at any time and are under no obligation to release a general availability version.

**3.5 Third-Party Services**

The Services may integrate with or provide access to third-party services, websites, or content. We do not control and are not responsible for third-party services. Your use of third-party services is governed by those third parties' terms of service and privacy policies.
        `
    },
    {
        id: 'fees',
        title: '4. Fees, Payment & Billing',
        content: `
**4.1 Pricing**

Certain Services are offered for a fee. Applicable fees are set forth on our websites, in applicable order forms, or in supplemental agreements. All fees are quoted in United States Dollars unless otherwise specified.

**4.2 Payment Terms**

(a) **Payment Methods:** We accept payment via major credit cards, debit cards, ACH bank transfers, wire transfers, and supported cryptocurrencies, as indicated during the checkout process.

(b) **Authorization:** By providing payment information, you authorize us (or our payment processors) to charge the applicable fees using the payment method provided.

(c) **Billing Cycles:** Subscription services are billed in advance on a monthly or annual basis, as selected at the time of purchase. One-time purchases are billed at the time of order.

(d) **Automatic Renewal:** Unless you cancel prior to the end of your billing cycle, subscriptions will automatically renew for successive periods of the same duration at the then-current rates.

**4.3 Taxes**

All fees are exclusive of taxes, levies, or duties imposed by taxing authorities. You are responsible for paying all applicable taxes, except for taxes based on the Company's net income. If we are legally obligated to collect taxes from you, such taxes will be added to your invoice.

**4.4 Price Changes**

We may modify pricing at any time. For existing subscriptions, price changes will take effect at the next renewal period following at least 30 days' notice.

**4.5 Refunds**

Except as required by applicable law or as expressly stated in these Terms or a supplemental agreement:

(a) All fees are non-refundable;
(b) No refunds will be provided for partial billing periods or unused services;
(c) Refund requests for annual subscriptions must be submitted within 14 days of the initial purchase or renewal.

**4.6 Late Payments**

(a) Overdue amounts bear interest at the rate of 1.5% per month (or the maximum legal rate, if lower) from the due date until paid;
(b) You shall reimburse us for all costs of collection, including reasonable attorneys' fees;
(c) We may suspend Services for accounts with overdue balances exceeding 30 days.
        `
    },
    {
        id: 'intellectual-property',
        title: '5. Intellectual Property Rights',
        content: `
**5.1 Company Intellectual Property**

The Services, including all software, algorithms, designs, graphics, text, images, audio, video, trademarks, service marks, trade names, logos, and other intellectual property (collectively, "Company IP"), are owned by or licensed to the Company and are protected by United States and international intellectual property laws.

**5.2 License Grant to You**

Subject to your compliance with these Terms, the Company grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Services solely for your personal or internal business purposes. This license does not include any right to:

(a) Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any Company IP;

(b) Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of any software;

(c) Remove, alter, or obscure any proprietary notices on the Services or Company IP;

(d) Use the Services or Company IP for competitive analysis or to build a competing product or service;

(e) Frame, mirror, or incorporate any portion of the Services into any other website, application, or service without our prior written consent.

**5.3 Your Content**

(a) **Ownership:** You retain ownership of all content, data, and materials you submit, post, upload, or transmit through the Services ("Your Content").

(b) **License Grant:** By submitting Your Content, you grant the Company a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, distribute, and display Your Content solely to the extent necessary to provide, improve, and promote the Services.

(c) **Representations:** You represent and warrant that (i) you own or have the rights to grant the licenses in this Section; (ii) Your Content does not infringe the intellectual property or other rights of any third party; and (iii) Your Content complies with applicable laws and these Terms.

**5.4 Feedback**

If you provide suggestions, ideas, or feedback regarding the Services ("Feedback"), you grant the Company a perpetual, irrevocable, worldwide, royalty-free license to use such Feedback for any purpose without compensation or attribution.

**5.5 DMCA Policy**

We respect intellectual property rights and respond to notices of alleged infringement in accordance with the Digital Millennium Copyright Act ("DMCA"). To report alleged copyright infringement, please contact our designated agent at: legal@theutilitycompany.co.
        `
    },
    {
        id: 'user-conduct',
        title: '6. Acceptable Use Policy',
        content: `
**6.1 General Conduct Standards**

You agree to use the Services only for lawful purposes and in accordance with these Terms. You shall not use the Services:

(a) In any way that violates any applicable federal, state, local, or international law or regulation;

(b) To transmit, or procure the sending of, any advertising or promotional material without our prior written consent, including "junk mail," "chain letters," "spam," or any other similar solicitation;

(c) To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity;

(d) To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which may harm the Company or users of the Services.

**6.2 Prohibited Activities**

You shall not:

(a) Introduce any viruses, Trojan horses, worms, logic bombs, ransomware, or other material that is malicious or technologically harmful;

(b) Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services, servers, or networks connected to the Services;

(c) Attack the Services via a denial-of-service attack or a distributed denial-of-service attack;

(d) Use any robot, spider, scraper, or other automated means to access the Services for any purpose without our express written permission;

(e) Circumvent, disable, or otherwise interfere with security-related features of the Services;

(f) Collect or harvest any personally identifiable information from the Services, including account names;

(g) Use the Services for any commercial purpose not expressly permitted by these Terms;

(h) Create or compile, directly or indirectly, any collection, compilation, database, or directory from the content on the Services;

(i) Make any unauthorized use of the Services, including collecting usernames and/or email addresses by electronic or other means for sending unsolicited email;

(j) Use the Services to send automated queries to any website or to send any unsolicited commercial email.

**6.3 Cryptocurrency and Blockchain-Specific Provisions**

For Services involving cryptocurrency, tokens, or blockchain technology, you additionally agree:

(a) Not to use the Services for money laundering, terrorist financing, sanctions evasion, or other illicit financial activities;

(b) To comply with all applicable anti-money laundering (AML) and know-your-customer (KYC) requirements;

(c) To accept the inherent risks of blockchain technology, including but not limited to price volatility, regulatory uncertainty, and technological risks;

(d) That we do not provide investment, financial, tax, or legal advice, and you should consult appropriate professionals before making financial decisions.
        `
    },
    {
        id: 'disclaimers',
        title: '7. Disclaimers & Warranty Exclusions',
        content: `
**7.1 "AS IS" AND "AS AVAILABLE" BASIS**

THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE COMPANY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

(a) IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT;

(b) WARRANTIES THAT THE SERVICES WILL MEET YOUR REQUIREMENTS;

(c) WARRANTIES THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE;

(d) WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF ANY INFORMATION OBTAINED THROUGH THE SERVICES;

(e) WARRANTIES THAT DEFECTS WILL BE CORRECTED.

**7.2 Third-Party Services**

WE MAKE NO WARRANTIES REGARDING THIRD-PARTY SERVICES, PRODUCTS, OR CONTENT ACCESSIBLE THROUGH OUR SERVICES. YOUR USE OF THIRD-PARTY SERVICES IS AT YOUR OWN RISK.

**7.3 Investment and Financial Disclaimers**

THE COMPANY DOES NOT PROVIDE INVESTMENT, FINANCIAL, LEGAL, OR TAX ADVICE. NOTHING IN THE SERVICES SHOULD BE CONSTRUED AS AN OFFER TO SELL OR A SOLICITATION OF AN OFFER TO BUY ANY SECURITY, TOKEN, OR OTHER FINANCIAL INSTRUMENT. CRYPTOCURRENCY AND TOKENIZED ASSETS ARE SUBJECT TO SIGNIFICANT RISKS INCLUDING TOTAL LOSS OF VALUE.

**7.4 No Professional Advice**

CONTENT AND INFORMATION PROVIDED THROUGH THE SERVICES ARE FOR GENERAL INFORMATIONAL PURPOSES ONLY AND DO NOT CONSTITUTE PROFESSIONAL ADVICE. YOU SHOULD CONSULT APPROPRIATE PROFESSIONALS BEFORE MAKING DECISIONS BASED ON INFORMATION OBTAINED THROUGH THE SERVICES.

**7.5 Jurisdictional Variations**

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES. IN SUCH JURISDICTIONS, THE ABOVE EXCLUSIONS SHALL APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.
        `
    },
    {
        id: 'liability',
        title: '8. Limitation of Liability',
        content: `
**8.1 Exclusion of Consequential Damages**

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR:

(a) Loss of profits, revenue, goodwill, use, data, or other intangible losses;
(b) The cost of procurement of substitute services;
(c) Unauthorized access to or alteration of your transmissions or data;
(d) Statements or conduct of any third party on the Services;
(e) Any other matter relating to the Services;

WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT THE COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

**8.2 Aggregate Liability Cap**

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL LIABILITY OF THE COMPANY AND ITS AFFILIATES FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES, WHETHER IN CONTRACT, TORT, OR OTHERWISE, SHALL NOT EXCEED THE GREATER OF:

(a) THE AMOUNTS YOU PAID TO THE COMPANY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR

(b) ONE HUNDRED UNITED STATES DOLLARS ($100.00).

**8.3 Essential Basis of the Bargain**

YOU ACKNOWLEDGE THAT THE COMPANY HAS SET ITS PRICES AND ENTERED INTO THESE TERMS IN RELIANCE UPON THE DISCLAIMERS OF WARRANTY AND THE LIMITATIONS OF LIABILITY SET FORTH HEREIN, AND THAT THE SAME FORM AN ESSENTIAL BASIS OF THE BARGAIN BETWEEN THE PARTIES.

**8.4 Jurisdictional Variations**

SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR CERTAIN DAMAGES. IN SUCH JURISDICTIONS, THE COMPANY'S LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.
        `
    },
    {
        id: 'indemnification',
        title: '9. Indemnification',
        content: `
**9.1 Your Indemnification Obligations**

You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees and costs) arising out of or relating to:

(a) Your access to or use of the Services;

(b) Your violation of these Terms;

(c) Your violation of any third-party rights, including but not limited to intellectual property rights, privacy rights, or publicity rights;

(d) Your violation of any applicable law, rule, or regulation;

(e) Your Content or any content you submit, post, or transmit through the Services;

(f) Your willful misconduct or negligence;

(g) Any dispute between you and another user of the Services.

**9.2 Indemnification Procedure**

The Company will provide you with prompt written notice of any claim subject to indemnification. The Company reserves the right, at its own expense, to assume the exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims. You shall not settle any claim without the Company's prior written consent.

**9.3 Survival**

Your indemnification obligations shall survive the termination of these Terms and your use of the Services.
        `
    },
    {
        id: 'dispute-resolution',
        title: '10. Dispute Resolution & Arbitration',
        content: `
**10.1 Informal Resolution**

Before initiating any formal dispute resolution proceeding, you agree to first contact us at legal@theutilitycompany.co and attempt to resolve the dispute informally. We will attempt to resolve any dispute within thirty (30) days of receiving notice.

**10.2 Binding Arbitration**

IF WE CANNOT RESOLVE A DISPUTE INFORMALLY, YOU AND THE COMPANY AGREE THAT ANY DISPUTE, CONTROVERSY, OR CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES SHALL BE RESOLVED BY BINDING ARBITRATION administered by the American Arbitration Association ("AAA") in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted:

(a) In Albuquerque, New Mexico, or another mutually agreed location;

(b) By a single arbitrator selected in accordance with AAA rules;

(c) In the English language;

(d) In accordance with the Federal Arbitration Act, to the extent applicable.

**10.3 Class Action Waiver**

YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION OR CLASS-WIDE ARBITRATION.

**10.4 Exceptions**

The following claims are exempt from mandatory arbitration:

(a) Claims that may be brought in small claims court;
(b) Claims for injunctive relief to prevent intellectual property infringement;
(c) Claims that applicable law does not permit to be arbitrated.

**10.5 Governing Law**

These Terms shall be governed by and construed in accordance with the laws of the State of New Mexico, without regard to its conflict of law principles. The United Nations Convention on Contracts for the International Sale of Goods shall not apply.

**10.6 Venue**

For any claims not subject to arbitration, you consent to exclusive jurisdiction and venue in the state and federal courts located in Bernalillo County, New Mexico.

**10.7 Time Limitation**

Any claim arising out of or relating to these Terms or the Services must be filed within one (1) year after such claim arose, or be forever barred.
        `
    },
    {
        id: 'general',
        title: '11. General Provisions',
        content: `
**11.1 Entire Agreement**

These Terms, together with our Privacy Protocols and any supplemental terms or policies incorporated by reference, constitute the entire agreement between you and the Company regarding your use of the Services and supersede all prior agreements and understandings, whether written or oral.

**11.2 Severability**

If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable, or if modification is not possible, severed from these Terms. The remaining provisions shall continue in full force and effect.

**11.3 Waiver**

The failure of the Company to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative of the Company.

**11.4 Assignment**

You may not assign or transfer these Terms or any rights or obligations hereunder without the Company's prior written consent. The Company may freely assign or transfer these Terms without restriction. These Terms shall bind and inure to the benefit of the parties and their respective successors and permitted assigns.

**11.5 No Third-Party Beneficiaries**

These Terms do not create any third-party beneficiary rights, except that the Company's affiliates and licensors are intended third-party beneficiaries of the provisions regarding intellectual property and limitation of liability.

**11.6 Notices**

(a) **Notices to You:** We may provide notices to you via email to the address associated with your account, by posting on the Services, or by other reasonable means. Notices sent by email are effective upon sending; notices posted on the Services are effective upon posting.

(b) **Notices to the Company:** Notices to the Company must be sent in writing to:

The Utility Company LLC
Attn: Legal Department
Email: legal@theutilitycompany.co

**11.7 Force Majeure**

The Company shall not be liable for any failure or delay in performance resulting from causes beyond its reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, pandemics, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.

**11.8 Relationship of the Parties**

Nothing in these Terms creates any agency, partnership, joint venture, or employment relationship between you and the Company. Neither party has authority to bind the other or to incur obligations on the other's behalf.

**11.9 Headings**

The headings in these Terms are for convenience only and shall not affect the interpretation of these Terms.

**11.10 Construction**

These Terms shall not be construed against the drafter. Any ambiguity shall be resolved without regard to which party drafted the language in question.
        `
    },
    {
        id: 'modifications',
        title: '12. Modifications to Terms',
        content: `
**12.1 Right to Modify**

The Company reserves the right to modify these Terms at any time in its sole discretion. When we make changes, we will:

(a) Post the updated Terms on our website with a new "Last Updated" date;

(b) Provide at least thirty (30) days' notice for material changes, via email or prominent notice on the Services;

(c) Maintain an archive of previous versions available upon request.

**12.2 Material Changes**

Material changes include but are not limited to:

(a) Changes to dispute resolution, arbitration, or class action waiver provisions;
(b) Modifications to limitation of liability or warranty provisions;
(c) Changes to fee structures for paid Services;
(d) New obligations or restrictions on your use of the Services;
(e) Changes to data processing or privacy practices that require separate consent.

**12.3 Acceptance of Modified Terms**

Your continued use of the Services following the posting of updated Terms (and, for material changes, following the notice period) constitutes your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Services and terminate your account.

**12.4 Disputes Under Prior Terms**

Disputes arising from events that occurred before the effective date of modified Terms shall be governed by the version of the Terms in effect at the time the disputed events occurred.
        `
    },
    {
        id: 'contact',
        title: '13. Contact Information',
        content: `
For questions, concerns, or notices regarding these Terms of Service:

**The Utility Company LLC**
Legal Department
Email: legal@theutilitycompany.co

**General Inquiries:**
info@theutilitycompany.co

**Privacy Matters:**
privacy@theutilitycompany.co

**Copyright Claims:**
legal@theutilitycompany.co

---

**ACKNOWLEDGMENT**

BY USING THE SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. YOU FURTHER ACKNOWLEDGE THAT THESE TERMS, TOGETHER WITH THE PRIVACY PROTOCOLS, REPRESENT THE COMPLETE AND EXCLUSIVE STATEMENT OF THE AGREEMENT BETWEEN YOU AND THE COMPANY, AND SUPERSEDE ANY PROPOSAL OR PRIOR AGREEMENT, ORAL OR WRITTEN, AND ANY OTHER COMMUNICATIONS BETWEEN YOU AND THE COMPANY RELATING TO THE SUBJECT MATTER OF THESE TERMS.

---

**The Utility Company LLC**
*Building Sovereign Infrastructure for a Post-Scarcity Civilization*

**© 2024 The Utility Company LLC. All Rights Reserved.**
        `
    }
];

export default function TermsOfServicePage() {
    return (
        <main className="bg-[#050505] text-white min-h-screen selection:bg-amber-500">
            <Navbar themeColor={THEME_COLOR} />
            <BackButton color={THEME_COLOR} />

            {/* Hero */}
            <section className="relative pt-40 pb-16 px-6 border-b border-white/5">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/30 rounded-full blur-[150px]" />
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                        <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono tracking-[0.2em] uppercase mb-6">
                            Legal Agreement
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                            Terms of <span className="text-amber-400">Service</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl">
                            The binding agreement governing your access to and use of all services, platforms, and products offered by The Utility Company LLC and its subsidiaries.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4 text-sm font-mono text-gray-500">
                            <span>Effective: December 26, 2024</span>
                            <span>•</span>
                            <span>Jurisdiction: New Mexico, USA</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="py-12 px-6 border-b border-white/5 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6">Table of Contents</h2>
                    <div className="grid md:grid-cols-2 gap-2">
                        {sections.map((section, i) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="text-gray-400 hover:text-amber-400 transition-colors py-2 flex items-center gap-3"
                            >
                                <span className="text-amber-500/50 font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                                <span>{section.title.replace(/^\d+\.\s*/, '')}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            id={section.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                            className="mb-16 scroll-mt-32"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-4">
                                <span className="w-10 h-[2px] bg-amber-500"></span>
                                {section.title}
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300">
                                {section.content.trim().split('\n\n').map((paragraph, i) => {
                                    const trimmed = paragraph.trim();

                                    // Handle all-caps paragraphs (legal emphasis)
                                    if (trimmed === trimmed.toUpperCase() && trimmed.length > 50) {
                                        return (
                                            <p key={i} className="text-amber-400/80 leading-relaxed mb-4 font-medium text-sm tracking-wide">
                                                {trimmed.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={j} className="text-amber-300">{part.slice(2, -2)}</strong>;
                                                    }
                                                    return part;
                                                })}
                                            </p>
                                        );
                                    }

                                    // Handle headers starting with **
                                    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('\n') && trimmed.length < 100) {
                                        return (
                                            <h3 key={i} className="text-xl font-semibold text-white mt-8 mb-4">
                                                {trimmed.slice(2, -2)}
                                            </h3>
                                        );
                                    }

                                    // Handle lettered/numbered lists
                                    if (/^\([a-z]\)/.test(trimmed) || /^\(\d+\)/.test(trimmed)) {
                                        const items = trimmed.split('\n').filter(l => l.trim());
                                        return (
                                            <div key={i} className="my-4 pl-4 border-l-2 border-amber-500/30">
                                                {items.map((item, j) => (
                                                    <p key={j} className="text-gray-300 mb-2">
                                                        {item.split(/(\*\*[^*]+\*\*)/).map((part, k) => {
                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                return <strong key={k} className="text-white">{part.slice(2, -2)}</strong>;
                                                            }
                                                            return part;
                                                        })}
                                                    </p>
                                                ))}
                                            </div>
                                        );
                                    }

                                    // Handle bullet lists starting with -
                                    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                                        const items = trimmed.split('\n').filter(l => l.trim());
                                        return (
                                            <ul key={i} className="list-none space-y-2 my-4">
                                                {items.map((item, j) => (
                                                    <li key={j} className="flex items-start gap-2">
                                                        <span className="text-amber-400 mt-1">•</span>
                                                        <span className="text-gray-300">
                                                            {item.replace(/^[-•]\s*/, '').split(/(\*\*[^*]+\*\*)/).map((part, k) => {
                                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                                    return <strong key={k} className="text-white">{part.slice(2, -2)}</strong>;
                                                                }
                                                                return part;
                                                            })}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }

                                    // Regular paragraphs with bold support
                                    return (
                                        <p key={i} className="text-gray-300 leading-relaxed mb-4">
                                            {trimmed.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={j} className="text-white">{part.slice(2, -2)}</strong>;
                                                }
                                                return part;
                                            })}
                                        </p>
                                    );
                                })}
                            </div>

                            {index < sections.length - 1 && (
                                <div className="mt-12 pt-12 border-t border-white/5" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
