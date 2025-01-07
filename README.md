# AVA - Advanced Virtual Assistant Interface

A futuristic AI dashboard inspired by JARVIS and Gideon, featuring a holographic interface, voice commands, and text-based interactions.

![AVA Interface Preview](preview.png)

## Features

- 🎯 Interactive Arc Reactor Interface
- 🗣️ Dual Input Methods:
  - Voice Commands with "push enable" trigger
  - Text-based Command Input
- 🌡️ Real-time System Monitoring:
  - Battery Status
  - Weather Information
  - Date and Time
- 💫 Cyberpunk-inspired Animations
- 🎨 Holographic UI Elements
- 🔊 Voice Feedback System
- 📝 Note-taking Capability
- 🌐 Quick Web Access Commands
- ⚡ Real-time Command Processing
- 🔄 Cross-browser Compatibility
- 🛡️ Error Recovery System

## Technology Stack

- Vanilla JavaScript for Core Functionality
- Web Speech API for Voice Recognition
- SpeechSynthesis for Voice Output
- OpenWeatherMap API for Weather Data
- Modern CSS3 Animations
- Browser Battery and Geolocation APIs

## Setup

1. Clone the repository:
```bash
git clone https://github.com/NAME0x0/NAME0x0.github.io.git
cd NAME0x0.github.io
```

2. API Configuration:
- Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
- Update the API_KEY in `index_JS.js`

3. Serve the project:
```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node's http-server
npx http-server
```

4. Access in browser:
- Navigate to `http://localhost:8000`
- Allow microphone access for voice commands

## Usage

### Voice Commands
- Say "push enable" to activate voice recognition
- Click the Arc Reactor or microphone icon to start listening
- Use commands like "open google", "what is the time", "weather"

### Text Commands
- Type commands in the bottom search bar
- Press Enter to execute
- Same commands as voice input are supported

### Common Commands
- "system status" - Get system information
- "weather" - Check weather conditions
- "open [website]" - Open popular websites
- "battery" - Check battery status
- "help" - List available commands

## Browser Support

- Chrome (Recommended)
- Firefox
- Edge
- Safari (Limited voice features)

All modern browsers with Web Speech API support

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push branch (`git push origin feature/improvement`)
5. Create Pull Request

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Iron Man's JARVIS interface for design inspiration
- The Flash's Gideon AI for interaction patterns
- Cyberpunk aesthetic for visual elements
- OpenWeatherMap for weather data
