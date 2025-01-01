class Terminal {
    constructor() {
        this.init();
        this.inputHistory = [];
        this.historyIndex = -1;
        
        this.customCommands = {
            clear: () => this.clear(),
            help: () => this.showHelp(),
            history: () => this.showHistory()
        };
    }

    init() {
        this.container = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.terminal-input');
        this.prompt = document.querySelector('.terminal-prompt');
        
        this.setupEventListeners();
        this.showWelcome();
    }

    async processCommand(input) {
        this.addToHistory(input);
        this.print(`> ${input}`, 'command');

        if (this.customCommands[input]) {
            this.customCommands[input]();
            return;
        }

        const response = await window.AVA.processInput(input);
        this.handleResponse(response);
    }

    handleResponse(response) {
        if (response.type === 'error') {
            this.print(response.message, 'error');
            if (response.suggestions) {
                this.print('Did you mean:', 'hint');
                response.suggestions.forEach(s => this.print(`  ${s}`, 'suggestion'));
            }
            return;
        }

        this.print(response.message, response.type || 'success');
    }

    // ... rest of terminal methods
}
