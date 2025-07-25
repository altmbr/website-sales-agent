// Wait for VAPI SDK to load and initialize agent
let vapiAgent = null;

// Check for VAPIAgent availability
function waitForVAPI() {
    if (window.VAPIAgent && window.Vapi) {
        vapiAgent = new window.VAPIAgent();
        console.log('VAPI Agent initialized');
    } else {
        setTimeout(waitForVAPI, 100);
    }
}

// Start waiting for VAPI
waitForVAPI();

// DOM elements
const callBubble = document.getElementById('callBubble');
const answerBtn = document.getElementById('answerCall');
const declineBtn = document.getElementById('declineCall');

// Show call bubble after 5 seconds
setTimeout(() => {
    callBubble.classList.remove('hidden');
    callBubble.classList.add('show');
}, 5000);

// Answer call
answerBtn.addEventListener('click', async () => {
    if (!vapiAgent) {
        alert('Voice agent is still loading. Please try again in a moment.');
        return;
    }
    
    // Hide our notification
    callBubble.classList.add('hidden');
    
    try {
        // Initialize and start VAPI with its native UI
        await vapiAgent.createWebCall();
        // VAPI will handle all UI from here
    } catch (error) {
        console.error('Failed to start call:', error);
        alert('Failed to start call. Please check your microphone permissions.');
    }
});

// Decline call
declineBtn.addEventListener('click', () => {
    callBubble.classList.add('hidden');
});

