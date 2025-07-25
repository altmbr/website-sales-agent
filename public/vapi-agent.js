// VAPI Voice Agent Integration using SDK
(function (d, t) {
    var g = document.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = "https://unpkg.com/@vapi-ai/web@2.2.6/dist/vapi.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    
    g.onload = function () {
        // Initialize VAPI with your credentials
        window.vapiInstance = null;
        
        window.VAPIAgent = class {
            constructor() {
                this.publicKey = window.Config?.VAPI_PUBLIC_KEY || '';
                this.workflowId = window.Config?.VAPI_WORKFLOW_ID || '';
                this.vapi = null;
                this.isCallActive = false;
            }
            
            async createWebCall() {
                try {
                    console.log('Creating VAPI call with:', {
                        publicKey: this.publicKey,
                        workflowId: this.workflowId
                    });
                    
                    // Check if Vapi constructor is available
                    if (!window.Vapi) {
                        throw new Error('VAPI SDK not loaded. Please try again.');
                    }
                    
                    // Initialize VAPI SDK with public key
                    this.vapi = new window.Vapi(this.publicKey);
                    
                    // Check if vapi was created successfully
                    if (!this.vapi) {
                        throw new Error('VAPI instance was not created');
                    }
                    
                    // Set up event listeners
                    this.vapi.on('call-start', () => {
                        console.log('VAPI call started');
                        this.isCallActive = true;
                    });
                    
                    this.vapi.on('call-end', () => {
                        console.log('VAPI call ended');
                        this.isCallActive = false;
                    });
                    
                    this.vapi.on('speech-start', () => {
                        console.log('User started speaking');
                    });
                    
                    this.vapi.on('speech-end', () => {
                        console.log('User stopped speaking');
                    });
                    
                    this.vapi.on('message', (message) => {
                        console.log('VAPI message:', message);
                    });
                    
                    this.vapi.on('error', (error) => {
                        console.error('VAPI error:', error);
                        // Don't throw here, just log
                    });
                    
                    // Start the call with workflow ID
                    console.log('Starting VAPI call with workflow ID:', this.workflowId);
                    await this.vapi.start(this.workflowId);
                    
                    return { success: true };
                } catch (error) {
                    console.error('Failed to create web call:', error);
                    throw error;
                }
            }
            
            toggleMute() {
                if (this.vapi) {
                    const currentMuted = this.vapi.isMuted();
                    this.vapi.setMuted(!currentMuted);
                    return !currentMuted;
                }
                return false;
            }
            
            async endCall() {
                if (this.vapi) {
                    this.vapi.stop();
                    this.isCallActive = false;
                }
            }
            
            async getCallStatus() {
                return {
                    status: this.isCallActive ? 'active' : 'ended',
                    duration: 0 // SDK doesn't provide duration directly
                };
            }
        };
        
        // Make VAPIAgent available globally
        window.VAPIAgent = window.VAPIAgent;
    };
})(document, "script");