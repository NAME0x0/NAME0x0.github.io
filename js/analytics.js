class SystemAnalytics {
    constructor() {
        this.container = document.querySelector('.analytics-container');
        this.data = {
            systemHealth: [],
            performance: [],
            security: []
        };
        this.init();
    }

    init() {
        this.createCharts();
        this.startDataCollection();
        
        document.addEventListener('ava-analytics-update', (e) => {
            this.updateAnalytics(e.detail);
        });
    }

    createCharts() {
        // Create performance chart
        this.performanceChart = new Chart(
            this.createCanvas('performance'),
            this.getChartConfig('System Performance')
        );

        // Create health chart
        this.healthChart = new Chart(
            this.createCanvas('health'),
            this.getChartConfig('System Health')
        );
    }

    createCanvas(id) {
        const canvas = document.createElement('canvas');
        canvas.id = `chart-${id}`;
        this.container.appendChild(canvas);
        return canvas.getContext('2d');
    }

    getChartConfig(title) {
        return {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: title,
                    data: [],
                    borderColor: '#64ffda',
                    backgroundColor: 'rgba(100, 255, 218, 0.1)'
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 300
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    }

    startDataCollection() {
        setInterval(() => {
            this.collectMetrics();
        }, 1000);
    }

    collectMetrics() {
        const metrics = {
            timestamp: Date.now(),
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.random() * 1000
        };

        this.updateCharts(metrics);
    }

    updateCharts(metrics) {
        // Update charts with new data
        this.updateChart(this.performanceChart, metrics);
        this.updateChart(this.healthChart, metrics);
    }

    updateChart(chart, metrics) {
        if (!chart) return;

        const maxDataPoints = 20;
        const data = chart.data.datasets[0].data;
        data.push(metrics.cpu);
        
        if (data.length > maxDataPoints) {
            data.shift();
            chart.data.labels.shift();
        }

        chart.data.labels.push('');
        chart.update('none');
    }

    updateAnalytics(data) {
        this.updateCharts(data);
        this.updateMetrics(data);
        this.generateInsights(data);
    }

    // ... other analytics methods
}

// Initialize analytics
const systemAnalytics = new SystemAnalytics();
