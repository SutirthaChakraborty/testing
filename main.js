/**
 * Must Tiffin - Main JavaScript File
 * Handles audio functionality and other interactive elements
 */

// Audio functionality
let backgroundMusic;
let isMuted = false;

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize background music
    initBackgroundMusic();

    // Add sound toggle button to the page
    addSoundToggleButton();
});

// Play music as soon as possible
window.onload = function() {
    if (isIndexPage() && backgroundMusic && !isMuted) {
        playBackgroundMusic();
    }
};

/**
 * Initializes the background music player
 */
function initBackgroundMusic() {
    backgroundMusic = new Audio('assest/Must Tiffins Jingle.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    
    // Play audio when page is loaded and if user is on index page
    if (isIndexPage()) {
        playBackgroundMusic();
    }

    // Ensure music continues playing when user navigates back to index page
    window.addEventListener('popstate', checkAndPlayMusic);

    // Handle page visibility changes (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && isIndexPage() && !isMuted) {
            backgroundMusic.play();
        } else if (document.visibilityState === 'hidden') {
            backgroundMusic.pause();
        }
    });
}

/**
 * Attempt to play background music with user interaction fallback
 */
function playBackgroundMusic() {
    // Try to play audio - this may fail due to browser autoplay policy
    const playPromise = backgroundMusic.play();
    
    // Handle autoplay restrictions
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Auto-play was prevented: ', error);
            // Show a UI element to let the user manually start playback
            createPlayPromptElement();
        });
    }
}

/**
 * Checks if the current page is the index page
 */
function isIndexPage() {
    return window.location.pathname.endsWith('index.html') || 
           window.location.pathname === '/' || 
           window.location.pathname.endsWith('/');
}

/**
 * Checks if the current page is the index page and plays music if needed
 */
function checkAndPlayMusic() {
    if (isIndexPage() && !isMuted) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}

/**
 * Toggles the background music on/off
 */
function toggleSound() {
    isMuted = !isMuted;
    
    if (isMuted) {
        backgroundMusic.pause();
        document.getElementById('soundToggleBtn').innerHTML = '<i class="fas fa-volume-mute"></i>';
        document.getElementById('soundToggleBtn').setAttribute('title', 'Unmute Music');
    } else {
        if (isIndexPage()) {
            backgroundMusic.play();
        }
        document.getElementById('soundToggleBtn').innerHTML = '<i class="fas fa-volume-up"></i>';
        document.getElementById('soundToggleBtn').setAttribute('title', 'Mute Music');
    }
}

/**
 * Creates a floating button to toggle sound
 */
function addSoundToggleButton() {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'sound-toggle';
    
    const toggleButton = document.createElement('button');
    toggleButton.id = 'soundToggleBtn';
    toggleButton.className = 'floating-btn sound-btn';
    toggleButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    toggleButton.setAttribute('title', 'Mute Music');
    toggleButton.addEventListener('click', toggleSound);
    
    buttonDiv.appendChild(toggleButton);
    document.body.appendChild(buttonDiv);
}

/**
 * Creates a prompt for user to enable audio playback
 * (used when autoplay is blocked by the browser)
 */
function createPlayPromptElement() {
    const promptDiv = document.createElement('div');
    promptDiv.className = 'play-prompt';
    
    const promptButton = document.createElement('button');
    promptButton.className = 'play-prompt-btn';
    promptButton.innerHTML = '<i class="fas fa-music"></i> Enable Music';
    promptButton.addEventListener('click', function() {
        backgroundMusic.play();
        promptDiv.style.display = 'none';
        isMuted = false;
        document.getElementById('soundToggleBtn').innerHTML = '<i class="fas fa-volume-up"></i>';
    });
    
    promptDiv.appendChild(promptButton);
    document.body.appendChild(promptDiv);
}