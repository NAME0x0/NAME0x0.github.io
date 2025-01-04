/** @type {Object.<string, string>} */
let Commands;
const API_KEY = "cac473d6bf5957b6879513079dd69ae2";

/**
 * Command history and state management
 */
const CommandState = {
    history: [],
    lastCommand: null,
    isProcessing: false,
    context: {},

    addToHistory(command) {
        this.history.push({ command, timestamp: Date.now() });
        if (this.history.length > 50) this.history.shift();
        this.lastCommand = command;
    },

    getLastCommand() {
        return this.lastCommand;
    },

    clearHistory() {
        this.history = [];
        this.lastCommand = null;
    }
};

/**
 * Enhanced system monitoring
 */
const SystemMonitor = {
    metrics: {
        startTime: Date.now(),
        commandsProcessed: 0,
        errors: 0
    },

    /**
     * Get system health metrics
     */
    async getHealthMetrics() {
        const uptime = (Date.now() - this.metrics.startTime) / 1000;
        const errorRate = this.metrics.commandsProcessed ?
            (this.metrics.errors / this.metrics.commandsProcessed * 100).toFixed(2) : 0;

        return {
            uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(uptime % 60)} seconds`,
            commandsProcessed: this.metrics.commandsProcessed,
            errorRate: `${errorRate}%`,
            memory: await SystemUtils.Memory.getUsage(),
            network: await SystemUtils.Network.getConnectionType()
        };
    },

    /**
     * Track command execution
     */
    trackCommand(success = true) {
        this.metrics.commandsProcessed++;
        if (!success) this.metrics.errors++;
    }
};

/**
 * Extended system utilities
 */
const SystemUtils = {
    /** Memory management utilities */
    Memory: {
        getUsage: () => performance?.memory?.usedJSHeapSize || 0,
        getLimit: () => performance?.memory?.jsHeapSizeLimit || 0,
        formatBytes: (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Byte';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    },

    /** Network status utilities */
    Network: {
        getConnectionType: () => navigator.connection?.effectiveType || 'unknown',
        getDownloadSpeed: () => navigator.connection?.downlink || 0,
        isOnline: () => navigator.onLine,
        getLatency: async () => {
            const start = performance.now();
            try {
                await fetch('https://www.google.com/favicon.ico');
                return Math.round(performance.now() - start);
            } catch (e) {
                return -1;
            }
        }
    },

    /** Volume control utilities */
    Audio: {
        volume: 1,
        muted: false,
        adjust: (direction) => {
            switch(direction) {
                case 'up':
                    SystemUtils.Audio.volume = Math.min(1, SystemUtils.Audio.volume + 0.1);
                    break;
                case 'down':
                    SystemUtils.Audio.volume = Math.max(0, SystemUtils.Audio.volume - 0.1);
                    break;
                case 'mute':
                    SystemUtils.Audio.muted = !SystemUtils.Audio.muted;
                    break;
            }
            return SystemUtils.Audio.muted ? 0 : SystemUtils.Audio.volume;
        }
    }
};

/**
 * Logger utility for consistent logging
 */
const Logger = {
    info: (msg) => console.log(`[AVA Info] ${msg}`),
    error: (msg, err) => console.error(`[AVA Error] ${msg}`, err),
    warn: (msg) => console.warn(`[AVA Warning] ${msg}`)
};

/**
 * Helper utilities for common operations
 */
const Utils = {
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    formatTime: (hours, minutes) => `${hours}:${minutes.toString().padStart(2, '0')}`,
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    isOnline: () => navigator.onLine
};

/**
 * Fetches command configurations from Process.json
 * @returns {Promise<void>}
 */
async function fetchCommands() {
    try {
        const response = await fetch("/mic/Process.json");
        if (!response.ok) throw new Error('Failed to fetch commands');
        Commands = await response.json();
    } catch (error) {
        Logger.error('Error loading commands:', error);
        Speak('Sorry, I had trouble loading my command list.');
    }
}
fetchCommands();

/**
 * Initializes speech recognition
 * @returns {SpeechRecognition}
 */
function initializeSpeechRecognition() {
    return new (window.webkitSpeechRecognition || window.SpeechRecognition)();
}

/**
 * Starts the voice recognition process
 */
function startListening() {
    const recognition = initializeSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.start();
    microphoneButton.classList.add("Listen");

    recognition.onerror = (event) => {
        Logger.error('Speech recognition error:', event.error);
        microphoneButton.classList.remove("Listen");
        Speak('I had trouble hearing you. Please try again.');
    };

    recognition.onresult = (event) => {
        microphoneButton.classList.remove("Listen");
        handleResults(event);
    };
}

function handleResults(data) {
    let text = data.results[0][0].transcript;
    text = text.toLowerCase();
    Logger.info(text);

    ProcessCommand(text);
}

/**
 * Enhanced command processor with better error handling
 * @param {string} userText - User's voice input
 */
async function ProcessCommand(userText) {
    try {
        if (!userText?.trim() || !Commands) {
            throw new Error('Invalid input or commands not loaded');
        }

        CommandState.isProcessing = true;
        Logger.info(`Processing command: ${userText}`);

        // Add context awareness
        const context = {
            time: new Date(),
            previousCommand: CommandState.getLastCommand(),
            systemState: await SystemMonitor.getHealthMetrics()
        };

        // Handle special commands
        if (await handleSpecialCommands(userText, context)) {
            return;
        }

        // Process regular commands
        await processRegularCommand(userText, context);

    } catch (error) {
        await ErrorRecovery.handleError(error, { type: 'command', command: userText });
    } finally {
        CommandState.isProcessing = false;
    }
}

/**
 * Handles special commands that need custom processing
 * @param {string} userText - User's input
 * @returns {Promise<boolean>} True if special command was handled
 */
async function handleSpecialCommands(userText) {
    // Search commands
    if (userText.includes("search on google")) {
        const query = userText.slice(16).trim();
        if (query) {
            Speak(`Searching Google for: ${query}`);
            searchOnGoogle(query);
            return true;
        }
    }

    // System commands
    if (userText.includes("system status")) {
        await getFullSystemStatus();
        return true;
    }

    return false;
}

/**
 * Gets comprehensive system status
 */
async function getFullSystemStatus() {
    const status = [];
    
    // Connection status
    status.push(`Internet: ${Utils.isOnline() ? 'Online' : 'Offline'}`);
    if (Utils.isOnline()) {
        status.push(`Speed: ${navigator.connection?.downlink || 'Unknown'} Mbps`);
    }
    
    // Battery status
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        status.push(`Battery: ${Math.round(battery.level * 100)}%`);
        status.push(`Charging: ${battery.charging ? 'Yes' : 'No'}`);
    }
    
    // Memory status (if available)
    if (performance?.memory) {
        const usedMemory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
        status.push(`Memory Usage: ${usedMemory}MB`);
    }

    Speak(status.join('. '));
}

/**
 * Enhanced text-to-speech function
 * @param {string} text - Text to speak
 */
function Speak(text) {
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    
    // Try to get a natural English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Natural')
    ) || voices[1] || voices[0];
    
    utter.voice = preferredVoice;
    utter.rate = 1.0;
    utter.pitch = 1.0;
    
    window.speechSynthesis.speak(utter);
}

//To get currentTime
function getCurrentTime() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    currentTimeIs = hours + 'hours' + minutes + 'minutes';
    Speak("The time is..." + currentTimeIs);
}

//Calls function onload
microphoneButton.addEventListener("click", startListening);

function openWeb(Url) {
    window.open(Url);
}

// Enhanced weather reporting with more details
async function getWeatherDetails() {
    try {
        const weatherData = await WeatherSystem.getWeather();
        const formattedReport = formatWeatherReport(weatherData);
        Speak(formattedReport);
    } catch (error) {
        Logger.error('Weather fetch error:', error);
        Speak('Sorry, I had trouble getting the weather information.');
    }
}

// Add new helper functions
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function fetchWeatherData(position) {
    const { latitude, longitude } = position.coords;
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    return response.json();
}

function formatWeatherReport(data) {
    const { temp, humidity, feels_like } = data.main;
    const description = Utils.capitalize(data.weather[0].description);
    return `Current temperature is ${Math.round(temp)}°C, feels like ${Math.round(feels_like)}°C. 
            ${description} with ${humidity}% humidity.`;
}

// Get today's date
function getTodayDate() {
    var d = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months[d.getMonth()];
    var date = d.getDate();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekDay = days[d.getDay()];
    var year = d.getFullYear();
    Speak("Today date is " + weekDay + " " + date + " " + month + " " + year);
}

//Opening camera
function openCamera() {
    openCamera = window.open(
        'http://localhost:5500/mic/Camera2.html',
        "",
        "width=700px,height=450px,left=300px,top=100px"
    );
}

//Closing Camera
function closeCamera() {
    openCamera.close();
}

//Search on Google
function searchOnGoogle(data) {
    window.open(
        `https://www.google.com/search?q=${data}`,
        "Google",
    );
}

//Search on Youtube
function searchOnYoutube(data) {
    window.open(
        `https://www.youtube.com/search?q=${data}`,
        "Youtube",
    );
}

//Close AVA
function closeAVA() {
    setTimeout(function () {
        window.close();
    }, 2 * 1000);
}

//Reload AVA
function reloadAVA() {
    // Speak('Reloading ava...');
    // Speak('Taking initial checks...');
    // Speak('Backing up configurations...');
    // Speak('I am online and ready again...');
    Speak("please wait...");
    Speak("reloading...");
    setTimeout(function () {
        location.reload();
    }, 7 * 1000);
}

//To move AVA window upside
function stepUp() {
    window.moveBy(0, -100);
}

//To move AVA window downside
function stepDown() {
    window.moveBy(0, 100);
}

//To move against x-axis out
function moveToXAxisOut() {
    window.moveBy(100, 0);
}

//To move against x-axis in
function moveToXAxisIn() {
    window.moveBy(-100, 0);
}

//To get a Battery
let batteryPromise = navigator.getBattery();
batteryPromise.then(printBatteryStatus);

function printBatteryStatus(batteryObject) {
    // console.log("IsCharging", batteryObject.charging);
    window.batteryLevel = Math.round(batteryObject.level * 100);
    // console.log("Percentage", batteryLevel+"%");
}
function getBattery() {
    Speak("Battery left in the device is " + batteryLevel + "percent");
}
//Get family Information
function getFamilyInfo() {
    Speak("There are six members in your family.");
    Speak("Your father, mother, you, younger brother, youngest brother, and your cat.");
    Speak("You live in Dubai, United Arab Emirates.");
    Speak("I have a lot more to say, but I think this will suffice.");
}

//Telling a Joke
function tellMeAJoke() {
    window.shutter1 = new Audio();  //window is use here to access variable anywhere in Program
    shutter1.autoplay = true;
    // play sound effect
    window.randomNumber = Math.floor((Math.random() * 6) + 1);
    Logger.info(randomNumber);
    if (randomNumber == 1) {
        shutter1.src = 'Joke 1.mp3';
    }
    else if (randomNumber == 2) {
        shutter1.src = 'Joke 2.mp3';
    }
    else if (randomNumber == 3) {
        shutter1.src = 'Joke 3.mp3';
    }
    else if (randomNumber == 4) {
        shutter1.src = 'Joke 4.mp3';
    }
    else if (randomNumber == 5) {
        shutter1.src = 'Joke 5.mp3';
    }
    else {
        shutter1.src = 'Joke 6.mp3';
    }
    shutter1.play();
}
//Next Joke
function nextJoke() {
    if (randomNumber < 6) {
        randomNumber = randomNumber + 1;
    }
    else {
        randomNumber = 0;
    }

    if (randomNumber == 1) {
        shutter1.src = 'Joke 1.mp3';
    }
    else if (randomNumber == 2) {
        shutter1.src = 'Joke 2.mp3';
    }
    else if (randomNumber == 3) {
        shutter1.src = 'Joke 3.mp3';
    }
    else if (randomNumber == 4) {
        shutter1.src = 'Joke 4.mp3';
    }
    else if (randomNumber == 5) {
        shutter1.src = 'Joke 5.mp3';
    }
    else {
        shutter1.src = 'Joke 6.mp3';
    }
}
//Welcome to friends
function welcomeToFriends() {
    Speak("Welcome everyone. I am AVA, it's nice to meet you.");
    Speak("I have a comprehensive list and I'm sure you're on it.");
    Speak("Sir, should I step aside? I think you would like to talk with your friends.");
}
//Show friends list
function friendList() {
    window.friendList = window.open(
        "http://localhost:5500/mic/friendList.html",
        "",
        "width=700px,height=500px"
    )
}
//Close Friend List
function closeList() {
    friendList.close();
}

//System Information
function systemInfo() {
    if (navigator.onLine) {
        Speak("The system is online with a speed of " + navigator.connection.downlink + " megabytes per second");
    }
    else {
        Speak("The system is offline.");
    }
    Speak("The keyboard language is set to " + navigator.language);
    var type = navigator.connection.effectiveType;
    type = type.slice(0, 1);
    Speak("The system is using a " + type + "G connection");
    var platform = navigator.platform;
    platform = platform.slice(3, 5);
    Speak("This is a " + platform + "-bit Windows system");
}
//Internet Speed
function internetSpeed() {
    if (navigator.onLine) {
        Speak("The system is online with the speed of " + navigator.connection.downlink + " MB per second");
    }
    else {
        Speak("The system is not online...");
    }
}

function readList() {
    var friendList = [];
    var friendList1 = "";
    friendList1 = localStorage.getItem("array");
    friendList = friendList1.split(",");
    Logger.info(friendList);

    for (let friend of friendList) {
        Logger.info(friend);
        Speak(friend);
    }
}

/**
 * Enhanced system monitoring functions
 */
async function getDetailedSystemStatus() {
    const status = [];
    
    // Memory status
    const memUsage = SystemUtils.Memory.getUsage();
    status.push(`Memory usage: ${SystemUtils.Memory.formatBytes(memUsage)}`);
    
    // Network status
    const connectionType = SystemUtils.Network.getConnectionType();
    const downloadSpeed = SystemUtils.Network.getDownloadSpeed();
    const latency = await SystemUtils.Network.getLatency();
    
    status.push(`Network: ${connectionType.toUpperCase()} connection`);
    status.push(`Download speed: ${downloadSpeed} Mbps`);
    if (latency > 0) status.push(`Latency: ${latency}ms`);

    // Battery status
    const battery = await navigator.getBattery();
    status.push(`Battery: ${Math.round(battery.level * 100)}%`);
    status.push(`Power: ${battery.charging ? 'Charging' : 'On battery'}`);

    return status.join('. ');
}

/**
 * New function to handle volume controls
 */
function adjustVolume(direction) {
    const newVolume = SystemUtils.Audio.adjust(direction);
    return newVolume;
}

/**
 * Enhanced command execution with better error handling
 * @param {string} action - Command action to execute
 */
async function executeCommand(action) {
    try {
        const result = await eval(action);
        Logger.info(`Command executed successfully: ${action}`);
        return result;
    } catch (error) {
        Logger.error(`Command execution failed: ${action}`, error);
        throw error;
    }
}

/**
 * Enhanced weather reporting with forecasting
 */
async function getDetailedWeather() {
    try {
        const position = await getCurrentPosition();
        const current = await fetchWeatherData(position);
        const forecast = await fetchWeatherForecast(position);
        
        const report = formatWeatherReport(current);
        const forecastReport = formatForecastReport(forecast);
        
        Speak(`${report} ${forecastReport}`);
    } catch (error) {
        Logger.error('Weather fetch error:', error);
        Speak('Sorry, I had trouble getting the weather information.');
    }
}

/**
 * Format weather forecast into speech
 */
function formatForecastReport(forecast) {
    if (!forecast?.daily?.[0]) return '';
    
    const tomorrow = forecast.daily[0];
    return `Tomorrow expects ${tomorrow.weather[0].description} with a high of ${Math.round(tomorrow.temp.max)}°C and a low of ${Math.round(tomorrow.temp.min)}°C.`;
}

/**
 * Enhanced error recovery system
 */
const ErrorRecovery = {
    async handleError(error, context) {
        Logger.error('Error occurred:', error);
        
        // Try to recover based on context
        if (context.type === 'network') {
            await this.handleNetworkError(error);
        } else if (context.type === 'speech') {
            await this.handleSpeechError(error);
        } else {
            await this.handleGenericError(error);
        }
    },

    async handleNetworkError(error) {
        if (!navigator.onLine) {
            Speak('I detected that we are offline. I will continue with limited functionality.');
            return;
        }
        Speak('I encountered a network issue. Let me try again.');
    },

    async handleSpeechError(error) {
        Speak('I had trouble understanding that. Could you please repeat?');
    },

    async handleGenericError(error) {
        Speak('I encountered an unexpected issue. I will try to recover.');
        await fetchCommands(); // Reload commands
    }
};

/**
 * Enhanced weather system with caching
 */
const WeatherSystem = {
    cache: null,
    lastUpdate: 0,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes

    async getWeather() {
        if (this.isCacheValid()) {
            return this.cache;
        }

        const position = await getCurrentPosition();
        const data = await fetchWeatherData(position);
        this.updateCache(data);
        return data;
    },

    isCacheValid() {
        return this.cache && (Date.now() - this.lastUpdate < this.cacheTimeout);
    },

    updateCache(data) {
        this.cache = data;
        this.lastUpdate = Date.now();
    }
};

/**
 * Task Management System
 */
const TaskManager = {
    tasks: [],
    
    addTask(task) {
        this.tasks.push({
            id: Date.now(),
            text: task,
            created: new Date(),
            completed: false
        });
        this.saveTasks();
    },
    
    getTasks() {
        return this.tasks;
    },
    
    clearTasks() {
        this.tasks = [];
        this.saveTasks();
    },
    
    saveTasks() {
        localStorage.setItem('ava_tasks', JSON.stringify(this.tasks));
    },
    
    loadTasks() {
        const saved = localStorage.getItem('ava_tasks');
        this.tasks = saved ? JSON.parse(saved) : [];
    }
};

/**
 * Note Management System
 */
const NoteManager = {
    notes: [],
    currentNote: null,
    
    createNote(content) {
        this.currentNote = {
            id: Date.now(),
            content,
            created: new Date()
        };
    },
    
    saveCurrentNote() {
        if (this.currentNote) {
            this.notes.push(this.currentNote);
            localStorage.setItem('ava_notes', JSON.stringify(this.notes));
            this.currentNote = null;
        }
    }
};

/**
 * Timer and Alarm System
 */
const TimeManager = {
    timers: {},
    alarms: {},
    
    startTimer(duration) {
        const id = Date.now();
        this.timers[id] = {
            start: Date.now(),
            duration: duration * 1000,
            interval: setInterval(() => this.checkTimer(id), 1000)
        };
        return id;
    },
    
    checkTimer(id) {
        const timer = this.timers[id];
        if (Date.now() - timer.start >= timer.duration) {
            clearInterval(timer.interval);
            delete this.timers[id];
            Speak('Timer completed');
        }
    },
    
    setAlarm(time) {
        // Implementation for alarm functionality
    }
};

/**
 * Workspace Mode Manager
 */
const WorkspaceManager = {
    currentMode: 'normal',
    
    setMode(mode) {
        this.currentMode = mode;
        switch(mode) {
            case 'workspace':
                this.enableWorkspaceMode();
                break;
            case 'focus':
                this.enableFocusMode();
                break;
            case 'normal':
                this.enableNormalMode();
                break;
        }
    },
    
    enableWorkspaceMode() {
        // Configure system for work
        SystemUtils.Audio.adjust('down');
        // Additional workspace optimizations
    },
    
    enableFocusMode() {
        // Minimize distractions
        SystemUtils.Audio.adjust('mute');
        // Additional focus mode settings
    },
    
    enableNormalMode() {
        // Reset to default settings
        SystemUtils.Audio.adjust('up');
        // Additional normal mode settings
    }
};

function createReminder() {
    // Implementation for reminder creation
}

function addTask() {
    // Implementation for task addition
}

function showTasks() {
    const tasks = TaskManager.getTasks();
    if (tasks.length === 0) {
        Speak('No tasks found.');
        return;
    }
    tasks.forEach(task => {
        Speak(task.text);
    });
}

function avaSaysHello() {
    const hours = new Date().getHours();
    let greeting = hours < 12 ? 'Good morning' : 
                  hours < 18 ? 'Good afternoon' : 
                  'Good evening';
    Speak(`${greeting}. AVA system initialized and ready to assist.`);
}

/**
 * Productivity Suite - Enhanced task and time management
 */
const ProductivitySuite = {
    pomodoro: {
        isActive: false,
        workDuration: 25 * 60, // 25 minutes
        breakDuration: 5 * 60,  // 5 minutes
        timer: null,
        
        start() {
            this.isActive = true;
            this.startWorkSession();
        },
        
        startWorkSession() {
            Speak('Starting work session. Focus for 25 minutes.');
            this.timer = setTimeout(() => this.startBreak(), this.workDuration * 1000);
        },
        
        startBreak() {
            Speak('Time for a 5-minute break.');
            this.timer = setTimeout(() => this.startWorkSession(), this.breakDuration * 1000);
        },
        
        stop() {
            this.isActive = false;
            clearTimeout(this.timer);
            Speak('Pomodoro session ended.');
        }
    },
    
    quickActions: {
        shortcuts: new Map(),
        
        register(name, action) {
            this.shortcuts.set(name, action);
            Logger.info(`Registered quick action: ${name}`);
        },
        
        execute(name) {
            if (this.shortcuts.has(name)) {
                this.shortcuts.get(name)();
                return true;
            }
            return false;
        }
    }
};

/**
 * Enhanced Notification System
 */
const NotificationManager = {
    permission: null,
    queue: [],
    
    async initialize() {
        this.permission = await Notification.requestPermission();
    },
    
    async notify(title, options = {}) {
        if (this.permission !== 'granted') return;
        
        return new Notification(title, {
            icon: '/path/to/icon.png',
            badge: '/path/to/badge.png',
            ...options
        });
    },
    
    scheduleNotification(title, options = {}, delay) {
        setTimeout(() => this.notify(title, options), delay);
    }
};

/**
 * Context-Aware Command Handler
 */
const ContextManager = {
    context: {
        lastCommand: null,
        timeOfDay: null,
        activeMode: 'normal',
        userPreferences: new Map()
    },
    
    updateContext() {
        const hour = new Date().getHours();
        this.context.timeOfDay = 
            hour < 12 ? 'morning' :
            hour < 17 ? 'afternoon' :
            'evening';
    },
    
    getRelevantCommands() {
        // Filter commands based on context
        return Object.entries(Commands).filter(([cmd, action]) => 
            this.isCommandRelevant(cmd, this.context)
        );
    }
};

/**
 * Smart Response Generator
 */
const ResponseGenerator = {
    templates: {
        success: [
            "Task completed successfully.",
            "Done! Anything else?",
            "Completed as requested."
        ],
        error: [
            "I encountered an issue: {error}",
            "Sorry, but {error}",
            "There was a problem: {error}"
        ]
    },
    
    generate(type, data = {}) {
        const templates = this.templates[type];
        const template = templates[Math.floor(Math.random() * templates.length)];
        return this.interpolate(template, data);
    },
    
    interpolate(template, data) {
        return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || '');
    }
};

// Add new command processing capabilities
async function processRegularCommand(userText, context) {
    try {
        // Update context before processing
        ContextManager.updateContext();
        
        // Check for quick actions first
        if (ProductivitySuite.quickActions.execute(userText)) {
            return;
        }

        // Process command with context awareness
        for (const [command, action] of Object.entries(Commands)) {
            if (userText.includes(command)) {
                await executeCommand(action);
                CommandState.addToHistory(command);
                SystemMonitor.trackCommand(true);
                return;
            }
        }

        // No matching command found
        Speak(ResponseGenerator.generate('error', { error: 'Command not recognized' }));

    } catch (error) {
        SystemMonitor.trackCommand(false);
        await ErrorRecovery.handleError(error, { type: 'command', command: userText });
    }
}

/**
 * Initialize all systems on startup
 */
async function initializeSystems() {
    await NotificationManager.initialize();
    TaskManager.loadTasks();
    
    // Register quick actions
    ProductivitySuite.quickActions.register('focus', () => WorkspaceManager.setMode('focus'));
    ProductivitySuite.quickActions.register('break', () => ProductivitySuite.pomodoro.start());
    
    Logger.info('All systems initialized');
}

// Call initialization
initializeSystems();

/**
 * AI Assistant Core Functionality Manager
 */
const AssistantCore = {
    state: {
        active: false,
        lastInteraction: null,
        mode: 'normal'
    },

    /**
     * Enhanced natural language processing
     */
    nlp: {
        keywords: new Map(),
        
        addKeyword(word, handler) {
            this.keywords.set(word.toLowerCase(), handler);
        },
        
        findIntent(text) {
            const words = text.toLowerCase().split(' ');
            for (const [keyword, handler] of this.keywords) {
                if (words.includes(keyword)) {
                    return handler;
                }
            }
            return null;
        }
    },

    /**
     * Voice interaction manager
     */
    voice: {
        speaking: false,
        queue: [],
        
        async speak(text, priority = false) {
            if (priority) {
                this.queue.unshift(text);
            } else {
                this.queue.push(text);
            }
            
            if (!this.speaking) {
                await this.processQueue();
            }
        },
        
        async processQueue() {
            while (this.queue.length > 0) {
                this.speaking = true;
                const text = this.queue.shift();
                await Speak(text);
                await Utils.delay(500); // Small pause between speeches
            }
            this.speaking = false;
        }
    }
};

/**
 * Command Chain Processing System
 */
const CommandChain = {
    chains: new Map(),
    
    createChain(name, steps) {
        this.chains.set(name, {
            steps,
            currentStep: 0,
            data: {}
        });
    },
    
    async processStep(chainName, input) {
        const chain = this.chains.get(chainName);
        if (!chain) return false;
        
        const step = chain.steps[chain.currentStep];
        const result = await step.execute(input, chain.data);
        
        if (result.success) {
            chain.currentStep++;
            chain.data = { ...chain.data, ...result.data };
            
            if (chain.currentStep >= chain.steps.length) {
                // Chain completed
                this.chains.delete(chainName);
                return true;
            }
        }
        return false;
    }
};

/**
 * Enhanced System Performance Monitor
 */
const PerformanceMonitor = {
    metrics: {
        commandLatency: [],
        memoryUsage: [],
        errorRates: [],
        batteryReadings: []
    },
    
    track(metric, value) {
        if (this.metrics[metric]) {
            this.metrics[metric].push({
                value,
                timestamp: Date.now()
            });
            
            // Keep only last 100 readings
            if (this.metrics[metric].length > 100) {
                this.metrics[metric].shift();
            }
        }
    },
    
    getAverages() {
        const averages = {};
        for (const [metric, values] of Object.entries(this.metrics)) {
            if (values.length > 0) {
                const sum = values.reduce((acc, curr) => acc + curr.value, 0);
                averages[metric] = sum / values.length;
            }
        }
        return averages;
    },
    
    async monitor() {
        setInterval(async () => {
            this.track('memoryUsage', await SystemUtils.Memory.getUsage());
            this.track('batteryReadings', (await navigator.getBattery()).level * 100);
        }, 60000); // Every minute
    }
};

/**
 * Enhanced command execution with intelligence
 */
async function executeCommand(action) {
    const startTime = performance.now();
    try {
        // Track command start
        PerformanceMonitor.track('commandStart', startTime);
        
        // Check for command chain
        if (CommandChain.chains.size > 0) {
            for (const [chainName] of CommandChain.chains) {
                if (await CommandChain.processStep(chainName, action)) {
                    return;
                }
            }
        }

        // Normal execution
        const result = await eval(action);
        
        // Track successful execution
        const endTime = performance.now();
        PerformanceMonitor.track('commandLatency', endTime - startTime);
        
        Logger.info(`Command executed successfully: ${action}`);
        return result;
    } catch (error) {
        // Track failed execution
        PerformanceMonitor.track('errorRates', 1);
        Logger.error(`Command execution failed: ${action}`, error);
        throw error;
    }
}

// Initialize new systems
async function initializeEnhancedSystems() {
    // ...existing initialization...
    
    // Setup command chains
    CommandChain.createChain('reminder', [
        {
            execute: async (input, data) => {
                const time = extractTimeFromInput(input);
                return { success: true, data: { time } };
            }
        },
        {
            execute: async (input, data) => {
                const message = input;
                await NotificationManager.scheduleNotification('Reminder', { body: message }, data.time);
                return { success: true };
            }
        }
    ]);

    // Start performance monitoring
    await PerformanceMonitor.monitor();
    
    // Initialize NLP keywords
    AssistantCore.nlp.addKeyword('help', () => showContextualHelp());
    AssistantCore.nlp.addKeyword('status', () => getFullSystemStatus());
    
    Logger.info('Enhanced systems initialized');
}

// Start the enhanced initialization
initializeEnhancedSystems();