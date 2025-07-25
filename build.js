// Simple build script to inject environment variables
const fs = require('fs');
const path = require('path');

// Create public directory
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Copy all files to public directory
const files = ['index.html', 'styles.css', 'script.js', 'vapi-agent.js', 'vapi-integration.js', 'call-ux-analysis.md'];
files.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join('public', file));
    }
});

// Generate config.js with environment variables
const configTemplate = `// Configuration - injected at build time
window.Config = {
    VAPI_PUBLIC_KEY: '${process.env.VAPI_PUBLIC_KEY}',
    VAPI_ASSISTANT_ID: '${process.env.VAPI_ASSISTANT_ID}'
};`;

fs.writeFileSync(path.join('public', 'config.js'), configTemplate);
console.log('Build completed successfully');