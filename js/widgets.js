class WidgetSystem {
    constructor() {
        this.widgets = new Map();
        this.init();
    }

    init() {
        // Register core widgets
        this.registerWidget('quick-access', new QuickAccessWidget());
        this.registerWidget('smart-search', new SmartSearchWidget());
        this.registerWidget('tasks', new TaskManagementWidget());
        this.registerWidget('system', new SystemMonitorWidget());
        this.registerWidget('weather-time', new WeatherTimeWidget());
        this.registerWidget('notes', new NotesWidget());

        this.setupDragAndDrop();
        this.loadLayout();
    }

    // ... rest of existing widget system code ...
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

// Initialize widget system
const widgetSystem = new WidgetSystem();
