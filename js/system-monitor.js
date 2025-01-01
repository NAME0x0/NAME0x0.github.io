class SystemMonitor {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            network: 0,
            processes: new Map()
        };
        
        this.init();
    }

    init() {
        this.elements = {
            cpu: document.getElementById('cpuUsage'),
            memory: document.getElementById('memoryUsage'),
            network: document.getElementById('networkSpeed'),
            processList: document.getElementById('processList')
        };
        
        this.startMonitoring();
        this.simulateProcesses();
    }

    startMonitoring() {
        setInterval(() => this.updateMetrics(), 1000);
        
        // Listen for AVA system events
        document.addEventListener('ava-system-update', (e) => {
            this.handleSystemUpdate(e.detail);
        });
    }

    updateMetrics() {
        // Simulate realistic system metrics
        this.metrics.cpu = this.simulateLoad(this.metrics.cpu);
        this.metrics.memory = this.simulateLoad(this.metrics.memory);
        this.metrics.network = Math.floor(Math.random() * 1000);
        
        this.updateUI();
    }

    simulateLoad(currentValue) {
        const maxChange = 5;
        const change = (Math.random() - 0.5) * maxChange;
        return Math.min(Math.max(currentValue + change, 0), 100);
    }

    simulateProcesses() {
        const systemProcesses = [
            { name: 'AVA Core', cpu: 15, memory: 250 },
            { name: 'System Monitor', cpu: 5, memory: 120 },
            { name: 'Network Manager', cpu: 3, memory: 80 },
            { name: 'Security Scanner', cpu: 8, memory: 160 }
        ];

        systemProcesses.forEach((proc, index) => {
            this.metrics.processes.set(1000 + index, {
                ...proc,
                pid: 1000 + index,
                status: 'running'
            });
        });
    }

    updateUI() {
        if (!this.elements.cpu) return;

        // Update metrics displays
        this.elements.cpu.textContent = `${Math.round(this.metrics.cpu)}%`;
        this.elements.memory.textContent = `${Math.round(this.metrics.memory)}%`;
        this.elements.network.textContent = `${this.metrics.network} Mb/s`;

        // Update progress bars
        document.querySelector('.progress-fill.cpu').style.width = `${this.metrics.cpu}%`;
        document.querySelector('.progress-fill.memory').style.width = `${this.metrics.memory}%`;

        this.updateProcessList();
    }

    updateProcessList() {
        if (!this.elements.processList) return;

        const processHTML = Array.from(this.metrics.processes.values())
            .map(proc => `
                <div class="process-item">
                    <div class="process-info">
                        <span class="process-name">${proc.name}</span>
                        <span class="process-pid">PID: ${proc.pid}</span>
                    </div>
                    <div class="process-metrics">
                        <span class="process-cpu">CPU: ${proc.cpu}%</span>
                        <span class="process-memory">MEM: ${proc.memory}MB</span>
                    </div>
                </div>
            `).join('');

        this.elements.processList.innerHTML = processHTML;
    }
}

// Initialize system monitor
const systemMonitor = new SystemMonitor();
