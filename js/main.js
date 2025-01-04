const API_KEY = "cac473d6bf5957b6879513079dd69ae2";

// Initialize page elements
$(document).ready(function() {
    $("#date_time").hide().delay(2000).fadeIn(1000);
    $("#mainCircle").hide().delay(8000).fadeIn(1000);
    $("#time1").hide().delay(9000).fadeIn(1000);
    $("#temperature").hide().delay(8000).fadeIn(1000);
});

// Date and Time functions
function getDate1() {
    var d = new Date();
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    document.getElementById("monthValue").innerHTML = months[d.getMonth()];
    document.getElementById("dateValue").innerHTML = d.getDate();
    document.getElementById("timeValue").innerHTML = d.getHours() + ":" + d.getMinutes();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    document.getElementById("weekDayValue").innerHTML = days[d.getDay()];
}

// Weather functions
function getWeatherDetails1() {
    if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position){
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            
            const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            let response = await fetch(api_url);
            let data = await response.json();
            manipulateWeatherData(data);
        });
    }
}

function manipulateWeatherData(data) {
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    let icon = data.weather[0].icon;
    let imageUrl = `https://openweathermap.org/img/w/${icon}.png`;
    let image = `<img src="${imageUrl}" height="90" width="90">`;
    
    document.getElementById('tempValue').innerHTML = `${temp}`;
    document.getElementById('humidityValue').innerHTML = `${humidity}*`;
    document.getElementById('weatherImage').innerHTML = image;
}

// Initialize particle animations
function initParticles() {
    const canvas1 = document.getElementById("particle1");
    const ctx1 = canvas1.getContext("2d");
    
    // Draw particle1
    ctx1.beginPath();
    ctx1.moveTo(0, 0);
    ctx1.lineTo(0, 70);
    ctx1.lineTo(10, 85);
    ctx1.lineTo(10, 135);
    ctx1.lineTo(0, 150);
    ctx1.lineTo(0, 480);
    ctx1.lineTo(5, 490);
    ctx1.lineTo(20, 490);
    ctx1.lineTo(20, 250);
    ctx1.lineTo(10, 235);
    ctx1.lineTo(10, 185);
    ctx1.lineTo(20, 170);
    ctx1.lineTo(20, 40);
    ctx1.closePath();
    ctx1.fillStyle = "rgba(2,254,255,0.3)";
    ctx1.fill();
}

// Start everything
function initialize() {
    getDate1();
    getWeatherDetails1();
    initParticles();
    setInterval(getDate1, 1000);
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', initialize);
