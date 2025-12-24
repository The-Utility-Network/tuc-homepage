
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = path.join(__dirname, '../public/artifacts');
const OG_OUT_DIR = path.join(__dirname, '../public/og-images');

if (!fs.existsSync(OG_OUT_DIR)) {
  fs.mkdirSync(OG_OUT_DIR, { recursive: true });
}

// Map source filename (in artifacts) to output filename (in og-images)
const JOBS = [
  { src: 'creative_revolution_bg.png', dest: 'our_model_og.jpg' },
  { src: 'cornucopia_bg.png', dest: 'cornucopia_og.jpg' },
  { src: 'elysium_bg.png', dest: 'elysium_og.jpg' },
  { src: 'requiem_bg.png', dest: 'requiem_og.jpg' },
  { src: 'vulcanbg.png', dest: 'vulcan_og.jpg' },
  { src: 'dbbg.png', dest: 'digibazaar_og.jpg' },
  { src: 'ledgerbg.png', dest: 'ledger1_og.jpg' },
  { src: 'tlnbg.png', dest: 'lochness_og.jpg' },
  { src: 'osiris_og.jpg', dest: 'osiris_og.jpg', isOgSource: true }, // Already in OG dir but ensure optimized? No, source is likely artifacts/something or just verify existence.
  // Actually osiris_og.jpg exists in og-images. Let's assume the ones in og-images are good IF they are small.
  // But let's regenerate them from high-res if we can find them, to be safe.
  // "osiris_og.jpg" is in og-images... where is the source? 
  // Checking list_dir... there isn't an obvious "osiris" bg in artifacts.
  // Let's stick to the ones we clearly saw in artifacts that are HUGE.

  { src: 'the_refrain_bg.png', dest: 'podcasts_og.jpg' },
  { src: 'arbg.png', dest: 'arthaneeti_og.jpg' },
  { src: 'tglbg.png', dest: 'graine_og.jpg' },
];

async function processImages() {
  console.log('Starting OG Image Optimization...');

  for (const job of JOBS) {
    const srcPath = path.join(ARTIFACTS_DIR, job.src);
    const destPath = path.join(OG_OUT_DIR, job.dest);

    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️ Source not found: ${job.src} (Skipping)`);
      continue;
    }

    try {
      const stats = fs.statSync(srcPath);
      console.log(`Processing ${job.src} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

      await sharp(srcPath)
        .resize(1200, 630, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .toFile(destPath);

      const newStats = fs.statSync(destPath);
      console.log(`✅ Created ${job.dest} (${(newStats.size / 1024).toFixed(2)} KB)`);
    } catch (err) {
      console.error(`❌ Failed to process ${job.src}:`, err);
    }
  }

  // Medallions
  const MEDALLION_JOBS = [
    { src: 'AR.png', dest: 'AR_opt.png' },
    { src: 'CornucopiaRobotics.png', dest: 'CornucopiaRobotics_opt.png' },
    { src: 'DigiBazaarMedallion.png', dest: 'DigiBazaarMedallion_opt.png' },
    { src: 'Elysium.png', dest: 'Elysium_opt.png' },
    { src: 'GlobalStorage.png', dest: 'GlobalStorage_opt.png' },
    { src: 'IE.png', dest: 'IE_opt.png' },
    { src: 'Ledger1.png', dest: 'Ledger1_opt.png' },
    { src: 'MKVLI.png', dest: 'MKVLI_opt.png' },
    { src: 'OP.png', dest: 'OP_opt.png' },
    { src: 'RE.png', dest: 'RE_opt.png' },
    { src: 'Symbol.png', dest: 'Symbol_opt.png' },
    { src: 'TGL.png', dest: 'TGL_opt.png' },
    { src: 'TLN.png', dest: 'TLN_opt.png' },
    { src: 'TSPAum1.png', dest: 'TSPAum1_opt.png' },
    { src: 'TUC.png', dest: 'TUC_opt.png' },
    { src: 'VulcanForge2.png', dest: 'VulcanForge2_opt.png' },
    { src: 'creative_revolution_medallion.png', dest: 'our_model_medallion_opt.png' },
    { src: 'the_refrain_medallion.png', dest: 'the_refrain_medallion_opt.png' },
  ];

  const MEDALLIONS_DIR = path.join(__dirname, '../public/Medallions');

  console.log('Starting Medallion Optimization...');
  for (const job of MEDALLION_JOBS) {
    const srcPath = path.join(MEDALLIONS_DIR, job.src);
    const destPath = path.join(MEDALLIONS_DIR, job.dest);

    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️ Source not found: ${job.src} (Skipping)`);
      continue;
    }

    try {
      const stats = fs.statSync(srcPath);
      console.log(`Processing ${job.src} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

      await sharp(srcPath)
        .resize(500, 500, {
          fit: 'inside',
        })
        .png({
          quality: 80,
          compressionLevel: 9,
          palette: true
        })
        .toFile(destPath);

      const newStats = fs.statSync(destPath);
      console.log(`✅ Created ${job.dest} (${(newStats.size / 1024).toFixed(2)} KB)`);

    } catch (err) {
      console.error(`❌ Failed to process ${job.src}:`, err);
    }
  }

  console.log('Done.');
}

processImages();
