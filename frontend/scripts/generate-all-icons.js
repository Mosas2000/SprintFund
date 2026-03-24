const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

const allSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'icon-16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-32.png', size: 32 },
  { name: 'icon-48.png', size: 48 },
  { name: 'icon-72.png', size: 72 },
  { name: 'icon-96.png', size: 96 },
  { name: 'icon-128.png', size: 128 },
  { name: 'icon-144.png', size: 144 },
  { name: 'icon-152.png', size: 152 },
  { name: 'icon-180.png', size: 180 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-196.png', size: 196 },
  { name: 'icon-256.png', size: 256 },
  { name: 'icon-384.png', size: 384 },
  { name: 'icon-512.png', size: 512 },
];

async function generateAllIcons() {
  console.log('Generating all icon sizes from SVG...');
  console.log('Source:', svgPath);
  console.log('');
  
  let generated = 0;
  let skipped = 0;
  
  for (const { name, size } of allSizes) {
    const outputPath = path.join(publicDir, name);
    
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipped ${name} (already exists)`);
      skipped++;
      continue;
    }
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated ${name} (${size}x${size})`);
      generated++;
    } catch (error) {
      console.error(`❌ Failed to generate ${name}:`, error.message);
    }
  }
  
  console.log('');
  console.log(`Summary: ${generated} generated, ${skipped} skipped`);
  console.log('All icons processed successfully!');
}

if (require.main === module) {
  generateAllIcons().catch(console.error);
}

module.exports = { generateAllIcons };
