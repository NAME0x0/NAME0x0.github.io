// Simulated Weather Data (Replace with real API if needed)
const weatherElement = document.getElementById("weather");
function updateWeather() {
  const weatherData = [
    "Sunny, 28°C",
    "Cloudy, 24°C",
    "Rainy, 21°C",
    "Windy, 25°C",
    "Clear Night, 18°C"
  ];
  const randomWeather = weatherData[Math.floor(Math.random() * weatherData.length)];
  weatherElement.textContent = randomWeather;
}

// Real-Time Clock
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;
  document.getElementById("event").textContent = `Current Time: ${timeString}`;
}

// Button Interaction Feedback
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
  button.addEventListener("click", () => {
    button.textContent = "Clicked!";
    setTimeout(() => {
      button.textContent = "Click Me";
    }, 1000);
  });
});

// Initialize All Features
updateWeather();
updateClock();
setInterval(updateClock, 1000);
setInterval(updateWeather, 10000); // Updates weather every 10 seconds
