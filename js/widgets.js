import { WIDGET_TYPES, WidgetFactory } from './widget-types.js';

class WidgetSystem {
    constructor() {
        this.widgets = new Map();
        this.init();
    }

    init() {
        this.initializeDateTime();
        this.initializeWeather();
        this.initializeSystemMetrics();
        this.initializeNotes();
        this.setupEventListeners();
    }

    initializeDateTime() {
        const updateDateTime = () => {
            const now = new Date();
            const timeElement = document.querySelector('#datetime-widget .time');
            const dateElement = document.querySelector('#datetime-widget .date');

            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });

            dateElement.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        // Update immediately and then every second
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    async initializeWeather() {
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

    // ... rest of the implementation
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

class Widgets {
    constructor() {
        this.initializeTimeWidget();
        this.initializeTasksWidget();
        this.initializeSystemWidget();
        this.initializeNotesWidget();
    }

    initializeTimeWidget() {
        const updateTime = () => {
            const now = new Date();
            document.querySelector('#time-widget .time').textContent = 
                now.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            document.querySelector('#time-widget .date').textContent = 
                now.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    initializeTasksWidget() {
        const addTaskBtn = document.querySelector('.add-task');
        const tasksList = document.querySelector('.tasks-list');

        addTaskBtn.addEventListener('click', () => {
            const task = prompt('Enter new task:');
            if (task) {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.textContent = task;
                tasksList.appendChild(taskElement);
            }
        });
    }

    initializeSystemWidget() {
        setInterval(() => {
            const metrics = document.querySelector('.metrics');
            metrics.innerHTML = `
                <div>CPU: ${Math.floor(Math.random() * 100)}%</div>
                <div>Memory: ${Math.floor(Math.random() * 100)}%</div>
                <div>Network: ${Math.floor(Math.random() * 100)} Mb/s</div>
            `;
        }, 2000);
    }

    initializeNotesWidget() {
        const addNoteBtn = document.querySelector('.add-note');
        const notesList = document.querySelector('.notes-list');

        addNoteBtn.addEventListener('click', () => {
            const note = prompt('Enter new note:');
            if (note) {
                const noteElement = document.createElement('div');
                noteElement.className = 'note';
                noteElement.textContent = note;
                notesList.appendChild(noteElement);
            }
        });
    }
}

// Initialize widget system
const widgetSystem = new WidgetSystem();

// Initialize widgets
const widgets = new Widgets();
