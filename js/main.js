// Core JavaScript functionality

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed. Main.js executing.');

  // Initialize Background, Widgets and Preloader
  if (typeof initBackgroundParticles === 'function') {
    initBackgroundParticles();
  } else {
    console.error('initBackgroundParticles function not found. Make sure backgroundParticles.js is loaded.');
  }
  animatePreloader();
  updateClock();
  updateDate();
  setInterval(updateClock, 1000);
  setInterval(updateDate, 60000);

  // Terminal Command Processing
  const userInputElement = document.getElementById('user-input');
  // Corrected: Target the div where AI and system messages are appended, not the whole terminal for clearing.
  const terminalOutputContainer = document.getElementById('ai-dynamic-content'); 
  const terminalScrollElement = document.getElementById('terminal'); // For scrolling

  if (userInputElement && terminalOutputContainer && terminalScrollElement) {
    userInputElement.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const commandText = userInputElement.textContent.trim();

        if (commandText) {
          // Construct the full prompt string to echo
          const promptUser = document.querySelector('.prompt-user')?.textContent || "USER";
          const promptSeparator = document.querySelector('.prompt-separator')?.textContent || "@";
          const promptHost = document.querySelector('.prompt-host')?.textContent || "LOCALHOST";
          const promptIndicator = document.querySelector('.prompt-indicator')?.textContent || ":$ ~";
          
          const echoedCommand = `${promptUser}${promptSeparator}${promptHost}${promptIndicator} ${commandText}`;
          appendMessageToTerminal(echoedCommand, 'user-command-echo'); // New class for echoed command styling
          
          processCommand(commandText);
          userInputElement.textContent = '';
        }
      }
    });
  }
});

async function animatePreloader() {
  const loader = document.getElementById('loader');
  const lines = [
    // Ensure these IDs match your index.html loader lines
    { id: 'loader-line-1', delay: 0, duration: 1500, status: null },
    { id: 'loader-line-2', delay: 300, duration: 1500, status: null }, // Adjusted delays for sequential feel
    { id: 'loader-line-3', delay: 600, duration: 1500, status: null },
    { id: 'loader-line-4', delay: 900, duration: 1500, status: null },
    { id: 'loader-line-5', delay: 1200, duration: 1000, status: 'pending' },
    { id: 'loader-line-6', delay: 1500, duration: 1500, status: null }
  ];

  const timeline = anime.timeline({
    complete: function() {
      anime({
        targets: loader,
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: function() {
          loader.style.display = 'none';
          // Initialize the new AI Face WebGL component
          if (typeof initAIFaceWebGL === 'function') {
            initAIFaceWebGL('aiFaceCanvas'); 
          } else {
            console.error('initAIFaceWebGL function not found. Make sure webgl.js is loaded correctly.');
          }
          if (typeof initAnimations === 'function') {
            initAnimations(); 
          } else {
            console.error('initAnimations function not found. Make sure animations.js is loaded.');
          }
        }
      });
    }
  });

  lines.forEach(lineConfig => {
    const lineEl = document.getElementById(lineConfig.id);
    if (lineEl) {
      timeline.add({
        targets: lineEl,
        opacity: [0, 1],
        // Removed duration division, let anime.js handle it based on timeline.
        easing: 'easeInOutQuad', 
        // Delays are now absolute in the timeline context thanks to add() offset parameter below
        begin: function(anim) {
          // Ensure the dot animation starts with the line
          const dotsEl = lineEl.querySelector('.loader-dots');
          if (dotsEl) dotsEl.style.opacity = 1;

          if (lineConfig.status === 'pending') {
            const statusEl = lineEl.querySelector('.loader-status');
            if (statusEl) {
              statusEl.textContent = 'PENDING'; // Set text here
              statusEl.classList.add('pending');
              statusEl.classList.remove('ok');
            }
          }
        },
        complete: function(anim) {
          if (lineConfig.id === 'loader-line-5') {
            setTimeout(() => { // Ensure this timeout is appropriate
              const statusEl = lineEl.querySelector('.loader-status');
              if (statusEl) {
                statusEl.classList.remove('pending');
                statusEl.classList.add('ok');
                statusEl.textContent = 'ONLINE';
              }
            }, 300); // Short delay before switching to ONLINE
          }
           // Stop dot animation when line is fully processed (or let it run if desired)
          // const dotsEl = lineEl.querySelector('.loader-dots');
          // if (dotsEl) dotsEl.style.display = 'none';
        }
      }, lineConfig.delay); // Use the delay directly as the offset for each animation in the timeline
    } else {
      console.error('Preloader line element not found:', lineConfig.id);
    }
  });
}

function updateClock() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

function updateDate() {
  const dateElement = document.getElementById('date');
  if (dateElement) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateElement.textContent = `${year}-${month}-${day}`;
  }
}

function appendMessageToTerminal(message, classNames = 'sys-message') { // Default to sys-message
  const terminalOutputContainer = document.getElementById('ai-dynamic-content');
  const terminalScrollElement = document.getElementById('terminal');

  if (!terminalOutputContainer || !terminalScrollElement) {
    console.error("Terminal output container or scroll element not found.");
    return;
  }

  const newLine = document.createElement('pre');
  newLine.classList.add('terminal-line');

  // Add all specified classes
  classNames.split(' ').forEach(cls => {
    if (cls) newLine.classList.add(cls);
  });
  
  if (classNames.includes('user-command-echo')) {
    newLine.innerHTML = message; // Allow HTML for echoed prompt
  } else {
    newLine.textContent = message;
  }

  terminalOutputContainer.appendChild(newLine);
  terminalScrollElement.scrollTop = terminalScrollElement.scrollHeight;
}

async function processCommand(command) {
  const parts = command.toLowerCase().split(' ');
  const baseCommand = parts[0];
  const args = parts.slice(1);

  const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
  const IP_API_URL = "https://ip-api.com/json/";

  // Helper to append success messages
  const appendSuccess = (msg) => appendMessageToTerminal(msg, 'ai-message command-success');
  // Helper to append error messages (already styled by command-error via ai-message error combo)
  const appendError = (msg) => appendMessageToTerminal(msg, 'ai-message command-error');

  switch (baseCommand) {
    case 'google':
      if (args.length > 0) {
        const searchQuery = args.join(' ');
        appendMessageToTerminal(`Executing: google ${searchQuery}...`, 'sys-message');
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        appendSuccess('Search results opened in a new tab.');
      } else {
        appendError('Usage: google <search query>');
      }
      break;
    case 'date':
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      appendSuccess(`Current Date: ${formattedDate}`);
      break;
    case 'time':
      const currentTime = new Date();
      const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}`;
      appendSuccess(`Current Time: ${formattedTime}`);
      break;
    case 'weather':
      if (args.length > 0) {
        const city = args.join(' ');
        appendMessageToTerminal(`Fetching weather for ${city}...`, 'sys-message');
        let displayNameFromGeo = city;

        try {
          const geoResponse = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
          if (!geoResponse.ok) throw new Error(`Geocoding API error: ${geoResponse.status}`);
          const geoData = await geoResponse.json();

          if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`Could not find location: ${city}`);
          }
          const location = geoData.results[0];
          const { latitude, longitude } = location;
          
          if (location.name && location.admin1 && location.country) {
            displayNameFromGeo = `${location.name}, ${location.admin1}, ${location.country}`;
          } else if (location.name && location.country) {
            displayNameFromGeo = `${location.name}, ${location.country}`;
          } else if (location.name) {
            displayNameFromGeo = location.name;
          }

          const weatherResponse = await fetch(`${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&timezone=auto&hourly=apparent_temperature&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max`);
          if (!weatherResponse.ok) throw new Error(`Weather API error: ${weatherResponse.status}`);
          const weatherData = await weatherResponse.json();

          if (weatherData.current_weather && weatherData.daily && weatherData.hourly) {
            const current = weatherData.current_weather;
            const daily = weatherData.daily;
            let apparentTemp = "N/A";
            const currentHourISO = current.time.substring(0, 13) + ":00";
            const hourIndex = weatherData.hourly.time.indexOf(currentHourISO);
            if (hourIndex !== -1) {
              apparentTemp = weatherData.hourly.apparent_temperature[hourIndex];
            }

            const finalReport = 
`Weather for: ${displayNameFromGeo}\n` +
`  Time: ${current.time.split('T')[1]} (Local)\n` +
`  Temperature: ${current.temperature}°C (Feels like: ${apparentTemp}°C)\n` +
`  Condition: ${interpretWeatherCodeJS(current.weathercode)}\n` +
`  Wind: ${current.windspeed} km/h\n` +
`  Today: High ${daily.temperature_2m_max[0]}°C / Low ${daily.temperature_2m_min[0]}°C\n` +
`  Sunrise: ${new Date(daily.sunrise[0]).toLocaleTimeString()} / Sunset: ${new Date(daily.sunset[0]).toLocaleTimeString()}\n` +
`  Precip. Chance: ${daily.precipitation_probability_max[0]}%`;
            appendSuccess(finalReport);
          } else {
            appendError('Weather Error: Incomplete weather data from API.');
          }
        } catch (err) {
          appendError(`Weather API Error: ${err.message}`);
        }
      } else {
        appendError('Usage: weather <city name>');
      }
      break;
    case 'ip':
      const ip_address_arg = args.length > 0 ? args[0] : '';
      appendMessageToTerminal(`Fetching IP location data${ip_address_arg ? ' for ' + ip_address_arg : ''}...`, 'sys-message');
      try {
        const response = await fetch(`${IP_API_URL}${encodeURIComponent(ip_address_arg)}`);
        const data = await response.json();
        if (data.status === 'fail') {
          appendError(`IP Location Error: ${data.message}`);
        } else {
          let locationReport = "IP Geolocation Data:\n";
          const fieldsToShow = { query: "IP Address", country: "Country", regionName: "Region", city: "City", zip: "ZIP Code", timezone: "Timezone", isp: "ISP", org: "Organization"};
          for (const key in fieldsToShow) {
            if (data[key]) { 
               locationReport += `  ${fieldsToShow[key]}: ${data[key]}\n`;
            }
          }
          appendSuccess(locationReport.trim());
        }
      } catch (err) {
        appendError(`API Error: ${err.message}`);
      }
      break;
    case 'clear':
    case 'cls':
      const terminalOutputContainer = document.getElementById('ai-dynamic-content');
      if (terminalOutputContainer) {
        terminalOutputContainer.innerHTML = '';
        // No specific success message for clear, or a very subtle one if desired.
        // appendMessageToTerminal('Terminal cleared.', 'sys-message command-success'); // Example if needed
      }
      break;
    case 'help': // Added help command
       const helpText = 
`Available Commands:\n` +
`  clear                    - Clears the terminal output.\n` +
`  date                     - Displays the current date.\n` +
`  time                     - Displays the current time.\n` +
`  google <search query>    - Opens Google search results in a new tab.\n` +
`  ip [ip_address]        - Shows geolocation data for your IP or a specified IP.\n` +
`  weather <city name>      - Shows weather information for the specified city.\n` +
`  help                     - Displays this help message.`;
      appendMessageToTerminal(helpText, 'ai-message'); // Standard ai-message, no success glow needed here.
      break;
    default:
      appendError(`COMMAND NOT RECOGNIZED: ${baseCommand}.`);
      appendMessageToTerminal(`Type 'help' for a list of available commands.`, 'ai-message');
      break;
  }
}

function interpretWeatherCodeJS(code) {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    56: "Light freezing drizzle", 57: "Dense freezing drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
  };
  return codes[code] || `Unknown weather code: ${code}`;
} 