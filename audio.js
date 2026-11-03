// Kannada Birthday, Power Cool Beer & Pizza Audio Engine
// Supports procedural Kannada Folk Tamate + Birthday Synth Fanfare + Pizza Chomp & Power Cool Cheers

class KannadaSoundController {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.synthBgmPlaying = false;
        this.speechEnabled = true;
        this.tempo = 130;
        this.bgmTimer = null;
        this.voices = [];
        this.customAudio = null;
        this.isCustomSongPlaying = false;

        if (typeof window !== 'undefined') {
            this.customAudio = new Audio();
            this.customAudio.loop = true;
            this.customAudio.volume = 0.75;

            if ('speechSynthesis' in window) {
                this.loadVoices();
                if (speechSynthesis.onvoiceschanged !== undefined) {
                    speechSynthesis.onvoiceschanged = () => this.loadVoices();
                }
            }
        }
    }

    loadVoices() {
        if ('speechSynthesis' in window) {
            this.voices = window.speechSynthesis.getVoices();
        }
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopBGM();
            if (this.customAudio && !this.customAudio.paused) {
                this.customAudio.pause();
            }
        } else {
            if (this.isCustomSongPlaying && this.customAudio) {
                this.customAudio.play().catch(() => {});
            }
        }
        return this.enabled;
    }

    loadCustomSongFile(file) {
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        if (this.customAudio) {
            this.stopBGM();
            this.customAudio.src = objectUrl;
            this.customAudio.load();
            this.isCustomSongPlaying = true;
            if (this.enabled) {
                this.customAudio.play().catch(e => console.log('Autoplay blocked:', e));
            }
        }
    }

    // Play Jump / Flap Sound
    playJump() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.11);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.06);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
    }

    // Power Cool Beer Bottle Clink / Score Sound
    playScore() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Heavy beer bottle glass clink
        [2050, 2900, 3600].forEach((freq) => {
            const clink = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            clink.type = 'sine';
            clink.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.24, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            clink.connect(gain);
            gain.connect(this.ctx.destination);
            clink.start(now);
            clink.stop(now + 0.25);
        });

        // Warm chord
        const chord = [523.25, 659.25, 783.99];
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.03);

            gain.gain.setValueAtTime(0.12, now + idx * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.24);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.03);
            osc.stop(now + idx * 0.03 + 0.26);
        });
    }

    // Pizza Bite / Chomp Sound Effect 🍕
    playPizzaChomp() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Crispy crust bite crunch (Noise burst with lowpass modulation)
        const crunchBuffer = this.createNoiseBuffer(0.14);
        const crunch = this.ctx.createBufferSource();
        crunch.buffer = crunchBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(450, now + 0.12);
        filter.Q.value = 3.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        crunch.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        crunch.start(now);

        // 2. Cheesy "Gulp / Mmm" cartoon pop
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'sine';
        popOsc.frequency.setValueAtTime(320, now + 0.04);
        popOsc.frequency.exponentialRampToValueAtTime(680, now + 0.16);

        popGain.gain.setValueAtTime(0, now);
        popGain.gain.setValueAtTime(0.25, now + 0.04);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        popOsc.connect(popGain);
        popGain.connect(this.ctx.destination);
        popOsc.start(now + 0.04);
        popOsc.stop(now + 0.25);

        // 3. Cheerful rewarding ding
        const ding = this.ctx.createOscillator();
        const dingGain = this.ctx.createGain();
        ding.type = 'triangle';
        ding.frequency.setValueAtTime(880, now + 0.1);
        ding.frequency.setValueAtTime(1174.66, now + 0.18);

        dingGain.gain.setValueAtTime(0, now);
        dingGain.gain.setValueAtTime(0.18, now + 0.1);
        dingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        ding.connect(dingGain);
        dingGain.connect(this.ctx.destination);
        ding.start(now + 0.1);
        ding.stop(now + 0.4);
    }

    // Cake Collect Sound
    playCakeCollect() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.25, now + i * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.38);
        });

        const popNoise = this.ctx.createBufferSource();
        popNoise.buffer = this.createNoiseBuffer(0.12);
        const popFilter = this.ctx.createBiquadFilter();
        popFilter.type = 'bandpass';
        popFilter.frequency.setValueAtTime(1400, now);

        const popGain = this.ctx.createGain();
        popGain.gain.setValueAtTime(0.3, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        popNoise.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(this.ctx.destination);
        popNoise.start(now);
    }

    // Surprise Gift Reveal Sound
    playSurpriseReveal() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const harp = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98, 2093.00];

        harp.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);

            gain.gain.setValueAtTime(0, now + i * 0.06);
            gain.gain.linearRampToValueAtTime(0.22, now + i * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.5);
        });
    }

    // Candle Blow Sound
    playCandleBlow() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        const puffNoise = this.ctx.createBufferSource();
        puffNoise.buffer = this.createNoiseBuffer(0.25);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        puffNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        puffNoise.start(now);

        setTimeout(() => {
            this.playBirthdayFanfare();
        }, 150);
    }

    // Power Cool Beer Bottle Crash Sound
    playCrash() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        const boomOsc = this.ctx.createOscillator();
        const boomGain = this.ctx.createGain();
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(160, now);
        boomOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

        boomGain.gain.setValueAtTime(0.55, now);
        boomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.48);

        boomOsc.connect(boomGain);
        boomGain.connect(this.ctx.destination);

        boomOsc.start(now);
        boomOsc.stop(now + 0.5);

        const noiseBuffer = this.createNoiseBuffer(0.35);
        const glassNoise = this.ctx.createBufferSource();
        glassNoise.buffer = noiseBuffer;

        const highFilter = this.ctx.createBiquadFilter();
        highFilter.type = 'highpass';
        highFilter.frequency.setValueAtTime(2600, now);

        const glassGain = this.ctx.createGain();
        glassGain.gain.setValueAtTime(0.4, now);
        glassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        glassNoise.connect(highFilter);
        highFilter.connect(glassGain);
        glassGain.connect(this.ctx.destination);

        glassNoise.start(now);
    }

    // Happy Birthday Fanfare
    playBirthdayFanfare() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const notes = [
            { f: 261.63, d: 0.25 },
            { f: 261.63, d: 0.20 },
            { f: 293.66, d: 0.45 },
            { f: 261.63, d: 0.45 },
            { f: 349.23, d: 0.45 },
            { f: 329.63, d: 0.85 }
        ];

        let offset = 0;
        const now = this.ctx.currentTime;

        notes.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f * 1.5, now + offset);

            gain.gain.setValueAtTime(0.2, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + offset);
            osc.stop(now + offset + note.d + 0.05);

            offset += note.d * 0.95;
        });
    }

    // Sweet Music Box Acoustic Mode
    playMusicBoxMelody() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const melody = [
            { f: 261.63, d: 0.3 },
            { f: 261.63, d: 0.3 },
            { f: 293.66, d: 0.6 },
            { f: 261.63, d: 0.6 },
            { f: 349.23, d: 0.6 },
            { f: 329.63, d: 1.0 },
            { f: 261.63, d: 0.3 },
            { f: 261.63, d: 0.3 },
            { f: 293.66, d: 0.6 },
            { f: 261.63, d: 0.6 },
            { f: 392.00, d: 0.6 },
            { f: 349.23, d: 1.2 }
        ];

        let t = 0;
        const now = this.ctx.currentTime;

        melody.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(n.f * 2, now + t);

            gain.gain.setValueAtTime(0.18, now + t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + t + n.d * 0.9);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + t);
            osc.stop(now + t + n.d);

            t += n.d * 0.85;
        });
    }

    // Party Mass Beat Engine
    startBGM() {
        if (!this.enabled || this.synthBgmPlaying) return;
        if (this.isCustomSongPlaying && this.customAudio && !this.customAudio.paused) return;
        this.init();
        if (!this.ctx) return;

        this.synthBgmPlaying = true;
        let step = 0;
        const stepTime = 60 / this.tempo / 4;

        const celebrationBass = [
            261.63, 0, 261.63, 329.63, 392.00, 0, 329.63, 0,
            349.23, 0, 349.23, 392.00, 261.63, 0, 196.00, 220.00
        ];

        this.bgmTimer = setInterval(() => {
            if (!this.synthBgmPlaying || !this.enabled || !this.ctx) return;
            const now = this.ctx.currentTime;

            if (step % 4 === 0) {
                this.playKick(now);
            }
            if (step % 8 === 4) {
                this.playPartyClap(now);
            }
            if (step % 2 === 1) {
                this.playTambourine(now);
            }
            const note = celebrationBass[step % celebrationBass.length];
            if (note > 0) {
                this.playPartyBass(now, note);
            }

            step = (step + 1) % 16;
        }, stepTime * 1000);
    }

    stopBGM() {
        this.synthBgmPlaying = false;
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.14);

        gain.gain.setValueAtTime(0.45, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.18);
    }

    playPartyClap(time) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.1);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, time);
        filter.Q.value = 2.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(time);
    }

    playTambourine(time) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.04);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7500, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(time);
    }

    playPartyBass(time, freq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq / 2, time);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, time);

        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.16);
    }

    createNoiseBuffer(duration) {
        const sampleRate = this.ctx.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    speakKannada(text) {
        if (!this.speechEnabled || !this.enabled || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            utterance.volume = 0.95;

            if (this.voices.length > 0) {
                const knVoice = this.voices.find(v => v.lang.startsWith('kn') || v.lang.includes('Kannada'));
                const inVoice = this.voices.find(v => v.lang.includes('IN') || v.lang.includes('in'));
                if (knVoice) {
                    utterance.voice = knVoice;
                } else if (inVoice) {
                    utterance.voice = inVoice;
                }
            }

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech error:', e);
        }
    }
}

window.kannadaSound = new KannadaSoundController();
