class WidgetSystem {
    constructor() {
        this.init();
        this.activeWidgets = new Set();
    }

    init() {
        // Wait for DOM content to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupWidgets());
        } else {
            this.setupWidgets();
        }
    }

    setupWidgets() {
        // Setup widget triggers
        const triggers = document.querySelectorAll('.widget-trigger');
        
        triggers.forEach(trigger => {
            const widgetId = trigger.dataset.widgetTrigger;
            const widget = document.querySelector(`[data-widget="${widgetId}"]`);
            const container = widget?.closest('.widget-container');
            
            if (widget && container) {
                // Store references
                trigger.widget = widget;
                trigger.container = container;
                
                // Add click handler
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleWidget(trigger);
                });

                // Ensure widget starts closed
                widget.style.display = 'none';
                container.classList.remove('active');
                trigger.classList.remove('active');
            }
        });

        // Close widgets when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.widget-container') && 
                !e.target.closest('.widget-trigger')) {
                this.closeAllWidgets();
            }
        });

        // Touch event handling for mobile
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.widget-container') && 
                !e.target.closest('.widget-trigger')) {
                this.closeAllWidgets();
            }
        }, { passive: true });

        // ESC key to close widgets
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllWidgets();
            }
        });

        // Handle widget container interactions
        document.querySelectorAll('.widget-container').forEach(container => {
            container.addEventListener('click', (e) => e.stopPropagation());
            container.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        });

        // Debug logging
        console.log('Widget system initialized');
        console.log('Found triggers:', triggers.length);
    }

    toggleWidget(trigger) {
        const widget = trigger.widget;
        const container = trigger.container;
        
        if (!widget || !container) {
            console.error('Widget or container not found');
            return;
        }

        const isActive = this.activeWidgets.has(trigger);

        // Close other widgets first
        this.closeAllWidgets();

        if (!isActive) {
            // Open this widget
            widget.style.display = 'block';
            container.classList.add('active');
            trigger.classList.add('active');
            this.activeWidgets.add(trigger);

            // Ensure widget is visible after display change
            setTimeout(() => {
                widget.style.opacity = '1';
                widget.style.transform = 'translateX(0)';
            }, 50);

            console.log('Widget opened:', trigger.dataset.widgetTrigger);
        }
    }

    closeWidget(trigger) {
        const widget = trigger.widget;
        const container = trigger.container;

        if (widget && container) {
            widget.style.opacity = '0';
            widget.style.transform = 'translateX(-20px)';
            container.classList.remove('active');
            trigger.classList.remove('active');
            
            // Hide after animation
            setTimeout(() => {
                widget.style.display = 'none';
            }, 300);

            this.activeWidgets.delete(trigger);
            console.log('Widget closed:', trigger.dataset.widgetTrigger);
        }
    }

    closeAllWidgets() {
        document.querySelectorAll('.widget-trigger').forEach(trigger => {
            this.closeWidget(trigger);
        });
        this.activeWidgets.clear();
    }
}

// Initialize the widget system
const widgetSystem = new WidgetSystem();

// Add error handling
window.addEventListener('error', (e) => {
    console.error('Widget system error:', e.error);
});
