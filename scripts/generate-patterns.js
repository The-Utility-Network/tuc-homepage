// Script to generate dense Game of Life SVG patterns
// Run with: node scripts/generate-patterns.js

const fs = require('fs');
const path = require('path');

const PATTERNS_DIR = path.join(__dirname, '..', 'public', 'patterns');

// Ensure patterns directory exists
if (!fs.existsSync(PATTERNS_DIR)) {
    fs.mkdirSync(PATTERNS_DIR, { recursive: true });
}

// Theme configurations for each page
const themes = {
    'stitch-tuc': {
        bg: '#0a0a0a',
        colors: ['#10B981', '#3B82F6', '#A855F7', '#38BDF8', '#F97316'],
        seed: 42
    },
    'stitch-arthaneeti': {
        bg: '#0a0a0a',
        colors: ['#3B82F6', '#60A5FA', '#1D4ED8', '#38BDF8', '#6366F1'],
        seed: 101
    },
    'stitch-cornucopia': {
        bg: '#0a0a0a',
        colors: ['#EC4899', '#10B981', '#BE185D', '#34D399', '#F472B6'],
        seed: 202
    },
    'stitch-digibazaar': {
        bg: '#0a0a0a',
        colors: ['#EF4444', '#F59E0B', '#DC2626', '#FBBF24', '#F97316'],
        seed: 303
    },
    'stitch-elysium': {
        bg: '#000000',
        colors: ['#f54029', '#EF4444', '#DC2626', '#F87171', '#FB923C'],
        seed: 404
    },
    'stitch-ledger1': {
        bg: '#0a0a0a',
        colors: ['#DC2626', '#A855F7', '#F87171', '#C084FC', '#EF4444'],
        seed: 505
    },
    'stitch-lochness': {
        bg: '#052e16',
        colors: ['#2ECC71', '#A7F3D0', '#0EA5E9', '#34D399', '#10B981'],
        seed: 606
    },
    'stitch-osiris': {
        bg: '#0a0a0a',
        colors: ['#A855F7', '#38BDF8', '#6B21A8', '#22D3EE', '#C084FC'],
        seed: 707
    },
    'stitch-ourmodel': {
        bg: '#022c22',
        colors: ['#10B981', '#FCD34D', '#059669', '#FBBF24', '#34D399'],
        seed: 808
    },
    'stitch-requiem': {
        bg: '#1a1805',
        colors: ['#FFD700', '#60A5FA', '#FDE047', '#3B82F6', '#FBBF24'],
        seed: 909
    },
    'stitch-graine': {
        bg: '#2e1005',
        colors: ['#F97316', '#FDBA74', '#EA580C', '#FB923C', '#C2410C'],
        seed: 1010
    },
    'stitch-vulcan': {
        bg: '#1c1917',
        colors: ['#F97316', '#525252', '#FDBA74', '#78716C', '#EA580C'],
        seed: 1111
    }
};

// Seeded random number generator
function seededRandom(seed) {
    let s = seed;
    return function () {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
}

// Generate SVG pattern
function generatePattern(name, config) {
    const width = 1200;
    const height = 630;
    const cellSpacing = 30; // Grid spacing
    const cellRadius = 3;

    const random = seededRandom(config.seed);

    let circles = '';

    // Generate dense grid of dots
    for (let y = 15; y < height; y += cellSpacing) {
        for (let x = 15; x < width; x += cellSpacing) {
            // Game of Life-like probability - vary by position
            const probability = 0.4 + Math.sin(x * 0.01) * 0.1 + Math.cos(y * 0.015) * 0.1;

            if (random() < probability) {
                const color = config.colors[Math.floor(random() * config.colors.length)];
                const opacity = (0.3 + random() * 0.5).toFixed(2);

                // Small jitter for organic feel
                const jitterX = (random() - 0.5) * 8;
                const jitterY = (random() - 0.5) * 8;

                circles += `    <circle cx="${(x + jitterX).toFixed(1)}" cy="${(y + jitterY).toFixed(1)}" r="${cellRadius}" fill="${color}" opacity="${opacity}"/>\n`;
            }
        }
    }

    // Create wave line path
    const wavePath = `M0 ${height / 2} Q${width * 0.25} ${height * 0.4} ${width * 0.5} ${height / 2} T${width} ${height / 2}`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${config.bg}"/>
  <!-- Wave overlay -->
  <path d="${wavePath}" stroke="#4B5563" stroke-width="1" fill="none" opacity="0.3"/>
  <!-- Game of Life cells -->
  <g>
${circles}  </g>
</svg>`;

    return svg;
}

// Generate all patterns
Object.entries(themes).forEach(([name, config]) => {
    const svg = generatePattern(name, config);
    const filePath = path.join(PATTERNS_DIR, `${name}.svg`);
    fs.writeFileSync(filePath, svg);
    console.log(`Generated: ${filePath}`);
});

console.log('\nAll patterns generated successfully!');
