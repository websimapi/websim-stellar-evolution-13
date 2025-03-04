import { initializeGameState } from '../core/gameState.js';
import { processCommand } from '../core/commandProcessor.js';
import { saveGame, loadGame } from '../utilities/storage.js';
import { updateResourceProduction } from '../core/resourceSystem.js';
import { generateEventId } from '../utilities/helpers.js';

// Create a React context for the game state
export const GameContext = React.createContext();

export const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(null);
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [processingCommand, setProcessingCommand] = React.useState(false);
  const terminalRef = React.useRef(null);

  // Initialize game state on component mount
  React.useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      try {
        // Try to load saved game
        const savedGame = await loadGame();
        if (savedGame) {
          setGameState(savedGame);
          setMessages(savedGame.messages || []);
          // Check if tutorial should be shown
          setShowTutorial(savedGame.turnNumber < 3);
        } else {
          // Initialize new game
          const newGame = initializeGameState();
          setGameState(newGame);
          // Add initial welcome message
          addMessage({
            type: 'SYSTEM',
            content: 'Welcome to Stellar Evolution. Your journey begins now.',
            detail: 'You are the leader of a fledgling stellar civilization. Guide your people through the cosmos with your commands.',
            timestamp: Date.now()
          });
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('Error initializing game:', error);
        // Fallback to new game if loading fails
        const newGame = initializeGameState();
        setGameState(newGame);
      } finally {
        setIsLoading(false);
      }
    };

    initGame();
  }, []);

  // Setup resource production interval
  React.useEffect(() => {
    if (!gameState) return;

    // Update resources and game state every minute
    const interval = setInterval(() => {
      setGameState(prevState => {
        const updatedState = updateResourceProduction(prevState);
        saveGame(updatedState); // Auto-save after updates
        return updatedState;
      });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [gameState]);

  // Scroll to bottom of terminal when messages change
  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  // Add a message to the terminal
  const addMessage = (message) => {
    // Generate unique ID for the message if it doesn't have one
    const messageWithId = {
      ...message,
      id: message.id || generateEventId()
    };
    
    setMessages(prevMessages => [...prevMessages, messageWithId]);
    
    // Update gameState to include messages for persistence
    setGameState(prevState => {
      if (!prevState) return null;
      
      // Keep only the last 100 messages to prevent excessive storage
      const updatedMessages = [...prevMessages, messageWithId].slice(-100);
      
      return {
        ...prevState,
        messages: updatedMessages
      };
    });
  };

  // Submit a command
  const submitCommand = async (command) => {
    if (!command || processingCommand) return;
    
    setProcessingCommand(true);
    
    // Add user command to messages
    addMessage({
      type: 'USER_COMMAND',
      content: command,
      timestamp: Date.now()
    });
    
    // Show processing indicator
    addMessage({
      type: 'SYSTEM',
      content: 'Processing command...',
      id: 'processing-indicator',
      timestamp: Date.now()
    });
    
    try {
      // Process the command
      const result = await processCommand(gameState, command);
      
      // Remove processing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'processing-indicator'));
      
      if (result.error) {
        addMessage({
          type: 'ERROR',
          content: result.error,
          timestamp: Date.now()
        });
      } else {
        // Update game state
        setGameState(result.newState);
        
        // Save the updated game state
        await saveGame(result.newState);
        
        // Add response message
        addMessage({
          type: result.response.action.type,
          content: result.response.narrative.mainText,
          detail: result.response.narrative.detailText,
          timestamp: Date.now(),
          tone: result.response.narrative.tone,
          imagePrompt: result.response.narrative.imagePrompt
        });
        
        // Handle image generation if applicable
        if (result.response.narrative.imagePrompt && !result.offlineMode) {
          try {
            // Generate image - implementation in imageGenerator.js
            const imageUrl = await generateImage(result.response.narrative.imagePrompt);
            setCurrentImage(imageUrl);
          } catch (error) {
            console.error('Image generation failed:', error);
          }
        }
        
        // Update tutorial state
        if (showTutorial && result.newState.turnNumber >= 3) {
          setShowTutorial(false);
        }
      }
    } catch (error) {
      console.error('Error processing command:', error);
      
      // Remove processing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'processing-indicator'));
      
      addMessage({
        type: 'ERROR',
        content: 'There was an error processing your command. Please try again.',
        detail: error.message,
        timestamp: Date.now()
      });
    } finally {
      setProcessingCommand(false);
    }
  };

  // Function to generate image based on prompt
  const generateImage = async (imagePrompt) => {
    try {
      const result = await websim.imageGen({
        prompt: imagePrompt,
        aspect_ratio: "16:9",
      });
      return result.url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };

  // Context value
  const contextValue = {
    gameState,
    messages,
    isLoading,
    processingCommand,
    currentImage,
    showTutorial,
    terminalRef,
    addMessage,
    submitCommand,
    setCurrentImage,
    setShowTutorial
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

