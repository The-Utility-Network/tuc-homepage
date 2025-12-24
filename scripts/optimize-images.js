
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(process.cwd(), 'public');

const jobs = [
    {
        input: path.join(publicDir, 'artifacts', 'creative_revolution_bg.png'),
        output: path.join(publicDir, 'artifacts', 'creative_revolution_bg_opt.png'),
        width: 1200,
        height: 630,
        fit: 'cover'
    },
    {
        input: path.join(publicDir, 'artifacts', 'the_refrain_bg.png'),
        output: path.join(publicDir, 'artifacts', 'the_refrain_bg_opt.png'),
        width: 1200,
        height: 630,
        fit: 'cover'
    },
    {
        input: path.join(publicDir, 'Medallions', 'creative_revolution_medallion.png'),
        output: path.join(publicDir, 'Medallions', 'creative_revolution_medallion_opt.png'),
        width: 600,
        height: 600,
        fit: 'inside'
    },
    {
        input: path.join(publicDir, 'Medallions', 'the_refrain_medallion.png'),
        output: path.join(publicDir, 'Medallions', 'the_refrain_medallion_opt.png'),
        width: 600,
        height: 600,
        fit: 'inside'
    }
];

async function run() {
    console.log('Starting image optimization...');

    for (const job of jobs) {
        if (!fs.existsSync(job.input)) {
            console.error(`Input file not found: ${job.input}`);
            continue;
        }

        try {
            console.log(`Processing ${path.basename(job.input)}...`);
            await sharp(job.input)
                .resize({
                    width: job.width,
                    height: job.height,
                    fit: job.fit
                })
                .toFile(job.output);

            // Replace original with optimized (user's request was to fix the assets)
            // Or maybe keep _opt and update code?
            // Safer to update code to point to _opt if we want to preserve original, 
            // BUT simpler to just overwrite if we are confident.
            // Let's overwrite for simplicity as the user specifically asked to "make them into og resolution".
            // Actually, let's keep _opt and update the code. It avoids data loss.
            console.log(`Saved to ${path.basename(job.output)}`);
        } catch (error) {
            console.error(`Error processing ${path.basename(job.input)}:`, error);
        }
    }
    console.log('Done.');
}

run();
