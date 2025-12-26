export interface CodexTerm {
    term: string;
    slug: string;
    definition: string;
    longDescription: string;
    category: 'Technology' | 'Economics' | 'Philosophy' | 'Infrastructure' | 'Security' | 'Cryptography' | 'Hardware' | 'Scaling' | 'Architecture' | 'DeFi' | 'Consensus' | 'Identity' | 'Governance';
    relatedIndustries: string[]; // slugs of related industries
    relatedLocations: string[]; // slugs of related locations
}

export const CODEX: CodexTerm[] = [
    {
        term: 'Neuromimetic Architecture',
        slug: 'neuromimetic-architecture',
        definition: 'A system design philosophy that mimics biological neural networks, allowing decentralized nodes to self-organize and optimize without central direction.',
        longDescription: 'Neuromimetic Architecture is the core design principle behind TUC\'s "Industrial Automation as a Service." Unlike traditional hierarchical control systems (SCADA), a neuromimetic network treats every machine, sensor, and ledger as an autonomous neuron. These neurons communicate laterally via peer-to-peer protocols (like Gossip sub) to reach local consensus on resource allocation. This allows the entire industrial grid to "heal" itself—if one factory node goes offline, the network automatically reroutes production orders to the next available nearest neighbor, much like the human brain reroutes signals around damaged tissue.',
        category: 'Technology',
        relatedIndustries: ['manufacturing', 'energy', 'logistics'],
        relatedLocations: ['tokyo', 'zurich']
    },
    {
        term: 'DePIN',
        slug: 'depin',
        definition: 'Decentralized Physical Infrastructure Networks—protocols that incentivize the rollout of real-world hardware (sensors, solar panels, wifi) using cryptographic tokens.',
        longDescription: 'DePIN represents the bridge between the digital world of crypto and the physical world of heavy industry. TUC utilizes DePIN models to crowdsource infrastructure costs. Instead of a single utility company paying billions to upgrade a power grid, Requiem Electric allows individual homeowners to become "micro-utilities." By installing smart solar arrays and batteries, they mine "Kilowatt Tokens" for every unit of energy they contribute to the grid. This shifts the capital expenditure (CapEx) from the centralized entity to the distributed edge, while rewarding participants with liquid ownership in the network they help build.',
        category: 'Infrastructure',
        relatedIndustries: ['energy', 'agriculture', 'manufacturing'],
        relatedLocations: ['dubai', 'lagos', 'sao-paulo']
    },
    {
        term: 'RWA Tokenization',
        slug: 'rwa-tokenization',
        definition: 'The process of creating a digital twin of a Real-World Asset (like real estate, gold, or debt) on a blockchain, allowing it to be traded globally 24/7.',
        longDescription: 'RWA (Real-World Asset) Tokenization is not just about putting stocks on a blockchain; it is about making illiquid assets liquid. TUC focuses on "Productive RWAs"—assets that generate yield. For example, The Graine Ledger does not just sell a token; it sells a tokenized cask of whiskey that acts as a legal claim to the physical inventory. As the whiskey ages and becomes more valuable, the token price reflects that appreciation. This allows for new financial instruments, such as "Inventory Financing," where a small business can instantly borrow against their on-chain stock without needing a bank loan officer.',
        category: 'Economics',
        relatedIndustries: ['finance', 'food-beverage', 'real-estate'],
        relatedLocations: ['new-york', 'hong-kong', 'singapore']
    },
    {
        term: 'Industrial Automation as a Service',
        slug: 'industrial-automation-as-a-service',
        definition: 'A business model where the complex machinery of production is abstracted away via APIs, allowing users to order "manufacturing" or "logistics" as easily as cloud computing.',
        longDescription: 'Just as AWS (Amazon Web Services) allowed startups to rent servers instead of building data centers, I3AS (Industrial Automation as a Service) allows companies to rent factories. Through Vulcan Forge and Cornucopia Robotics, TUC provides the physical layer. A client simply uploads a CAD file and pays a fee; the network handles the materials sourcing, the 3D printing, the quality control, and the drone delivery. The client never touches a machine. This democratizes heavy industry, lowering the barrier to entry for physical product innovation to nearly zero.',
        category: 'Technology',
        relatedIndustries: ['manufacturing', 'robotics'],
        relatedLocations: ['tokyo', 'san-francisco']
    },
    {
        term: 'Zero-Knowledge Proof',
        slug: 'zero-knowledge-proof',
        definition: 'A cryptographic method by which one party can prove to another that a statement is true without revealing any information apart from the fact that the statement is true.',
        longDescription: 'In the TUC ecosystem, privacy is paramount, especially for enterprise partners. Zero-Knowledge Proofs (ZKPs) allow us to verify compliance without exposing trade secrets. For instance, a bank running on Ledger1 can prove to regulators that it has sufficient reserves (Solvency) without revealing the balances of its individual clients. Elysium Athletica users can prove they completed a workout to earn insurance discounts without uploading their GPS location history. ZKPs turn "Don\'t get breached" into "Have nothing to breach."',
        category: 'Technology',
        relatedIndustries: ['finance', 'sports', 'healthcare'],
        relatedLocations: ['zurich', 'london']
    },
    {
        term: 'Smart Legal Contract',
        slug: 'smart-legal-contract',
        definition: 'A legally binding agreement where natural language clauses are paired with executable code that automatically enforces the terms.',
        longDescription: 'A standard smart contract is just code; it often lacks legal standing in a court of law. TUC utilizes "Ricardian Contracts" or Smart Legal Contracts, where the code acts as the automated administrator of a document signed effectively by the parties. If a shipment is late, the code reads the Oracle data and automatically executes the penalty clause defined in the legal text. This merges the efficiency of software with the enforceability of law, reducing legal overhead and dispute resolution times by orders of magnitude.',
        category: 'Infrastructure',
        relatedIndustries: ['logistics', 'finance', 'politics'],
        relatedLocations: ['new-york', 'singapore', 'london']
    },
    {
        term: 'Sovereign Identity',
        slug: 'sovereign-identity',
        definition: 'A model of digital identity where the user retains full control over their data, sharing only what is necessary via cryptographic attestations.',
        longDescription: 'In the age of AI and deepfakes, proving "Humanity" is the new gold standard. TUC implements Self-Sovereign Identity (SSI) across all its platforms. When you vote in Arthaneeti or trade on DigiBazaar, you are not logging in with a Google or Facebook account; you are signing with your own private key. Your history, your reputation, and your assets belong to that key, not to TUC\'s servers. This ensures that no platform can "de-platform" a user, and users can take their reputation with them across different applications.',
        category: 'Philosophy',
        relatedIndustries: ['politics', 'retail', 'social'],
        relatedLocations: ['lagos', 'zurich']
    },
    {
        term: 'Token Engineering',
        slug: 'token-engineering',
        definition: 'The rigorous design of economic systems and incentives using optimization, control theory, and simulation.',
        longDescription: 'TUC does not just "launch tokens." We engineer economies. Using CADCAD simulations, we model how our systems behave under stress, inflation, or attack vectors before writing a single line of Solidity. This engineering approach ensures that our intricate multi-token systems (like the dual-token model of Governance vs. Utility) remain stable and aligned with the long-term goals of the network. We treat economics as a hard engineering discipline, akin to building a bridge or a skyscraper.',
        category: 'Economics',
        relatedIndustries: ['finance', 'energy'],
        relatedLocations: ['new-york', 'tokyo']
    },
    {
        term: 'Moloch Trap',
        slug: 'moloch-trap',
        definition: 'A game-theory concept where individual incentives lead to a collective negative outcome.',
        longDescription: 'In TUC\'s philosophy, "Moloch" represents the coordination failures of legacy capitalism (e.g., race to the bottom, pollution). Our protocols are designed as "Moloch Slayers"—coordination mechanisms that align individual profit with collective well-being through programmed incentives.',
        category: 'Philosophy',
        relatedIndustries: ['Politics', 'Economics'],
        relatedLocations: ['Zurich', 'Lagos']
    },
    {
        term: 'Zero-Knowledge Rollup',
        slug: 'zk-rollup',
        definition: 'A Layer 2 scaling solution that bundles hundreds of transactions off-chain and generates a cryptographic proof of validity.',
        longDescription: 'ZK-Rollups allow TUC to process industrial-scale throughput (thousands of sensor readings per second) without clogging the main blockchain. We use zero-knowledge proofs to verify these batches, ensuring correctness without revealing the underlying proprietary data.',
        category: 'Infrastructure',
        relatedIndustries: ['Energy', 'Manufacturing'],
        relatedLocations: ['Tel Aviv', 'Toronto']
    },
    {
        term: 'Multi-Party Computation',
        slug: 'mpc',
        definition: 'A cryptographic protocol where multiple parties jointly compute a function over their inputs while keeping those inputs private.',
        longDescription: 'MPC is the backbone of our "Sovereign Custody" solutions. Instead of a single private key, the key is split into shards held by different nodes (e.g., the user, the bank, and a compliance oracle). All must cooperate to sign a transaction, removing any single point of failure.',
        category: 'Security',
        relatedIndustries: ['Finance', 'Defense'],
        relatedLocations: ['New York', 'Zurich']
    },
    {
        term: 'Homomorphic Encryption',
        slug: 'homomorphic-encryption',
        definition: 'A form of encryption that permits users to perform computations on its encrypted data without first decrypting it.',
        longDescription: 'This is the "Holy Grail" for medical and privacy-sensitive data. TUC uses it to allow AI models to train on encrypted patient records. The AI learns from the data, but never actually "sees" the data, remaining 100% HIPAA compliant.',
        category: 'Security',
        relatedIndustries: ['Healthcare', 'Research'],
        relatedLocations: ['Toronto', 'Boston']
    },
    {
        term: 'Account Abstraction',
        slug: 'account-abstraction',
        definition: 'ERC-4337 standard that upgrades simple wallets into smart contract wallets with programmable logic.',
        longDescription: 'Account Abstraction removes the complexity of crypto. It allows TUC users to pay gas fees in any token (e.g., paying for a coffee with coffee tokens), recover lost accounts via social recovery, and batch transactions. It is the key to user experience parity with Web2.',
        category: 'Infrastructure',
        relatedIndustries: ['Retail', 'Gaming'],
        relatedLocations: ['San Francisco', 'London']
    },
    {
        term: 'Miner Extractable Value',
        slug: 'mev',
        definition: 'The maximum value that can be extracted from block production in excess of the standard block reward and gas fees.',
        longDescription: 'MEV is often predatory (front-running). TUC implements "Fair Ordering" protocols and "MEV-Boost" relays that capture this value and redistribute it to the protocol treasury or the users, ensuring that the infrastructure itself does not extract rent from the economy.',
        category: 'Economics',
        relatedIndustries: ['Finance', 'Trading'],
        relatedLocations: ['New York', 'Hong Kong']
    },
    {
        term: 'Data Availability Layer',
        slug: 'data-availability',
        definition: 'A specialized blockchain layer dedicated solely to storing transaction data to ensure it is retrievable.',
        longDescription: 'For industrial audit trails, data must not just be verified; it must be available forever. We utilize specialized DA layers (like Celestia or EigenDA) to store massive logs of supply chain history cheaply, while the execution happens on high-speed rollups.',
        category: 'Infrastructure',
        relatedIndustries: ['Logistics', 'Manufacturing'],
        relatedLocations: ['Austin', 'Singapore']
    },
    {
        term: 'Optimistic Oracle',
        slug: 'optimistic-oracle',
        definition: 'An oracle system that accepts data as true by default, unless challenged within a specific dispute window.',
        longDescription: 'Optimistic Oracles allow us to bring complex, subjective real-world data on-chain (e.g., "Did the shipment arrive damaged?"). The assumption of truth speeds up operations, while the "dispute bond" mechanism economically guarantees correctness.',
        category: 'Infrastructure',
        relatedIndustries: ['Insurance', 'Logistics'],
        relatedLocations: ['London', 'Rotterdam']
    },
    {
        term: 'Verifiable Delay Function',
        slug: 'vdf',
        definition: 'A function that requires a specified amount of sequential time to evaluate, but whose output can be quickly verified.',
        longDescription: 'TUC uses VDFs to generate "Unbiasable Randomness" for fair lotteries, gaming loot drops, and leader selection in our consensus protocols. It proves that time has passed and prevents manipulation of random outcomes.',
        category: 'Cryptography',
        relatedIndustries: ['Gaming', 'Governance'],
        relatedLocations: ['Tel Aviv', 'Stockholm']
    },
    {
        term: 'Trusted Execution Environment',
        slug: 'tee',
        definition: 'A secure area of a main processor (like Intel SGX) that compromises confidentiality and integrity protection.',
        longDescription: 'For scenarios where ZK-proofs are too slow, we use TEEs ("Secure Enclaves") to run private code off-chain. This allows for fast, private execution of business logic, with the results attested to on-chain.',
        category: 'Hardware',
        relatedIndustries: ['Defense', 'Cloud'],
        relatedLocations: ['Shenzhen', 'San Francisco']
    },
    {
        term: 'State Channels',
        slug: 'state-channels',
        definition: 'A technique for performing transactions off-chain, with the blockchain used only for settlement.',
        longDescription: 'State Channels are like a bar tab. Two machines can exchange millions of micro-transactions (e.g., streaming payments for bandwidth) instantly and for free. Only when they close the channel does the final balance execute on the main chain.',
        category: 'Scaling',
        relatedIndustries: ['Telecom', 'Energy'],
        relatedLocations: ['Berlin', 'Tokyo']
    },
    {
        term: 'Proto-Danksharding',
        slug: 'proto-danksharding',
        definition: 'EIP-4844 update that introduces "blobs" of data that are attached to blocks but not accessible to the EVM.',
        longDescription: 'This update drastically reduces fees for our Layer 2 rollups. It allows TUC to post massive amounts of compressed industrial data to Ethereum for cents, making high-volume use cases like logistics tracking economically viable.',
        category: 'Infrastructure',
        relatedIndustries: ['Logistics', 'Public Goods'],
        relatedLocations: ['Global']
    },
    {
        term: 'Modular Blockchain',
        slug: 'modular-blockchain',
        definition: 'A blockchain architecture that separates execution, settlement, consensus, and data availability into different layers.',
        longDescription: 'TUC does not build monolithic chains. We build modular stacks. We might use one layer for security (Ethereum), one for speed (Rollup), and one for storage (Filecoin/Arweave). This "Lego" approach allows us to custom-build the perfect chain for each industry.',
        category: 'Architecture',
        relatedIndustries: ['Enterprise', 'Tech'],
        relatedLocations: ['Austin', 'Berlin']
    },
    {
        term: 'Sovereign Rollup',
        slug: 'sovereign-rollup',
        definition: 'A rollup that publishes its transaction data to a blockchain but handles its own settlement and fork choice rules.',
        longDescription: 'For nations or large enterprises needing absolute control, we deploy Sovereign Rollups. They get the security of the public chain for data ordering, but they retain the right to upgrade or fork their own chain without asking permission from the global network.',
        category: 'Architecture',
        relatedIndustries: ['GovTech', 'Defense'],
        relatedLocations: ['Riyadh', 'Washington']
    },
    {
        term: 'Liquid Staking',
        slug: 'liquid-staking',
        definition: 'A mechanism allowing users to stake assets and receive a token representing their stake, keeping liquidity.',
        longDescription: 'TUC enables "Liquid Staking for Real Assets". You "stake" your solar panel into the grid to earn rewards, but you receive a "staked-Panel" token that you can still use as collateral for a loan. Your capital is never dead; it is always working.',
        category: 'DeFi',
        relatedIndustries: ['Energy', 'Finance'],
        relatedLocations: ['New York', 'Singapore']
    },
    {
        term: 'Restaking',
        slug: 'restaking',
        definition: 'The concept of using staked security (like ETH) to secure other protocols or services simultaneously.',
        longDescription: 'We use protocols like EigenLayer to "borrow" the security of Ethereum for our own oracle networks. This means TUC services are secured by billions of dollars of economic trust from Day 1, without needing to bootstrap our own validator set.',
        category: 'Security',
        relatedIndustries: ['Infrastructure', 'Oracle'],
        relatedLocations: ['Chicago', 'Zurich']
    },
    {
        term: 'Flash Loans',
        slug: 'flash-loans',
        definition: 'Unsecured loans that must be borrowed and repaid within the same transaction block.',
        longDescription: 'In the industrial context, Flash Loans enable "Instant Arbitrage" for supply chains. A smart contract can spot a price discrepancy in energy markets, borrow millions, rebalance the grid, and repay the loan, all in 12 seconds, optimizing efficiency without capital.',
        category: 'DeFi',
        relatedIndustries: ['Energy', 'Trading'],
        relatedLocations: ['New York', 'London']
    },
    {
        term: 'Atomic Swaps',
        slug: 'atomic-swaps',
        definition: 'A smart contract technology that enables the exchange of one cryptocurrency for another without using centralized intermediaries.',
        longDescription: 'Atomic Swaps are the engine of our cross-border trade. A factory in Japan pays in Yen-tokens, and the supplier in Germany receives Euro-tokens instantly. If either side fails, the entire transaction reverts. No counterparty risk.',
        category: 'DeFi',
        relatedIndustries: ['Trade', 'Finance'],
        relatedLocations: ['Tokyo', 'Frankfurt']
    },
    {
        term: 'Directed Acyclic Graph',
        slug: 'dag',
        definition: 'A data structure used in some distributed ledgers where transactions are linked to previous transactions rather than blocks.',
        longDescription: 'For high-frequency IoT networks (like swarm robotics), standard blocks are too slow. We use DAGs (like IOTA or Hedera) where every transaction confirms two previous ones, allowing the network to speed up as more devices join.',
        category: 'Infrastructure',
        relatedIndustries: ['IoT', 'Robotics'],
        relatedLocations: ['Berlin', 'Shenzhen']
    },
    {
        term: 'Byzantine Fault Tolerance',
        slug: 'bft',
        definition: 'The ability of a system to continue operating even if some of its components fail or act maliciously.',
        longDescription: 'BFT is the standard for our "Mission Critical" systems. A nuclear power plant grid controlled by TUC can tolerate up to 1/3rd of its sensors being hacked or destroyed and still reach a correct consensus on the state of the reactor.',
        category: 'Consensus',
        relatedIndustries: ['Energy', 'Defense'],
        relatedLocations: ['Global']
    },
    {
        term: 'Sybil Resistance',
        slug: 'sybil-resistance',
        definition: 'Mechanisms to prevent a single adversary from controlling multiple fake identities to manipulate a network.',
        longDescription: 'In our democratic implementations (Arthaneeti), Sybil Resistance is key. We use "Proof of Humanity" and "Gitcoin Passport" heuristics to ensure that every vote cast comes from a unique, living human being, preventing bot swarms from hijacking governance.',
        category: 'Identity',
        relatedIndustries: ['Governance', 'Social'],
        relatedLocations: ['Lagos', 'Tallinn']
    }
];
