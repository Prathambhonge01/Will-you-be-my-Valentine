/* =========================================================
   Will You Be My Valentine? - Interactive & Animated Script
   ========================================================= */

// Audio Synthesizer using Web Audio API (Zero external audio files needed!)
class ValentineAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isPlayingBgm = false;
        this.bgmTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.15) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.error(e);
        }
    }

    playHover() {
        this.playTone(587.33, 'sine', 0.08, 0.05); // D5
    }

    playNoSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            // Whimsical downward boing/wobble
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(380, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.35);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.35);
        } catch (e) {}
    }

    playYesFanfare() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        // Sweet romantic arpeggio (C5 -> E5 -> G5 -> B5 -> C6)
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.5, 0.18);
            }, idx * 110);
        });
    }

    toggleBgm(buttonElement) {
        this.init();
        this.isPlayingBgm = !this.isPlayingBgm;
        
        if (this.isPlayingBgm) {
            if (buttonElement) {
                buttonElement.innerHTML = `🎵 <span>Music: On</span>`;
                buttonElement.style.borderColor = '#2ec4b6';
            }
            this.startMelody();
        } else {
            if (buttonElement) {
                buttonElement.innerHTML = `🔇 <span>Music: Off</span>`;
                buttonElement.style.borderColor = 'rgba(255, 117, 143, 0.4)';
            }
            this.stopMelody();
        }
    }

    startMelody() {
        // Soft romantic melody loop notes (Pentatonic sweet melody)
        const melody = [
            523.25, 587.33, 659.25, 783.99,
            659.25, 783.99, 880.00, 1046.50,
            880.00, 783.99, 659.25, 587.33
        ];
        let noteIndex = 0;

        const tick = () => {
            if (!this.isPlayingBgm) return;
            const note = melody[noteIndex % melody.length];
            this.playTone(note, 'sine', 0.35, 0.04);
            noteIndex++;
            this.bgmTimer = setTimeout(tick, 380);
        };
        tick();
    }

    stopMelody() {
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

const audio = new ValentineAudio();

// Progression data
const messages = [
    "Are you sure? 🥺",
    "Really sure?? 💔",
    "Are you positive? 😢",
    "Pookie please... 🧸",
    "Just think about it! 💭",
    "If you say no, I will cry... 😭",
    "Look at this cute face! 🥺",
    "I'll give you chocolate! 🍫",
    "And unlimited cuddles! 🫂",
    "Don't break my heart! 💔",
    "I'm not crying, you're crying! 😿",
    "Error 404: 'No' not found! ⚠️",
    "Resistance is impossible! ✨",
    "Okay, now you're teasing me 😂",
    "You have no choice, click YES! ❤️"
];

const gifs = [
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW5lenZyZHI5OXM2eW95b3pmMG40cWVrMDhtNjVuM3A4dGNxa2g2dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VM1fcpu2bKs1e2Kdbj/giphy.gif", // Cute happy asking
    "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif", // Shocked cat
    "https://media.giphy.com/media/L95W4wvxsn4G0/giphy.gif", // Teary begging
    "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif", // Heartbroken crying
    "https://media.giphy.com/media/7SF5scGB2AFrgsXP63/giphy.gif" // Meltdown crying
];

let messageIndex = 0;
let noClickCount = 0;
let isDodging = false;

// Handle "No" Button Click
function handleNoClick() {
    audio.playNoSound();
    noClickCount++;

    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    const gifImg = document.querySelector('.gif_container img');
    const container = document.querySelector('.container');

    // Update message
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;

    // Scale up "Yes" button smoothly
    const currentScale = 1 + (noClickCount * 0.28);
    yesButton.style.transform = `scale(${Math.min(currentScale, 2.6)})`;
    yesButton.classList.add('pulse-glow');

    // Change GIF progressively
    let gifIdx = Math.min(Math.floor(noClickCount / 2), gifs.length - 1);
    if (gifImg && gifImg.src !== gifs[gifIdx]) {
        gifImg.style.opacity = '0';
        setTimeout(() => {
            gifImg.src = gifs[gifIdx];
            gifImg.style.opacity = '1';
        }, 150);
    }

    // Shake effects
    noButton.classList.remove('shake');
    void noButton.offsetWidth; // Trigger reflow
    noButton.classList.add('shake');

    container.classList.remove('screen-wobble');
    void container.offsetWidth;
    container.classList.add('screen-wobble');

    // Emit heartbreak particles
    createHeartburst(noButton.getBoundingClientRect(), '💔');

    // Enable dodging mode after 3 clicks
    if (noClickCount >= 3 && !isDodging) {
        enableDodgeMode(noButton);
    }
}

// Playful "No" button dodging
function enableDodgeMode(button) {
    isDodging = true;
    const dodge = () => {
        const area = document.querySelector('.buttons-area');
        const rect = area.getBoundingClientRect();
        
        // Random position within safe boundary
        const maxX = 120;
        const maxY = 50;
        const randomX = (Math.random() - 0.5) * 2 * maxX;
        const randomY = (Math.random() - 0.5) * 2 * maxY;

        button.style.transition = 'transform 0.18s ease-out';
        button.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.9)`;
    };

    button.addEventListener('mouseenter', dodge);
    button.addEventListener('touchstart', (e) => {
        dodge();
    }, { passive: true });
}

// Handle "Yes" Button Click
function handleYesClick() {
    audio.playYesFanfare();
    launchConfetti();

    // Preserve URL parameters when navigating to yes_page.html
    const params = new URLSearchParams(window.location.search);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    setTimeout(() => {
        window.location.href = `yes_page.html${queryString}`;
    }, 700);
}

// Heartburst particle effect
function createHeartburst(rect, char = '❤️') {
    const count = 7;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'cursor-heart';
        particle.textContent = char;
        particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 30}px`;
        particle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 20}px`;
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
}

// Cursor trail effect
function setupCursorTrail() {
    let lastTime = 0;
    const symbols = ['💖', '✨', '🌸', '💕', '⭐'];

    const handlePointer = (x, y) => {
        const now = Date.now();
        if (now - lastTime < 90) return; // Throttle
        lastTime = now;

        const heart = document.createElement('div');
        heart.className = 'cursor-heart';
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1000);
    };

    window.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) {
            handlePointer(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
}

// Canvas floating hearts ambient background
function setupBackgroundHearts() {
    const canvas = document.getElementById('hearts-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 35), 35);
    const symbols = ['♥', '💖', '🌸', '✨'];

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 16 + 12,
            speedY: Math.random() * 0.8 + 0.4,
            speedX: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.45 + 0.15,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.02
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y -= p.speedY;
            p.x += Math.sin(p.y * 0.01) * 0.5;
            p.rotation += p.rotSpeed;

            if (p.y < -30) {
                p.y = height + 30;
                p.x = Math.random() * width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.opacity;
            ctx.font = `${p.size}px serif`;
            ctx.fillStyle = '#ff4d6d';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.symbol, 0, 0);
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Confetti engine (Pure native canvas, lightweight & zero dependency)
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#2ec4b6', '#ffb703', '#ffffff', '#e63946'];

    for (let i = 0; i < 180; i++) {
        pieces.push({
            x: canvas.width / 2,
            y: canvas.height * 0.6,
            w: Math.random() * 10 + 6,
            h: Math.random() * 8 + 4,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 1.2) * 14,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.28,
            drag: 0.98,
            alpha: 1
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.drag;
            p.rotation += p.rotSpeed;

            if (p.y > canvas.height * 0.7) {
                p.alpha -= 0.02;
            }

            if (p.alpha > 0) {
                active = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
        });

        if (active) {
            requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    render();
}

// Personalization (URL Parameters & Custom Link Generator)
function setupPersonalization() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const from = params.get('from');

    if (to) {
        const titleEl = document.getElementById('headline');
        if (titleEl) {
            titleEl.textContent = `${to}, will you be my Valentine?`;
        }
        document.title = `${to}, Will You Be My Valentine? 💖`;
    }

    if (from) {
        const fromEl = document.getElementById('from-container');
        if (fromEl) {
            fromEl.textContent = `— With love, from ${from} 💕`;
            fromEl.style.display = 'block';
        }
    }
}

// Modal controls for Personalize Link
function openModal() {
    const modal = document.getElementById('personalize-modal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('personalize-modal');
    if (modal) modal.classList.remove('active');
}

function generateShareLink() {
    const toInput = document.getElementById('to-name-input').value.trim();
    const fromInput = document.getElementById('from-name-input').value.trim();

    const url = new URL(window.location.href);
    url.search = '';
    if (toInput) url.searchParams.set('to', toInput);
    if (fromInput) url.searchParams.set('from', fromInput);

    const shareBox = document.getElementById('share-result');
    const linkInput = document.getElementById('share-link-input');

    linkInput.value = url.toString();
    shareBox.style.display = 'block';
}

function copyShareLink() {
    const linkInput = document.getElementById('share-link-input');
    const copyBtn = document.getElementById('copy-btn');
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value).then(() => {
        copyBtn.textContent = 'Copied to Clipboard! ✨';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Link 📋';
        }, 2000);
    });
}

// Sound button setup
function toggleAudio() {
    const btn = document.getElementById('music-btn');
    audio.toggleBgm(btn);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupBackgroundHearts();
    setupCursorTrail();
    setupPersonalization();

    const yesBtn = document.querySelector('.yes-button');
    const noBtn = document.querySelector('.no-button');

    if (yesBtn) {
        yesBtn.addEventListener('mouseenter', () => audio.playHover());
    }
    if (noBtn) {
        noBtn.addEventListener('mouseenter', () => audio.playHover());
    }
});
