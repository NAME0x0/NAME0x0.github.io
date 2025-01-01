
class CyberEffects {
    constructor() {
        this.initGlitchEffects();
        this.initHologramEffects();
        this.initScanlines();
    }

    initGlitchEffects() {
        const glitchTexts = document.querySelectorAll('.cyber-glitch');
        glitchTexts.forEach(text => {
            text.setAttribute('data-text', text.textContent);
        });
    }

    initHologramEffects() {
        // Add hologram effects
    }

    initScanlines() {
        const scanline = document.createElement('div');
        scanline.className = 'cyber-scanline';
        document.body.appendChild(scanline);
    }
}

// Initialize effects
new CyberEffects();