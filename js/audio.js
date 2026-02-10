document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById("bg-music");
    const controls = document.getElementById("audio-controls");
    const playIcon = document.getElementById("play-icon");
    const controlText = document.getElementById("control-text");
    const volumeSlider = document.getElementById("volume-slider");

    // Check if elements exist
    if (!audio || !controls) return;

    let isPlaying = false;

    // Try autoplay on load
    audio.volume = 0.5;
    var promise = audio.play();
    if (promise !== undefined) {
        promise.then(_ => {
            isPlaying = true;
            updateUI();
        }).catch(error => {
            console.log("Autoplay prevented");
            isPlaying = false;
            updateUI();
        });
    }

    controls.addEventListener("click", function (e) {
        // Prevent toggling when clicking the slider
        if (e.target === volumeSlider) return;

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play();
            isPlaying = true;
        }
        updateUI();
    });

    volumeSlider.addEventListener("input", function () {
        audio.volume = this.value;
    });

    function updateUI() {
        if (isPlaying) {
            playIcon.className = "fas fa-stop";
            controlText.textContent = "Stop";
        } else {
            playIcon.className = "fas fa-play";
            controlText.textContent = "Start Muzică";
        }
    }

    // Global function to pause music from other scripts (e.g., video players)
    window.pauseBackgroundMusic = function () {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            updateUI();
        }
    };

    // Auto-pause when any video starts playing
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('play', () => {
            window.pauseBackgroundMusic();
        });
    });
});
