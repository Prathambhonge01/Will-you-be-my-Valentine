/* =========================================================
   Will You Be My Valentine? - Celebration Page Script
   ========================================================= */

// Audio Synthesizer
class CelebrationAudio {
    constructor() {
        this.ctx = null;
        this.isPlayingBgm = false;
        this.bgmTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type = 'sine', duration = 0.3, gainValue = 0.15) {
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
        } catch (e) {}
    }

    playFanfare() {
        // Triumphant happy chord sequence (C - E - G - C6 with shimmer)
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.45, 0.16);
            }, idx * 90);
        });
    }

    playChime() {
        // Sweet bell chime for selection
        this.playTone(880, 'sine', 0.25, 0.12);
        setTimeout(() => this.playTone(1046.50, 'sine', 0.3, 0.14), 80);
    }

    toggleBgm(btn) {
        this.init();
        this.isPlayingBgm = !this.isPlayingBgm;
        if (this.isPlayingBgm) {
            if (btn) btn.innerHTML = '🎵 <span>Music: On</span>';
            this.startMelody();
        } else {
            if (btn) btn.innerHTML = '🔇 <span>Music: Off</span>';
            this.stopMelody();
        }
    }

    startMelody() {
        const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25];
        let idx = 0;
        const tick = () => {
            if (!this.isPlayingBgm) return;
            this.playTone(melody[idx % melody.length], 'sine', 0.4, 0.05);
            idx++;
            this.bgmTimer = setTimeout(tick, 350);
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

const audio = new CelebrationAudio();

// Canvas Floating Hearts
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
    const count = Math.min(Math.floor(window.innerWidth / 30), 40);
    const symbols = ['♥', '💖', '🌸', '✨', '💕', '🎉'];

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 16 + 12,
            speedY: Math.random() * 0.9 + 0.4,
            speedX: (Math.random() - 0.5) * 0.6,
            opacity: Math.random() * 0.45 + 0.2,
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

// Confetti Cannon
function triggerConfetti(count = 200) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#2ec4b6', '#ffb703', '#ffffff', '#e63946', '#ffd166'];

    for (let i = 0; i < count; i++) {
        pieces.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height * 0.5,
            w: Math.random() * 10 + 6,
            h: Math.random() * 8 + 4,
            vx: (Math.random() - 0.5) * 22,
            vy: (Math.random() - 1.3) * 18,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.3,
            drag: 0.97,
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

            if (p.y > canvas.height * 0.65) {
                p.alpha -= 0.018;
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

// Cursor Trail
function setupCursorTrail() {
    let lastTime = 0;
    const symbols = ['💖', '✨', '🌸', '💕', '⭐', '🥰'];

    const handlePointer = (x, y) => {
        const now = Date.now();
        if (now - lastTime < 90) return;
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
        if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
}

// Valentine Countdown
function setupCountdown() {
    const now = new Date();
    let currentYear = now.getFullYear();
    let target = new Date(currentYear, 1, 14); // Feb 14
    if (now > target) {
        target = new Date(currentYear + 1, 1, 14);
    }

    function update() {
        const diff = target - new Date();
        if (diff <= 0) {
            const title = document.querySelector('.countdown-title');
            if (title) title.textContent = "🎉 Happy Valentine's Day! 💖";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const elDays = document.getElementById('count-days');
        const elHours = document.getElementById('count-hours');
        const elMins = document.getElementById('count-mins');
        const elSecs = document.getElementById('count-secs');

        if (elDays) elDays.textContent = String(days).padStart(2, '0');
        if (elHours) elHours.textContent = String(hours).padStart(2, '0');
        if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
        if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// Date Planner Selection
function toggleDateCard(card) {
    card.classList.toggle('selected');
    audio.playChime();

    if (card.classList.contains('selected')) {
        const rect = card.getBoundingClientRect();
        createMiniBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

function createMiniBurst(x, y) {
    const chars = ['✨', '💕', '🥰', '🌸'];
    for (let i = 0; i < 5; i++) {
        const el = document.createElement('div');
        el.className = 'cursor-heart';
        el.textContent = chars[Math.floor(Math.random() * chars.length)];
        el.style.left = `${x + (Math.random() - 0.5) * 30}px`;
        el.style.top = `${y + (Math.random() - 0.5) * 20}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 900);
    }
}

// Love Letter Toggle
function toggleLoveLetter() {
    const letter = document.getElementById('love-letter');
    const btn = document.getElementById('letter-toggle-btn');
    audio.playChime();

    if (letter.style.display === 'block') {
        letter.style.display = 'none';
        btn.innerHTML = '💌 Open Love Letter';
    } else {
        letter.style.display = 'block';
        btn.innerHTML = '💌 Fold Love Letter';
        triggerConfetti(60);
    }
}

// Personalization Setup
function setupPersonalization() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const from = params.get('from');

    if (to) {
        const header = document.getElementById('celebrate-heading');
        if (header) header.textContent = `Yay ${to}! Knew you'd say yes! 💖`;
        document.title = `${to} Said YES! 💘`;
    }

    if (from) {
        const fromEl = document.getElementById('from-container');
        if (fromEl) {
            fromEl.textContent = `— Loved forever by ${from} 💕`;
            fromEl.style.display = 'block';
        }

        const letterSignature = document.getElementById('letter-signature');
        if (letterSignature) {
            letterSignature.textContent = `Forever yours, \n${from} ❤️`;
        }
    }

    if (to) {
        const letterGreeting = document.getElementById('letter-greeting');
        if (letterGreeting) {
            letterGreeting.textContent = `Dearest ${to},`;
        }
    }
}

// Share Celebration
function shareCelebration() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to') || 'My Valentine';
    const from = params.get('from') ? `from ${params.get('from')}` : '';

    const shareData = {
        title: 'She/He Said YES! 💖',
        text: `It's official! ${to} said YES to being my Valentine! 🥰🎉 ${from}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => {});
    } else {
        navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`).then(() => {
            const btn = document.getElementById('share-btn');
            btn.textContent = 'Copied to Clipboard! ✨';
            setTimeout(() => {
                btn.innerHTML = 'Share the News 💌';
            }, 2200);
        });
    }
}

// Audio Toggle
function toggleAudio() {
    const btn = document.getElementById('music-btn');
    audio.toggleBgm(btn);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupBackgroundHearts();
    setupCursorTrail();
    setupCountdown();
    setupPersonalization();

    // Trigger celebration fanfare & confetti after small delay
    setTimeout(() => {
        triggerConfetti(180);
        audio.playFanfare();
    }, 300);
});
