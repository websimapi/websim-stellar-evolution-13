// AudioContext.js - Manages the game's audio system
import { speechSynthesis } from '../utilities/speechSynthesis.js';

export const AudioContext = React.createContext();

export const AudioContextProvider = ({ children }) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(0.7);
  const [narrationEnabled, setNarrationEnabled] = React.useState(true);
  const [narrationMode, setNarrationMode] = React.useState('critical'); // 'full', 'critical', 'tutorial', 'off'
  const [isNarrating, setIsNarrating] = React.useState(false);
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = React.useState(false);
  
  const audioCache = React.useRef({});
  const narrationQueue = React.useRef([]);
  const currentNarration = React.useRef(null);

  // Initialize audio context when component mounts
  React.useEffect(() => {
    // Load user preferences from localStorage
    const savedVolume = localStorage.getItem('stellarEvolution_volume');
    const savedMuted = localStorage.getItem('stellarEvolution_muted');
    const savedNarrationMode = localStorage.getItem('stellarEvolution_narrationMode');
    
    if (savedVolume !== null) setVolume(parseFloat(savedVolume));
    if (savedMuted !== null) setIsMuted(savedMuted === 'true');
    if (savedNarrationMode) setNarrationMode(savedNarrationMode);
    
    // Clean up on component unmount
    return () => {
      stopAllAudio();
    };
  }, []);

  // Save preferences when they change
  React.useEffect(() => {
    localStorage.setItem('stellarEvolution_volume', volume);
    localStorage.setItem('stellarEvolution_muted', isMuted);
    localStorage.setItem('stellarEvolution_narrationMode', narrationMode);
  }, [volume, isMuted, narrationMode]);

  // Play a sound effect
  const playSound = (soundName) => {
    if (isMuted) return;
    
    // Common sound effects
    const soundMap = {
      'command_success': 'command_confirm.mp3',
      'command_error': 'error_beep.mp3',
      'notification': 'notification.mp3',
      'discovery': 'discovery.mp3',
      'construction_start': 'construction_start.mp3',
      'research_complete': 'research_complete.mp3',
      'alert': 'alert.mp3'
    };
    
    try {
      // Use cached audio if available
      if (!audioCache.current[soundName]) {
        const audio = new Audio(`./audio/${soundMap[soundName] || soundName}`);
        audio.volume = volume;
        audioCache.current[soundName] = audio;
      }
      
      const soundToPlay = audioCache.current[soundName];
      soundToPlay.currentTime = 0;
      soundToPlay.volume = volume;
      soundToPlay.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Stop all audio
  const stopAllAudio = () => {
    // Stop all cached sounds
    Object.values(audioCache.current).forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // Stop current narration
    if (currentNarration.current) {
      speechSynthesis.cancel();
    }
    
    setIsNarrating(false);
    currentNarration.current = null;
    narrationQueue.current = [];
  };

  // Toggle mute state
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      stopAllAudio();
    }
    
    return newMutedState;
  };

  // Set volume and update all cached audio
  const setAudioVolume = (newVolume) => {
    setVolume(newVolume);
    Object.values(audioCache.current).forEach(audio => {
      audio.volume = newVolume;
    });
  };

  // Speak text using text-to-speech
  const speakText = (text, options = {}) => {
    if (isMuted || narrationMode === 'off') return;
    
    const { voiceType = 'narrator', priority = 'normal', interrupt = false } = options;
    
    // Check if this narration should be played based on mode
    const shouldPlay = 
      narrationMode === 'full' || 
      (narrationMode === 'critical' && (priority === 'critical' || priority === 'warning')) ||
      (narrationMode === 'tutorial' && (priority === 'tutorial' || priority === 'critical'));
    
    if (!shouldPlay) return;
    
    // Create narration item
    const narrationItem = {
      text,
      voiceType,
      priority,
      onStart: () => setIsNarrating(true),
      onEnd: () => {
        setIsNarrating(false);
        processNarrationQueue();
      }
    };
    
    // Handle interruption
    if (interrupt && isNarrating) {
      speechSynthesis.cancel();
      currentNarration.current = null;
      setIsNarrating(false);
      narrationQueue.current.unshift(narrationItem);
      processNarrationQueue();
    } else {
      // Add to queue
      narrationQueue.current.push(narrationItem);
      if (!isNarrating) {
        processNarrationQueue();
      }
    }
  };

  // Process the narration queue
  const processNarrationQueue = () => {
    if (narrationQueue.current.length === 0 || isNarrating) return;
    
    const item = narrationQueue.current.shift();
    currentNarration.current = item;
    
    item.onStart();
    
    // Use the speech synthesis utility to speak the text
    speechSynthesis.speak(item.text, {
      voice: item.voiceType,
      rate: 1.0,
      pitch: 1.0,
      volume: volume,
      onEnd: item.onEnd
    });
  };

  // Toggle narration mode
  const toggleNarrationMode = () => {
    const modes = ['full', 'critical', 'tutorial', 'off'];
    const currentIndex = modes.indexOf(narrationMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setNarrationMode(modes[nextIndex]);
    return modes[nextIndex];
  };

  // Provide the context value
  const audioContextValue = {
    isMuted,
    volume,
    narrationMode,
    isNarrating,
    backgroundMusicPlaying,
    playSound,
    speakText,
    toggleMute,
    setAudioVolume,
    toggleNarrationMode,
    stopAllAudio,
    setBackgroundMusicPlaying
  };

  return (
    <AudioContext.Provider value={audioContextValue}>
      {children}
    </AudioContext.Provider>
  );
};

