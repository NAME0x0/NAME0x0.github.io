/**
 * Terminal Widget
 * Creates an interactive terminal widget as an Easter egg
 * Provides useful commands and system information
 */

if (typeof window.Terminal === 'undefined') {
  class Terminal {
    constructor() {
      this.terminalEl = document.getElementById('quantum-terminal');
      this.outputEl = document.getElementById('terminal-output');
      this.inputEl = document.getElementById('terminal-input');
      this.isActive = false;
      this.history = [];
      this.historyIndex = -1;
      this.commands = {};
      this.konamiIndex = 0;
    }
    
    init() {
      if (!this.terminalEl || !this.outputEl || !this.inputEl) {
        console.error("Terminal elements not found. Terminal will not initialize.");
        return;
      }

      this.registerCommands();
      
      this.inputEl.addEventListener('keydown', (e) => this.handleInput(e));
      document.addEventListener('keydown', (e) => this.handleKeyboardShortcut(e));
      
      const minimizeButton = this.terminalEl.querySelector('.minimize-terminal');
      const closeButton = this.terminalEl.querySelector('.close-terminal');
      
      if (minimizeButton) minimizeButton.addEventListener('click', () => this.toggleTerminal());
      if (closeButton) closeButton.addEventListener('click', () => this.hideTerminal());
      
      document.addEventListener('preloaderComplete', () => {
        setTimeout(() => {
          this.initializeTerminalDisplay();
        }, 2000);
      });
    }
    
    registerCommands() {
      this.commands = {
        help: () => this.showHelp(),
        clear: () => this.clearTerminal(),
        cls: () => this.clearTerminal(),
        date: () => this.showDate(),
        time: () => this.showTime(),
        echo: (args) => this.echo(args),
        about: () => this.showAbout(),
        contact: () => this.showContact(),
        projects: () => this.showProjects(),
        skills: () => this.showSkills(),
        weather: (args) => this.showWeather(args),
        google: (args) => this.searchGoogle(args),
        perplexity: (args) => this.searchPerplexity(args),
        github: () => this.openGitHub(),
        navigate: (args) => this.navigateToSection(args),
        system: () => this.showSystemInfo(),
        matrix: () => this.showMatrix(),
        exit: () => this.hideTerminal(),
        hello: () => this.greet(),
        hi: () => this.greet(),
        hey: () => this.greet(),
        status: () => this.showSystemStatus(),
        credits: () => this.showCredits()
      };
    }
    
    initializeTerminalDisplay() {
      // Clear any previous initial messages if re-toggled without full refresh
      // this.outputEl.innerHTML = ''; // Optional: if you want to clear on every showTerminal if it's empty
      
      const welcomeMessages = [
        { text: 'AVA Quantum Terminal v4.7.2', type: 'system', delay: 100 },
        { text: 'Establishing secure connection to core systems...', type: 'system', delay: 600 },
        { text: 'Connection established. Quantum encryption active.', type: 'success', delay: 1200 },
        { text: 'Type "help" for a list of available commands.', type: 'system', delay: 1700 },
        { text: 'Initializing user interface enhancements...', type: 'system', delay: 2200 },
        { text: 'Terminal ready.', type: 'info', delay: 2700 },
        { text: '', type: 'spacer', delay: 2800 }
      ];

      welcomeMessages.forEach(msg => {
        setTimeout(() => {
          // Only add if terminal is still active and output is empty or has only initial message structure
          // This prevents re-adding messages if user closes and reopens terminal quickly
          if (this.isActive) {
             this.addOutput(msg.text, msg.type);
          }
        }, msg.delay);
      });
    }
    
    toggleTerminal() {
      if (!this.terminalEl) return;
      if (this.isActive) {
        this.hideTerminal();
      } else {
        this.showTerminal();
      }
    }
    
    showTerminal() {
      if (!this.terminalEl || !this.inputEl) return;
      this.terminalEl.classList.add('active');
      this.isActive = true;

      // If terminal output is empty, run the welcome sequence
      if (this.outputEl && this.outputEl.children.length === 0) {
        this.initializeTerminalDisplay();
      }
      
      setTimeout(() => {
        this.inputEl.focus();
      }, 300);
    }
    
    hideTerminal() {
      if (!this.terminalEl) return;
      this.terminalEl.classList.remove('active');
      this.isActive = false;
    }
    
    handleKeyboardShortcut(e) {
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        this.toggleTerminal();
      }
      
      const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      if (e.key.toLowerCase() === konamiSequence[this.konamiIndex].toLowerCase()) {
        this.konamiIndex++;
        if (this.konamiIndex === konamiSequence.length) {
          this.konamiIndex = 0;
          this.showTerminal();
          this.addOutput('Initiating advanced diagnostic mode... Access granted.', 'success');
        }
      } else {
        this.konamiIndex = 0;
      }
    }
    
    handleInput(e) {
      if (!this.inputEl) return;
      if (e.key === 'Enter') {
        const commandText = this.inputEl.value.trim();
        
        if (commandText) {
          this.history.push(commandText);
          this.historyIndex = this.history.length;
          
          this.addOutput(`ava@NAME0x0:~$ ${commandText}`, 'command');
          
          this.processCommand(commandText);
          
          this.inputEl.value = '';
        }
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.history[this.historyIndex];
          this.inputEl.setSelectionRange(this.inputEl.value.length, this.inputEl.value.length);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex];
          this.inputEl.setSelectionRange(this.inputEl.value.length, this.inputEl.value.length);
        } else {
          this.historyIndex = this.history.length;
          this.inputEl.value = '';
        }
      }
      
      if (e.key === 'Tab') {
        e.preventDefault();
        this.autoCompleteCommand();
      }
    }
    
    processCommand(commandStr) {
      const parts = commandStr.split(' ');
      const commandName = parts[0].toLowerCase();
      const args = parts.slice(1).join(' ');
      
      if (this.commands[commandName]) {
        try {
            const result = this.commands[commandName](args);
            if (result instanceof Promise) {
                result.catch(error => {
                    this.addOutput(`Error executing ${commandName}: ${error.message || error}`, 'error');
                });
            }
        } catch (error) {
            this.addOutput(`Error in command ${commandName}: ${error.message || error}`, 'error');
        }
      } else {
        this.addOutput(`Command not found: ${commandName}. Type "help" for syntax.`, 'error');
      }
    }
    
    autoCompleteCommand() {
      if (!this.inputEl) return;
      const currentInput = this.inputEl.value.toLowerCase();
      
      if (currentInput) {
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(currentInput));
        
        if (matches.length === 1) {
          this.inputEl.value = matches[0];
        } else if (matches.length > 1) {
          this.addOutput(`ava@NAME0x0:~$ ${currentInput}`, 'command');
          this.addOutput('Possible commands:', 'system');
          matches.forEach(match => {
            this.addOutput(`  ${match}`, 'system');
          });
        }
      }
    }
    
    addOutput(text, type = 'text') {
      if (!this.outputEl) return;
      const line = document.createElement('div');
      line.className = `terminal-line ${type}`;
      
      // Handle empty text or spacers directly
      if (!text || text.trim() === '') {
        line.innerHTML = '&nbsp;'; // Use &nbsp; for spacer to maintain line height
        this.outputEl.appendChild(line);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
        return;
      }

      this.outputEl.appendChild(line);

      let i = 0;
      const speed = 20; // Milliseconds per character

      // Prevent input while typing output
      if (this.inputEl) this.inputEl.disabled = true;

      const typeCharacter = () => {
        if (i < text.length) {
          line.textContent += text.charAt(i);
          i++;
          this.outputEl.scrollTop = this.outputEl.scrollHeight;
          setTimeout(typeCharacter, speed);
        } else {
          // Re-enable input after typing is complete
          if (this.inputEl) this.inputEl.disabled = false;
          // Ensure focus is returned to input if terminal is active
          if (this.isActive && this.inputEl) {
            this.inputEl.focus();
          }
          this.outputEl.scrollTop = this.outputEl.scrollHeight; // Final scroll adjustment
        }
      };
      typeCharacter();
    }
    
    clearTerminal() {
      if (!this.outputEl) return;
      this.outputEl.innerHTML = '';
      this.addOutput('Terminal memory purged.', 'system');
      this.addOutput('', 'spacer');
    }
    
    showHelp() {
      this.addOutput('Initiating help sequence...', 'system');
      this.addOutput('Available commands:', 'system');
      this.addOutput('  help                  - Display this quantum entanglement of commands', 'system');
      this.addOutput('  clear, cls            - Purge terminal memory banks', 'system');
      this.addOutput('  date                  - Display current temporal coordinates (date)', 'system');
      this.addOutput('  time                  - Display current temporal coordinates (time)', 'system');
      this.addOutput('  echo [text]           - Resonate text sequence', 'system');
      this.addOutput('  about                 - Reveal identity matrix of NAME0x0', 'system');
      this.addOutput('  contact               - Establish communication pathways', 'system');
      this.addOutput('  projects              - Access project execution chamber', 'system');
      this.addOutput('  skills                - Scan capability matrix', 'system');
      this.addOutput('  weather [city]        - Query atmospheric conditions for [city]', 'system');
      this.addOutput('  google [query]        - Interface with Google data stream', 'system');
      this.addOutput('  perplexity [query]    - Interface with Perplexity AI data stream', 'system');
      this.addOutput('  github                - Access GitHub repository archive', 'system');
      this.addOutput('  navigate [section]    - Shift focus to specified neural pathway', 'system');
      this.addOutput('  system                - Display quantum core diagnostics', 'system');
      this.addOutput('  matrix                - Activate visual data stream (matrix effect)', 'system');
      this.addOutput('  exit                  - Disengage terminal interface', 'system');
      this.addOutput('  hello, hi, hey        - Initiate standard greeting protocol', 'system');
      this.addOutput('  status                - Display current system status overview', 'system');
      this.addOutput('  credits               - Display system acknowledgement protocol', 'system');
      this.addOutput('', 'spacer');
    }
    
    showDate() {
      const now = new Date();
      this.addOutput(`Current date: ${now.toLocaleDateString()}`, 'info');
    }
    
    showTime() {
      const now = new Date();
      this.addOutput(`Current time: ${now.toLocaleTimeString()}`, 'info');
    }
    
    echo(text) {
      if (text) {
        this.addOutput(text, 'echo');
      } else {
        this.addOutput('Usage: echo [text to resonate]', 'system');
      }
    }
    
    showAbout() {
      this.addOutput('NAME0x0 - Developer | Innovator | Tech Architect', 'info');
      this.addOutput('Passionate about creating impactful technology.', 'info');
      this.addOutput('Currently pursuing BSc (Hons) in IT at Middlesex University Dubai.', 'info');
      this.addOutput('More details: Use "navigate knowledge-repository" or the main interface.', 'system');
    }
    
    showContact() {
      this.addOutput('Contact Channels:', 'info');
      this.addOutput('  Quantum Comm Link (Phone): +971558280821', 'info');
      this.addOutput('  Data Transmission (Email): contact@name0x0.dev', 'info');
      this.addOutput('  Spatial Coordinates: Dubai, UAE', 'info');
      this.addOutput('Use "navigate communication-array" or the main interface.', 'system');
    }
    
    showProjects() {
      this.addOutput('Project Execution Chamber - Accessing active projects:', 'info');
      this.addOutput('  AVA       - Afsah\'s Virtual Assistant', 'info');
      this.addOutput('  Tangled   - Quantum Browser Entanglement', 'info');
      this.addOutput('  MAVIS     - Modern Architecture Virtual Interface System', 'info');
      this.addOutput('Use "navigate project-execution" for interactive models.', 'system');
    }
    
    showSkills() {
      this.addOutput('Capability Matrix Scan:', 'info');
      this.addOutput('  Core Languages: Python, JavaScript, Rust, HTML/CSS', 'info');
      this.addOutput('  Frameworks: React, Three.js, TensorFlow, WebGL', 'info');
      this.addOutput('  Tools: Git, Docker, AWS, CI/CD', 'info');
      this.addOutput('  Soft Skills: Problem Solving, Team Leadership, Communication', 'info');
      this.addOutput('Use "navigate capability-matrix" for detailed metrics.', 'system');
    }
    
    async showWeather(city) {
      if (!city) {
        this.addOutput('Usage: weather [city name]', 'system');
        this.addOutput('Example: weather Dubai', 'system');
        return;
      }
      this.addOutput(`Querying atmospheric conditions for ${city}...`, 'info');
      try {
        const apiKey = 'YOUR_WEATHER_API_KEY';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.cod === 200) {
            this.addOutput(`Weather in ${data.name}: ${data.weather[0].description}, Temp: ${data.main.temp}°C, Humidity: ${data.main.humidity}%`, 'success');
        } else {
            this.addOutput(`Could not retrieve weather for ${city}: ${data.message}`, 'error');
        }
      } catch (error) {
        this.addOutput(`Error fetching weather data for ${city}. Please ensure the city is correct and the API is accessible.`, 'error');
        this.addOutput(`Details: ${error.message}`, 'error');
        this.addOutput('Note: Live weather data requires a valid API key and network access.', 'system');
      }
    }
    
    searchGoogle(query) {
      if (!query) {
        this.addOutput('Usage: google [search query]', 'system');
        return;
      }
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      this.addOutput(`Initiating Google data stream for: "${query}"`, 'info');
      window.open(searchUrl, '_blank');
    }

    searchPerplexity(query) {
      if (!query) {
        this.addOutput('Usage: perplexity [search query]', 'system');
        return;
      }
      const searchUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`;
      this.addOutput(`Interfacing with Perplexity AI for: "${query}"`, 'info');
      window.open(searchUrl, '_blank');
    }
    
    openGitHub() {
      const githubUrl = 'https://github.com/NAME0x0';
      this.addOutput('Accessing GitHub repository archive...', 'info');
      window.open(githubUrl, '_blank');
    }
    
    navigateToSection(section) {
      if (!section) {
        this.addOutput('Usage: navigate [section-id]', 'system');
        this.addOutput('Available sections: core-system, knowledge-repository, project-execution, capability-matrix, communication-array', 'system');
        return;
      }
      const validSections = ['core-system', 'knowledge-repository', 'project-execution', 'capability-matrix', 'communication-array'];
      if (validSections.includes(section.toLowerCase())) {
        this.addOutput(`Navigating to neural pathway: ${section}...`, 'info');
        document.dispatchEvent(new CustomEvent('navigateToSection', { detail: { section: section.toLowerCase() } }));
        this.hideTerminal();
      } else {
        this.addOutput(`Invalid neural pathway: ${section}. Use 'help' or see available sections.`, 'error');
      }
    }
    
    showSystemInfo() {
      this.addOutput('Quantum Core Diagnostics:', 'info');
      this.addOutput(`  AVA Version: 4.7.2`, 'info');
      this.addOutput(`  Status: All systems nominal`, 'info');
      this.addOutput(`  Performance Tier: ${window.performanceOptimizer ? window.performanceOptimizer.deviceTier : 'Unknown'}`, 'info');
      this.addOutput(`  CPU Cores: ${navigator.hardwareConcurrency || 'N/A'}`, 'info');
      this.addOutput(`  Memory: ${(navigator.deviceMemory || 'N/A')} GB`, 'info');
      this.addOutput(`  WebGL Renderer: ${window.performanceOptimizer && window.performanceOptimizer.webGLRenderer ? window.performanceOptimizer.webGLRenderer : 'N/A'}`, 'info');
      this.addOutput(`  Screen Resolution: ${screen.width}x${screen.height}`, 'info');
      this.addOutput(`  User Agent: ${navigator.userAgent}`, 'info');
    }
    
    showMatrix() {
      this.addOutput('Activating visual data stream...', 'system');
      const matrixContainer = document.createElement('canvas');
      matrixContainer.id = 'terminal-matrix-effect';
      matrixContainer.style.position = 'absolute';
      matrixContainer.style.top = '0';
      matrixContainer.style.left = '0';
      matrixContainer.style.width = '100%';
      matrixContainer.style.height = '100%';
      matrixContainer.style.zIndex = '0';
      
      if (this.terminalEl) {
        // Add canvas to terminal body
        const terminalBody = this.terminalEl.querySelector('.terminal-body');
        if (terminalBody) {
          terminalBody.style.position = 'relative';
          terminalBody.appendChild(matrixContainer);
          
          // Initialize matrix effect
          this.initMatrixEffect(matrixContainer);
          
          // Add stop button
          this.addOutput('Matrix effect activated. Type "clear" to stop.', 'success');
        }
      }
    }
    
    initMatrixEffect(canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const columns = Math.floor(canvas.width / 20);
      const drops = [];
      
      // Initialize drops
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height);
      }
      
      // Set text properties
      ctx.font = '15px monospace';
      
      // Animation function
      const draw = () => {
        // Semi-transparent black background to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Green text
        ctx.fillStyle = '#0F0';
        
        // Loop through drops
        for (let i = 0; i < drops.length; i++) {
          // Random character
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          
          // x = i * font size, y = drops[i] * font size
          ctx.fillText(text, i * 20, drops[i] * 20);
          
          // Sending the drop back to the top randomly after it has crossed the screen
          // Adding randomness to the reset to make the drops scattered on the Y axis
          if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          // Increment y coordinate
          drops[i]++;
        }
        
        // Check if canvas is still in DOM
        if (canvas.parentNode) {
          requestAnimationFrame(draw);
        }
      };
      
      // Start animation
      draw();
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (canvas.parentNode) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
        }
      });
    }
    
    greet() {
      this.addOutput('Greetings, operative. All systems nominal.', 'info');
    }

    showSystemStatus() {
      this.addOutput('Initiating system status query...', 'system');
      setTimeout(() => {
        this.addOutput('[AVASYS_CORE] Status Report:', 'info');
        this.addOutput('  Quantum Core Processor: Online, 99.7% Efficiency', 'system');
        this.addOutput('  Neural Network Interface: Stable, 1.2 PetaFLOPS', 'system');
        this.addOutput('  Data Streams: Encrypted, 256-bit AES', 'system');
        this.addOutput('  Energy Levels: Optimal, 92.4% Capacity', 'system');
        this.addOutput('  External Threat Matrix: Clear', 'success');
        this.addOutput('  System Uptime: 783 days, 14 hours, 22 minutes', 'system');
        this.addOutput('All primary systems nominal.', 'info');
        this.addOutput('', 'spacer');
      }, 500);
    }

    showCredits() {
      this.addOutput('System Acknowledgement Protocol Initiated:', 'system');
      this.addOutput('This interface was inspired by advanced telemetry systems and fictional UIs.', 'info');
      this.addOutput('Core Technologies Utilized:', 'system');
      this.addOutput('  - HTML5, CSS3, JavaScript (ES6+)', 'info');
      this.addOutput('  - Three.js for 3D holographic projections', 'info');
      this.addOutput('  - Google Fonts for typographic rendering', 'info');
      this.addOutput('Special thanks to the open-source community for invaluable tools and libraries.', 'system');
      this.addOutput('Design Ethos: Quantum Futurism & Cybernetic Aesthetics.', 'info');
      this.addOutput('', 'spacer');
    }
  }
  
  // Initialize terminal on DOM content loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
    window.terminal.init();
  });
}
