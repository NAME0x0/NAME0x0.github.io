class AVACore {
    constructor() {
        this.initialized = false;
        this.initializationAttempts = 0;
        this.maxAttempts = 3;
        this.init();
    }

    async init() {
        try {
            // Remove loading state if present
            document.body.classList.remove('loading');
            
            // Initialize components
            await this.initializeComponents();
            
            // Mark as initialized
            this.initialized = true;
            
            // Show success indicator
            this.updateStatus('AVA Core Online', 'success');
        } catch (error) {
            console.error('Initialization error:', error);
            
            if (this.initializationAttempts < this.maxAttempts) {
                this.initializationAttempts++;
                this.updateStatus('Retrying initialization...', 'warning');
                setTimeout(() => this.init(), 1000);
            } else {
                this.updateStatus('System initialization failed', 'error');
                this.showErrorMessage();
            }
        }
    }

    updateStatus(message, type = 'info') {
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = message;
            statusText.dataset.status = type;
        }
    }

    // ...rest of existing methods...
}
