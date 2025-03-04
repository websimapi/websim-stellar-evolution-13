// Message.js - Component for displaying individual messages
import { formatTimestamp } from '../utilities/helpers.js';
import { AudioContext } from '../context/AudioContext.js';

export const Message = ({ message }) => {
  const { playSound } = React.useContext(AudioContext);
  const messageRef = React.useRef(null);
  
  // Add typing effect to new messages
  React.useEffect(() => {
    // Play sound based on message type
    if (message.type === 'EXPLORATION') {
      playSound('discovery');
    } else if (message.type === 'CONSTRUCTION') {
      playSound('construction_start');
    } else if (message.type === 'RESEARCH') {
      playSound('research_complete');
    } else if (message.type === 'ERROR') {
      playSound('command_error');
    } else if (message.type === 'SPECIAL_EVENT' || message.tone === 'urgent') {
      playSound('alert');
    }
  }, []);

  // Determine message class based on type
  const getMessageClass = () => {
    const baseClass = 'message';
    
    switch (message.type) {
      case 'SYSTEM':
        return `${baseClass} message-system`;
      case 'USER_COMMAND':
        return `${baseClass} message-user`;
      case 'ERROR':
        return `${baseClass} message-error`;
      case 'EXPLORATION':
        return `${baseClass} message-exploration`;
      case 'RESEARCH':
        return `${baseClass} message-research`;
      case 'CONSTRUCTION':
        return `${baseClass} message-construction`;
      case 'SPECIAL_EVENT':
        return `${baseClass} message-special`;
      default:
        return baseClass;
    }
  };

  // Determine header based on message type
  const getMessageHeader = () => {
    switch (message.type) {
      case 'SYSTEM':
        return 'SYSTEM';
      case 'USER_COMMAND':
        return '> COMMAND';
      case 'ERROR':
        return 'ERROR';
      case 'EXPLORATION':
        return 'EXPLORATION REPORT';
      case 'RESEARCH':
        return 'RESEARCH UPDATE';
      case 'CONSTRUCTION':
        return 'CONSTRUCTION NOTICE';
      case 'COLONIZATION':
        return 'COLONIZATION PROGRAM';
      case 'PRODUCTION':
        return 'PRODUCTION SYSTEMS';
      case 'DIPLOMACY':
        return 'DIPLOMATIC CHANNELS';
      case 'MANAGEMENT':
        return 'RESOURCE MANAGEMENT';
      case 'COMBAT':
        return 'MILITARY OPERATIONS';
      case 'SPECIAL_EVENT':
        return 'PRIORITY ALERT';
      default:
        return message.type;
    }
  };

  // Format the message content based on type
  const formatContent = () => {
    if (message.type === 'USER_COMMAND') {
      return <span className="user-command">{message.content}</span>;
    }
    
    if (message.type === 'SYSTEM' && message.content === 'Processing command...') {
      return (
        <span className="processing-command">
          Processing command<span className="loading-dots"></span>
        </span>
      );
    }
    
    return message.content;
  };

  return (
    <div className={getMessageClass()} ref={messageRef}>
      {message.type !== 'USER_COMMAND' && message.type !== 'SYSTEM' && (
        <div className="message-header">[{getMessageHeader()}]</div>
      )}
      
      <div className="message-content">
        {formatContent()}
      </div>
      
      {message.detail && (
        <div className="message-detail">
          {message.detail}
        </div>
      )}
      
      {message.timestamp && message.type !== 'SYSTEM' && (
        <div className="message-date">
          {formatTimestamp(message.timestamp)}
        </div>
      )}
    </div>
  );
};

