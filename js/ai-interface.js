class AIInterface {
    constructor() {
        this.inputField = document.querySelector('.search-bar');
        this.responseArea = document.querySelector('#aiResponse');
        this.voiceButton = document.querySelector('.voice-btn');
        this.initializeListeners();
    }

    initializeListeners() {
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processInput(e.target.value);
            }
        });

        this.voiceButton.addEventListener('click', () => {
            this.activateVoiceInput();
        });
    }

    processInput(input) {
        // Show processing state
        this.showProcessing();
        
        // Simple command processing
        if (input.toLowerCase().includes('weather')) {
            this.respondTo('Fetching weather data...');
        } else if (input.toLowerCase().includes('calendar')) {
            this.respondTo('Checking your schedule...');
        } else {
            this.respondTo('Processing your request...');
        }

        // Clear input
        this.inputField.value = '';
    }

    showProcessing() {
        this.responseArea.innerHTML = `
            <span class="response-text">Processing...</span>
            <div class="response-visualizer active"></div>
        `;
    }

    respondTo(message) {
        this.responseArea.innerHTML = `
            <span class="response-text">${message}</span>
            <div class="response-visualizer"></div>
        `;
    }

    activateVoiceInput() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                this.voiceButton.classList.add('listening');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.inputField.value = transcript;
                this.processInput(transcript);
            };

            recognition.onend = () => {
                this.voiceButton.classList.remove('listening');
            };

            recognition.start();
        } else {
            this.respondTo('Voice recognition is not supported in this browser.');
        }
    }
}

// Initialize AI Interface
const ai = new AIInterface();
