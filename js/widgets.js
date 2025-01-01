class AVAWidgetSystem {
    constructor() {
        this.widgets = new Map();
        this.init();
    }

    init() {
        this.registerCoreWidgets();
        this.setupEventListeners();
    }

    registerCoreWidgets() {
        // System Monitor Widget
        this.registerWidget('system-monitor', {
            update: this.updateSystemMetrics.bind(this),
            interval: 1000
        });
    }

    registerWidget(id, config) {
        this.widgets.set(id, {
            element: document.getElementById(id),
            config: config,
            data: {}
        });

        if (config.interval) {
            setInterval(() => config.update(), config.interval);
        }
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

    setupEventListeners() {
        // Implement widget drag and resize functionality
        this.widgets.forEach((widget, id) => {
            if (widget.element) {
                this.makeWidgetDraggable(widget.element);
                this.makeWidgetResizable(widget.element);
            }
        });
    }

    makeWidgetDraggable(element) {
        const header = element.querySelector('.widget-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        // Implement drag logic
    }

    makeWidgetResizable(element) {
        // Implement resize logic
    }
}

// Initialize widget system
const widgetSystem = new AVAWidgetSystem();
