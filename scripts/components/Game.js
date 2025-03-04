// Game.js - Main game component that renders the game UI
import { Terminal } from './Terminal.js';
import { CommandInput } from './CommandInput.js';
import { StatusBar } from './StatusBar.js';
import { Header } from './Header.js';
import { LoadingScreen } from './LoadingScreen.js';
import { ImageModal } from './ImageModal.js';
import { GameContext } from '../context/GameContext.js';

export const Game = () => {
  const { 
    gameState, 
    isLoading, 
    currentImage, 
    setCurrentImage 
  } = React.useContext(GameContext);

  if (isLoading || !gameState) {
    return <LoadingScreen />;
  }

  return (
    <React.Fragment>
      <div className="starfield"></div>
      <Header />
      <Terminal />
      <StatusBar />
      <CommandInput />
      {currentImage && (
        <ImageModal 
          imageUrl={currentImage} 
          onClose={() => setCurrentImage(null)} 
        />
      )}
    </React.Fragment>
  );
};

