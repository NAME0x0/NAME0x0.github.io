const OPENWEATHER_API_KEY = 'YOUR_API_KEY'; // Get free key from openweathermap.org
const ABSTRACT_API_KEY = 'YOUR_API_KEY'; // Get free key from abstractapi.com

async function getLocation() {
    try {
        const response = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}`);
        const data = await response.json();
        return {
            city: data.city,
            country: data.country_code,
            lat: data.latitude,
            lon: data.longitude,
            timezone: data.timezone.name
        };
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

async function getWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

function updateDateTime(timezone) {
    const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const now = new Date();
    
    document.querySelector('.digital-clock').textContent = 
        now.toLocaleTimeString('en-US', { timeZone: timezone, ...options });
    document.querySelector('.date-display').textContent = 
        now.toLocaleDateString('en-US', { timeZone: timezone, ...options });
    document.querySelector('.timezone').textContent = timezone;
}

function updateWeather(weatherData) {
    if (!weatherData) return;

    const temp = Math.round(weatherData.main.temp);
    const weatherDesc = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    document.querySelector('.weather-temp').textContent = `${temp}°C`;
    document.querySelector('.weather-desc').textContent = weatherDesc;
    document.querySelector('.weather-stats').innerHTML = `
        <span>Humidity: ${humidity}%</span>
        <span>Wind: ${windSpeed}m/s</span>
    `;

    // Update weather icon
    const iconCode = weatherData.weather[0].icon;
    document.querySelector('.weather-icon').textContent = getWeatherEmoji(iconCode);
}

function getWeatherEmoji(iconCode) {
    const emojiMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return emojiMap[iconCode] || '☀️';
}

async function initializeWeatherTime() {
    const location = await getLocation();
    if (!location) return;

    document.querySelector('.location-display').textContent = 
        `${location.city}, ${location.country}`;

    // Update time immediately and then every second
    updateDateTime(location.timezone);
    setInterval(() => updateDateTime(location.timezone), 1000);

    // Update weather immediately and then every 5 minutes
    const weather = await getWeather(location.lat, location.lon);
    updateWeather(weather);
    setInterval(async () => {
        const weatherUpdate = await getWeather(location.lat, location.lon);
        updateWeather(weatherUpdate);
    }, 300000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWeatherTime);
