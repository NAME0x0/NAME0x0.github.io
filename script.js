// Preloader: Hide when video ends
const preloaderVideo = document.getElementById('preloaderVideo');
preloaderVideo.addEventListener('ended', () => {
  document.querySelector('.preloader').style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Audio Player Functionality
const playPauseButton = document.getElementById('playPause');
let isPlaying = false;

playPauseButton.addEventListener('click', () => {
  if (!isPlaying) {
    playPauseButton.textContent = 'Pause';
    isPlaying = true;
    // Add audio logic here if needed
  } else {
    playPauseButton.textContent = 'Play';
    isPlaying = false;
  }
});
