export class SoundManager {
  private static instance: SoundManager;
  private soundEnabled: boolean = true;
  private audioContext: AudioContext | null = null;

  private constructor() {
    // Initialize audio context on first user interaction
    this.initializeAudioContext();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeAudioContext(): void {
    // Audio context will be created on first sound play
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    console.log(`SoundManager: Sound effects ${enabled ? 'enabled' : 'disabled'}.`);
  }

  playSound(soundType: 'move' | 'win' | 'draw' | 'button', player?: 'X' | 'O'): void {
    if (!this.soundEnabled) {
      console.log(`SoundManager: Sound ${soundType} blocked - sound disabled`);
      return;
    }

    console.log(`SoundManager: Playing sound ${soundType} for player ${player}`);
    const audioContext = this.getAudioContext();
    
    // Resume audio context if suspended (required for some browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    switch (soundType) {
      case 'move':
        this.playMoveSound(audioContext, player);
        break;
      case 'win':
        this.playWinSound(audioContext);
        break;
      case 'draw':
        this.playDrawSound(audioContext);
        break;
      case 'button':
        this.playButtonSound(audioContext);
        break;
    }
  }

  private playMoveSound(audioContext: AudioContext, player?: 'X' | 'O'): void {
    // Simple, clean, gentle click sound
    const baseFreq = player === 'X' ? 400 : 300; // Pleasant, distinct frequencies
    const variation = Math.random() * 10 - 5; // Small variation
    const frequency = baseFreq + variation;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Clean, simple tone
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Very gentle envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.005); // Very quick, soft attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12); // Quick, clean decay

    // Soft, warm filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, audioContext.currentTime);
    filter.Q.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.12);
  }

  private playWinSound(audioContext: AudioContext): void {
    // Much softer, warmer victory chimes
    const notes = [262, 330, 392, 523]; // C4, E4, G4, C5 - lower, warmer octave
    const duration = 0.6; // Longer, more gentle
    
    notes.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const startTime = audioContext.currentTime + (index * 0.2); // Slower progression
      
      oscillator.frequency.setValueAtTime(freq, startTime);
      oscillator.type = 'sine';
      
      // Much gentler envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.1); // Lower volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      // Much warmer, softer filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, startTime); // Much lower cutoff
      filter.Q.setValueAtTime(0.5, startTime); // Gentle rolloff

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  private playDrawSound(audioContext: AudioContext): void {
    // Much softer, warmer chord resolution
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    const mixer = audioContext.createGain();
    oscillator1.connect(mixer);
    oscillator2.connect(mixer);
    mixer.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Lower, warmer chord resolution (F3 to C4)
    oscillator1.frequency.setValueAtTime(175, audioContext.currentTime); // F3
    oscillator2.frequency.setValueAtTime(262, audioContext.currentTime); // C4
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    
    // Much softer envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.15); // Lower volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.0); // Longer

    // Much warmer, gentler filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime); // Much lower cutoff
    filter.Q.setValueAtTime(0.3, audioContext.currentTime); // Very gentle rolloff

    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 1.0);
    oscillator2.stop(audioContext.currentTime + 1.0);
  }

  private playButtonSound(audioContext: AudioContext): void {
    // Much softer, gentler button feedback
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Lower, warmer frequency
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime); // Much lower
    oscillator.type = 'sine';
    
    // Much softer envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.02); // Lower volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15); // Longer

    // Much warmer, gentler filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime); // Much lower cutoff
    filter.Q.setValueAtTime(0.5, audioContext.currentTime); // Gentle rolloff

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }

  // Additional method for hover sounds (future enhancement)
  playHoverSound(): void {
    if (!this.soundEnabled) return;

    const audioContext = this.getAudioContext();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Very quiet "tick" for hover feedback
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Very quiet and brief
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }
}