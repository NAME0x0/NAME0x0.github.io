class AnimationSystem {
    constructor() {
        this.initializeParticles();
        this.setupHolographicEffects();
    }

    initializeParticles() {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80 },
                color: { value: '#64ffda' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    out_mode: 'out'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    }
                }
            }
        });
    }

    setupHolographicEffects() {
        const glitchElements = document.querySelectorAll('.cyber-glitch');
        glitchElements.forEach(element => {
            element.dataset.text = element.textContent;
        });
    }

    addCommandAnimation(command) {
        const terminal = document.querySelector('.terminal-output');
        const line = document.createElement('div');
        line.classList.add('terminal-line');
        line.innerHTML = `<span class="terminal-prompt">ava://$</span> ${command}`;
        terminal.appendChild(line);
        line.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the animation system
const animationSystem = new AnimationSystem();
