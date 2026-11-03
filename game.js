// Flying Boss (ಹಾರುವ ಬಾಸ್) - Birthday Surprise Special Edition 🎂🎁
// Pure Happy Birthday Theme | Android & Mobile Optimized Touch Controls

(function() {
    'use strict';

    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const previewCanvas = document.getElementById('previewCanvas');
    const previewCtx = previewCanvas.getContext('2d');

    // UI Elements
    const startScreen = document.getElementById('start-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    const pauseScreen = document.getElementById('pause-screen');
    const surpriseCardModal = document.getElementById('surprise-card-modal');
    const customizerModal = document.getElementById('customizer-modal');

    const scoreVal = document.getElementById('score-val');
    const cakeCountEl = document.getElementById('cake-count');
    const menuBestScore = document.getElementById('menu-best-score');
    const finalScore = document.getElementById('final-score');
    const finalBest = document.getElementById('final-best');
    const finalCakeCount = document.getElementById('final-cake-count');
    const finalCakePoints = document.getElementById('final-cake-points');
    const newHighBadge = document.getElementById('new-high-badge');
    const massTier = document.getElementById('mass-tier');
    const gameoverQuote = document.getElementById('gameover-quote');
    const verdictTag = document.getElementById('verdict-tag');
    const dialogueBanner = document.getElementById('dialogue-banner');
    const dialogueText = document.getElementById('dialogue-text');
    const btnSound = document.getElementById('btn-sound');
    const btnPause = document.getElementById('btn-pause');
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');
    const btnResume = document.getElementById('btn-resume');
    const btnShare = document.getElementById('btn-share');
    const skinTabs = document.querySelectorAll('.skin-tab[data-skin]');
    const customFaceInput = document.getElementById('custom-face-input');
    const customSongInput = document.getElementById('custom-song-input');
    const currentSongLabel = document.getElementById('current-song-label');
    const partyHatToggle = document.getElementById('party-hat-toggle');

    // Surprise & Card Elements
    const displayHerName = document.getElementById('display-her-name');
    const cardHerName = document.getElementById('card-her-name');
    const cardLetterBody = document.getElementById('card-letter-body');
    const btnEditSurprise = document.getElementById('btn-edit-surprise');
    const btnOpenCardDirect = document.getElementById('btn-open-card-direct');
    const btnHudSurprise = document.getElementById('btn-hud-surprise');
    const btnGameoverSurprise = document.getElementById('btn-gameover-surprise');
    const btnCloseCard = document.getElementById('btn-close-card');
    const btnCloseCardBottom = document.getElementById('btn-close-card-bottom');
    const btnBlowCandle = document.getElementById('btn-blow-candle');
    const cardCandleFlame = document.getElementById('card-candle-flame');
    const wishRevealedText = document.getElementById('wish-revealed-text');
    const btnCardMusic = document.getElementById('btn-card-music');
    const btnCardCopyMsg = document.getElementById('btn-card-copy-msg');

    // Customizer Modal Elements
    const inputHerName = document.getElementById('input-her-name');
    const inputLetterMsg = document.getElementById('input-letter-msg');
    const btnSaveSurprise = document.getElementById('btn-save-surprise');
    const btnCancelSurprise = document.getElementById('btn-cancel-surprise');

    // Stored Birthday Customizations
    const DEFAULT_LETTER = `ಹುಟ್ಟುಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! 🎂✨

ನಮ್ಮ ದಾರಿಗಳು ಬದಲಾಗಿದ್ದರೂ, ನಿನ್ನ ಮುಖದಲ್ಲಿ ಯಾವಾಗಲೂ ಆ ಮುಗ್ಧ ನಗು ಹಾಗೆಯೇ ಇರಲಿ.
ನಿನ್ನ ಜೀವನದಲ್ಲಿ ಎಲ್ಲಾ ಸಂತೋಷ, ನೆಮ್ಮದಿ, ಯಶಸ್ಸು ಮತ್ತು ಉತ್ತಮ ಆರೋಗ್ಯ ಸದಾ ಇರಲಿ ಎಂದು ಹೃದಯಪೂರ್ವಕವಾಗಿ ಹಾರೈಸುತ್ತೇನೆ.

Have a truly beautiful, blessed, and wonderful birthday ahead! 💖🌸`;

    let herName = localStorage.getItem('kannada_surprise_her_name') || 'Princess';
    let herLetter = localStorage.getItem('kannada_surprise_her_letter') || DEFAULT_LETTER;

    function updateSurpriseDisplay() {
        if (displayHerName) displayHerName.textContent = herName + ' 👑';
        if (cardHerName) cardHerName.textContent = herName;
        if (cardLetterBody) cardLetterBody.textContent = herLetter;
        if (inputHerName) inputHerName.value = herName;
        if (inputLetterMsg) inputLetterMsg.value = herLetter;
    }
    updateSurpriseDisplay();

    // Virtual resolution (Optimized for Android Mobile & Desktop)
    const VIRTUAL_WIDTH = 480;
    const VIRTUAL_HEIGHT = 720;
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
        dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.resetTransform();
        ctx.scale((canvas.width / VIRTUAL_WIDTH), (canvas.height / VIRTUAL_HEIGHT));
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Game Constants & Variables
    const STATES = { MENU: 0, PLAYING: 1, GAMEOVER: 2, PAUSED: 3 };
    let gameState = STATES.MENU;
    let openedFromState = STATES.MENU;

    let score = 0;
    let cakesEaten = 0;
    let highScore = parseInt(localStorage.getItem('kannada_flying_birthday_best') || '0', 10);
    if (menuBestScore) menuBestScore.textContent = highScore;

    let selectedSkin = 'queen'; // Default Birthday Queen
    let customImage = null;
    let showPartyHat = true;

    if (partyHatToggle) {
        partyHatToggle.addEventListener('change', (e) => {
            showPartyHat = e.target.checked;
            drawPreview();
        });
    }

    let shakeTimer = 0;
    let shakeIntensity = 0;

    // ONLY PURE HAPPY BIRTHDAY DIALOGUES
    const BIRTHDAY_DIALOGUES = [
        "ಹುಟ್ಟುಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! 🎂🎉",
        "Happy Birthday! May your day be blessed! 🌸✨",
        "ಸರ್ಪ್ರೈಸ್ ಗಿಫ್ಟ್ ಹಿಡಿಯಿರಿ! 🎁💖",
        "ಸದಾ ನಗುನಗುತ್ತಾ ಖುಷಿಯಾಗಿರಿ! 🌸",
        "ಇಂದು ನಿಮ್ಮದೇ ವಿಶೇಷ ದಿನ! 👑🎂",
        "ಜೈ ಕರ್ನಾಟಕ! ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ! 💛❤️",
        "Wishing you joy, love & happiness! ✨🎂",
        "ನಿಮ್ಮ ಎಲ್ಲಾ ಕನಸುಗಳು ಈಡೇರಲಿ! 🌟"
    ];

    const GAMEOVER_QUOTES = [
        { quote: "ಹುಟ್ಟುಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ನಿಮ್ಮ ಮುಖದಲ್ಲಿ ನಗು ಸದಾ ಇರಲಿ!", verdict: "ಗ್ರಾಂಡ್ ಬರ್ತ್‌ಡೇ ಸೆಲೆಬ್ರೇಷನ್! 🎂" },
        { quote: "May all your dreams and wishes come true this year! 🌸", verdict: "ಕ್ವೀನ್ ಸ್ಪೆಷಲ್ ವಿಶ್! 👑" },
        { quote: "ನಿಮ್ಮ ಜೀವನದಲ್ಲಿ ಎಲ್ಲಾ ಸಂತೋಷ, ನೆಮ್ಮದಿ, ಯಶಸ್ಸು ಸದಾ ಇರಲಿ!", verdict: "ಬರ್ತ್‌ಡೇ ಬ್ಲಾಕ್‌ಬಸ್ಟರ್! ✨" },
        { quote: "Happy Birthday! Wishing you a year full of smiles & success!", verdict: "ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ ರನ್! 🎉" }
    ];

    function getBirthdayTier(s, c) {
        const total = s + c;
        if (total >= 50) return { name: "ಬರ್ತ್‌ಡೇ ಮಹಾರಾಣಿ 👑🎂", color: "#ffd700" };
        if (total >= 35) return { name: "ಬರ್ತ್‌ಡೇ ಸೂಪರ್‌ಸ್ಟಾರ್ 🌟💖", color: "#00d2d3" };
        if (total >= 20) return { name: "ಬರ್ತ್‌ಡೇ ಕ್ವೀನ್ 👑🍰", color: "#ff6b81" };
        if (total >= 10) return { name: "ಬರ್ತ್‌ಡೇ ಪಾರ್ಟಿ ಲೀಡರ್ 🎉", color: "#ff9f1a" };
        return { name: "ಬರ್ತ್‌ಡೇ ಗೆಳತಿ 🎈", color: "#2ed573" };
    }

    // Hero Object
    const hero = {
        x: 100,
        y: 320,
        width: 48,
        height: 48,
        radius: 24,
        vy: 0,
        gravity: 0.38,
        jumpForce: -7.0,
        rotation: 0,
        frame: 0,

        reset() {
            this.x = 100;
            this.y = 300;
            this.vy = 0;
            this.rotation = 0;
            this.frame = 0;
        },

        flap() {
            this.vy = this.jumpForce;
            window.kannadaSound.playJump();

            for (let i = 0; i < 8; i++) {
                const colors = ['#f7d117', '#d21034', '#ff6b81', '#00d2d3', '#e056fd', '#fff'];
                particles.push(new Particle(
                    this.x - 14 + Math.random() * 8,
                    this.y + 12 + Math.random() * 8,
                    (Math.random() - 0.7) * 3,
                    (Math.random() + 0.6) * 3,
                    colors[Math.floor(Math.random() * colors.length)],
                    Math.random() * 5 + 3,
                    28
                ));
            }
        },

        update() {
            this.vy += this.gravity;
            this.y += this.vy;
            this.frame += 0.15;

            const targetRot = Math.min(Math.PI / 2.5, Math.max(-Math.PI / 7, this.vy * 0.08));
            this.rotation += (targetRot - this.rotation) * 0.2;

            const floorY = VIRTUAL_HEIGHT - 65;
            if (this.y + this.radius >= floorY) {
                this.y = floorY - this.radius;
                return true;
            }
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.vy = 0;
            }
            return false;
        },

        draw(targetCtx, renderX = this.x, renderY = this.y, rot = this.rotation) {
            targetCtx.save();
            targetCtx.translate(renderX, renderY);
            targetCtx.rotate(rot);

            // 1. Wings / Cape
            targetCtx.save();
            const flapOffset = Math.sin(this.frame * 2.5) * 8;
            if (selectedSkin === 'queen') {
                targetCtx.fillStyle = 'rgba(255, 107, 129, 0.75)';
                targetCtx.beginPath();
                targetCtx.ellipse(-24, flapOffset - 4, 18, 10, -0.3, 0, Math.PI * 2);
                targetCtx.fill();
                targetCtx.strokeStyle = '#fff';
                targetCtx.lineWidth = 1.5;
                targetCtx.stroke();
            } else {
                targetCtx.fillStyle = (selectedSkin === 'simha') ? '#d21034' : (selectedSkin === 'appu' ? '#ff6b81' : '#c0392b');
                targetCtx.beginPath();
                targetCtx.moveTo(-16, -4);
                targetCtx.quadraticCurveTo(-38, flapOffset, -50, flapOffset * 1.5 + 10);
                targetCtx.lineTo(-32, 16);
                targetCtx.closePath();
                targetCtx.fill();
            }
            targetCtx.restore();

            // 2. Aura
            targetCtx.save();
            targetCtx.shadowColor = (selectedSkin === 'queen') ? 'rgba(224, 86, 253, 0.7)' : 'rgba(255, 204, 0, 0.55)';
            targetCtx.shadowBlur = 14;
            targetCtx.beginPath();
            targetCtx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
            targetCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            targetCtx.fill();
            targetCtx.restore();

            // 3. Avatar Face / Photo
            if (selectedSkin === 'custom' && customImage) {
                targetCtx.save();
                targetCtx.beginPath();
                targetCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
                targetCtx.clip();
                targetCtx.drawImage(customImage, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
                targetCtx.restore();

                targetCtx.strokeStyle = '#ffd700';
                targetCtx.lineWidth = 3;
                targetCtx.beginPath();
                targetCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
                targetCtx.stroke();
            } else {
                this.drawProceduralHero(targetCtx);
            }

            // 4. Birthday Party Hat
            if (showPartyHat && selectedSkin !== 'queen') {
                this.drawPartyHat(targetCtx);
            }

            targetCtx.restore();
        },

        drawPartyHat(tCtx) {
            tCtx.save();
            tCtx.translate(0, -this.radius + 4);

            tCtx.beginPath();
            tCtx.moveTo(-14, 0);
            tCtx.lineTo(0, -28);
            tCtx.lineTo(14, 0);
            tCtx.closePath();

            const grad = tCtx.createLinearGradient(-14, 0, 14, -28);
            grad.addColorStop(0, '#ff4757');
            grad.addColorStop(0.3, '#f7d117');
            grad.addColorStop(0.6, '#2ed573');
            grad.addColorStop(1, '#ff6b81');
            tCtx.fillStyle = grad;
            tCtx.fill();

            tCtx.strokeStyle = '#fff';
            tCtx.lineWidth = 2;
            tCtx.beginPath();
            tCtx.moveTo(-15, 0);
            tCtx.lineTo(15, 0);
            tCtx.stroke();

            tCtx.fillStyle = '#fff';
            tCtx.beginPath();
            tCtx.arc(0, -29, 4.5, 0, Math.PI * 2);
            tCtx.fill();

            tCtx.restore();
        },

        drawProceduralHero(tCtx) {
            const r = this.radius;

            if (selectedSkin === 'queen') {
                tCtx.fillStyle = '#ffeaa7';
                tCtx.beginPath();
                tCtx.arc(0, 0, r, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.fillStyle = '#3d1d11';
                tCtx.beginPath();
                tCtx.arc(0, -5, r * 1.02, Math.PI * 0.85, Math.PI * 2.15);
                tCtx.fill();
                tCtx.beginPath();
                tCtx.arc(-r * 0.8, 6, 8, 0, Math.PI * 2);
                tCtx.arc(r * 0.8, 6, 8, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.fillStyle = '#2d3436';
                tCtx.beginPath();
                tCtx.arc(-7, -1, 2.5, 0, Math.PI * 2);
                tCtx.arc(7, -1, 2.5, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.fillStyle = '#fff';
                tCtx.beginPath();
                tCtx.arc(-8, -2, 1, 0, Math.PI * 2);
                tCtx.arc(6, -2, 1, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.fillStyle = 'rgba(255, 107, 129, 0.45)';
                tCtx.beginPath();
                tCtx.arc(-11, 5, 4.5, 0, Math.PI * 2);
                tCtx.arc(11, 5, 4.5, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.strokeStyle = '#e84118';
                tCtx.lineWidth = 1.8;
                tCtx.beginPath();
                tCtx.arc(0, 5, 6, 0.2, Math.PI - 0.2);
                tCtx.stroke();

                // Golden Sparkling TIARA / CROWN 👑
                tCtx.fillStyle = '#ffd700';
                tCtx.strokeStyle = '#e1b12c';
                tCtx.lineWidth = 1;
                tCtx.beginPath();
                tCtx.moveTo(-16, -16);
                tCtx.lineTo(-12, -26);
                tCtx.lineTo(-4, -18);
                tCtx.lineTo(0, -30);
                tCtx.lineTo(4, -18);
                tCtx.lineTo(12, -26);
                tCtx.lineTo(16, -16);
                tCtx.closePath();
                tCtx.fill();
                tCtx.stroke();

                tCtx.fillStyle = '#ff4757';
                tCtx.beginPath();
                tCtx.arc(0, -22, 2.5, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.fillStyle = '#f1f2f6';
                tCtx.beginPath();
                tCtx.arc(-r * 0.9, 10, 2.5, 0, Math.PI * 2);
                tCtx.arc(r * 0.9, 10, 2.5, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.strokeStyle = '#ff6b81';
                tCtx.lineWidth = 2.5;
                tCtx.beginPath();
                tCtx.arc(0, 0, r, 0, Math.PI * 2);
                tCtx.stroke();
                return;
            }

            tCtx.fillStyle = (selectedSkin === 'appu') ? '#f3cba8' : '#e0ac69';
            tCtx.beginPath();
            tCtx.arc(0, 0, r, 0, Math.PI * 2);
            tCtx.fill();

            tCtx.strokeStyle = '#ffd700';
            tCtx.lineWidth = 2.5;
            tCtx.beginPath();
            tCtx.arc(0, 8, r * 0.7, 0.2, Math.PI - 0.2);
            tCtx.stroke();

            if (selectedSkin === 'rocky') {
                tCtx.fillStyle = '#111';
                tCtx.beginPath();
                tCtx.arc(0, -6, r * 0.98, Math.PI * 0.9, Math.PI * 2.1);
                tCtx.fill();

                tCtx.fillStyle = '#1c1c1c';
                tCtx.beginPath();
                tCtx.arc(0, 4, r * 0.95, 0.2, Math.PI - 0.2);
                tCtx.lineTo(0, r + 4);
                tCtx.closePath();
                tCtx.fill();

                tCtx.fillStyle = '#0a0a0a';
                tCtx.strokeStyle = '#ffd700';
                tCtx.lineWidth = 1.5;
                tCtx.beginPath();
                tCtx.roundRect(-16, -6, 13, 9, 3);
                tCtx.fill();
                tCtx.stroke();
                tCtx.beginPath();
                tCtx.roundRect(3, -6, 13, 9, 3);
                tCtx.fill();
                tCtx.stroke();

                tCtx.beginPath();
                tCtx.moveTo(-3, -2);
                tCtx.lineTo(3, -2);
                tCtx.stroke();

            } else if (selectedSkin === 'appu') {
                tCtx.fillStyle = '#222';
                tCtx.beginPath();
                tCtx.arc(0, -7, r * 0.95, Math.PI * 0.95, Math.PI * 2.05);
                tCtx.lineTo(r * 0.6, -r * 0.2);
                tCtx.fill();

                tCtx.fillStyle = '#2d3436';
                tCtx.beginPath();
                tCtx.arc(-8, -4, 3, 0, Math.PI * 2);
                tCtx.arc(8, -4, 3, 0, Math.PI * 2);
                tCtx.fill();

                tCtx.strokeStyle = '#c0392b';
                tCtx.lineWidth = 2.2;
                tCtx.beginPath();
                tCtx.arc(0, 3, 9, 0.2, Math.PI - 0.2);
                tCtx.stroke();
            }

            tCtx.strokeStyle = '#f7d117';
            tCtx.lineWidth = 2.5;
            tCtx.beginPath();
            tCtx.arc(0, 0, r, 0, Math.PI * 2);
            tCtx.stroke();
        }
    };

    // Obstacle System: Amber Glass Bottle
    const obstacles = [];
    const OBSTACLE_WIDTH = 70;
    const OBSTACLE_GAP = 188;
    const OBSTACLE_SPACING = 275;
    let obstacleTimer = 0;
    let totalObstaclesSpawned = 0;

    class Obstacle {
        constructor(x) {
            this.x = x;
            this.width = OBSTACLE_WIDTH;
            this.gap = OBSTACLE_GAP;
            this.passed = false;
            totalObstaclesSpawned++;

            const minTop = 85;
            const maxTop = VIRTUAL_HEIGHT - 65 - this.gap - 85;
            this.topHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
            this.bottomY = this.topHeight + this.gap;
            this.bottomHeight = (VIRTUAL_HEIGHT - 65) - this.bottomY;

            // Collectibles:
            // Every 4th is Surprise Gift Box 🎁, otherwise 70% chance Birthday Cake 🎂
            this.collectibleY = this.topHeight + this.gap / 2;
            this.collected = false;

            if (totalObstaclesSpawned % 4 === 0) {
                this.collectibleType = 'surprise';
            } else if (Math.random() < 0.7) {
                this.collectibleType = 'cake';
            } else {
                this.collectibleType = null;
            }
        }

        update(speed) {
            this.x -= speed;
        }

        collidesWith(h) {
            const topBox = { x: this.x, y: 0, w: this.width, h: this.topHeight };
            if (this.circleRectCollision(h.x, h.y, h.radius * 0.85, topBox)) return true;

            const bottomBox = { x: this.x, y: this.bottomY, w: this.width, h: this.bottomHeight };
            if (this.circleRectCollision(h.x, h.y, h.radius * 0.85, bottomBox)) return true;

            return false;
        }

        circleRectCollision(cx, cy, radius, rect) {
            const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
            const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
            const distX = cx - nearestX;
            const distY = cy - nearestY;
            return (distX * distX + distY * distY) < (radius * radius);
        }

        draw(tCtx) {
            this.drawBottle(tCtx, this.x, this.topHeight, this.width, true);
            this.drawBottle(tCtx, this.x, this.bottomY, this.width, false, this.bottomHeight);

            if (!this.collected) {
                if (this.collectibleType === 'cake') {
                    this.drawBirthdayCake(tCtx, this.x + this.width / 2, this.collectibleY);
                } else if (this.collectibleType === 'surprise') {
                    this.drawSurpriseGiftBox(tCtx, this.x + this.width / 2, this.collectibleY);
                }
            }
        }

        // Amber Bottle Visual
        drawBottle(tCtx, x, y, w, isInverted, customHeight) {
            tCtx.save();
            const neckW = w * 0.38;
            const neckH = 50;

            const glassGrad = tCtx.createLinearGradient(x, 0, x + w, 0);
            glassGrad.addColorStop(0, '#2d1405');
            glassGrad.addColorStop(0.25, '#5d2b0a');
            glassGrad.addColorStop(0.65, '#9e4b10');
            glassGrad.addColorStop(0.85, '#d4771e');
            glassGrad.addColorStop(1, '#251004');

            const foilGrad = tCtx.createLinearGradient(x, 0, x + w, 0);
            foilGrad.addColorStop(0, '#936d1b');
            foilGrad.addColorStop(0.3, '#dfad3b');
            foilGrad.addColorStop(0.7, '#f7d268');
            foilGrad.addColorStop(1, '#876114');

            if (isInverted) {
                const bodyH = y - neckH;

                tCtx.fillStyle = glassGrad;
                tCtx.fillRect(x, 0, w, bodyH);

                tCtx.beginPath();
                tCtx.moveTo(x, bodyH);
                tCtx.lineTo(x + (w - neckW) / 2, bodyH + 18);
                tCtx.lineTo(x + (w + neckW) / 2, bodyH + 18);
                tCtx.lineTo(x + w, bodyH);
                tCtx.closePath();
                tCtx.fill();

                tCtx.fillStyle = foilGrad;
                tCtx.fillRect(x + (w - neckW) / 2, bodyH + 12, neckW, neckH - 12);

                tCtx.fillStyle = '#dfad3b';
                tCtx.fillRect(x + (w - neckW) / 2 - 2, y - 10, neckW + 4, 10);
                tCtx.strokeStyle = '#5a3d00';
                tCtx.lineWidth = 1;
                tCtx.strokeRect(x + (w - neckW) / 2 - 2, y - 10, neckW + 4, 10);

                tCtx.strokeStyle = '#111';
                tCtx.lineWidth = 2;
                tCtx.beginPath();
                tCtx.arc(x + w / 2, y - 13, 3.5, 0, Math.PI * 2);
                tCtx.stroke();

                if (bodyH > 80) {
                    const labelY = bodyH - 75;
                    const labelW = w - 10;
                    const labelH = 55;

                    tCtx.fillStyle = '#fffdf7';
                    tCtx.beginPath();
                    tCtx.roundRect(x + 5, labelY, labelW, labelH, 6);
                    tCtx.fill();
                    tCtx.strokeStyle = '#dfad3b';
                    tCtx.lineWidth = 2;
                    tCtx.stroke();

                    tCtx.fillStyle = '#800c1c';
                    tCtx.beginPath();
                    tCtx.roundRect(x + 8, labelY + 14, labelW - 6, 24, 3);
                    tCtx.fill();

                    tCtx.fillStyle = '#ffffff';
                    tCtx.font = 'bold 7px Montserrat, sans-serif';
                    tCtx.textAlign = 'center';
                    tCtx.fillText('★ SPECIAL ★', x + w / 2, labelY + 28);
                }

                tCtx.fillStyle = 'rgba(255, 255, 255, 0.32)';
                tCtx.fillRect(x + 7, 0, 4, bodyH + 12);

            } else {
                const bodyY = y + neckH;
                const bodyH = customHeight - neckH;

                tCtx.fillStyle = '#dfad3b';
                tCtx.fillRect(x + (w - neckW) / 2 - 2, y, neckW + 4, 10);
                tCtx.strokeStyle = '#5a3d00';
                tCtx.lineWidth = 1;
                tCtx.strokeRect(x + (w - neckW) / 2 - 2, y, neckW + 4, 10);

                tCtx.strokeStyle = '#111';
                tCtx.lineWidth = 2;
                tCtx.beginPath();
                tCtx.arc(x + w / 2, y - 3, 3.5, 0, Math.PI * 2);
                tCtx.stroke();

                tCtx.fillStyle = foilGrad;
                tCtx.fillRect(x + (w - neckW) / 2, y + 10, neckW, neckH - 22);

                tCtx.fillStyle = glassGrad;
                tCtx.beginPath();
                tCtx.moveTo(x + (w - neckW) / 2, y + neckH - 12);
                tCtx.lineTo(x, bodyY);
                tCtx.lineTo(x + w, bodyY);
                tCtx.lineTo(x + (w + neckW) / 2, y + neckH - 12);
                tCtx.closePath();
                tCtx.fill();

                tCtx.fillRect(x, bodyY, w, bodyH);

                if (bodyH > 75) {
                    const labelY = bodyY + 12;
                    const labelW = w - 10;
                    const labelH = 55;

                    tCtx.fillStyle = '#fffdf7';
                    tCtx.beginPath();
                    tCtx.roundRect(x + 5, labelY, labelW, labelH, 6);
                    tCtx.fill();
                    tCtx.strokeStyle = '#dfad3b';
                    tCtx.lineWidth = 2;
                    tCtx.stroke();

                    tCtx.fillStyle = '#800c1c';
                    tCtx.beginPath();
                    tCtx.roundRect(x + 8, labelY + 14, labelW - 6, 24, 3);
                    tCtx.fill();

                    tCtx.fillStyle = '#ffffff';
                    tCtx.font = 'bold 7px Montserrat, sans-serif';
                    tCtx.textAlign = 'center';
                    tCtx.fillText('★ SPECIAL ★', x + w / 2, labelY + 28);
                }

                tCtx.fillStyle = 'rgba(255, 255, 255, 0.32)';
                tCtx.fillRect(x + 7, bodyY, 4, bodyH);
            }

            tCtx.restore();
        }

        // DELICIOUS BIRTHDAY CAKE 🎂
        drawBirthdayCake(tCtx, cx, cy) {
            tCtx.save();
            const floatOffset = Math.sin(hero.frame * 2) * 5;
            tCtx.translate(cx, cy + floatOffset);

            tCtx.shadowColor = 'rgba(255, 107, 129, 0.7)';
            tCtx.shadowBlur = 15;

            tCtx.fillStyle = '#ffeaa7';
            tCtx.beginPath();
            tCtx.roundRect(-20, 0, 40, 16, 4);
            tCtx.fill();

            tCtx.fillStyle = '#6d4c41';
            tCtx.fillRect(-20, 7, 40, 3);

            tCtx.fillStyle = '#ff7675';
            tCtx.beginPath();
            tCtx.roundRect(-16, -12, 32, 14, 3);
            tCtx.fill();

            tCtx.fillStyle = '#ffffff';
            tCtx.beginPath();
            tCtx.moveTo(-16, -12);
            tCtx.lineTo(16, -12);
            tCtx.quadraticCurveTo(12, -7, 8, -12);
            tCtx.quadraticCurveTo(4, -5, 0, -12);
            tCtx.quadraticCurveTo(-4, -6, -8, -12);
            tCtx.quadraticCurveTo(-12, -7, -16, -12);
            tCtx.closePath();
            tCtx.fill();

            tCtx.fillStyle = '#00cec9';
            tCtx.fillRect(-10, 4, 3, 2);
            tCtx.fillStyle = '#fdcb6e';
            tCtx.fillRect(6, 3, 3, 2);
            tCtx.fillStyle = '#a29bfe';
            tCtx.fillRect(10, 10, 3, 2);

            tCtx.fillStyle = '#74b9ff';
            tCtx.fillRect(-2, -22, 4, 10);

            tCtx.strokeStyle = '#2d3436';
            tCtx.beginPath();
            tCtx.moveTo(0, -22);
            tCtx.lineTo(0, -24);
            tCtx.stroke();

            const flameFlicker = Math.sin(hero.frame * 8) * 1.5;
            tCtx.shadowColor = '#fdcb6e';
            tCtx.shadowBlur = 10;
            tCtx.fillStyle = '#f39c12';
            tCtx.beginPath();
            tCtx.ellipse(0, -28 + flameFlicker, 3.5, 6, 0, 0, Math.PI * 2);
            tCtx.fill();

            tCtx.fillStyle = '#fff200';
            tCtx.beginPath();
            tCtx.ellipse(0, -27 + flameFlicker, 2, 3.5, 0, 0, Math.PI * 2);
            tCtx.fill();

            tCtx.restore();
        }

        // SURPRISE GIFT BOX 🎁
        drawSurpriseGiftBox(tCtx, cx, cy) {
            tCtx.save();
            const floatOffset = Math.sin(hero.frame * 2.5) * 6;
            tCtx.translate(cx, cy + floatOffset);

            tCtx.shadowColor = '#e056fd';
            tCtx.shadowBlur = 18;

            tCtx.fillStyle = '#ff4757';
            tCtx.beginPath();
            tCtx.roundRect(-16, -16, 32, 32, 5);
            tCtx.fill();

            tCtx.fillStyle = '#ff6b81';
            tCtx.beginPath();
            tCtx.roundRect(-18, -19, 36, 8, 3);
            tCtx.fill();

            tCtx.fillStyle = '#ffd700';
            tCtx.fillRect(-4, -19, 8, 35);
            tCtx.fillRect(-16, -4, 32, 8);

            tCtx.beginPath();
            tCtx.ellipse(-6, -23, 6, 4, -0.4, 0, Math.PI * 2);
            tCtx.ellipse(6, -23, 6, 4, 0.4, 0, Math.PI * 2);
            tCtx.fill();

            tCtx.fillStyle = '#fff';
            tCtx.font = 'bold 8px Anek Kannada';
            tCtx.textAlign = 'center';
            tCtx.fillText('SURPRISE!', 0, 24);

            tCtx.restore();
        }
    }

    // Party Balloon System
    const balloons = [];
    class Balloon {
        constructor() {
            this.x = Math.random() * VIRTUAL_WIDTH;
            this.y = VIRTUAL_HEIGHT + 30 + Math.random() * 80;
            this.vy = -(Math.random() * 1.2 + 0.8);
            this.color = ['#ff4757', '#f7d117', '#ff6b81', '#00d2d3', '#a29bfe', '#ff9f1a'][Math.floor(Math.random() * 6)];
            this.radius = Math.random() * 10 + 14;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            this.wobbleAmp = Math.random() * 20 + 10;
            this.startX = this.x;
            this.time = Math.random() * 100;
        }
        update() {
            this.time += this.wobbleSpeed;
            this.y += this.vy;
            this.x = this.startX + Math.sin(this.time) * this.wobbleAmp;
            if (this.y < -50) {
                this.y = VIRTUAL_HEIGHT + 40;
                this.startX = Math.random() * VIRTUAL_WIDTH;
                this.x = this.startX;
            }
        }
        draw(tCtx) {
            tCtx.save();
            tCtx.globalAlpha = 0.45;
            tCtx.fillStyle = this.color;
            tCtx.beginPath();
            tCtx.ellipse(this.x, this.y, this.radius * 0.8, this.radius, 0, 0, Math.PI * 2);
            tCtx.fill();

            tCtx.beginPath();
            tCtx.moveTo(this.x, this.y + this.radius);
            tCtx.lineTo(this.x - 3, this.y + this.radius + 5);
            tCtx.lineTo(this.x + 3, this.y + this.radius + 5);
            tCtx.closePath();
            tCtx.fill();

            tCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            tCtx.lineWidth = 1;
            tCtx.beginPath();
            tCtx.moveTo(this.x, this.y + this.radius + 5);
            tCtx.quadraticCurveTo(this.x + 5, this.y + this.radius + 15, this.x - 2, this.y + this.radius + 25);
            tCtx.stroke();
            tCtx.restore();
        }
    }

    for (let i = 0; i < 6; i++) {
        balloons.push(new Balloon());
    }

    // Particles & Floating Text System
    const particles = [];
    const floatingTexts = [];

    class Particle {
        constructor(x, y, vx, vy, color, size, maxLife = 30, isHeart = false) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.size = size;
            this.life = 0;
            this.maxLife = maxLife;
            this.isHeart = isHeart;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            return this.life < this.maxLife;
        }
        draw(tCtx) {
            const alpha = 1 - (this.life / this.maxLife);
            tCtx.save();
            tCtx.globalAlpha = Math.max(0, alpha);
            tCtx.fillStyle = this.color;

            if (this.isHeart) {
                tCtx.font = `${Math.max(10, this.size * 2)}px sans-serif`;
                tCtx.textAlign = 'center';
                tCtx.fillText('💖', this.x, this.y);
            } else {
                tCtx.beginPath();
                tCtx.arc(this.x, this.y, Math.max(1, this.size * alpha), 0, Math.PI * 2);
                tCtx.fill();
            }
            tCtx.restore();
        }
    }

    class FloatingText {
        constructor(text, x, y, color) {
            this.text = text;
            this.x = x;
            this.y = y;
            this.color = color;
            this.life = 0;
            this.maxLife = 40;
        }
        update() {
            this.y -= 1.2;
            this.life++;
            return this.life < this.maxLife;
        }
        draw(tCtx) {
            const alpha = 1 - (this.life / this.maxLife);
            tCtx.save();
            tCtx.globalAlpha = Math.max(0, alpha);
            tCtx.font = 'bold 15px Anek Kannada, sans-serif';
            tCtx.fillStyle = this.color;
            tCtx.shadowColor = '#000';
            tCtx.shadowBlur = 6;
            tCtx.textAlign = 'center';
            tCtx.fillText(this.text, this.x, this.y);
            tCtx.restore();
        }
    }

    function createPartyCakeBurst(x, y) {
        for (let i = 0; i < 28; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            const colors = ['#ff6b81', '#f7d117', '#d21034', '#00d2d3', '#a29bfe', '#fff'];
            particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 6 + 3,
                40
            ));
        }
        floatingTexts.push(new FloatingText('+5 ಬರ್ತ್‌ಡೇ ಕೇಕ್! 🎂', x, y - 15, '#ffda79'));
    }

    function createSurpriseGiftBurst(x, y) {
        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            const colors = ['#e056fd', '#ff6b81', '#ffd700', '#fff'];
            particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 7 + 3,
                45,
                Math.random() < 0.4
            ));
        }
        floatingTexts.push(new FloatingText('✨ ಸರ್ಪ್ರೈಸ್ ಗಿಫ್ಟ್! 🎁', x, y - 15, '#ffd700'));
    }

    function createBottleSmashExplosion(x, y) {
        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            const colors = ['#800c1c', '#dfad3b', '#ffffff', '#5d2b0a', '#f7d117'];
            particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 6 + 3,
                45
            ));
        }
    }

    // Parallax Background
    let bgOffsetCity = 0;
    let bgOffsetClouds = 0;
    let spotlightAngle = 0;

    function drawBackground(tCtx) {
        const skyGrad = tCtx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
        skyGrad.addColorStop(0, '#1c082e');
        skyGrad.addColorStop(0.4, '#4d1246');
        skyGrad.addColorStop(0.75, '#b03b2e');
        skyGrad.addColorStop(1, '#f7d117');
        tCtx.fillStyle = skyGrad;
        tCtx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

        spotlightAngle += 0.015;
        tCtx.save();
        tCtx.globalAlpha = 0.12;
        tCtx.fillStyle = '#fff';

        tCtx.beginPath();
        tCtx.moveTo(60, VIRTUAL_HEIGHT - 65);
        const spot1X = 140 + Math.sin(spotlightAngle) * 160;
        tCtx.lineTo(spot1X - 40, 0);
        tCtx.lineTo(spot1X + 40, 0);
        tCtx.closePath();
        tCtx.fill();

        tCtx.beginPath();
        tCtx.moveTo(VIRTUAL_WIDTH - 60, VIRTUAL_HEIGHT - 65);
        const spot2X = VIRTUAL_WIDTH - 140 - Math.cos(spotlightAngle * 1.2) * 160;
        tCtx.lineTo(spot2X - 40, 0);
        tCtx.lineTo(spot2X + 40, 0);
        tCtx.closePath();
        tCtx.fill();
        tCtx.restore();

        balloons.forEach(b => {
            b.update();
            b.draw(tCtx);
        });

        bgOffsetClouds += (gameState === STATES.PLAYING ? 0.4 : 0.15);
        tCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let i = 0; i < 4; i++) {
            const cx = ((i * 180 - bgOffsetClouds) % (VIRTUAL_WIDTH + 200)) - 50;
            tCtx.beginPath();
            tCtx.arc(cx, 130 + (i % 2) * 40, 45, 0, Math.PI * 2);
            tCtx.arc(cx + 40, 120 + (i % 2) * 40, 55, 0, Math.PI * 2);
            tCtx.arc(cx + 80, 130 + (i % 2) * 40, 45, 0, Math.PI * 2);
            tCtx.fill();
        }

        bgOffsetCity += (gameState === STATES.PLAYING ? 0.7 : 0.25);
        tCtx.fillStyle = 'rgba(24, 12, 34, 0.75)';
        const cityY = VIRTUAL_HEIGHT - 130;
        for (let i = 0; i < 6; i++) {
            const bx = ((i * 120 - bgOffsetCity) % (VIRTUAL_WIDTH + 140)) - 60;
            tCtx.fillRect(bx, cityY - 40, 45, 110);
            tCtx.beginPath();
            tCtx.arc(bx + 22.5, cityY - 40, 20, Math.PI, 0);
            tCtx.fill();
            tCtx.fillRect(bx + 21, cityY - 68, 3, 10);
        }

        const floorY = VIRTUAL_HEIGHT - 65;
        tCtx.fillStyle = '#1c1326';
        tCtx.fillRect(0, floorY, VIRTUAL_WIDTH, 65);

        tCtx.fillStyle = '#f7d117';
        tCtx.fillRect(0, floorY, VIRTUAL_WIDTH, 6);
        tCtx.fillStyle = '#d21034';
        tCtx.fillRect(0, floorY + 6, VIRTUAL_WIDTH, 6);

        tCtx.strokeStyle = 'rgba(247, 209, 23, 0.25)';
        tCtx.lineWidth = 2;
        const gridOffset = (bgOffsetCity * 2) % 30;
        for (let gx = -gridOffset; gx < VIRTUAL_WIDTH; gx += 30) {
            tCtx.beginPath();
            tCtx.moveTo(gx, floorY + 12);
            tCtx.lineTo(gx - 20, VIRTUAL_HEIGHT);
            tCtx.stroke();
        }
    }

    function drawPreview() {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        hero.draw(previewCtx, previewCanvas.width / 2, previewCanvas.height / 2 + 6, Math.sin(hero.frame) * 0.1);
    }

    let dialogueTimeout = null;
    function showCelebrationQuote() {
        const text = BIRTHDAY_DIALOGUES[Math.floor(Math.random() * BIRTHDAY_DIALOGUES.length)];
        dialogueText.textContent = text;
        dialogueBanner.classList.remove('hidden');

        window.kannadaSound.speakKannada(text.replace(/[^\u0C80-\u0CFFa-zA-Z ]/g, ''));

        if (dialogueTimeout) clearTimeout(dialogueTimeout);
        dialogueTimeout = setTimeout(() => {
            dialogueBanner.classList.add('hidden');
        }, 2000);
    }

    // ========================================================
    // BULLETPROOF SURPRISE CARD MODAL CONTROLS
    // ========================================================
    function openSurpriseCard() {
        openedFromState = gameState;
        if (gameState === STATES.PLAYING) {
            gameState = STATES.PAUSED;
            window.kannadaSound.stopBGM();
        }

        surpriseCardModal.classList.remove('hidden');
        surpriseCardModal.classList.add('active');
        window.kannadaSound.playSurpriseReveal();

        cardCandleFlame.classList.remove('blown-out');
        wishRevealedText.classList.add('hidden');
    }

    function closeSurpriseCard() {
        surpriseCardModal.classList.remove('active');
        surpriseCardModal.classList.add('hidden');

        if (openedFromState === STATES.PLAYING) {
            gameState = STATES.PLAYING;
            window.kannadaSound.startBGM();
        } else if (openedFromState === STATES.MENU) {
            startScreen.classList.remove('hidden');
            startScreen.classList.add('active');
        } else if (openedFromState === STATES.GAMEOVER) {
            gameoverScreen.classList.remove('hidden');
            gameoverScreen.classList.add('active');
        }
    }

    // Attach click, pointerdown, and touchend events to close buttons
    [btnCloseCard, btnCloseCardBottom].forEach(btn => {
        if (!btn) return;
        ['click', 'pointerdown', 'touchend'].forEach(evtType => {
            btn.addEventListener(evtType, (e) => {
                e.stopPropagation();
                e.preventDefault();
                closeSurpriseCard();
            });
        });
    });

    // Close when clicking the backdrop outside the card
    surpriseCardModal.addEventListener('click', (e) => {
        if (e.target === surpriseCardModal) {
            closeSurpriseCard();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!surpriseCardModal.classList.contains('hidden')) {
                closeSurpriseCard();
            }
            if (!customizerModal.classList.contains('hidden')) {
                customizerModal.classList.remove('active');
                customizerModal.classList.add('hidden');
            }
        }
    });

    // Actions
    function startGame() {
        gameState = STATES.PLAYING;
        openedFromState = STATES.PLAYING;
        score = 0;
        cakesEaten = 0;
        scoreVal.textContent = '0';
        cakeCountEl.textContent = '0';
        obstacles.length = 0;
        particles.length = 0;
        floatingTexts.length = 0;
        hero.reset();

        startScreen.classList.remove('active');
        startScreen.classList.add('hidden');
        gameoverScreen.classList.remove('active');
        gameoverScreen.classList.add('hidden');
        pauseScreen.classList.remove('active');
        pauseScreen.classList.add('hidden');
        closeSurpriseCard();

        window.kannadaSound.startBGM();
        hero.flap();
    }

    function triggerGameOver() {
        gameState = STATES.GAMEOVER;
        openedFromState = STATES.GAMEOVER;
        window.kannadaSound.stopBGM();
        window.kannadaSound.playCrash();

        shakeTimer = 18;
        shakeIntensity = 10;

        createBottleSmashExplosion(hero.x, hero.y);

        let isNewHigh = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('kannada_flying_birthday_best', highScore.toString());
            isNewHigh = true;
            window.kannadaSound.playBirthdayFanfare();
        }

        finalScore.textContent = score;
        finalBest.textContent = highScore;
        menuBestScore.textContent = highScore;
        finalCakeCount.textContent = cakesEaten;
        finalCakePoints.textContent = cakesEaten * 5;

        if (isNewHigh) {
            newHighBadge.classList.remove('hidden');
        } else {
            newHighBadge.classList.add('hidden');
        }

        const tier = getBirthdayTier(score, cakesEaten);
        massTier.textContent = tier.name;
        massTier.style.color = tier.color;

        const pick = GAMEOVER_QUOTES[Math.floor(Math.random() * GAMEOVER_QUOTES.length)];
        gameoverQuote.textContent = pick.quote;
        verdictTag.textContent = pick.verdict;

        setTimeout(() => {
            gameoverScreen.classList.remove('hidden');
            gameoverScreen.classList.add('active');
        }, 400);
    }

    function togglePause() {
        if (gameState === STATES.PLAYING) {
            gameState = STATES.PAUSED;
            pauseScreen.classList.remove('hidden');
            pauseScreen.classList.add('active');
            window.kannadaSound.stopBGM();
        } else if (gameState === STATES.PAUSED) {
            gameState = STATES.PLAYING;
            pauseScreen.classList.remove('active');
            pauseScreen.classList.add('hidden');
            window.kannadaSound.startBGM();
        }
    }

    function handleAction() {
        if (!surpriseCardModal.classList.contains('hidden') || !customizerModal.classList.contains('hidden')) {
            return;
        }
        if (gameState === STATES.MENU) {
            startGame();
        } else if (gameState === STATES.PLAYING) {
            hero.flap();
        } else if (gameState === STATES.GAMEOVER) {
            startGame();
        }
    }

    // Android & Mobile Touch Support (Flawless, Zero Latency)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.kannadaSound.init();
        handleAction();
    }, { passive: false });

    canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        window.kannadaSound.init();
        handleAction();
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            window.kannadaSound.init();
            handleAction();
        } else if (e.code === 'KeyP') {
            togglePause();
        } else if (e.code === 'KeyM') {
            const isUnmuted = window.kannadaSound.toggleMute();
            btnSound.querySelector('.icon').textContent = isUnmuted ? '🔊' : '🔇';
        }
    });

    // Buttons
    btnStart.addEventListener('click', (e) => {
        e.stopPropagation();
        startGame();
    });

    btnRestart.addEventListener('click', (e) => {
        e.stopPropagation();
        startGame();
    });

    btnResume.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePause();
    });

    btnPause.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePause();
    });

    btnSound.addEventListener('click', (e) => {
        e.stopPropagation();
        const isUnmuted = window.kannadaSound.toggleMute();
        btnSound.querySelector('.icon').textContent = isUnmuted ? '🔊' : '🔇';
    });

    btnShare.addEventListener('click', (e) => {
        e.stopPropagation();
        const shareText = `🎂 ನಾನು "${herName}" ಅವರ ಹುಟ್ಟುಹಬ್ಬದ ಗೇಮ್‌ನಲ್ಲಿ ${score} ಅಂಕ ಗಳಿಸಿ, ${cakesEaten} ಕೇಕ್ ತಿಂದಿದ್ದೇನೆ! Happy Birthday! 🎂✨ #HappyBirthday`;
        if (navigator.share) {
            navigator.share({
                title: `${herName} - Birthday Surprise Game`,
                text: shareText,
                url: window.location.href
            }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('ಹುಟ್ಟುಹಬ್ಬದ ಸಂದೇಶ ಕಾಪಿ ಆಗಿದೆ! ನಿಮ್ಮ ಗೆಳೆಯರಿಗೆ ಕಳಿಸಿ! 📢');
            });
        }
    });

    // Surprise Card Triggers
    btnOpenCardDirect.addEventListener('click', (e) => {
        e.stopPropagation();
        openSurpriseCard();
    });

    btnHudSurprise.addEventListener('click', (e) => {
        e.stopPropagation();
        openSurpriseCard();
    });

    btnGameoverSurprise.addEventListener('click', (e) => {
        e.stopPropagation();
        openSurpriseCard();
    });

    // Interactive Candle Blow
    btnBlowCandle.addEventListener('click', (e) => {
        e.stopPropagation();
        cardCandleFlame.classList.add('blown-out');
        wishRevealedText.classList.remove('hidden');
        window.kannadaSound.playCandleBlow();

        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(
                VIRTUAL_WIDTH / 2,
                VIRTUAL_HEIGHT / 2,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                ['#ff6b81', '#ffd700', '#00d2d3', '#e056fd', '#fff'],
                Math.random() * 7 + 4,
                55,
                Math.random() < 0.5
            ));
        }
    });

    // Play Birthday Tune from Card
    btnCardMusic.addEventListener('click', (e) => {
        e.stopPropagation();
        window.kannadaSound.playMusicBoxMelody();
    });

    // Copy Wish for WhatsApp
    btnCardCopyMsg.addEventListener('click', (e) => {
        e.stopPropagation();
        const copyText = `🌸 Happy Birthday ${herName}! 🎂✨\n\n${herLetter}\n\n🎮 Play your special surprise birthday game here: ${window.location.href}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(copyText).then(() => {
                alert('ಬರ್ತ್‌ಡೇ ಸಂದೇಶ ಕಾಪಿ ಆಗಿದೆ! WhatsApp ನಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ ಕಳುಹಿಸಿ! 💌');
            });
        }
    });

    // Customizer Modal Triggers
    btnEditSurprise.addEventListener('click', (e) => {
        e.stopPropagation();
        customizerModal.classList.remove('hidden');
        customizerModal.classList.add('active');
    });

    btnCancelSurprise.addEventListener('click', (e) => {
        e.stopPropagation();
        customizerModal.classList.remove('active');
        customizerModal.classList.add('hidden');
    });

    btnSaveSurprise.addEventListener('click', (e) => {
        e.stopPropagation();
        const enteredName = inputHerName.value.trim() || 'Princess';
        const enteredLetter = inputLetterMsg.value.trim() || DEFAULT_LETTER;

        herName = enteredName;
        herLetter = enteredLetter;

        localStorage.setItem('kannada_surprise_her_name', herName);
        localStorage.setItem('kannada_surprise_her_letter', herLetter);

        updateSurpriseDisplay();
        customizerModal.classList.remove('active');
        customizerModal.classList.add('hidden');

        openSurpriseCard();
    });

    // Skin Selection
    skinTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skinTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            selectedSkin = tab.getAttribute('data-skin');
            drawPreview();
        });
    });

    // Custom Face Photo Upload
    customFaceInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    customImage = img;
                    selectedSkin = 'custom';
                    skinTabs.forEach(t => t.classList.remove('active'));
                    customFaceInput.parentElement.classList.add('active');
                    drawPreview();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Custom Song MP3 Upload
    customSongInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            currentSongLabel.textContent = `ಹಾಡು: ${file.name.substring(0, 18)}...`;
            window.kannadaSound.loadCustomSongFile(file);
        }
    });

    // Main Game Loop
    let lastTime = performance.now();
    const gameSpeed = 2.9;

    function gameLoop(now) {
        requestAnimationFrame(gameLoop);
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        ctx.save();
        if (shakeTimer > 0) {
            const sx = (Math.random() - 0.5) * shakeIntensity;
            const sy = (Math.random() - 0.5) * shakeIntensity;
            ctx.translate(sx, sy);
            shakeTimer--;
            shakeIntensity *= 0.9;
        }

        drawBackground(ctx);

        if (gameState === STATES.PLAYING) {
            obstacleTimer++;
            if (obstacleTimer > OBSTACLE_SPACING / gameSpeed) {
                obstacleTimer = 0;
                obstacles.push(new Obstacle(VIRTUAL_WIDTH + 20));
            }

            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obs = obstacles[i];
                obs.update(gameSpeed);
                obs.draw(ctx);

                // Collectibles Collision
                if (!obs.collected && obs.collectibleType) {
                    const distColl = Math.hypot(hero.x - (obs.x + obs.width / 2), hero.y - obs.collectibleY);
                    if (distColl < hero.radius + 18) {
                        obs.collected = true;

                        if (obs.collectibleType === 'cake') {
                            cakesEaten++;
                            score += 5;
                            scoreVal.textContent = score;
                            cakeCountEl.textContent = cakesEaten;
                            scoreVal.parentElement.classList.add('score-bump');
                            setTimeout(() => scoreVal.parentElement.classList.remove('score-bump'), 150);

                            createPartyCakeBurst(obs.x + obs.width / 2, obs.collectibleY);
                            window.kannadaSound.playCakeCollect();

                            if (cakesEaten % 2 === 0) {
                                showCelebrationQuote();
                            }

                        } else if (obs.collectibleType === 'surprise') {
                            score += 10;
                            scoreVal.textContent = score;
                            scoreVal.parentElement.classList.add('score-bump');
                            setTimeout(() => scoreVal.parentElement.classList.remove('score-bump'), 150);

                            createSurpriseGiftBurst(obs.x + obs.width / 2, obs.collectibleY);
                            setTimeout(() => {
                                openSurpriseCard();
                            }, 300);
                        }
                    }
                }

                // Pass obstacle
                if (!obs.passed && obs.x + obs.width < hero.x) {
                    obs.passed = true;
                    score++;
                    scoreVal.textContent = score;
                    scoreVal.parentElement.classList.add('score-bump');
                    setTimeout(() => scoreVal.parentElement.classList.remove('score-bump'), 120);
                    window.kannadaSound.playScore();

                    if (score > 0 && score % 5 === 0) {
                        showCelebrationQuote();
                    }
                }

                if (obs.collidesWith(hero)) {
                    triggerGameOver();
                    break;
                }

                if (obs.x + obs.width < -75) {
                    obstacles.splice(i, 1);
                }
            }

            const crashed = hero.update();
            if (crashed && gameState === STATES.PLAYING) {
                triggerGameOver();
            }
            hero.draw(ctx);

        } else if (gameState === STATES.MENU) {
            hero.frame += 0.05;
            const idleY = 320 + Math.sin(hero.frame * 2) * 12;
            hero.draw(ctx, hero.x, idleY, Math.sin(hero.frame) * 0.08);
            drawPreview();

        } else if (gameState === STATES.GAMEOVER || gameState === STATES.PAUSED) {
            for (let i = 0; i < obstacles.length; i++) {
                obstacles[i].draw(ctx);
            }
            hero.draw(ctx);
        }

        // Floating Text
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            if (!floatingTexts[i].update()) {
                floatingTexts.splice(i, 1);
            } else {
                floatingTexts[i].draw(ctx);
            }
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw(ctx);
            }
        }

        ctx.restore();
    }

    requestAnimationFrame(gameLoop);
})();
