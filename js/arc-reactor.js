class ArcReactor {
    constructor() {
        this.setupReactor();
        this.createMarks();
        this.initializeAnimations();
    }

    setupReactor() {
        const reactor = document.querySelector('.arc_reactor');
        if (!reactor) return;

        // Add core rings
        for (let i = 1; i <= 4; i++) {
            const ring = document.createElement('div');
            ring.className = `reactor-ring ring-${i}`;
            reactor.appendChild(ring);
        }

        // Add energy core
        const core = document.createElement('div');
        core.className = 'core2';
        reactor.querySelector('.e7').appendChild(core);
    }

    createMarks() {
        const marks = document.querySelector('.marks');
        if (!marks) return;

        // Create 60 marks for the reactor
        for (let i = 0; i < 60; i++) {
            const mark = document.createElement('li');
            mark.style.transform = `rotate(${i * 6}deg) translateY(125px)`;
            marks.appendChild(mark);
        }
    }

    initializeAnimations() {
        // Core pulse animation
        setInterval(() => {
            const core = document.querySelector('.core2');
            if (!core) return;
            
            core.style.boxShadow = '0px 0px 50px 25px rgba(2, 255, 255, 0.5)';
            setTimeout(() => {
                core.style.boxShadow = '0px 0px 40px 15px rgba(2, 255, 255, 0.3)';
            }, 100);
        }, 2000);
    }
}

// Initialize Arc Reactor
document.addEventListener('DOMContentLoaded', () => new ArcReactor());
