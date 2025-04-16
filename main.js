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

    // Logo animation for sound toggle indication
    addLogoSoundAnimation();
    
    // Load mute preference from localStorage if available
    const savedMuteState = localStorage.getItem('musicMuted');
    if (savedMuteState !== null) {
        isMuted = savedMuteState === 'true';
        updateLogoAudioState();
    }
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
    backgroundMusic.volume = 0.3;
    
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
    // In many browsers, audio won't play without user interaction
    backgroundMusic.play().catch(function(error) {
        console.log('Audio playback failed:', error);
        // Create a prompt to play music with user interaction
        showPlayPrompt();
    });
}

/**
 * Shows a prompt to encourage user interaction for audio playback
 */
function showPlayPrompt() {
    // Only show prompt if not already shown
    if (document.querySelector('.play-prompt')) return;
    
    const prompt = document.createElement('div');
    prompt.className = 'play-prompt';
    prompt.innerHTML = `
        <button class="play-prompt-btn">
            <span class="play-btn-3d">
                <i class="fas fa-music"></i>
            </span>
            <span class="play-text">Experience the taste of India with music!</span>
        </button>
    `;
    document.body.appendChild(prompt);
    
    // Add event listener to play music on click
    prompt.querySelector('button').addEventListener('click', function() {
        backgroundMusic.play();
        isMuted = false;
        updateLogoAudioState();
        this.closest('.play-prompt').remove();
    });

    // Add 3D button effect styles
    const style = document.createElement('style');
    style.textContent = `
        .play-prompt {
            position: fixed;
            bottom: 90px;
            left: 30px;
            z-index: 100;
            background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,245,0.9));
            padding: 12px 20px;
            border-radius: 30px;
            box-shadow: 
                0 10px 20px rgba(0, 0, 0, 0.1),
                0 6px 6px rgba(0, 0, 0, 0.1),
                inset 0 -2px 5px rgba(0, 0, 0, 0.05);
            animation: float 3s ease-in-out infinite;
            display: flex;
            align-items: center;
            transform-style: preserve-3d;
            perspective: 1000px;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .play-prompt-btn {
            background: none;
            border: none;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: transform 0.2s;
            font-weight: 600;
            color: var(--dark-color);
            padding: 0;
        }

        .play-prompt-btn:hover {
            transform: scale(1.05);
        }

        .play-prompt-btn:active {
            transform: scale(0.98);
        }

        .play-btn-3d {
            background: linear-gradient(145deg, var(--accent-color), var(--accent-color));
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            box-shadow: 
                0 6px 10px rgba(0, 0, 0, 0.15),
                inset 0 -3px 6px rgba(0, 0, 0, 0.2),
                inset 0 3px 2px rgba(255, 255, 255, 0.5);
            position: relative;
            transform: translateZ(20px);
            transition: all 0.3s;
        }

        .play-prompt-btn:hover .play-btn-3d {
            box-shadow: 
                0 8px 15px rgba(0, 0, 0, 0.2),
                inset 0 -3px 6px rgba(0, 0, 0, 0.2),
                inset 0 3px 2px rgba(255, 255, 255, 0.5);
            transform: translateZ(25px) rotateY(-10deg);
        }

        .play-prompt-btn:active .play-btn-3d {
            box-shadow: 
                0 3px 6px rgba(0, 0, 0, 0.1),
                inset 0 -2px 5px rgba(0, 0, 0, 0.2),
                inset 0 2px 2px rgba(255, 255, 255, 0.2);
            transform: translateZ(10px);
        }

        .play-text {
            font-family: 'Kalam', cursive;
            color: var(--primary-color);
            font-size: 1.1em;
            transform: translateZ(10px);
            text-shadow: 1px 1px 1px rgba(255,255,255,0.7);
        }
    `;
    document.head.appendChild(style);
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
 * Toggle music mute/unmute state
 */
function toggleMute() {
    isMuted = !isMuted;
    
    updateLogoAudioState();
    
    if (isMuted) {
        backgroundMusic.pause();
        addTasteMessage('Experience the silent flavors...');
    } else {
        if (isIndexPage()) {
            playBackgroundMusic();
            addTasteMessage('Hear the spices dance!');
        }
    }
    
    // Save preference to localStorage
    localStorage.setItem('musicMuted', isMuted);

    // Add visual feedback for the logo click
    addLogoClickFeedback();
}

/**
 * Updates the logo appearance based on audio state
 */
function updateLogoAudioState() {
    const logoToggle = document.getElementById('logoAudioToggle');
    if (logoToggle) {
        logoToggle.setAttribute('aria-label', isMuted ? 'Unmute background music' : 'Mute background music');
        logoToggle.title = isMuted ? 'Click to play music' : 'Click to pause music';
        
        // We could add a visual indicator on the logo if desired
        // For example, adding a small icon or changing the logo's opacity
        const logoImage = logoToggle.querySelector('.logo-image');
        if (logoImage) {
            logoImage.style.transition = 'all 0.3s ease';
            logoImage.style.filter = isMuted ? 'grayscale(50%)' : 'grayscale(0%)';
        }
    }
}

/**
 * Adds a temporary message that fades about taste
 */
function addTasteMessage(message) {
    const tasteMsg = document.createElement('div');
    tasteMsg.textContent = message;
    tasteMsg.style.position = 'fixed';
    tasteMsg.style.bottom = '100px';
    tasteMsg.style.left = '30px';
    tasteMsg.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    tasteMsg.style.color = 'var(--primary-color)';
    tasteMsg.style.padding = '8px 15px';
    tasteMsg.style.borderRadius = '20px';
    tasteMsg.style.fontFamily = "'Kalam', cursive";
    tasteMsg.style.zIndex = '99';
    tasteMsg.style.opacity = '0';
    tasteMsg.style.transform = 'translateY(20px)';
    tasteMsg.style.transition = 'opacity 0.3s, transform 0.3s';
    
    document.body.appendChild(tasteMsg);
    
    // Trigger animation
    setTimeout(() => {
        tasteMsg.style.opacity = '1';
        tasteMsg.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        tasteMsg.style.opacity = '0';
        tasteMsg.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            if (tasteMsg.parentNode) {
                document.body.removeChild(tasteMsg);
            }
        }, 300);
    }, 2000);
}

/**
 * Add animation to logo for sound toggle indication
 */
function addLogoSoundAnimation() {
    // Add CSS for logo interactions
    const style = document.createElement('style');
    style.textContent = `
        .logo-image {
            transition: transform 0.3s ease, filter 0.3s ease;
        }
        
        .logo:hover .logo-image {
            transform: scale(1.05);
        }
        
        .logo:active .logo-image {
            transform: scale(0.95);
        }
        
        .logo-pulse {
            animation: logoPulse 0.5s ease-in-out;
        }
        
        @keyframes logoPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .logo-music-indicator {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: var(--accent-color);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .logo-music-active .logo-music-indicator {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add visual feedback when logo is clicked
 */
function addLogoClickFeedback() {
    const logoImage = document.querySelector('.logo-image');
    if (logoImage) {
        // Remove existing animation class
        logoImage.classList.remove('logo-pulse');
        
        // Force reflow to restart the animation
        void logoImage.offsetWidth;
        
        // Add animation class
        logoImage.classList.add('logo-pulse');
        
        // Create music notes for visual feedback
        const musicNotes = isMuted ? '🔇' : ['🎵', '🎶', '♪', '♫'];
        const notesContainer = document.createElement('div');
        notesContainer.style.position = 'absolute';
        notesContainer.style.top = '0';
        notesContainer.style.left = '50%';
        notesContainer.style.zIndex = '100';
        notesContainer.style.pointerEvents = 'none';
        
        logoImage.parentNode.style.position = 'relative';
        logoImage.parentNode.appendChild(notesContainer);
        
        if (!isMuted) {
            for (let i = 0; i < 3; i++) {
                const note = document.createElement('div');
                note.textContent = musicNotes[Math.floor(Math.random() * musicNotes.length)];
                note.style.position = 'absolute';
                note.style.fontSize = '16px';
                note.style.opacity = '0';
                note.style.transform = `translate(-50%, -${20 + i * 10}px)`;
                note.style.animation = `floatingNotes 1s ease-out forwards ${i * 0.2}s`;
                notesContainer.appendChild(note);
            }
        } else {
            const note = document.createElement('div');
            note.textContent = musicNotes;
            note.style.position = 'absolute';
            note.style.fontSize = '20px';
            note.style.opacity = '0';
            note.style.transform = 'translate(-50%, -20px)';
            note.style.animation = 'fadeOutNote 1s ease-out forwards';
            notesContainer.appendChild(note);
        }
        
        // Add keyframes for note animation
        if (!document.getElementById('logo-audio-keyframes')) {
            const animStyle = document.createElement('style');
            animStyle.id = 'logo-audio-keyframes';
            animStyle.textContent = `
                @keyframes floatingNotes {
                    0% { transform: translate(-50%, 0); opacity: 1; }
                    100% { transform: translate(-50%, -40px); opacity: 0; }
                }
                
                @keyframes fadeOutNote {
                    0% { transform: translate(-50%, 0); opacity: 1; }
                    100% { transform: translate(-50%, -20px); opacity: 0; }
                }
            `;
            document.head.appendChild(animStyle);
        }
        
        // Clean up notes after animation
        setTimeout(() => {
            if (notesContainer.parentNode) {
                notesContainer.parentNode.removeChild(notesContainer);
            }
        }, 1500);
    }
}