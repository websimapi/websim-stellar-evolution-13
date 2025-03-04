// helpers.js - Utility functions for the game

/**
 * Generate a unique ID for events and other game objects
 */
export const generateEventId = () => {
  return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Format a timestamp for display
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format game time for display
 */
export const formatGameTime = (gameTime) => {
  if (!gameTime) return 'Time unknown';
  const { year, cycle } = gameTime;
  return `Year ${year}, Cycle ${cycle}`;
};

/**
 * Check if a technology's prerequisites are met
 */
export const checkTechPrerequisites = (technology, researchedTechs) => {
  if (!technology.prerequisites || technology.prerequisites.length === 0) {
    return true;
  }
  
  // Check if all prerequisites are in the researched techs
  return technology.prerequisites.every(prereqId => {
    return researchedTechs.some(tech => tech.id === prereqId);
  });
};

/**
 * Find available technologies based on prerequisites
 */
export const getAvailableTechnologies = (gameState) => {
  const { technologies } = gameState;
  const allTechIds = technologies.researched.map(tech => tech.id);
  
  return technologies.available.filter(tech => {
    return checkTechPrerequisites(tech, technologies.researched);
  });
};

/**
 * Calculate the distance between two celestial objects
 */
export const calculateDistance = (object1, object2) => {
  // In a real implementation, this would use coordinates
  // For this demo, we'll return a placeholder value
  return 1.0;
};

/**
 * Check if two objects are in the same star system
 */
export const areSameSystem = (object1, object2, gameState) => {
  // Find the systems containing each object
  let system1 = null;
  let system2 = null;
  
  for (const system of gameState.starSystems) {
    for (const celestialObject of system.celestialObjects) {
      if (celestialObject.id === object1) {
        system1 = system.id;
      }
      if (celestialObject.id === object2) {
        system2 = system.id;
      }
    }
  }
  
  return system1 === system2;
};

/**
 * Format a large number for display (1000 -> 1K, 1000000 -> 1M)
 */
export const formatLargeNumber = (number) => {
  if (number < 1000) {
    return number.toString();
  }
  
  if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  
  if (number < 1000000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  
  return `${(number / 1000000000).toFixed(1)}B`;
};

