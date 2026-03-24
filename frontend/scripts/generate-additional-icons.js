const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

const additionalSizes = [
  { name: 'icon-180.png', size: 180 },
  { name: 'icon-196.png', size: 196 },
  { name: 'icon-256.png', size: 256 },
  { name: 'favicon-16x16.png', size: 16 },
];

async function generateAdditionalIcons() {
  console.log('Generating additional icon sizes...');
  
  for (const { name, size } of additionalSizes) {
    const outputPath = path.join(publicDir, name);
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }
  
  console.log('Additional icons generated successfully!');
}

generateAdditionalIcons().catch(console.error);
