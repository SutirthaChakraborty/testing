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
    soundBtn.innerHTML = `<span class="sound-btn-3d">${isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>'}</span>`;
    soundBtn.setAttribute('aria-label', isMuted ? 'Unmute background music' : 'Mute background music');
    soundBtn.title = isMuted ? 'Turn music on' : 'Turn music off';
    
    soundToggle.appendChild(soundBtn);
    document.body.appendChild(soundToggle);
    
    // Add click event to toggle mute/unmute
    soundBtn.addEventListener('click', toggleMute);
    
    // Add food animation to sound toggle button
    addSoundToggleAnimation(soundBtn);
    
    // Add 3D button styles
    const style = document.createElement('style');
    style.textContent = `
        .sound-toggle {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 99;
            perspective: 1000px;
        }
        
        .sound-btn {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            position: relative;
            transform-style: preserve-3d;
            perspective: 800px;
            transition: transform 0.2s;
        }
        
        .sound-btn:hover {
            transform: scale(1.05);
        }
        
        .sound-btn:active {
            transform: scale(0.95);
        }
        
        .sound-btn-3d {
            background: linear-gradient(145deg, #5bd6cf, #45b4ae);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            box-shadow: 
                0 10px 20px rgba(0, 0, 0, 0.15),
                0 6px 6px rgba(0, 0, 0, 0.1),
                inset 0 -4px 8px rgba(0, 0, 0, 0.15),
                inset 0 4px 8px rgba(255, 255, 255, 0.3);
            position: relative;
            transform: translateZ(0);
            transition: all 0.3s;
        }
        
        .sound-btn:hover .sound-btn-3d {
            transform: translateZ(10px) rotateX(10deg) rotateY(-10deg);
            box-shadow: 
                0 15px 25px rgba(0, 0, 0, 0.2),
                0 8px 10px rgba(0, 0, 0, 0.1),
                inset 0 -4px 8px rgba(0, 0, 0, 0.2),
                inset 0 4px 8px rgba(255, 255, 255, 0.4);
        }
        
        .sound-btn:active .sound-btn-3d {
            transform: translateZ(5px);
            box-shadow: 
                0 5px 10px rgba(0, 0, 0, 0.1),
                0 3px 5px rgba(0, 0, 0, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                inset 0 2px 4px rgba(255, 255, 255, 0.2);
        }
        
        /* Creating the illusion of depth with a pseudo element */
        .sound-btn-3d::before {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 6%;
            width: 88%;
            height: 15%;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            filter: blur(5px);
            z-index: -1;
        }
        
        .sound-btn:hover .sound-btn-3d::before {
            filter: blur(8px);
        }
    `;
    document.head.appendChild(style);
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