// Terminal.js - Displays the game messages and narrative
import { Message } from './Message.js';
import { TutorialHint } from './TutorialHint.js';
import { GameContext } from '../context/GameContext.js';
import { AudioContext } from '../context/AudioContext.js';

export const Terminal = () => {
  const { messages, terminalRef, showTutorial } = React.useContext(GameContext);
  const { speakText } = React.useContext(AudioContext);
  
  // Speak new messages that aren't system or user command types
  React.useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      // Determine if this message should be narrated
      if (latestMessage && 
          !['SYSTEM', 'USER_COMMAND', 'ERROR'].includes(latestMessage.type)) {
        
        // Determine priority based on message type and tone
        let priority = 'normal';
        if (latestMessage.type === 'SPECIAL_EVENT' || latestMessage.tone === 'urgent') {
          priority = 'critical';
        } else if (latestMessage.tone === 'negative') {
          priority = 'warning';
        }
        
        // Speak the content
        speakText(latestMessage.content, {
          voiceType: getVoiceForMessageType(latestMessage.type),
          priority,
          interrupt: priority === 'critical'
        });
      }
    }
  }, [messages, speakText]);
  
  // Helper to determine which voice to use based on message type
  const getVoiceForMessageType = (type) => {
    switch (type) {
      case 'RESEARCH':
        return 'science';
      case 'COMBAT':
        return 'military';
      case 'DIPLOMACY':
        return 'diplomatic';
      case 'CONSTRUCTION':
        return 'engineering';
      case 'SPECIAL_EVENT':
        return 'alert';
      default:
        return 'narrator';
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal" ref={terminalRef}>
        {messages.map((message, index) => (
          <Message key={message.id || index} message={message} />
        ))}
        
        {showTutorial && (
          <TutorialHint />
        )}
      </div>
    </div>
  );
};

