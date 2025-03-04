import { GameContextProvider } from './context/GameContext.js';
import { AudioContextProvider } from './context/AudioContext.js';
import { Game } from './components/Game.js';
import { initServiceWorker } from './utilities/serviceWorker.js';

// Initialize service worker for PWA functionality
initServiceWorker();

// Initialize the app with React
const rootElement = document.getElementById('game-container');
const root = ReactDOM.createRoot(rootElement);

root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      AudioContextProvider,
      null,
      React.createElement(
        GameContextProvider,
        null,
        React.createElement(Game, null)
      )
    )
  )
);

