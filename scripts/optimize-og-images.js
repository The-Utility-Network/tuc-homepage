const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_TO_OPTIMIZE = [
    { src: 'public/artifacts/tucbg.png', dest: 'tuc_og.jpg' },
    { src: 'public/artifacts/arbg.png', dest: 'arthaneeti_og.jpg' },
    { src: 'public/artifacts/cornucopia_bg.png', dest: 'cornucopia_og.jpg' },
    { src: 'public/artifacts/dbbg.png', dest: 'digibazaar_og.jpg' },
    { src: 'public/artifacts/elysium_bg.png', dest: 'elysium_og.jpg' },
    { src: 'public/artifacts/ledgerbg.png', dest: 'ledger1_og.jpg' },
    { src: 'public/artifacts/tlnbg.png', dest: 'lochness_og.jpg' },
    { src: 'public/osiris/heroart.png', dest: 'osiris_og.jpg' },
    { src: 'public/artifacts/requiem_bg.png', dest: 'requiem_og.jpg' },
    { src: 'public/artifacts/tglbg.png', dest: 'graine_og.jpg' },
    { src: 'public/artifacts/vulcanbg.png', dest: 'vulcan_og.jpg' },
];

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImages() {
    console.log('Starting OG image optimization...');

    for (const image of IMAGES_TO_OPTIMIZE) {
        const inputPath = path.join(process.cwd(), image.src);
        const outputPath = path.join(OUTPUT_DIR, image.dest);

        if (!fs.existsSync(inputPath)) {
            console.warn(`Warning: Source image not found: ${inputPath}`);
            continue;
        }

        try {
            await sharp(inputPath)
                .resize(1200, 630, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({
                    quality: 80,
                    mozjpeg: true
                })
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`✅ Optimized ${image.dest}: ${sizeKB}KB`);
        } catch (error) {
            console.error(`❌ Error optimizing ${image.src}:`, error);
        }
    }

    console.log('Optimization complete!');
}

optimizeImages();
