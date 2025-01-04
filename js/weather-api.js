class WeatherSystem {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.init();
    }

    async init() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => this.fetchWeatherData(position),
                error => console.error("Geolocation error:", error)
            );
        }
    }

    async fetchWeatherData(position) {
        const { latitude: lat, longitude: lon } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            this.updateWeatherDisplay(data);
        } catch (error) {
            console.error("Weather fetch error:", error);
        }
    }

    updateWeatherDisplay(data) {
        const tempElement = document.getElementById('tempValue');
        const humidElement = document.getElementById('humidityValue');
        const weatherImage = document.getElementById('weatherImage');

        if (tempElement) tempElement.textContent = Math.round(data.main.temp);
        if (humidElement) humidElement.textContent = `${data.main.humidity}*`;
        
        if (weatherImage) {
            const iconCode = data.weather[0].icon;
            weatherImage.innerHTML = `<img src="https://openweathermap.org/img/w/${iconCode}.png" height="90" width="90">`;
        }
    }
}

// Initialize weather system
const weatherSystem = new WeatherSystem('cac473d6bf5957b6879513079dd69ae2');
