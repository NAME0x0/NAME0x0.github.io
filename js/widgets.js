import { WIDGET_TYPES, WidgetFactory } from './widget-types.js';

class WidgetSystem {
    constructor() {
        this.initializeWidgets();
        this.updateCycle();
    }

    initializeWidgets() {
        this.initializeSystemStatus();
        this.initializeActiveTasks();
        this.initializeAnalytics();
        this.initializeNotifications();
    }

    initializeSystemStatus() {
        const statusList = document.querySelector('.status-list');
        const metrics = ['CPU', 'Memory', 'Network', 'Storage'];
        
        metrics.forEach(metric => {
            const metricEl = document.createElement('div');
            metricEl.className = 'metric-item';
            metricEl.innerHTML = `
                <span class="metric-name">${metric}</span>
                <div class="metric-bar">
                    <div class="metric-fill" style="width: 0%"></div>
                </div>
                <span class="metric-value">0%</span>
            `;
            statusList.appendChild(metricEl);
        });
    }

    updateCycle() {
        setInterval(() => {
            this.updateMetrics();
            this.updateTasks();
            this.updateAnalytics();
            this.checkNotifications();
        }, 1000);
    }

    updateMetrics() {
        // Simulate real-time metrics
        document.querySelectorAll('.metric-item').forEach(metric => {
            const fill = metric.querySelector('.metric-fill');
            const value = metric.querySelector('.metric-value');
            const newValue = Math.floor(Math.random() * 100);
            
            fill.style.width = `${newValue}%`;
            value.textContent = `${newValue}%`;
            
            // Add warning class if high usage
            fill.className = `metric-fill ${newValue > 80 ? 'warning' : ''}`;
        });
    }

    // ...implement other widget methods...
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

class DashboardWidgets {
    constructor() {
        this.charts = {};
        this.initializeWidgets();
        this.startUpdateCycle();
    }

    initializeWidgets() {
        this.setupSystemMetrics();
        this.setupAnalyticsChart();
        this.setupNotifications();
        this.setupTaskManager();
    }

    setupSystemMetrics() {
        const metrics = ['CPU', 'Memory', 'Network', 'Storage'];
        const container = document.querySelector('.metrics-container');
        
        metrics.forEach(metric => {
            const metricEl = this.createMetricElement(metric);
            container.appendChild(metricEl);
        });
    }

    setupAnalyticsChart() {
        const ctx = document.getElementById('analytics-chart').getContext('2d');
        this.charts.analytics = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    label: 'System Load',
                    data: Array(20).fill(0),
                    borderColor: '#00fff2',
                    backgroundColor: 'rgba(0, 255, 242, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 255, 242, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 242, 0.1)'
                        }
                    }
                }
            }
        });
    }

    startUpdateCycle() {
        setInterval(() => {
            this.updateMetrics();
            this.updateAnalytics();
            this.checkNotifications();
        }, 1000);
    }

    updateMetrics() {
        document.querySelectorAll('.metric').forEach(metric => {
            const fill = metric.querySelector('.metric-fill');
            const value = metric.querySelector('.metric-value');
            const newValue = this.generateMetricValue(metric.dataset.type);
            
            fill.style.width = `${newValue}%`;
            value.textContent = `${newValue}%`;
            fill.classList.toggle('warning', newValue > 80);
        });
    }

    updateAnalytics() {
        const chart = this.charts.analytics;
        const newValue = Math.random() * 100;
        
        chart.data.datasets[0].data.push(newValue);
        chart.data.datasets[0].data.shift();
        chart.update('quiet');
    }

    generateMetricValue(type) {
        // Simulate more realistic system metrics
        switch(type) {
            case 'cpu':
                return Math.sin(Date.now() / 10000) * 30 + 50;
            case 'memory':
                return Math.sin(Date.now() / 15000) * 20 + 60;
            default:
                return Math.random() * 100;
        }
    }

    createMetricElement(name) {
        const div = document.createElement('div');
        div.className = 'metric';
        div.dataset.type = name.toLowerCase();
        div.innerHTML = `
            <label>${name}</label>
            <div class="metric-bar">
                <div class="metric-fill"></div>
            </div>
            <span class="metric-value">0%</span>
        `;
        return div;
    }
}

class SystemMetrics {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            network: 0,
            temperature: 0
        };
        this.setupMetrics();
        this.startUpdates();
    }

    setupMetrics() {
        const grid = document.querySelector('.metrics-grid');
        const metrics = [
            { id: 'cpu', label: 'CPU Usage', icon: '⚡' },
            { id: 'memory', label: 'Memory', icon: '📊' },
            { id: 'network', label: 'Network', icon: '📡' },
            { id: 'temp', label: 'Temperature', icon: '🌡️' }
        ];

        metrics.forEach(metric => {
            grid.appendChild(this.createMetricElement(metric));
        });
    }

    createMetricElement({ id, label, icon }) {
        const div = document.createElement('div');
        div.className = 'metric';
        div.innerHTML = `
            <div class="metric-header">
                <span class="metric-icon">${icon}</span>
                <span class="metric-label">${label}</span>
            </div>
            <div class="metric-value" id="${id}-value">0%</div>
            <div class="metric-bar">
                <div class="metric-fill" id="${id}-fill"></div>
            </div>
        `;
        return div;
    }

    startUpdates() {
        setInterval(() => {
            this.updateMetrics();
        }, 1000);
    }

    updateMetrics() {
        // Simulate realistic system metrics
        this.metrics.cpu = Math.sin(Date.now() / 10000) * 30 + 50;
        this.metrics.memory = Math.sin(Date.now() / 15000) * 20 + 60;
        this.metrics.network = Math.sin(Date.now() / 20000) * 40 + 50;
        this.metrics.temperature = Math.sin(Date.now() / 25000) * 15 + 40;

        // Update UI
        Object.entries(this.metrics).forEach(([key, value]) => {
            const valueEl = document.getElementById(`${key}-value`);
            const fillEl = document.getElementById(`${key}-fill`);
            if (valueEl && fillEl) {
                valueEl.textContent = `${value.toFixed(1)}%`;
                fillEl.style.width = `${value}%`;
                fillEl.style.background = this.getStatusColor(value);
            }
        });
    }

    getStatusColor(value) {
        if (value > 80) return 'var(--error)';
        if (value > 60) return 'var(--warning)';
        return 'var(--accent)';
    }
}

// Initialize widget system
const widgetSystem = new WidgetSystem();

// Initialize widgets
const widgets = new Widgets();

// Initialize dashboard widgets
const dashboardWidgets = new DashboardWidgets();

// Initialize widgets when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const systemMetrics = new SystemMetrics();
});
