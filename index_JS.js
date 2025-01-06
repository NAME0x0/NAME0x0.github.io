const API_KEY="cac473d6bf5957b6879513079dd69ae2";

let Commands = {};

const ErrorHandler = {
    errors: [],
    maxErrors: 50,
    
    handle(error, context = {}) {
        const errorInfo = {
            timestamp: new Date(),
            error: error.message,
            context,
            stack: error.stack
        };
        
        this.errors.unshift(errorInfo);
        if (this.errors.length > this.maxErrors) {
            this.errors.pop();
        }
        
        console.error('AVA Error:', errorInfo);
        return this.getRecoveryAction(error);
    },
    
    getRecoveryAction(error) {
        if (error.name === 'NetworkError') {
            return 'network';
        }
        return 'default';
    }
};

const speechRecognition=window.webkitSpeechRecognition //Google Chrome 
||
window.SpeechRecognition;  //Firefox


//To get a Battery
let batteryPromise = navigator.getBattery();
batteryPromise.then(batteryCallback1);

function batteryCallback1(batteryObject) {
   printBatteryStatus(batteryObject);
}
function printBatteryStatus(batteryObject) {
    const batteryLevel = batteryObject.level*100;
    // console.log("Percentage", batteryLevel+"%");
    document.getElementById('ram').innerHTML = "Battery: " + batteryLevel + "%";
}

//Temperature
getWeatherDetails1();
function getWeatherDetails1()
{
    if("geolocation" in navigator)
    {
        navigator.geolocation.getCurrentPosition(async function(position){
            let lat=position.coords.latitude;
            let lon=position.coords.longitude;

            const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

            let response = await fetch(api_url);

            let data = await response.json();

            manipulateWeatherData(data);

        });
    }
}
function manipulateWeatherData(data)
{
    let city=data.name;
    let temp=data.main.temp;
    let humidity=data.main.humidity;
    let weather_Name = data.weather[0].main;

    let icon=data.weather[0].icon;
    let description=data.weather[0].main;
    //console.log(data);
    // let msg=`Current temperature is ${temp} degree celcius and humidity is ${humidity} grams of water vapour per kilogram`;
    // Speak(msg);
    //We can use other data if we want to show on screen
    let imageUrl = `https://openweathermap.org/img/w/${icon}.png`;

    let image = `<img src="${imageUrl}" height="90" width="90">`;
    // document.write(image);
    document.getElementById('tempValue').innerHTML = `${temp}`;
    document.getElementById('humidityValue').innerHTML = `${humidity}` + "*";
    document.getElementById('weatherImage').innerHTML = image;
    document.getElementById('weather_Name').innerHTML = weather_Name;
    
}
//Get Date
getDate1();
function getDate1()
{
    var d = new Date();
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    document.getElementById("monthValue").innerHTML = months[d.getMonth()];
    document.getElementById("dateValue").innerHTML = d.getDate();
    document.getElementById("timeValue").innerHTML = d.getHours() + ":" + d.getMinutes();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    document.getElementById("weekDayValue").innerHTML = days[d.getDay()];
}

// AVAStartingReply();
function startListening()
{
    const recong = new speechRecognition();
    recong.start();

    recong.onresult =function(data)
    {
        handleResults(data);
    }
}
function handleResults(data)
{
    let text=data.results[0][0].transcript;
    text = text.toLowerCase();
    console.log(text);

    ProcessCommand(text);
}

async function loadCommands(retries = 3) {
    while (retries > 0) {
        try {
            const response = await fetch('./backend/Process.json');
            if (!response.ok) throw new Error('Failed to fetch commands');
            Commands = await response.json();
            return;
        } catch (error) {
            retries--;
            if (retries === 0) {
                ErrorHandler.handle(error, { context: 'loading commands' });
                Speak('I had trouble loading my command list.');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

async function ProcessCommand(UserText) {
    if (!UserText) return;
    
    UserText = UserText.toLowerCase().trim();
    
    // Visual feedback
    const searchBox = document.getElementById('commandInput');
    if (searchBox) {
        searchBox.classList.add('processing');
    }
    
    try {
        // Check for "push enable" command first
        if (UserText.includes("push enable")) {
            return;
        }
        
        // Check if commands are loaded
        if (!Commands || Object.keys(Commands).length === 0) {
            await loadCommands();
        }
        
        // Cross-browser speech synthesis
        const browserSpeech = window.speechSynthesis || window.webkitSpeechSynthesis || window.mozSpeechSynthesis;
        
        // Process command
        for (const [command, action] of Object.entries(Commands)) {
            if (UserText === command || UserText.includes(command)) {
                try {
                    await eval(action);
                    return;
                } catch (error) {
                    const recovery = ErrorHandler.handle(error, { command, action });
                    handleRecovery(recovery);
                }
            }
        }
        
        // No command matched
        Speak('I did not understand that command. Try something else.');
        
    } catch (error) {
        ErrorHandler.handle(error, { userText: UserText });
        Speak('Sorry, I encountered an error. Please try again.');
    } finally {
        // Remove visual feedback
        if (searchBox) {
            searchBox.classList.remove('processing');
        }
    }
}

function handleRecovery(recoveryType) {
    switch(recoveryType) {
        case 'network':
            Speak('I\'m having trouble connecting to the network. Please check your connection.');
            break;
        default:
            Speak('I encountered an error. Please try again.');
    }
}

function Speak(TEXT) {
    return new Promise((resolve, reject) => {
        try {
            const utter = new SpeechSynthesisUtterance();
            utter.text = TEXT;
            
            // Get available voices
            const voices = window.speechSynthesis.getVoices();
            
            // Try to find an English voice
            const englishVoice = voices.find(voice => 
                voice.lang.includes('en') && voice.localService
            ) || voices[1] || voices[0];
            
            if (englishVoice) {
                utter.voice = englishVoice;
            }
            
            utter.onend = () => resolve();
            utter.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                reject(error);
            };
            
            window.speechSynthesis.speak(utter);
            
        } catch (error) {
            console.error('Speech synthesis not supported:', error);
            // Fallback to console
            console.log('AVA says:', TEXT);
            resolve();
        }
    });
}

function AVAStartingReply()
      {
        Speak("please wait...system initializing...backing up configurations...gathering audio and video files...");
        Speak("system initialized...");
        Speak("i am online and ready... say push enable to talk... or simply click arc reactor...");
        startListening();
      }

document.addEventListener('DOMContentLoaded', function() {
    loadCommands();
    
    const commandInput = document.getElementById('commandInput');
    const micIcon = document.getElementById('micIcon');

    // Handle text input
    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const text = this.value.toLowerCase();
            ProcessCommand(text);
            this.value = ''; // Clear input after processing
        }
    });

    // Handle mic icon click
    micIcon.addEventListener('click', function() {
        startListening();
        commandInput.placeholder = 'Listening...';
        setTimeout(() => {
            commandInput.placeholder = "Type a command or say 'push enable' to use voice...";
        }, 5000);
    });
});
