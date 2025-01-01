class TerminalEmulator {
    constructor() {
        this.init();
        this.commandHistory = [];
        this.historyIndex = -1;
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clearTerminal(),
            time: () => this.showTime(),
            weather: () => this.getWeather(),
            system: () => this.showSystemStatus(),
            ai: () => this.activateAI(),
            widgets: () => this.listWidgets(),
            // Add more commands
        };
    }

    init() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.terminal-output');
        this.input = document.querySelector('.terminal-input');
        
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        this.showWelcome();
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const cmd = this.input.value.trim();
            this.executeCommand(cmd);
            this.commandHistory.push(cmd);
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        }
    }

    executeCommand(cmd) {
        const [command, ...args] = cmd.split(' ');
        
        this.print(`> ${cmd}`);
        
        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.print(`Command not found: ${command}`);
        }
    }

    print(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    // ... implement other terminal methods
}
