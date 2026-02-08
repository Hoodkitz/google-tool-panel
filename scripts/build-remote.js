const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Nexus Control for Remote Deployment...\n');

try {
  // Check if NEXT_PUBLIC_API_URL is set
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.log('⚠️  Warning: NEXT_PUBLIC_API_URL not set!');
    console.log('   Using localhost:3000 for development.\n');
    console.log('   For production builds, set the API URL:');
    console.log('   Windows (PowerShell):');
    console.log('   $env:NEXT_PUBLIC_API_URL="http://192.109.200.35"');
    console.log('   ');
    console.log('   Linux/macOS:');
    console.log('   export NEXT_PUBLIC_API_URL="http://192.109.200.35"');
    console.log('   ');
    console.log('   Then run: npm run build:all\n');
  } else {
    console.log(`✅ API URL set to: ${apiUrl}\n`);
  }

  // Build Next.js
  console.log('📦 Building Next.js...');
  execSync('bun run build:web', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('\n📁 Output:');
  console.log('   - Web build: .next/');
  console.log('   - Static files: public/');
  console.log('\n🚀 Next steps:');
  console.log('   1. Deploy to VPS: See VPS-DEPLOY.md');
  console.log('   2. Build Desktop: npm run build:desktop');
  console.log('   3. Build Android: npm run build:android');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
