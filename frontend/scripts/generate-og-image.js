const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'og-image.svg');
const outputPath = path.join(publicDir, 'og-image.png');

async function generateOgImage() {
  console.log('Generating og-image.png...');
  
  await sharp(svgPath)
    .resize(1200, 630)
    .png()
    .toFile(outputPath);
  
  console.log('Generated og-image.png (1200x630)');
}

generateOgImage().catch(console.error);
