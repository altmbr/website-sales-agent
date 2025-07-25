// Simple build script to inject environment variables
const fs = require('fs');
require('dotenv').config();

const configTemplate = `// Configuration - injected at build time
window.Config = {
    VAPI_PUBLIC_KEY: '${process.env.VAPI_PUBLIC_KEY}',
    VAPI_ASSISTANT_ID: '${process.env.VAPI_ASSISTANT_ID}'
};`;

fs.writeFileSync('config.js', configTemplate);
console.log('Config built successfully');