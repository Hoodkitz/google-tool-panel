const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a temporary next.config for static export
const configPath = path.join(process.cwd(), 'next.config.ts');
const backupConfigPath = path.join(process.cwd(), 'next.config.ts.backup');

try {
  // Backup original config
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupConfigPath);
  }

  // Create static export config (without headers for export mode)
  const staticConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`;

  fs.writeFileSync(configPath, staticConfig);

  // Run the build using bun
  console.log('Building Next.js for static export...');
  console.log('⚠️  Note: API routes will be static in this build. For full functionality, use the web version with a server.');
  execSync('bun run build:web', { stdio: 'inherit' });

  console.log('\n✅ Static build complete! Output in /out directory');
  console.log('ℹ️  Note: Some features may not work in the static build (API routes, server-side rendering)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore original config
  if (fs.existsSync(backupConfigPath)) {
    fs.copyFileSync(backupConfigPath, configPath);
    fs.unlinkSync(backupConfigPath);
  }
}
