class WidgetSystem {
    constructor() {
        this.init();
        this.activeWidgets = new Map();
        this.widgetStates = new Map();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupWidgets();
            this.setupTerminal();
            this.initializeAICore();
        });
    }

    setupWidgets() {
        document.querySelectorAll('.widget-trigger').forEach(trigger => {
            const widgetId = trigger.dataset.widgetTrigger;
            const widget = document.querySelector(`[data-widget="${widgetId}"]`);
            const container = widget?.closest('.widget-container');
            
            if (widget && container) {
                this.widgetStates.set(widgetId, {
                    trigger,
                    widget,
                    container,
                    active: false,
                    content: widget.innerHTML,
                    position: {
                        x: 0,
                        y: 0
                    }
                });

                // Make widgets draggable
                this.makeWidgetDraggable(widget);
                
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleWidget(widgetId);
                });

                // Initialize widget in closed state
                widget.style.display = 'none';
                container.classList.remove('active');
            }
        });

        // Add global click handler for closing widgets
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.widget-container') && 
                !e.target.closest('.widget-trigger') &&
                !e.target.closest('.terminal-container')) {
                this.minimizeAllWidgets();
            }
        });
    }

    toggleWidget(widgetId) {
        const state = this.widgetStates.get(widgetId);
        if (!state) return;

        const isActive = state.active;
        
        // Minimize other widgets
        this.minimizeAllWidgets();

        if (!isActive) {
            this.showWidget(widgetId);
        }
    }

    showWidget(widgetId) {
        const state = this.widgetStates.get(widgetId);
        if (!state) return;

        state.active = true;
        state.widget.style.display = 'block';
        state.container.classList.add('active');
        state.trigger.classList.add('active');

        // Force reflow
        state.widget.offsetHeight;

        requestAnimationFrame(() => {
            state.widget.style.opacity = '1';
            state.widget.style.transform = 'translateX(0)';
        });

        // Update content if needed
        this.updateWidgetContent(widgetId);
    }

    minimizeWidget(widgetId) {
        const state = this.widgetStates.get(widgetId);
        if (!state || !state.active) return;

        state.active = false;
        state.widget.style.opacity = '0';
        state.widget.style.transform = 'translateX(-20px)';
        state.container.classList.remove('active');
        state.trigger.classList.remove('active');

        setTimeout(() => {
            if (!state.active) {
                state.widget.style.display = 'none';
            }
        }, 300);
    }

    minimizeAllWidgets() {
        this.widgetStates.forEach((_, widgetId) => {
            this.minimizeWidget(widgetId);
        });
    }

    makeWidgetDraggable(widget) {
        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'widget-resize-handle';
        widget.appendChild(resizeHandle);

        // Track resize state
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizeHandle.addEventListener('mousedown', initResize);

        function initResize(e) {
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = widget.offsetWidth;
            startHeight = widget.offsetHeight;

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        }

        function resize(e) {
            if (!isResizing) return;

            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);

            widget.style.width = `${Math.max(300, newWidth)}px`;
            widget.style.height = `${Math.max(200, newHeight)}px`;
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = widget.querySelector('.widget-header') || widget;

        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            widget.style.top = (widget.offsetTop - pos2) + "px";
            widget.style.left = (widget.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    updateWidgetContent(widgetId) {
        const state = this.widgetStates.get(widgetId);
        if (!state) return;

        const widgetType = state.widget.dataset.widget;
        
        switch(widgetType) {
            case 'weather':
                if (window.initializeWeatherTime) {
                    window.initializeWeatherTime();
                }
                break;
            case 'calendar':
                if (window.calendar) {
                    window.calendar.renderEvents();
                }
                break;
        }
    }

    closeWidget(trigger) {
        const widgetId = trigger.dataset.widgetTrigger;
        this.minimizeWidget(widgetId);
    }

    closeAllWidgets() {
        this.minimizeAllWidgets();
    }
}

// Initialize the widget system
const widgetSystem = new WidgetSystem();

// Add error handling
window.addEventListener('error', (e) => {
    console.error('Widget system error:', e.error);
});
