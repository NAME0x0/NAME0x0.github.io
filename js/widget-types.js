const WIDGET_TYPES = {
    SYSTEM_MONITOR: {
        id: 'system-monitor',
        title: 'System Monitor',
        minWidth: 300,
        minHeight: 200,
        defaultPosition: { x: 0, y: 0 },
        permissions: ['system'],
        refreshRate: 1000,
        template: `
            <div class="widget-content system-monitor">
                <div class="metric-group">
                    <div class="metric cpu">
                        <canvas class="metric-chart"></canvas>
                        <div class="metric-value"></div>
                    </div>
                    <!-- ... other metrics ... -->
                </div>
            </div>
        `
    },
    
    AI_ASSISTANT: {
        id: 'ai-assistant',
        title: 'AI Assistant',
        minWidth: 400,
        minHeight: 300,
        defaultPosition: { x: 'center', y: 'center' },
        permissions: ['microphone'],
        template: `
            <div class="widget-content ai-assistant">
                <div class="chat-container">
                    <div class="chat-messages"></div>
                    <div class="chat-input"></div>
                </div>
            </div>
        `
    },
    
    // ... other widget type definitions ...
};

class WidgetFactory {
    static create(type, config = {}) {
        const template = WIDGET_TYPES[type];
        if (!template) throw new Error(`Unknown widget type: ${type}`);
        
        return new Widget({
            ...template,
            ...config,
            id: `${template.id}-${generateUniqueId()}`
        });
    }
}

// Export for module usage
export { WIDGET_TYPES, WidgetFactory };
