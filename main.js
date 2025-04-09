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
            <i class="fas fa-music"></i> Experience the taste of India with music!
        </button>
    `;
    document.body.appendChild(prompt);
    
    // Add event listener to play music on click
    prompt.querySelector('button').addEventListener('click', function() {
        backgroundMusic.play();
        this.closest('.play-prompt').remove();
    });
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
    // Create the sound toggle button
    const soundToggle = document.createElement('div');
    soundToggle.className = 'sound-toggle';
    
    // Create the button with initial state
    const soundBtn = document.createElement('button');
    soundBtn.className = 'sound-btn';
    soundBtn.id = 'soundToggle';
    soundBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    soundBtn.setAttribute('aria-label', isMuted ? 'Unmute background music' : 'Mute background music');
    soundBtn.title = isMuted ? 'Turn music on' : 'Turn music off';
    
    soundToggle.appendChild(soundBtn);
    document.body.appendChild(soundToggle);
    
    // Add click event to toggle mute/unmute
    soundBtn.addEventListener('click', toggleMute);
    
    // Add food animation to sound toggle button
    addSoundToggleAnimation(soundBtn);
}

/**
 * Adds a food-themed animation to the sound toggle button
 */
function addSoundToggleAnimation(button) {
    const foodIcons = ['🌶️', '🍛', '🥘', '🍲', '🥮', '🍚'];
    
    button.addEventListener('mouseover', function() {
        // Create floating food particles when hovered
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('span');
            particle.textContent = foodIcons[Math.floor(Math.random() * foodIcons.length)];
            particle.className = 'food-particle';
            particle.style.position = 'absolute';
            particle.style.fontSize = '16px';
            particle.style.left = '50%';
            particle.style.bottom = '100%';
            particle.style.opacity = '1';
            particle.style.transform = `translateX(${-10 + Math.random() * 20}px)`;
            particle.style.animation = `floatUp 1s ease-out forwards ${i * 0.2}s`;
            
            button.appendChild(particle);
            
            // Remove particles after animation
            setTimeout(() => {
                if (particle.parentNode === button) {
                    button.removeChild(particle);
                }
            }, 1200 + i * 200);
        }
    });
    
    // Add keyframes for particle animation
    if (!document.getElementById('food-particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'food-particle-keyframes';
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-40px) translateX(${-20 + Math.random() * 40}px) rotate(${-20 + Math.random() * 40}deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Toggle music mute/unmute state
 */
function toggleMute() {
    isMuted = !isMuted;
    
    const soundBtn = document.getElementById('soundToggle');
    if (soundBtn) {
        soundBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        soundBtn.setAttribute('aria-label', isMuted ? 'Unmute background music' : 'Mute background music');
        soundBtn.title = isMuted ? 'Turn music on' : 'Turn music off';
    }
    
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
 * Add animated food decorations to the page
 */
function addFoodDecorations() {
    if (!isIndexPage()) return;
    
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Add additional food decorations
    const foodIcons = [
        { icon: 'fas fa-mortar-pestle', color: '#FFD166' },
        { icon: 'fas fa-pepper-hot', color: '#E63946' },
        { icon: 'fas fa-leaf', color: '#4CAF50' },
        { icon: 'fas fa-cookie', color: '#FF9800' }
    ];
    
    for (let i = 0; i < foodIcons.length; i++) {
        const decoration = document.createElement('i');
        decoration.className = `${foodIcons[i].icon} food-decoration spice${i+1}`;
        decoration.style.color = foodIcons[i].color;
        heroSection.appendChild(decoration);
    }
    
    // Add masala container with colorful circles
    const masalaContainer = document.createElement('div');
    masalaContainer.className = 'masala-container';
    
    const spices = ['turmeric', 'paprika', 'coriander'];
    spices.forEach(spice => {
        const circle = document.createElement('div');
        circle.className = `masala-circle ${spice}`;
        masalaContainer.appendChild(circle);
    });
    
    heroSection.appendChild(masalaContainer);
    
    // Add thali patterns
    const sizes = ['small', 'medium', 'large'];
    sizes.forEach(size => {
        const thali = document.createElement('div');
        thali.className = `thali-pattern ${size}`;
        heroSection.appendChild(thali);
    });
}