// VAPI Integration using direct SDK approach
class VAPIIntegration {
    constructor() {
        this.publicKey = window.Config?.VAPI_PUBLIC_KEY || '';
        this.assistantId = window.Config?.VAPI_ASSISTANT_ID || '';
        this.vapi = null;
    }

    async initialize() {
        // Dynamically load VAPI SDK from unpkg
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@vapi-ai/web@latest/dist/vapi.js';
            script.onload = () => {
                console.log('VAPI SDK loaded');
                resolve();
            };
            script.onerror = (error) => {
                console.error('Failed to load VAPI SDK:', error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    async startCall() {
        try {
            // Import Vapi from the loaded script
            if (!window.Vapi) {
                throw new Error('VAPI SDK not loaded');
            }

            // Create VAPI instance
            this.vapi = new window.Vapi(this.publicKey);

            // Set up event listeners before starting
            this.vapi.on('call-start', () => {
                console.log('Call started successfully');
            });

            this.vapi.on('call-end', () => {
                console.log('Call ended');
            });

            this.vapi.on('error', (error) => {
                console.error('VAPI error:', error);
            });

            // Start the call with assistant ID
            await this.vapi.start(this.assistantId);
            
            return true;
        } catch (error) {
            console.error('Failed to start VAPI call:', error);
            throw error;
        }
    }

    endCall() {
        if (this.vapi) {
            this.vapi.stop();
        }
    }
}

// Export for use
window.VAPIIntegration = VAPIIntegration;