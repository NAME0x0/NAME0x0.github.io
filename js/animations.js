class AVAAnimationSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupBackgroundEffects();
        this.setupTerminalAnimations();
        this.setupWidgetAnimations();
    }

    setupBackgroundEffects() {
        // Grid animation
        this.animateGrid();
        
        // Scan line effect
        this.animateScanLine();
    }

    animateGrid() {
        const grid = document.querySelector('.grid-overlay');
        // Implement grid animations
    }

    animateScanLine() {
        const scanLine = document.querySelector('.scan-line');
        // Implement scan line animation
    }

    setupTerminalAnimations() {
        // Terminal typing and response animations
        this.terminalEffects = {
            typeSpeed: 50,
            cursorBlink: true
        };
    }

    typeText(element, text, callback) {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, this.terminalEffects.typeSpeed);
    }

    setupWidgetAnimations() {
        // Widget transition animations
        document.querySelectorAll('.widget').forEach(widget => {
            this.addWidgetAnimations(widget);
        });
    }

    addWidgetAnimations(widget) {
        // Add entrance/exit animations
        widget.addEventListener('mouseenter', () => {
            // Implement hover effects
        });
    }
}

// Initialize animation system
const animationSystem = new AVAAnimationSystem();
