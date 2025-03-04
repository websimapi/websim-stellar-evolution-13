// speechSynthesis.js - Handles text-to-speech functionality

/**
 * Text-to-speech utility
 */
export const speechSynthesis = {
  // Different voice profiles
  voices: {
    narrator: { name: 'narrator', rate: 1.0, pitch: 1.0 },
    science: { name: 'science', rate: 1.1, pitch: 1.1 },
    military: { name: 'military', rate: 0.9, pitch: 0.8 },
    diplomatic: { name: 'diplomatic', rate: 0.9, pitch: 1.0 },
    engineering: { name: 'engineering', rate: 1.0, pitch: 0.9 },
    alert: { name: 'alert', rate: 1.2, pitch: 1.2 }
  },
  
  // Speak text using the browser's speech synthesis
  speak(text, options = {}) {
    // Default options
    const defaultOptions = {
      voice: 'narrator',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      onEnd: null
    };
    
    // Merge defaults with provided options
    const settings = { ...defaultOptions, ...options };
    
    try {
      // Make sure we have access to the speech synthesis API
      if (!window.speechSynthesis) {
        console.warn('Speech synthesis not supported');
        if (settings.onEnd) settings.onEnd();
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get voice profile
      const voiceProfile = this.voices[settings.voice] || this.voices.narrator;
      
      // Apply settings
      utterance.rate = voiceProfile.rate * settings.rate;
      utterance.pitch = voiceProfile.pitch * settings.pitch;
      utterance.volume = settings.volume;
      
      // Set up the end event
      if (settings.onEnd) {
        utterance.onend = settings.onEnd;
      }
      
      // Find an appropriate voice
      const availableVoices = window.speechSynthesis.getVoices();
      const selectedVoice = availableVoices.find(v => 
        v.lang === 'en-US' || v.lang === 'en-GB'
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Apply SSML-like effects through manual text modification
      let enhancedText = text;
      
      // Add emphasis to key phrases
      enhancedText = enhancedText.replace(/\b(warning|alert|danger|critical)\b/gi, 
        (match) => `... ${match.toUpperCase()} ...`);
      
      // Add pauses for readability
      enhancedText = enhancedText.replace(/([.!?])\s+/g, '$1 ... ');
      
      // Change the text
      utterance.text = enhancedText;
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      if (settings.onEnd) settings.onEnd();
    }
  },
  
  // Cancel ongoing speech
  cancel() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
};

