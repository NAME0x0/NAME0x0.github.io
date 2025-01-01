class CalendarManager {
    constructor() {
        this.events = [];
        this.container = document.querySelector('.calendar-content');
    }

    addEvent(event) {
        this.events.push(event);
        this.sortEvents();
        this.renderEvents();
    }

    sortEvents() {
        this.events.sort((a, b) => new Date(a.time) - new Date(b.time));
    }

    renderEvents() {
        this.container.innerHTML = this.events
            .map(event => `
                <div class="calendar-event ${event.priority}">
                    <div class="event-time">${this.formatTime(event.time)}</div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-details">
                        <span class="event-type">${event.type}</span>
                        <span class="event-status">${event.status}</span>
                    </div>
                </div>
            `).join('');
    }

    formatTime(time) {
        return new Date(time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize calendar
const calendar = new CalendarManager();

// Add some sample events
calendar.addEvent({
    time: new Date().setHours(9, 0),
    title: "AI System Diagnostics",
    type: "System",
    status: "Scheduled",
    priority: "high"
});

calendar.addEvent({
    time: new Date().setHours(14, 30),
    title: "Data Analysis",
    type: "Task",
    status: "In Progress",
    priority: "medium"
});
