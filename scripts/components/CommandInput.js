// CommandInput.js - Component for entering and submitting commands
import { GameContext } from '../context/GameContext.js';
import { AudioContext } from '../context/AudioContext.js';

export const CommandInput = () => {
  const [command, setCommand] = React.useState('');
  const { submitCommand, processingCommand } = React.useContext(GameContext);
  const { playSound } = React.useContext(AudioContext);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim() || processingCommand) return;
    
    playSound('command_success');
    submitCommand(command.trim());
    setCommand('');
  };

  return (
    <form className="command-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        className="command-input"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder={processingCommand ? "Processing..." : "Enter your command..."}
        disabled={processingCommand}
        aria-label="Command input"
      />
      <button 
        type="submit" 
        className="submit-button"
        disabled={processingCommand || !command.trim()}
        aria-label="Submit command"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
};

