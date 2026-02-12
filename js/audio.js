document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById("bg-music");
    const controls = document.getElementById("audio-controls");
    const playIcon = document.getElementById("play-icon");
    const controlText = document.getElementById("control-text");
    const volumeSlider = document.getElementById("volume-slider");

    // Check if elements exist
    if (!audio || !controls) return;


    let isPlaying = false;

    // Set initial volume, but don't autoplay
    audio.volume = 0.5;

    // --- PERSISTENCE LOGIC (LocalStorage) ---
    // Restore state if available
    const savedTime = localStorage.getItem('audioTime');
    const savedPlaying = localStorage.getItem('audioPlaying');
    const savedVolume = localStorage.getItem('audioVolume');

    if (savedVolume) {
        audio.volume = parseFloat(savedVolume);
        volumeSlider.value = savedVolume;
    }

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Attempt to auto-resume if it was playing
    if (savedPlaying === 'true') {
        // We try to play. Browsers might block this if no interaction, 
        // but since it's a click-triggered navigation, it often works.
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isPlaying = true;
                updateUI();
            }).catch(error => {
                console.log("Autoplay prevented by browser policy:", error);
                isPlaying = false;
                updateUI();
            });
        }
    } else {
        updateUI(); // Set initial UI logic
    }

    // Save state before unloading (for standard navigation/refresh)
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('audioTime', audio.currentTime);
        localStorage.setItem('audioPlaying', isPlaying);
        localStorage.setItem('audioVolume', audio.volume);
    });

    // Save state periodically (fallback)
    setInterval(() => {
        if (isPlaying) {
            localStorage.setItem('audioTime', audio.currentTime);
            localStorage.setItem('audioPlaying', isPlaying);
        }
    }, 1000);

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

    // Auto-pause when any video starts playing + fullscreen + pause other videos
    function attachVideoListeners() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                // Pause background music
                window.pauseBackgroundMusic();

                // Start fullscreen on play
                try {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                        video.webkitRequestFullscreen();
                    } else if (video.mozRequestFullScreen) { /* Firefox */
                        video.mozRequestFullScreen();
                    } else if (video.msRequestFullscreen) { /* IE/Edge */
                        video.msRequestFullscreen();
                    } else if (video.webkitEnterFullscreen) { /* iOS */
                        video.webkitEnterFullscreen();
                    }
                } catch (err) {
                    console.log("Fullscreen request failed: " + err);
                }

                // Pause other videos on this page
                videos.forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.pause();
                    }
                });
            });
        });
    }


    // Initial attach
    attachVideoListeners();

    // Re-attach on page navigation (SPA)
    window.addEventListener('page-changed', () => {
        attachVideoListeners();
        // Also re-check controls in case they were re-rendered (though we try to preserve them)
        // If controls were inside the replaced content, we'd need to re-bind them to the audio object.
        // But our navigation script preserves #audio-controls, so this might not be needed for controls.
        // However, if the page has *new* videos, we MUST attach listeners.
    });
});
