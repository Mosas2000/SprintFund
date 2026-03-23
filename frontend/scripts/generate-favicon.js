const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');
const outputPath = path.join(publicDir, 'favicon.ico');

async function generateFavicon() {
  console.log('Generating favicon.ico...');
  
  const sizes = [16, 32, 48];
  const images = [];
  
  for (const size of sizes) {
    const buffer = await sharp(svgPath)
      .resize(size, size)
      .png()
      .toBuffer();
    images.push(buffer);
  }
  
  const icon16 = await sharp(svgPath).resize(16, 16).png().toBuffer();
  const icon32 = await sharp(svgPath).resize(32, 32).png().toBuffer();
  const icon48 = await sharp(svgPath).resize(48, 48).png().toBuffer();
  
  await sharp(icon32)
    .toFile(outputPath.replace('.ico', '-temp.png'));
  
  fs.renameSync(
    outputPath.replace('.ico', '-temp.png'),
    publicDir + '/favicon-32x32.png'
  );
  
  console.log('Generated favicon files');
}

generateFavicon().catch(console.error);
