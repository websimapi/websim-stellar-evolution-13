// Header.js - Game title and controls
import { AudioContext } from '../context/AudioContext.js';

export const Header = () => {
  const { 
    isMuted, 
    toggleMute, 
    narrationMode, 
    toggleNarrationMode 
  } = React.useContext(AudioContext);

  return (
    <header className="game-header">
      <div className="game-title">
        <svg className="game-logo" viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="10" fill="#000025" stroke="#48a9f8" strokeWidth="1" />
          <circle cx="12" cy="12" r="3" fill="#48a9f8" />
          <ellipse cx="12" cy="12" rx="6" ry="2" fill="none" stroke="#48a9f8" strokeWidth="1" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="6" ry="2" fill="none" stroke="#48a9f8" strokeWidth="1" transform="rotate(-30 12 12)" />
        </svg>
        <span>STELLAR EVOLUTION</span>
      </div>
      
      <div className="game-controls">
        <button 
          className="control-button" 
          onClick={toggleMute} 
          aria-label={isMuted ? "Unmute" : "Mute"}
          style={{ 
            background: "none", 
            border: "none", 
            color: "#fff", 
            cursor: "pointer",
            marginRight: "10px" 
          }}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" stroke="#f84848" />
              <path d="M9 9l-3 3H3V12H2z" />
              <path d="M15 9 9 15V9l6-6v12l-6 6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15 8a5 5 0 0 1 0 8" />
              <path d="M19 5a10 10 0 0 1 0 14" />
            </svg>
          )}
        </button>
        
        <button 
          className="narration-button" 
          onClick={toggleNarrationMode} 
          aria-label={`Narration mode: ${narrationMode}`}
          style={{ 
            background: "none", 
            border: "none", 
            color: "#fff", 
            cursor: "pointer" 
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 0 0-7 17l-3 3v-4H5a10 10 0 0 0 7-17z" />
            <text x="9" y="14" fontSize="8" fill="currentColor">
              {narrationMode === 'full' ? 'F' : 
               narrationMode === 'critical' ? 'C' : 
               narrationMode === 'tutorial' ? 'T' : 'X'}
            </text>
          </svg>
        </button>
      </div>
    </header>
  );
};

