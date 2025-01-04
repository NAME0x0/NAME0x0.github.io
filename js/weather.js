const API_KEY = "cac473d6bf5957b6879513079dd69ae2";

class WeatherSystem {
    constructor() {
        this.init();
    }

    async init() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => this.getWeatherDetails(position),
                error => console.error("Geolocation error:", error)
            );
        }
    }

    async getWeatherDetails(position) {
        const { latitude: lat, longitude: lon } = position.coords;
        const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        try {
            const response = await fetch(api_url);
            const data = await response.json();
            this.manipulateWeatherData(data);
        } catch (error) {
            console.error('Weather fetch error:', error);
        }
    }

    manipulateWeatherData(data) {
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const icon = data.weather[0].icon;
        const imageUrl = `https://openweathermap.org/img/w/${icon}.png`;
        const image = `<img src="${imageUrl}" height="90" width="90">`;

        // Update UI elements
        document.getElementById('tempValue').innerHTML = `${temp}`;
        document.getElementById('humidityValue').innerHTML = `${humidity}*`;
        document.getElementById('weatherImage').innerHTML = image;
    }
}

// Initialize weather system
document.addEventListener('DOMContentLoaded', () => {
    new WeatherSystem();
});
