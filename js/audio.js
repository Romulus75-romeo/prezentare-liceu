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
