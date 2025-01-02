import { WIDGET_TYPES, WidgetFactory } from './widget-types.js';

class WidgetSystem {
    constructor() {
        this.widgets = new Map();
        this.init();
    }

    init() {
        this.initializeTimeWeather();
        this.initializeTasks();
        this.initializeNotes();
        this.initializeSystemMonitor();
        this.setupEventListeners();
    }

    async initializeTimeWeather() {
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
        
        // Update weather every 30 minutes
        this.updateWeather();
        setInterval(() => this.updateWeather(), 1800000);
    }

    async updateWeather() {
        // Dubai coordinates
        const lat = 25.2048;
        const lon = 55.2708;
        try {
            const weather = await this.fetchWeatherData(lat, lon);
            this.updateWeatherDisplay(weather);
        } catch (error) {
            console.error('Weather update failed:', error);
        }
    }

    updateTime() {
        const now = new Date();
        const timeDisplay = document.querySelector('.current-time');
        const dateDisplay = document.querySelector('.date');
        
        timeDisplay.textContent = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        dateDisplay.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // ... rest of widget implementation ...
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
