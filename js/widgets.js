import { WIDGET_TYPES, WidgetFactory } from './widget-types.js';

class WidgetSystem {
    constructor() {
        this.widgets = new Map();
        this.grid = null;
        this.errorBoundary = new ErrorBoundary();
        this.init();
    }

    async init() {
        try {
            await this.setupGrid();
            await this.loadSavedLayout();
            this.registerEventListeners();
            this.startPerformanceMonitoring();
        } catch (error) {
            this.errorBoundary.handleError(error);
        }
    }

    async setupGrid() {
        this.grid = new GridLayout({
            container: '.widget-grid',
            columns: 12,
            rowHeight: 60,
            gap: 10,
            animate: true
        });
    }

    createWidget(type, config = {}) {
        try {
            const widget = WidgetFactory.create(type, config);
            this.widgets.set(widget.id, widget);
            this.grid.addWidget(widget);
            return widget;
        } catch (error) {
            this.errorBoundary.handleError(error);
            return null;
        }
    }

    // ... rest of the widget system implementation ...
}

// Widget Classes
class QuickAccessWidget {
    constructor() {
        this.links = [];
        this.recentItems = [];
    }

    async init() {
        await this.loadUserLinks();
        this.render();
    }

    // ... widget-specific methods ...
}

// ... other widget class implementations ...

class SystemMonitorWidget {
    constructor() {
        this.interval = 1000;
    }

    async init() {
        this.updateSystemMetrics();
        setInterval(() => this.updateSystemMetrics(), this.interval);
    }

    updateSystemMetrics() {
        // Simulate system metrics (replace with real monitoring)
        const metrics = {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.floor(Math.random() * 1000)
        };

        // Update UI
        document.getElementById('cpu-usage').textContent = 
            `CPU: ${metrics.cpu.toFixed(1)}%`;
        document.getElementById('memory-usage').textContent = 
            `Memory: ${metrics.memory.toFixed(1)}%`;
        document.getElementById('network-status').textContent = 
            `Network: ${metrics.network} Mb/s`;
    }
}

// Initialize with error handling
try {
    const widgetSystem = new WidgetSystem();
    window.widgetSystem = widgetSystem; // Global access for debugging
} catch (error) {
    console.error('Failed to initialize widget system:', error);
    // Show user-friendly error message
    document.getElementById('error-boundary').classList.remove('hidden');
}
