console.log('Testing backend startup...');
console.log('Current directory:', __dirname);
console.log('Node version:', process.version);
console.log('Files in directory:', require('fs').readdirSync('.'));
console.log('Test completed successfully!');
