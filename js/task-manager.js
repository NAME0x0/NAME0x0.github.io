class TaskManager {
    constructor() {
        this.tasks = new Map();
        this.taskList = document.getElementById('taskList');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedTasks();
    }

    setupEventListeners() {
        document.addEventListener('ava-task-created', (e) => {
            this.addTask(e.detail);
        });

        document.addEventListener('ava-task-completed', (e) => {
            this.completeTask(e.detail.id);
        });
    }

    addTask(taskData) {
        const task = {
            id: Date.now(),
            status: 'active',
            created: new Date(),
            ...taskData
        };

        this.tasks.set(task.id, task);
        this.updateUI();
        this.saveTasks();
    }

    updateUI() {
        if (!this.taskList) return;

        const taskElements = Array.from(this.tasks.values())
            .filter(task => task.status === 'active')
            .map(task => `
                <div class="task-item" data-task-id="${task.id}">
                    <div class="task-header">
                        <span class="task-title">${task.title}</span>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                    </div>
                    <div class="task-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${task.progress || 0}%"></div>
                        </div>
                        <span class="progress-text">${task.progress || 0}%</span>
                    </div>
                    <div class="task-actions">
                        <button onclick="taskManager.completeTask(${task.id})">✓</button>
                        <button onclick="taskManager.deleteTask(${task.id})">×</button>
                    </div>
                </div>
            `).join('');

        this.taskList.innerHTML = taskElements;
    }

    // ... other task management methods
}

// Initialize Task Manager
const taskManager = new TaskManager();
