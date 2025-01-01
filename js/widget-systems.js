class WidgetSystem {
    constructor() {
        this.widgets = new Map();
        this.activeWidget = null;
        this.init();
    }

    init() {
        // Create widget triggers
        const triggers = document.querySelectorAll('[data-widget-trigger]');
        triggers.forEach(trigger => {
            const widgetId = trigger.dataset.widgetTrigger;
            const widget = document.querySelector(`[data-widget="${widgetId}"]`);
            
            if (widget) {
                this.widgets.set(widgetId, {
                    trigger,
                    widget,
                    active: false
                });

                trigger.addEventListener('click', () => this.toggleWidget(widgetId));
            }
        });

        // Handle click outside to close widgets
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.widget-container') && 
                !e.target.closest('.widget-trigger')) {
                this.closeAllWidgets();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllWidgets();
            }
        });
    }

    toggleWidget(widgetId) {
        const widgetData = this.widgets.get(widgetId);
        if (!widgetData) return;

        if (this.activeWidget && this.activeWidget !== widgetId) {
            this.closeWidget(this.activeWidget);
        }

        widgetData.active = !widgetData.active;
        widgetData.trigger.classList.toggle('active');
        widgetData.widget.classList.toggle('active');

        const container = widgetData.widget.closest('.widget-container');
        if (container) {
            container.classList.toggle('active');
        }

        this.activeWidget = widgetData.active ? widgetId : null;
    }

    closeWidget(widgetId) {
        const widgetData = this.widgets.get(widgetId);
        if (!widgetData || !widgetData.active) return;

        widgetData.active = false;
        widgetData.trigger.classList.remove('active');
        widgetData.widget.classList.remove('active');

        const container = widgetData.widget.closest('.widget-container');
        if (container) {
            container.classList.remove('active');
        }
    }

    closeAllWidgets() {
        this.widgets.forEach((data, id) => this.closeWidget(id));
        this.activeWidget = null;
    }
}