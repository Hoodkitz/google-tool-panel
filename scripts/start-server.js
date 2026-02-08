const { spawn } = require('child_process');
const path = require('path');

// Start the Next.js server
const serverPath = path.join(__dirname, '../.next/standalone/server.js');
const port = process.env.PORT || 3000;

console.log(`Starting Nexus Control Server on port ${port}...`);

const server = spawn('node', [serverPath, port], {
  cwd: path.join(__dirname, '../.next/standalone'),
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Keep the process alive
process.on('SIGINT', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});
