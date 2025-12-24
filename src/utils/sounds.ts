// Web Audio API sound generator for cat meows
let audioContext: AudioContext | null = null;
let backgroundGainNode: GainNode | null = null;
let backgroundOscillators: OscillatorNode[] = [];

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const createOscillator = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue: number = 0.3,
  delay: number = 0
): Promise<void> => {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.8,
      ctx.currentTime + delay + duration
    );
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
    
    setTimeout(resolve, (delay + duration) * 1000);
  });
};

// Different meow variations for different kittens
export const playHappyMeow = async (kittenId?: string): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  // Different happy meows per kitten personality
  const meowVariations: Record<string, number[]> = {
    princess: [500, 700, 900, 1100],
    chaos: [400, 800, 600, 1000, 500],
    sleepy: [300, 400, 350, 380],
    fancy: [450, 600, 750, 850],
    hungry: [600, 900, 1200, 1000, 1400],
  };

  const frequencies = kittenId && meowVariations[kittenId] 
    ? meowVariations[kittenId] 
    : [500, 700, 900, 1100];

  for (let i = 0; i < frequencies.length; i++) {
    createOscillator(frequencies[i], 0.12, 'sine', 0.25, i * 0.08);
  }
};

export const playGrumpyMeow = async (kittenId?: string): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const meowVariations: Record<string, number[]> = {
    princess: [800, 600, 400, 200],
    chaos: [700, 300, 800, 250, 150],
    sleepy: [400, 300, 200, 180, 150],
    fancy: [600, 500, 350, 250],
    hungry: [500, 400, 250, 200, 150, 100],
  };

  const frequencies = kittenId && meowVariations[kittenId]
    ? meowVariations[kittenId]
    : [600, 400, 300, 200];

  for (let i = 0; i < frequencies.length; i++) {
    createOscillator(frequencies[i], 0.18, 'sawtooth', 0.15, i * 0.1);
  }
};

export const playSuccessChime = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  
  // Magical sparkle sound
  createOscillator(523, 0.15, 'sine', 0.15, 0);
  createOscillator(659, 0.15, 'sine', 0.15, 0.08);
  createOscillator(784, 0.15, 'sine', 0.18, 0.16);
  createOscillator(1047, 0.25, 'sine', 0.2, 0.24);
};

export const playRejectSound = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  
  // Bonk / slap sound
  createOscillator(200, 0.1, 'square', 0.2, 0);
  createOscillator(150, 0.15, 'sawtooth', 0.15, 0.05);
  createOscillator(100, 0.2, 'triangle', 0.1, 0.1);
};

export const playWhooshSound = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  
  // Quick whoosh sound for throwing
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
};

export const playThudSound = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  
  // Soft thud when gift lands
  createOscillator(80, 0.08, 'sine', 0.25, 0);
  createOscillator(60, 0.1, 'triangle', 0.15, 0.02);
};

// Background ambient meows with unique kitten personalities
let meowInterval: number | null = null;
let ambienceVolume = 0.5;

// Each kitten has a unique voice signature
const kittenVoices = {
  princess: {
    name: 'Princess Whiskers',
    meows: [
      { freqs: [500, 600, 550, 580], duration: 0.25, type: 'sine' as OscillatorType }, // High-pitched diva meow
      { freqs: [480, 550, 520], duration: 0.2, type: 'sine' as OscillatorType }, // Elegant short meow
      { freqs: [520, 620, 580, 540, 560], duration: 0.35, type: 'sine' as OscillatorType }, // Demanding attention meow
    ]
  },
  chaos: {
    name: 'Captain Chaos',
    meows: [
      { freqs: [400, 600, 350, 700, 300], duration: 0.3, type: 'sawtooth' as OscillatorType }, // Chaotic wild meow
      { freqs: [500, 300, 600, 250], duration: 0.25, type: 'square' as OscillatorType }, // Crazy rapid meow
      { freqs: [350, 500, 400, 550, 380, 480], duration: 0.4, type: 'triangle' as OscillatorType }, // Hyperactive meow
    ]
  },
  sleepy: {
    name: 'Sir Snuggles',
    meows: [
      { freqs: [250, 280, 260], duration: 0.4, type: 'sine' as OscillatorType }, // Sleepy low meow
      { freqs: [220, 240, 230, 220], duration: 0.5, type: 'sine' as OscillatorType }, // Yawning meow
      { freqs: [260, 280, 270], duration: 0.35, type: 'triangle' as OscillatorType }, // Drowsy mumble meow
    ]
  },
  fancy: {
    name: 'Duchess Fluffington',
    meows: [
      { freqs: [420, 480, 450, 460], duration: 0.28, type: 'sine' as OscillatorType }, // Refined meow
      { freqs: [400, 450, 430, 440, 420], duration: 0.32, type: 'sine' as OscillatorType }, // Sophisticated trill
      { freqs: [440, 500, 470, 480], duration: 0.25, type: 'triangle' as OscillatorType }, // Posh acknowledgment
    ]
  },
  hungry: {
    name: 'Mochi the Mooch',
    meows: [
      { freqs: [380, 500, 600, 700, 650], duration: 0.35, type: 'sawtooth' as OscillatorType }, // Pleading hungry meow
      { freqs: [400, 550, 500, 600, 550, 650], duration: 0.45, type: 'sine' as OscillatorType }, // Long demanding meow
      { freqs: [350, 450, 400, 500, 480], duration: 0.3, type: 'triangle' as OscillatorType }, // Whiny food meow
    ]
  }
};

const playSoftMeow = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  // Pick a random kitten voice
  const kittenIds = Object.keys(kittenVoices) as (keyof typeof kittenVoices)[];
  const randomKitten = kittenIds[Math.floor(Math.random() * kittenIds.length)];
  const kittenVoice = kittenVoices[randomKitten];
  
  // Pick a random meow from that kitten
  const meow = kittenVoice.meows[Math.floor(Math.random() * kittenVoice.meows.length)];
  const volume = 0.08 * ambienceVolume;

  meow.freqs.forEach((freq, i) => {
    createOscillator(freq, meow.duration / meow.freqs.length, meow.type, volume, i * 0.06);
  });
};

export const startBackgroundAmbience = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  if (meowInterval !== null) return; // Already playing

  // Play initial meow
  setTimeout(() => playSoftMeow(), 500);

  // Schedule random meows every 3-6 seconds
  const scheduleNextMeow = () => {
    const delay = 3000 + Math.random() * 3000;
    meowInterval = window.setTimeout(() => {
      playSoftMeow();
      scheduleNextMeow();
    }, delay);
  };

  scheduleNextMeow();
};

export const stopBackgroundAmbience = (): void => {
  if (meowInterval !== null) {
    clearTimeout(meowInterval);
    meowInterval = null;
  }
};

export const setAmbienceVolume = (volume: number): void => {
  ambienceVolume = volume;
};
