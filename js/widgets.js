class WidgetManager {
    constructor() {
        this.widgets = new Map();
        this.initializeWidgets();
        this.setupEventListeners();
    }

    initializeWidgets() {
        // System monitoring widget
        this.registerWidget('system', {
            init: () => this.initSystemMonitoring(),
            update: () => this.updateSystemMetrics()
        });

        // AI control widget
        this.registerWidget('ai', {
            init: () => this.initAIControls(),
            update: (data) => this.updateAIStatus(data)
        });

        // Task management widget
        this.registerWidget('tasks', {
            init: () => this.initTaskManager(),
            update: (tasks) => this.updateTasks(tasks)
        });
    }

    registerWidget(id, handlers) {
        this.widgets.set(id, {
            element: document.querySelector(`[data-widget="${id}"]`),
            ...handlers
        });
        handlers.init();
    }

    async updateSystemMetrics() {
        // Simulate system metrics (replace with real monitoring)
        const metrics = {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.floor(Math.random() * 1000)
        };

        document.getElementById('cpuUsage').textContent = `${metrics.cpu.toFixed(1)}%`;
        document.getElementById('memoryUsage').textContent = `${metrics.memory.toFixed(1)}%`;
        document.getElementById('networkSpeed').textContent = `${metrics.network} Mb/s`;
    }

    initAIControls() {
        const modes = document.querySelectorAll('.mode-btn');
        modes.forEach(btn => {
            btn.addEventListener('click', () => {
                modes.forEach(m => m.classList.remove('active'));
                btn.classList.add('active');
                AVACore.setMode(btn.dataset.mode);
            });
        });
    }

    makeWidgetsDraggable() {
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            const header = widget.querySelector('.widget-header');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            header.addEventListener('mousedown', (e) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === header) {
                    isDragging = true;
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    widget.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });
    }
}

// Initialize the widget system
const widgetManager = new WidgetManager();
