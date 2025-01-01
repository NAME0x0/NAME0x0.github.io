class AIInterface {
    constructor() {
        this.inputField = document.querySelector('.search-bar');
        this.responseArea = document.querySelector('#aiResponse');
        this.voiceButton = document.querySelector('.voice-btn');
        this.contextMemory = [];
        this.setupCLIInput();
        this.initializeAIPersonality();
        this.initializeListeners();
    }

    setupCLIInput() {
        this.inputField.classList.add('cli-input');
        this.inputField.addEventListener('input', (e) => {
            const input = e.target.value;
            if (input.startsWith('/')) {
                this.showCommandSuggestions(input);
            }
        });

        // Command history navigation
        let historyIndex = -1;
        const history = [];

        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    this.inputField.value = history[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autoCompleteCommand();
            }
        });
    }

    initializeAIPersonality() {
        this.personality = {
            name: 'AVA',
            traits: ['helpful', 'efficient', 'precise'],
            responses: {
                greeting: [
                    "At your service, Mr. Afsah.",
                    "How may I assist you today?",
                    "I'm analyzing your request..."
                ]
            }
        };
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

    async processInput(input) {
        if (input.startsWith('/')) {
            this.executeCommand(input.slice(1));
            return;
        }

        // Natural language processing
        const response = await this.analyzeAndRespond(input);
        this.updateInterface(response);
        this.contextMemory.push({ input, response, timestamp: Date.now() });
    }

    async analyzeAndRespond(input) {
        // Simulate AI processing with visual feedback
        this.showThinking();
        
        // Analyze intent and context
        const intent = this.analyzeIntent(input);
        const context = this.getRelevantContext(input);
        
        // Generate appropriate response
        return this.generateResponse(intent, context);
    }

    showThinking() {
        const thoughts = [
            'Analyzing context...',
            'Processing request...',
            'Searching knowledge base...',
            'Formulating response...'
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            this.updateStatus(thoughts[i]);
            i = (i + 1) % thoughts.length;
        }, 500);

        return () => clearInterval(interval);
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
