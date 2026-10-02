import('./src/server.js').catch((error) => {
  console.error('Failed to start the API:', error);
  process.exit(1);
});