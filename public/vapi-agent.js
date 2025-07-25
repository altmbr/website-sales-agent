// VAPI Voice Agent Integration using SDK
(function (d, t) {
    var g = document.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    
    g.onload = function () {
        console.log('VAPI SDK script loaded, waiting for vapiSDK...');
        
        // Wait for vapiSDK to be available
        function checkVapiSDK() {
            if (window.vapiSDK && window.vapiSDK.run) {
                console.log('vapiSDK is ready');
                initializeVAPIAgent();
            } else {
                setTimeout(checkVapiSDK, 100);
            }
        }
        
        function initializeVAPIAgent() {
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
                    
                    // Initialize VAPI SDK with default UI
                    this.vapi = window.vapiSDK.run({
                        apiKey: this.publicKey,
                        workflowId: this.workflowId,
                        config: {
                            hideButton: false  // Show VAPI's button after we trigger it
                        }
                    });
                    
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
                    
                    // Start the call automatically
                    setTimeout(() => {
                        this.vapi.start();
                    }, 100);
                    
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
            console.log('VAPIAgent class defined');
        }
        
        // Start checking for vapiSDK
        checkVapiSDK();
    };
})(document, "script");