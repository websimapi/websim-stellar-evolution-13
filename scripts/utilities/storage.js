// storage.js - Handles saving and loading game state

/**
 * Save game state to localStorage
 */
export const saveGame = async (gameState) => {
  try {
    if (!gameState) return false;
    
    // Convert the game state to a string for storage
    const gameStateString = JSON.stringify(gameState);
    
    // Save to localStorage
    localStorage.setItem('stellarEvolution_savedGame', gameStateString);
    
    return true;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
};

/**
 * Load game state from localStorage
 */
export const loadGame = async () => {
  try {
    // Get the saved game from localStorage
    const savedGameString = localStorage.getItem('stellarEvolution_savedGame');
    
    if (!savedGameString) {
      return null;
    }
    
    // Parse the saved game state
    const gameState = JSON.parse(savedGameString);
    
    return gameState;
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
};

/**
 * Delete saved game
 */
export const deleteSavedGame = () => {
  try {
    localStorage.removeItem('stellarEvolution_savedGame');
    return true;
  } catch (error) {
    console.error('Error deleting saved game:', error);
    return false;
  }
};

/**
 * Save settings
 */
export const saveSettings = (settings) => {
  try {
    const settingsString = JSON.stringify(settings);
    localStorage.setItem('stellarEvolution_settings', settingsString);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Load settings
 */
export const loadSettings = () => {
  try {
    const settingsString = localStorage.getItem('stellarEvolution_settings');
    
    if (!settingsString) {
      return null;
    }
    
    return JSON.parse(settingsString);
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

