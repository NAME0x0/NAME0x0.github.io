class WidgetManager {
    constructor() {
        this.widgets = document.querySelectorAll('.widget');
        this.init();
    }

    init() {
        this.widgets.forEach(widget => {
            // Add icon element
            const icon = document.createElement('span');
            icon.className = 'widget-icon';
            icon.textContent = this.getWidgetIcon(widget);
            widget.querySelector('.widget-header').appendChild(icon);

            // Store initial height
            widget.style.setProperty('--current-height', `${widget.offsetHeight}px`);

            // Add click handler
            widget.addEventListener('click', (e) => this.toggleWidget(widget, e));

            // Initially collapse all widgets except the first one
            if (!widget.classList.contains('primary-widget')) {
                this.collapseWidget(widget);
            }
        });
    }

    getWidgetIcon(widget) {
        // Map widget types to icons
        const iconMap = {
            'time-weather-group': '🌍',
            'calendar-widget': '📅',
            'system-status': '⚡',
            'ai-controls': '🤖',
            'analytics': '📊'
        };

        for (const [className, icon] of Object.entries(iconMap)) {
            if (widget.classList.contains(className)) return icon;
        }
        return '📱';
    }

    toggleWidget(widget, event) {
        if (event.target.closest('.widget-content')) return;
        
        if (widget.classList.contains('collapsed')) {
            this.expandWidget(widget);
        } else {
            this.collapseWidget(widget);
        }
    }

    expandWidget(widget) {
        // Collapse other widgets in the same container
        const container = widget.parentElement;
        container.querySelectorAll('.widget:not(.collapsed)').forEach(w => {
            if (w !== widget) this.collapseWidget(w);
        });

        widget.classList.remove('collapsed');
        widget.classList.add('expanding');
        
        setTimeout(() => {
            widget.classList.remove('expanding');
            widget.querySelector('.widget-content').style.display = 'block';
        }, 300);
    }

    collapseWidget(widget) {
        widget.style.setProperty('--current-height', `${widget.offsetHeight}px`);
        widget.classList.add('collapsing');
        
        setTimeout(() => {
            widget.classList.remove('collapsing');
            widget.classList.add('collapsed');
            widget.querySelector('.widget-content').style.display = 'none';
        }, 300);
    }
}

// Initialize widget manager
document.addEventListener('DOMContentLoaded', () => {
    new WidgetManager();
});
