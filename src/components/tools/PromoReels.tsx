import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Film, Play, Pause, Download, Volume2, VolumeX, Sparkles, 
  Settings, Layers, Tv, RefreshCw, AlertCircle, HelpCircle, 
  Check, Smartphone, Music, Palette, Type, Video, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAppSettings } from '../../hooks/useAppSettings';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

// Preset products/tools to advertise
const PROMO_PRODUCTS = [
  { id: 'dih-movies', name: 'DIH MOVIES SUITE', tag: 'Ultra High Definition Streaming', desc: 'Watch your favorite blockbuster movies and high-end video series directly inside our servers.', colors: ['#ef4444', '#b91c1c'], iconColor: 'text-red-500' },
  { id: 'mobile-bypass', name: 'MOBILE BYPASS PRO', tag: 'Instant FRP & MDM Boot Unlocker', desc: 'Complete software solution to unlock bootloader and bypass standard Google FRP/MDM locks.', colors: ['#8b5cf6', '#7c3aed'], iconColor: 'text-purple-500' },
  { id: 'auto-passport', name: 'AUTO PASSPORT', tag: 'Biometric Photo Studio', desc: 'Isolate backgrounds, align pose & print 4x6 templates instantly.', colors: ['#f59e0b', '#d97706'], iconColor: 'text-amber-500' },
  { id: 'hosted-admin', name: 'CLOUDFLARE DIH TEMPLATE', tag: '1-Click Free Static Deployer', desc: 'Instantly host custom templates, webapps, landing pages with customized subdomains for free.', colors: ['#ea580c', '#c2410c'], iconColor: 'text-orange-500' },
  { id: 'bg-remover', name: 'BACKGROUND REMOVER', tag: 'Aesthetic Silhouette Isolator', desc: 'Surgical cutouts inside your browser with clean transparent outputs.', colors: ['#4f46e5', '#3730a3'], iconColor: 'text-indigo-500' },
  { id: 'video', name: 'HIGH SPEED VIDEO D/L', tag: 'Social Media Video Downloader', desc: 'Download original resolution clips and reels from TikTok, Facebook, or Instagram at premium speeds.', colors: ['#ec4899', '#db2777'], iconColor: 'text-pink-500' },
  { id: 'dex-protector', name: 'DEX PROTECTOR PRO', tag: 'Android Application Fortress', desc: 'Encrypt binaries, secure DEX structure, and sign APK files instantly.', colors: ['#dc2626', '#991b1b'], iconColor: 'text-red-500' },
  { id: 'temp-mail', name: 'TEMP EMAIL SUITE', tag: 'Privacy Shield Sandbox', desc: 'Secure temporary secure mail inbox to receive OTP registrations safely.', colors: ['#2563eb', '#1d4ed8'], iconColor: 'text-blue-500' },
  { id: 'temp-sms', name: 'TEMP SMS ONLINE', tag: 'Anonymous Virtual Phone Lines', desc: 'Generate high performance active phone numbers to bypass annoying OTP verifications worldwide.', colors: ['#06b6d4', '#0891b2'], iconColor: 'text-cyan-500' },
  { id: 'qr', name: 'GRADIENT QR STUDIO', tag: 'Artistic High-Contrast Codes', desc: 'Design customizable colorful QR code templates with gradient markers, custom logos, and shapes.', colors: ['#06b6d4', '#3b82f6'], iconColor: 'text-sky-400' },
  { id: 'custom', name: 'CUSTOM PROMOTION', tag: 'Your Brand / Creative Agency', desc: 'Make interactive promotional reels with extreme precision and speed.', colors: ['#ec4899', '#be185d'], iconColor: 'text-pink-500' }
];

// Preset visual themes
const VIDEO_THEMES = [
  { 
    id: 'cyber-neon', 
    name: 'Cyberpunk Neon', 
    bgColor: '#06060c', 
    borderColor: '#ff007f', 
    canvasBg: '#090916',
    primaryTextColor: '#00ffff', 
    secondaryTextColor: '#ff007f', 
    particleColor: '#00ffff' 
  },
  { 
    id: 'clean-saas', 
    name: 'Modern Ultra SaaS', 
    bgColor: '#ffffff', 
    borderColor: '#2563eb', 
    canvasBg: '#f8fafc',
    primaryTextColor: '#0f172a', 
    secondaryTextColor: '#2563eb', 
    particleColor: '#3b82f6' 
  },
  { 
    id: 'deep-slate', 
    name: 'Cosmic Slate', 
    bgColor: '#0f172a', 
    borderColor: '#38bdf8', 
    canvasBg: '#0b0f19',
    primaryTextColor: '#f8fafc', 
    secondaryTextColor: '#38bdf8', 
    particleColor: '#0284c7' 
  },
  { 
    id: 'royal-vhs', 
    name: 'Retro VHS Glitch', 
    bgColor: '#180018', 
    borderColor: '#ff00a0', 
    canvasBg: '#110011',
    primaryTextColor: '#00ff66', 
    secondaryTextColor: '#ff00a0', 
    particleColor: '#ff00ff' 
  }
];

// Musical soundtracks using Web Audio Synthesizer
const SOUNDTRACKS = [
  { id: 'cyberwave', name: 'Neon Cyberwave Synth', desc: 'Pulsing synthwave bassline & custom high-hat loops' },
  { id: 'lofi', name: 'SaaS Chill Lo-Fi', desc: 'Soft lounge ambient pads with geometric percussion ticks' },
  { id: 'epic-tech', name: 'Futuristic Dark Bass', desc: 'Powerful modular rhythmic oscillations & sweeps' },
  { id: 'mute', name: 'Mute / No Sound', desc: 'No background audio soundtrack track generated' }
];

// Pre-configured typographic slogans
const REEL_SLOGANS = [
  "SECURE. MODERN. LIGHTNING FAST.",
  "STOP OVERPAYING FOR SUBSCRIPTIONS.",
  "100% ONLINE & FREE FOREVER.",
  "ACCESS THE ULTIMATE DEVELOPER SUITE.",
  "THE PLATFORM YOU ALWAYS WANTED."
];

export default function PromoReels() {
  const { settings } = useAppSettings();
  
  // Custom states
  const [selectedProduct, setSelectedProduct] = useState(PROMO_PRODUCTS[0]);
  const [selectedTheme, setSelectedTheme] = useState(VIDEO_THEMES[0]);
  const [selectedSoundtrack, setSelectedSoundtrack] = useState(SOUNDTRACKS[0]);
  
  // Custom values editable by user
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customSlogan, setCustomSlogan] = useState(REEL_SLOGANS[0]);
  const [customCTA, setCustomCTA] = useState('WWW.DIHTEMPLATE.PRO  //  LINK IN BIO');
  
  // State variables
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true); // Default to true so it immediately showcases the site's promo sequence!
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false); // Can be enabled optionally for AI VoiceOver narration!
  const [autoplayIndex, setAutoplayIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(15); // Standard Reels/TikTok promo duration
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'info' | 'error', text: string } | null>(null);

  // Autoplay campaign slideshow loop
  useEffect(() => {
    if (!isAutoplay || isRecording) return;

    const interval = setInterval(() => {
      setAutoplayIndex((prevIndex) => {
        // Cycle between all except 'custom' mode
        const nextIndex = (prevIndex + 1) % (PROMO_PRODUCTS.length - 1);
        const prod = PROMO_PRODUCTS[nextIndex];
        setSelectedProduct(prod);
        
        // Match copy block parameters to selected product
        setCustomTitle(prod.name);
        setCustomSubtitle(prod.tag);
        
        // Progress slogans for active subtitles
        const nextSlogan = REEL_SLOGANS[nextIndex % REEL_SLOGANS.length];
        setCustomSlogan(nextSlogan);

        // Optional HTML5 Web Speech Voice synthesis to vocalize slide
        if (isVoiceEnabled && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Presenting ${prod.name}! ${prod.tag}. ${prod.desc}`);
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.error("Narration failed:", e);
          }
        }
        return nextIndex;
      });
    }, 2500); // Transitions showcase every 2.5s

    // Trigger initial voice over welcoming the user
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const firstProd = PROMO_PRODUCTS[autoplayIndex];
      const welcome = new SpeechSynthesisUtterance(`Welcome to ${settings.appName}! Here is a live showcase of our secure developer utility suites. First up: ${firstProd.name}.`);
      window.speechSynthesis.speak(welcome);
    }

    return () => {
      clearInterval(interval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isAutoplay, isVoiceEnabled, isRecording, autoplayIndex, settings.appName]);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animeFrameRef = useRef<number | null>(null);
  const canvasWidth = 1080; // Standard 9:16 vertical resolution
  const canvasHeight = 1920;

  // Sound Synthesizer Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthsRef = useRef<any[]>([]);
  const synthIntervalRef = useRef<any>(null);

  // Media Recording State
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Local storage lists for particles
  const particlesRef = useRef<Particle[]>([]);

  // Helper to trigger alert banners safely
  const triggerAlert = (type: 'success' | 'info' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(prev => prev?.text === text ? null : prev);
    }, 6000);
  };

  // Synthesize Procedural Musical Loops on the fly using Web Audio API
  const startProceduralSynthLoop = useCallback(() => {
    if (selectedSoundtrack.id === 'mute' || isMuted) {
      // Disconnect all existing synthesizers
      synthsRef.current.forEach(s => { try { s.stop(); } catch(_) {} });
      synthsRef.current = [];
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      return;
    }

    try {
      // Initialize Audio Context if absent
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Keep context running
      synthsRef.current.forEach(s => { try { s.stop(); } catch(_) {} });
      synthsRef.current = [];
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime); // Safe subtle background level
      masterGain.connect(ctx.destination);

      let step = 0;
      let tempo = selectedSoundtrack.id === 'cyberwave' ? 120 : selectedSoundtrack.id === 'epic-tech' ? 130 : 85;
      const stepDuration = 60 / tempo / 2; // Eighth notes

      // Basic modular sound generators based on selected soundtrack
      const playStep = () => {
        if (!ctx || ctx.state === 'suspended') return;
        const now = ctx.currentTime;

        // 1. Synthwave loops (Bassline & Sweeping Pads)
        if (selectedSoundtrack.id === 'cyberwave') {
          // Dark Cyberwave Bass Note
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'sawtooth';
          
          // E1 - G1 - A1 sequence
          const notes = [41.20, 41.20, 48.99, 48.99, 55.00, 55.00, 41.20, 48.99];
          const currentBassNote = notes[step % notes.length];
          bassOsc.frequency.setValueAtTime(currentBassNote, now);
          
          // rhythmic envelope
          bassGain.gain.setValueAtTime(0.12, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);
          
          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);
          bassOsc.start(now);
          bassOsc.stop(now + stepDuration);

          // Add clean Hi-Hat noise
          if (step % 2 === 1) {
            const noise = ctx.createOscillator();
            const noiseGain = ctx.createGain();
            noise.type = 'triangle';
            noise.frequency.setValueAtTime(10000 + Math.random() * 2000, now);
            
            noiseGain.gain.setValueAtTime(0.03, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
            
            noise.connect(noiseGain);
            noiseGain.connect(masterGain);
            noise.start(now);
            noise.stop(now + 0.06);
          }
        } 
        // 2. Lo-Fi Chords
        else if (selectedSoundtrack.id === 'lofi') {
          // Smooth electric piano triangle chords on alternate major beats
          if (step % 8 === 0) {
            const chordFrequencies = step % 16 === 0 
              ? [196.00, 246.94, 293.66, 392.00] // G major 7 structure
              : [220.00, 261.63, 329.63, 440.00]; // A minor 7 structure
            
            chordFrequencies.forEach(f => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(f, now);
              
              gain.gain.setValueAtTime(0.08, now);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + stepDuration * 6.5);
              
              osc.connect(gain);
              gain.connect(masterGain);
              osc.start(now);
              osc.stop(now + stepDuration * 7);
            });
          }

          // Subtle shaker click
          if (step % 4 === 2) {
            const shaker = ctx.createOscillator();
            const shakerGain = ctx.createGain();
            shaker.type = 'sine';
            shaker.frequency.setValueAtTime(8000, now);
            shakerGain.gain.setValueAtTime(0.015, now);
            shakerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
            
            shaker.connect(shakerGain);
            shakerGain.connect(masterGain);
            shaker.start(now);
            shaker.stop(now + 0.04);
          }
        } 
        // 3. Epic Tech House sweeps
        else if (selectedSoundtrack.id === 'epic-tech') {
          // Rhythmic high-density tech sweeps
          if (step % 4 === 0) {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(120, now);
            kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
            
            kickGain.gain.setValueAtTime(0.35, now);
            kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
            
            kickOsc.connect(kickGain);
            kickGain.connect(masterGain);
            kickOsc.start(now);
            kickOsc.stop(now + 0.16);
          }

          // Rhythmic sweep pad
          const sweepOsc = ctx.createOscillator();
          const sweepGain = ctx.createGain();
          sweepOsc.type = 'sawtooth';
          sweepOsc.frequency.setValueAtTime(60 + (step % 8) * 15, now);
          sweepOsc.frequency.exponentialRampToValueAtTime(140 + (step % 4) * 30, now + stepDuration);
          
          sweepGain.gain.setValueAtTime(0.04, now);
          sweepGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.95);
          
          sweepOsc.connect(sweepGain);
          sweepGain.connect(masterGain);
          sweepOsc.start(now);
          sweepOsc.stop(now + stepDuration);
        }

        step++;
      };

      // Play immediate first beat
      playStep();
      synthIntervalRef.current = setInterval(playStep, stepDuration * 1000);
    } catch (err) {
      console.warn("Synth loop error:", err);
    }
  }, [selectedSoundtrack, isMuted]);

  // Handle Play/Pause toggling live synth loop
  useEffect(() => {
    if (isPlaying) {
      startProceduralSynthLoop();
    } else {
      synthsRef.current.forEach(s => { try { s.stop(); } catch(_) {} });
      synthsRef.current = [];
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
    }
    return () => {
      synthsRef.current.forEach(s => { try { s.stop(); } catch(_) {} });
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, [isPlaying, selectedSoundtrack, isMuted, startProceduralSynthLoop]);

  // Generate background particles once
  useEffect(() => {
    const particles: Particle[] = [];
    const particleColors = [selectedTheme.particleColor, '#ffffff', selectedTheme.secondaryTextColor];
    
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() * 2) + 1.5, // Float downwards
        size: Math.random() * 12 + 4,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.6 + 0.2
      });
    }
    particlesRef.current = particles;
  }, [selectedTheme]);

  // Main high-precision recursive drawing engine for Canvas (1080x1920 HD representation)
  const drawCanvasFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset components & variables
    const time = Date.now() * 0.001; // Current timestamp in float
    const displayTitle = customTitle || selectedProduct.name;
    const displaySub = customSubtitle || selectedProduct.tag;
    const displayDesc = selectedProduct.desc;

    // Clear and Fill background with theme's pure background color
    ctx.fillStyle = selectedTheme.canvasBg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // DRAW CINEMATIC TECH ELEMENTS ON BACKGROUND
    if (selectedTheme.id === 'cyber-neon' || selectedTheme.id === 'royal-vhs') {
      // Intercept matrix digital mesh scanlines
      ctx.strokeStyle = "rgba(255, 0, 127, 0.015)";
      ctx.lineWidth = 2;
      for (let y = 0; y < canvasHeight; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }

      // Retro geometric neon grids at the lower half
      ctx.strokeStyle = "rgba(0, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      const horizon = canvasHeight * 0.72;
      
      // Horizontal lines
      for (let y = horizon; y < canvasHeight; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }
      
      // Perspective vertical grid cuts
      for (let x = -400; x <= canvasWidth + 400; x += 100) {
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2, horizon);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
    } else {
      // SaaS elegant ambient subtle gradient circles
      ctx.fillStyle = 'rgba(59, 130, 246, 0.04)';
      ctx.beginPath();
      ctx.arc(canvasWidth * 0.2, canvasHeight * 0.3, 400, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(99, 102, 241, 0.04)';
      ctx.beginPath();
      ctx.arc(canvasWidth * 0.8, canvasHeight * 0.65, 500, 0, Math.PI * 2);
      ctx.fill();
    }

    // DRAW DYNAMIC FLOATING PARTICLES
    particlesRef.current.forEach(p => {
      if (isPlaying) {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y > canvasHeight) {
          p.y = -20;
          p.x = Math.random() * canvasWidth;
        }
        if (p.x < 0 || p.x > canvasWidth) {
          p.vx *= -1;
        }
      }
      
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = selectedTheme.id.includes('cyber') ? 12 : 0;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // DRAW CENTRAL CHROME MOCKUP / CARD SHIELD (THE METAPHENE)
    const cardY = canvasHeight * 0.38;
    const cardW = 860;
    const cardH = 580;
    const cardX = (canvasWidth - cardW) / 2;

    ctx.save();
    // Glassmorphism Box glow and body
    ctx.fillStyle = selectedTheme.id === 'clean-saas' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.72)';
    ctx.shadowColor = selectedTheme.borderColor;
    ctx.shadowBlur = 45;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 35);
    ctx.fill();
    
    // Sleek Border Highlight
    ctx.strokeStyle = selectedTheme.borderColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // CARD HEADER DETAILS (Like a browser or OS frame window)
    ctx.fillStyle = selectedTheme.id === 'clean-saas' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, 70, [35, 35, 0, 0]);
    ctx.fill();

    // Draw three decorative browser dots (Red, Yellow, Green)
    const dotY = cardY + 35;
    const dotColors = ['#ef4444', '#f59e0b', '#10b981'];
    dotColors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cardX + 45 + idx * 25, dotY, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sub Title within simulated browser tag
    ctx.fillStyle = selectedTheme.id === 'clean-saas' ? '#1e293b' : '#38bdf8';
    ctx.font = "bold 24px monospace";
    ctx.fillText("DIH_TEMPLATE_UTILITY_CORE.SYS", cardX + 135, cardY + 44);

    // DRAW GRAPHIC METAPHOR / DEMO ILLUSTRATION INSIDE COMPONENT CARD
    const graphicCenterY = cardY + 310;
    const graphicCenterX = canvasWidth / 2;

    if (selectedProduct.id === 'auto-passport') {
      // DRAW BIO-STEREOSCOPIC PASSPORT MOCK GRAPHIC
      ctx.save();
      const pulseScale = 1.0 + Math.sin(time * 3) * 0.04;
      ctx.translate(graphicCenterX, graphicCenterY);
      ctx.scale(pulseScale, pulseScale);

      // Biometric green scan alignment square
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 10]);
      ctx.strokeRect(-90, -110, 180, 220);
      
      // Face shape sketch
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      // Outer head
      ctx.arc(0, -15, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      
      // Shoulders
      ctx.beginPath();
      ctx.moveTo(-110, 110);
      ctx.quadraticCurveTo(-110, 55, -45, 45);
      ctx.lineTo(45, 45);
      ctx.quadraticCurveTo(110, 55, 110, 110);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Holographic targeting points
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(-25, -25, 6, 0, Math.PI * 2); // left eye node
      ctx.arc(25, -25, 6, 0, Math.PI * 2); // right eye node
      ctx.arc(0, 5, 5, 0, Math.PI * 2); // nose node
      ctx.fill();

      ctx.restore();
    } else if (selectedProduct.id === 'bg-remover') {
      // TRANSITIONING DOUBLE ICON CUT METAPHOR
      const swipeX = (Math.sin(time * 2.2) * 110);
      
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Left Side: Colored picture mockup
      ctx.fillStyle = "#0284c7";
      ctx.roundRect(-160, -90, 320, 180, 12);
      ctx.fill();

      // Right/Transformed Transparent Grid pattern cutout
      ctx.fillStyle = "rgba(255,255,255, 0.15)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 6]);
      ctx.strokeRect(-160, -90, 320, 180);

      // Draw sliding isolation surgical line
      ctx.strokeStyle = "#ff007f";
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(swipeX, -100);
      ctx.lineTo(swipeX, 100);
      ctx.stroke();
      ctx.restore();
    } else if (selectedProduct.id === 'dex-protector') {
      // DEX CRYPTOGRAPHIC ENCRYPTION SHIELD MOCKUP
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);
      
      const angle = time * 1.5;
      ctx.rotate(angle);

      // Spinning encryption hexagonal shield ring
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        const rx = Math.cos(rad) * 105;
        const ry = Math.sin(rad) * 105;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw inner target nodes
      ctx.fillStyle = "#f8fafc";
      ctx.font = "900 36px font-mono";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 15;
      // Counter rotate text to stay upright
      ctx.rotate(-angle);
      ctx.fillText("DEX_0x1", 0, 0);

      ctx.restore();
    } else if (selectedProduct.id === 'temp-mail') {
      // TEMP EMAIL SUITE DYNAMIC SECURE MAILBOX GRAPHIC
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Draw mailbox outline bubble envelope
      ctx.fillStyle = "rgba(37, 99, 235, 0.15)";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-150, -80, 300, 160, 20);
      ctx.fill();
      ctx.stroke();

      // Floating dynamic incoming secure padlock envelope
      const bounceY = Math.sin(time * 3) * 15;
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(-80, -40 + bounceY, 160, 80, 10);
      ctx.fill();

      // Envelope fold draw
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-80, -40 + bounceY);
      ctx.lineTo(0, 0 + bounceY);
      ctx.lineTo(80, -40 + bounceY);
      ctx.stroke();

      // Glowing badge for "NEW OTP INBOX"
      ctx.fillStyle = "#10b981";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(60, -30 + bounceY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Text key count
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px font-mono";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText("1", 60, -30 + bounceY);

      // Secure shield key
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 24px monospace";
      ctx.fillText("OTP SECURE", 0, 75);

      ctx.restore();
    } else if (selectedProduct.id === 'video') {
      // HIGH SPEED VIDEO DOWNLOADER ILLUSTRATION
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Spinning neon outer rings
      const angle = time * 2;
      ctx.strokeStyle = "#ec4899";
      ctx.shadowColor = "#ec4899";
      ctx.shadowBlur = 15;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.stroke();

      // Rhythmic down arrow overlay
      const arrowBounce = Math.sin(time * 4) * 12;
      ctx.fillStyle = "#ffffff";
      
      // Arrow shaft
      ctx.fillRect(-15, -60 + arrowBounce, 30, 70);
      // Arrow head triangle
      ctx.beginPath();
      ctx.moveTo(-40, 10 + arrowBounce);
      ctx.lineTo(40, 10 + arrowBounce);
      ctx.lineTo(0, 50 + arrowBounce);
      ctx.closePath();
      ctx.fill();

      // Bottom baseline download tray
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-70, 70);
      ctx.lineTo(-70, 90);
      ctx.lineTo(70, 90);
      ctx.lineTo(70, 70);
      ctx.stroke();

      ctx.restore();
    } else if (selectedProduct.id === 'hosted-admin') {
      // CLOUDFLARE HTML HOSTING METAPHER
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Cloud base silhouette
      ctx.fillStyle = "rgba(234, 88, 12, 0.2)";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#ea580c";
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.moveTo(-90, 45);
      ctx.arc(-90, 15, 30, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(-50, -15, 45, Math.PI * 1.0, Math.PI * 2.0);
      ctx.arc(20, -35, 55, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(90, 15, 30, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Floating browser tags representing web hosts
      const bounce = Math.sin(time * 2.5) * 10;
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 0;
      ctx.roundRect(-100 + bounce, -25 - bounce, 80, 55, 6);
      ctx.roundRect(30 - bounce, 5 + bounce, 90, 60, 6);
      ctx.fill();

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = 'center';
      ctx.fillText("INDEX.HTML", -60 + bounce, 5 - bounce);
      ctx.fillText("LIVE SITE", 75 - bounce, 40 + bounce);

      ctx.restore();
    } else if (selectedProduct.id === 'temp-sms') {
      // ANONYMOUS VIRTUAL SMS CODE BOX GRAPHIC
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Mobile device body
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#0891b2";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(-85, -115, 170, 230, 24);
      ctx.fill();
      ctx.stroke();

      // Floating text message banner bubble
      const pop = Math.sin(time * 3) * 8;
      ctx.fillStyle = "#0891b2";
      ctx.beginPath();
      ctx.roundRect(-65, -50 + pop, 130, 55, 12);
      ctx.fill();

      // Incoming mini lock text
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 13px sans-serif";
      ctx.fillText("OTP CODE", -45, -30 + pop);
      ctx.font = "900 17px monospace";
      ctx.fillText("8 4 9 2 0 1", -45, -10 + pop);

      ctx.restore();
    } else if (selectedProduct.id === 'mobile-bypass') {
      // FRP BYPASS LOCK & CRYPTIC MATRIX KEY
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Draw secure loop padlock representation
      const isUnlocked = Math.sin(time * 3.5) > 0;
      ctx.strokeStyle = isUnlocked ? "#10b981" : "#ef4444";
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Lock shackle loop
      if (isUnlocked) {
        ctx.arc(0, -40, 50, Math.PI, Math.PI * 1.8); // Open shackle rotation
      } else {
        ctx.arc(0, -20, 50, Math.PI, 0); // Secure closed shackle
      }
      ctx.stroke();

      // Keylock body shield
      ctx.fillStyle = isUnlocked ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)";
      ctx.strokeStyle = isUnlocked ? "#10b981" : "#ef4444";
      ctx.shadowColor = isUnlocked ? "#10b981" : "#ef4444";
      ctx.shadowBlur = 25;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(-80, -10, 160, 120, 16);
      ctx.fill();
      ctx.stroke();

      // Status label text
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 24px monospace";
      ctx.textAlign = 'center';
      ctx.fillText(isUnlocked ? "FRP OK" : "LOCK", 0, 50);

      ctx.restore();
    } else if (selectedProduct.id === 'qr') {
      // GRADIENT QR CODE REDIRECT METAPHER
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Draw aesthetic outer frame corners
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 4;
      // Top-left
      ctx.beginPath(); ctx.moveTo(-110, -80); ctx.lineTo(-110, -110); ctx.lineTo(-80, -110); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(110, -80); ctx.lineTo(110, -110); ctx.lineTo(80, -110); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(-110, 80); ctx.lineTo(-110, 110); ctx.lineTo(-80, 110); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(110, 80); ctx.lineTo(110, 110); ctx.lineTo(80, 110); ctx.stroke();

      // Interactive flashing QR Code block
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-70, -70, 140, 140);

      // Render 3 classic corner square markers
      ctx.fillStyle = "#0c82f0";
      ctx.fillRect(-60, -60, 35, 35);
      ctx.fillRect(25, -60, 35, 35);
      ctx.fillRect(-60, 25, 35, 35);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-50, -50, 15, 15);
      ctx.fillRect(35, -50, 15, 15);
      ctx.fillRect(-50, 35, 15, 15);

      // Dynamic inner matrix pixels
      ctx.fillStyle = "#0f172a";
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; r % 2 === 0 ? c += 1 : c += 2) {
          if ((r + c + Math.floor(time * 5)) % 3 === 0) {
            ctx.fillRect(-20 + c * 10, -20 + r * 10, 8, 8);
          }
        }
      }

      ctx.restore();
    } else if (selectedProduct.id === 'dih-movies') {
      // PREMIER CINEMATIC VIDEOPLAY METAPHER
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);

      // Cinema Movie Frame border box
      ctx.fillStyle = "rgba(220, 38, 38, 0.2)";
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-160, -90, 320, 180, 15);
      ctx.fill();
      ctx.stroke();

      // Film reel slots at left and right
      ctx.fillStyle = "#ffffff";
      for (let y = -80; y <= 70; y += 30) {
        ctx.fillRect(-150, y, 12, 16);
        ctx.fillRect(138, y, 12, 16);
      }

      // Large central glowing neon play button representation
      const shrinkPulse = 1.0 + Math.sin(time * 3) * 0.08;
      ctx.transform(shrinkPulse, 0, 0, shrinkPulse, 0, 0);

      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.fill();

      // Pure white triangle
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(-12, -18);
      ctx.lineTo(20, 0);
      ctx.lineTo(-12, 18);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } else {
      // INTERACTIVE FLOATING TECH BARS OR WAVES FOR MULTIPLE PLUGINS
      ctx.save();
      ctx.translate(graphicCenterX, graphicCenterY);
      
      for (let i = 0; i < 5; i++) {
        const h = 50 + Math.abs(Math.sin(time * 3 + i * 1.2)) * 140;
        ctx.fillStyle = selectedTheme.borderColor;
        ctx.shadowColor = selectedTheme.borderColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        // Dynamic horizontal bouncing equalizer cards
        ctx.roundRect(-180 + i * 80, -h / 2, 45, h, 10);
        ctx.fill();
      }
      ctx.restore();
    }

    // DRAW DYNAMIC SAAS BRAND HEADER AT TOP (The high quality logo tag)
    ctx.fillStyle = selectedTheme.primaryTextColor;
    ctx.font = "900 85px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(settings.appName.toUpperCase(), canvasWidth / 2, 220);

    // Decorative underline banner
    ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2 - 250, 260);
    ctx.lineTo(canvasWidth / 2 + 250, 260);
    ctx.stroke();

    // Tagline banner
    ctx.fillStyle = selectedTheme.secondaryTextColor;
    ctx.font = "bold 32px monospace";
    ctx.fillText("NEXT-GEN DIGITAL REVOLUTION // SECURE SUITE", canvasWidth / 2, 310);

    // PRODUCT HIGH SPOTLIGHT CAPTION TEXT BELOW CHROME FRAME
    const textBaseY = cardY + cardH + 160;

    ctx.fillStyle = selectedTheme.primaryTextColor;
    ctx.font = "900 70px sans-serif";
    ctx.fillText(displayTitle.toUpperCase(), canvasWidth / 2, textBaseY);

    ctx.fillStyle = selectedTheme.secondaryTextColor;
    ctx.font = "bold 42px monospace";
    ctx.fillText(`<< ${displaySub.toUpperCase()} >>`, canvasWidth / 2, textBaseY + 80);

    // Descriptive text blocks (Wrapped elegantly)
    ctx.fillStyle = selectedTheme.id === 'clean-saas' ? '#334155' : '#94a3b8';
    ctx.font = "normal 30px sans-serif";
    
    // Draw description with comfortable line spacing
    const lines = [];
    const words = displayDesc.split(' ');
    let currentLine = '';
    
    for (let word of words) {
      const test = currentLine + word + ' ';
      const width = ctx.measureText(test).width;
      if (width > 800) {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = test;
      }
    }
    lines.push(currentLine);

    lines.forEach((line, idx) => {
      ctx.fillText(line, canvasWidth / 2, textBaseY + 160 + idx * 48);
    });

    // DRAW DYNAMIC SUBTITLE KARAOKE TEXT AT LOWER TIER (SLOGANS SLIDE)
    const sloganY = textBaseY + 360;
    
    // Ambient pill capsule box for the active typewriter/slogan
    ctx.fillStyle = "rgba(0,0,0, 0.25)";
    ctx.beginPath();
    ctx.roundRect(canvasWidth / 2 - 440, sloganY - 60, 880, 100, 50);
    ctx.fill();

    // Slogan flash glow effect
    ctx.save();
    ctx.shadowBlur = Math.abs(Math.sin(time * 4) * 15) + 5;
    ctx.shadowColor = selectedTheme.borderColor;
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px monospace";
    ctx.fillText(customSlogan, canvasWidth / 2, sloganY);
    ctx.restore();

    // DRAW EXTREMELY ENTIRE BOTTOM CALL-TO-ACTION TIER
    const ctaY = canvasHeight - 110;

    ctx.save();
    ctx.strokeStyle = selectedTheme.borderColor;
    ctx.lineWidth = 4;
    ctx.setLineDash([9, 12]);
    ctx.beginPath();
    ctx.moveTo(80, ctaY - 50);
    ctx.lineTo(canvasWidth - 80, ctaY - 50);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = selectedTheme.primaryTextColor;
    ctx.font = "900 38px monospace";
    ctx.fillText(customCTA.toUpperCase(), canvasWidth / 2, ctaY + 20);

    // Render loop recursion
    if (isPlaying && !isRecording) {
      animeFrameRef.current = requestAnimationFrame(drawCanvasFrame);
    }
  }, [selectedProduct, selectedTheme, customTitle, customSubtitle, customSlogan, customCTA, isPlaying, settings.appName, isRecording]);

  // Recalculate frame on structural component updates
  useEffect(() => {
    drawCanvasFrame();
    return () => {
      if (animeFrameRef.current) cancelAnimationFrame(animeFrameRef.current);
    };
  }, [drawCanvasFrame]);

  // ACTION: EXPORT VIDEO CINEMATIC MOVIE (1080p, 60fps) using browser state-of-the-art MediaRecorder
  const handleExportPromoVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      triggerAlert('error', 'Error rendering engine missing. Try restarting application.');
      return;
    }

    // Prepare recording state
    setIsRecording(true);
    setRecordedVideoUrl(null);
    setRecordingProgress(0);
    recordedChunksRef.current = [];

    // Prompt user on screen
    triggerAlert('info', 'Activating high-fidelity HTML5 video canvas rendering...');

    try {
      // 1. Grab canvas video tracks
      const stream = canvas.captureStream(30); // 30 frames per second standard format
      
      // 2. Synthesize clean audio stream if there is music
      let combinedStream = stream;
      
      if (selectedSoundtrack.id !== 'mute' && !isMuted) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioCtx = audioCtxRef.current;
        const dest = audioCtx.createMediaStreamDestination();

        // Bind synthesized music loop directly to internal track
        const synthGain = audioCtx.createGain();
        synthGain.gain.setValueAtTime(0.22, audioCtx.currentTime); // Normal strong level for final product video
        synthGain.connect(dest);

        // Bind synth loop output
        synthsRef.current.forEach(s => { try { s.disconnect(); s.connect(synthGain); } catch(_) {} });

        // Add both media sources together
        combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...dest.stream.getAudioTracks()
        ]);
      }

      // 3. Handle recorder initialization with standard container support
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }

      const recorderOptions = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(videoUrl);
        setIsRecording(false);
        setRecordingProgress(100);
        triggerAlert('success', `Promotional video generated successfully! Duration: ${recordingDuration}s.`);
      };

      // 4. Begin Recording Sequence
      mediaRecorder.start();

      // Trigger frame updates iteratively for the length of recordingDuration
      const startMs = Date.now();
      const totalMs = recordingDuration * 1000;

      const recordFrameLoop = () => {
        const elapsed = Date.now() - startMs;
        const progressPercent = Math.min(Math.round((elapsed / totalMs) * 100), 100);
        setRecordingProgress(progressPercent);

        // Render each frame inside canvas
        drawCanvasFrame();

        if (elapsed < totalMs) {
          requestAnimationFrame(recordFrameLoop);
        } else {
          // Stop recording
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }
      };

      recordFrameLoop();

    } catch (err: any) {
      console.error("[Record Export Error]:", err);
      setIsRecording(false);
      triggerAlert('error', `Failed to construct browser media stream: ${err.message || err}`);
    }
  };

  // Switch presets automatically to speed up setup
  const handleProductPresetSelect = (prod: typeof PROMO_PRODUCTS[0]) => {
    setSelectedProduct(prod);
    if (isAutoplay) {
      setIsAutoplay(false);
      triggerAlert('info', 'Autoplay campaign paused so you can manually customize this product.');
    }
    if (prod.id !== 'custom') {
      setCustomTitle(prod.name);
      setCustomSubtitle(prod.tag);
    } else {
      setCustomTitle('DIH TEMPLATE CORE');
      setCustomSubtitle('THE ULTIMATE DIGITAL COMPANION');
    }
  };

  // Instant pre-configs for fast creation
  const handleSloganSelect = (sloganText: string) => {
    setCustomSlogan(sloganText);
    triggerAlert('info', `Active cinematic subtitle configured as: "${sloganText}"`);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto px-4 lg:px-8 py-4 animate-fade-in relative z-10 text-slate-800 dark:text-slate-100">
      
      {/* ALERT BOX OVERLAY BANNER */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -45 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -45 }}
            className={cn(
              "fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-xl max-w-lg text-xs leading-relaxed",
              alertMsg.type === 'success' && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
              alertMsg.type === 'info' && "bg-blue-500/10 border-blue-500/30 text-blue-400",
              alertMsg.type === 'error' && "bg-rose-500/10 border-rose-500/30 text-rose-400"
            )}
          >
            {alertMsg.type === 'success' && <Check size={16} className="text-emerald-400 flex-shrink-0" />}
            {alertMsg.type === 'info' && <Sparkles size={16} className="text-blue-400 flex-shrink-0" />}
            {alertMsg.type === 'error' && <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />}
            <span>{alertMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDE: CREATIVE ADJUSTMENTS (60% width on Desktop) */}
      <div className="flex-1 space-y-6">
        
        {/* HERO TITLE HEADER */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">
            <Film size={12} className="animate-spin-slow text-sky-400" />
            Cinematic Reel Studio
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase">Promo Video Maker</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Directly export gorgeous 9:16 portrait videos (WebM format with procedural beats) about your platform tools. Upload directly to Instagram Reels, TikTok, and YouTube Shorts for unlimited engagement!
          </p>
        </div>

        {/* AUTOMATED SITE AD SHOWCASE & AD CAMPAIGN PRESENTER */}
        <div className="p-5 md:p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl md:rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-block w-2.5 h-2.5 rounded-full",
                  isAutoplay ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                )} />
                <span className="font-black text-xs uppercase tracking-wider text-indigo-400">
                  Automated Ad Campaign Mode
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-md">
                স্মার্ট অটোমেটেড বিজ্ঞাপনঃ এটি আপনার সাইটের যাবতীয় জনপ্রিয় ফিচারসমূহ একের পর এক সুন্দর ব্যাকগ্রাউন্ড মিউজিক এবং ভয়েসওভার সহ স্বয়ংক্রিয়ভাবে উপস্থাপন করবে!
              </p>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setIsAutoplay(!isAutoplay);
                  triggerAlert('info', isAutoplay ? 'Automated ad tour paused.' : 'Automated site promo ad tour activated!');
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md",
                  isAutoplay 
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/10" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10"
                )}
              >
                {isAutoplay ? '● Running Show' : 'Start Auto Ad'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs font-medium">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Anchor Narration</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enable deep VoiceOver to announce site features out loud in real time!
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isVoiceEnabled} 
                onChange={(e) => {
                  setIsVoiceEnabled(e.target.checked);
                  triggerAlert('success', e.target.checked ? 'Anchor voiceover activated!' : 'Voiceover muted.');
                }}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              <span className="ml-2.5 text-xs font-bold">{isVoiceEnabled ? "Active" : "Disabled"}</span>
            </label>
          </div>

          {isAutoplay && (
            <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center gap-3 text-[10px] text-indigo-300">
              <Sparkles size={14} className="text-sky-400 animate-spin-slow flex-shrink-0" />
              <span>
                Currently displaying: <strong className="text-white uppercase">{selectedProduct.name}</strong> ({autoplayIndex + 1}/{PROMO_PRODUCTS.length - 1}). Switching scene automatically every 2.5 seconds.
              </span>
            </div>
          )}
        </div>

        {/* 1. SELECT UTILITY PRESET AND CUSTOM COPYEDITORS */}
        <div className="p-5 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-3">
            <Palette className="text-sky-400" size={16} />
            <span className="font-black text-xs uppercase tracking-wider">1. Brand & Slogan Customization</span>
          </div>

          {/* Product selector row */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Product to Advertise</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PROMO_PRODUCTS.map(prod => (
                <button
                  key={prod.id}
                  onClick={() => handleProductPresetSelect(prod)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all font-sans cursor-pointer hover:border-primary",
                    selectedProduct.id === prod.id 
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5" 
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/5 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <span className={cn("text-[10px] font-black tracking-tight", prod.iconColor)}>{prod.name}</span>
                  <span className="text-[9px] opacity-75 font-medium leading-snug line-clamp-2">{prod.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typographic details layout inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custom Headline Name</label>
              <input
                type="text"
                value={customTitle}
                placeholder={selectedProduct.name}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                  drawCanvasFrame();
                }}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dynamic Product Tag</label>
              <input
                type="text"
                value={customSubtitle}
                placeholder={selectedProduct.tag}
                onChange={(e) => {
                  setCustomSubtitle(e.target.value);
                  drawCanvasFrame();
                }}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Typographic subtitle carousel selector */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interactive Middle Caption</label>
            <div className="flex flex-wrap gap-2">
              {REEL_SLOGANS.map(slog => (
                <button
                  key={slog}
                  onClick={() => handleSloganSelect(slog)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer",
                    customSlogan === slog 
                      ? "bg-slate-900 border-white/20 text-white dark:bg-white dark:text-black dark:border-transparent" 
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-800"
                  )}
                >
                  {slog}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customSlogan}
              placeholder="Enter custom visual slogan..."
              onChange={(e) => {
                setCustomSlogan(e.target.value);
                drawCanvasFrame();
              }}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none placeholder-slate-600"
            />
          </div>

          {/* Call to action details tag */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Static Bottom Call To Action (URL)</label>
            <input
              type="text"
              value={customCTA}
              placeholder="E.g., WWW.DIHTEMPLATE.PRO  //  LINK IN BIO"
              onChange={(e) => {
                setCustomCTA(e.target.value);
                drawCanvasFrame();
              }}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* 2. AUDIO SYNTHESIZER AND CINEMATIC THEMES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Cinematic Styling Theme card */}
          <div className="p-5 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-3">
              <Sparkles className="text-sky-400" size={16} />
              <span className="font-black text-xs uppercase tracking-wider">2. Aesthetic Theme Preset</span>
            </div>
            <div className="space-y-2">
              {VIDEO_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme);
                    triggerAlert('info', `Visual color preset updated to: "${theme.name}"`);
                  }}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer font-sans text-xs font-bold hover:bg-slate-950/40",
                    selectedTheme.id === theme.id 
                      ? "bg-slate-100 border-indigo-500/20 text-indigo-500 dark:bg-slate-950" 
                      : "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-transparent text-slate-500 hover:text-slate-300"
                  )}
                >
                  <span>{theme.name}</span>
                  <div className="flex gap-2">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.primaryTextColor }} />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.secondaryTextColor }} />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.canvasBg }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Procedural Audio loop controller */}
          <div className="p-5 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Music className="text-emerald-400" size={16} />
                <span className="font-black text-xs uppercase tracking-wider">3. Background Beat Synthesizer</span>
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-[10px] font-bold"
              >
                {isMuted ? <VolumeX size={12} className="text-red-500" /> : <Volume2 size={12} className="text-emerald-400" />}
                {isMuted ? "Unmute" : "Muted"}
              </button>
            </div>

            <div className="space-y-3">
              {SOUNDTRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedSoundtrack(track);
                    triggerAlert('info', `Soundtrack preset switched to: ${track.name}`);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border text-left transition-all h-16 flex flex-col justify-center cursor-pointer font-sans",
                    selectedSoundtrack.id === track.id 
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500" 
                      : "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-transparent text-slate-500 hover:text-slate-300"
                  )}
                >
                  <span className="text-xs font-bold leading-normal">{track.name}</span>
                  <span className="text-[10px] opacity-75 font-medium">{track.desc}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE: LIVE VERTICAL BEZEL MOUNT & RENDERING BAR (40% width on Desktop) */}
      <div className="w-full xl:w-[410px] p-5 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-xl space-y-6 flex flex-col justify-between">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <div className="flex items-center gap-1.5">
              <Tv className="text-slate-400" size={16} />
              <span className="font-black text-xs uppercase tracking-wider">Live Bezel Preview</span>
            </div>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer text-slate-400"
              title={isPlaying ? "Pause Active Canvas Frames" : "Resume Frame Animations"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current text-sky-400" />}
            </button>
          </div>

          {/* DYNAMIC SMARTPHONE 9:16 SIMULATOR BEZEL VIEW */}
          <div className="relative w-[280px] xs:w-[325px] h-[497px] xs:h-[577px] mx-auto rounded-[36px] border-[10px] border-slate-950 bg-slate-950 shadow-2xl shadow-indigo-500/10 overflow-hidden ring-4 ring-indigo-500/15 group">
            
            {/* Selfie speaker element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-2">
              <div className="w-8 h-1 bg-slate-700 rounded-full" />
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
            </div>

            {/* LIVE EXHAUST RENDERING CANVAS */}
            <div className="w-full h-full relative z-20">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="w-full h-full object-cover active:scale-95 transition-all cursor-crosshair"
              />
            </div>
            
            {/* Cinematic Scanline Grid Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] z-20" />
          </div>
        </div>

        {/* 4. CHRONO EXPORT CHAMBER */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5">
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Dynamic Reel Length</span>
              <span className="text-sky-400">{recordingDuration} Seconds</span>
            </div>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map(sec => (
                <button
                  key={sec}
                  onClick={() => setRecordingDuration(sec)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg border text-xs font-black tracking-tight cursor-pointer",
                    recordingDuration === sec 
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold" 
                      : "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-transparent text-slate-400 hover:text-slate-200"
                  )}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Progress loader block when recording */}
          {isRecording && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-indigo-500/30 text-xs font-medium space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <RefreshCw size={12} className="animate-spin text-sky-400" />
                  Capturing Movie Stream...
                </span>
                <span>{recordingProgress}%</span>
              </div>
              <div className="progress-bar w-full bg-slate-200 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all" style={{ width: `${recordingProgress}%` }} />
              </div>
            </div>
          )}

          {/* DUAL ACTION CONTROLS */}
          {!isRecording && !recordedVideoUrl && (
            <button
              onClick={handleExportPromoVideo}
              className="w-full py-4 bg-gradient-to-r from-sky-400 via-indigo-500 to-pink-500 hover:from-sky-500 hover:to-pink-600 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02] shadow-indigo-500/10 cursor-pointer text-center"
            >
              <Video size={16} />
              Construct Promotion Reel Video
            </button>
          )}

          {/* RE-EXPORT SEPARATE VIEW */}
          {recordedVideoUrl && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-bold text-emerald-400 mb-2">
                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                Your promotion reel has compiled successfully!
              </div>

              <div className="flex gap-2">
                <a
                  href={recordedVideoUrl}
                  download={`DIHTEMPLATE-Reel-Promo-${Date.now()}.webm`}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 hover:bg-emerald-400 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <Download size={14} />
                  Download WebM
                </a>
                
                <button
                  onClick={() => {
                    setRecordedVideoUrl(null);
                    setRecordingProgress(0);
                    drawCanvasFrame();
                  }}
                  className="px-4 py-3 bg-slate-950 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-850 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} className="text-sky-400" />
                  Make Another
                </button>
              </div>

              {/* Subtitle notes on embedding */}
              <p className="text-[10px] text-slate-500 text-center leading-normal">
                WebM format is natively supported by Google Chrome, Firefox, and macOS. Simply load the file to capcut, canva or directly share on TikTok and Shorts!
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
