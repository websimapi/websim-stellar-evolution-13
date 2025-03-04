// resourceSystem.js - Handles resource production and consumption

/**
 * Update resource production based on elapsed time
 */
export const updateResourceProduction = (gameState) => {
  if (!gameState) return gameState;
  
  const { resources } = gameState;
  
  // Calculate base production rates per minute
  let energyProduction = resources.energyProduction || 0;
  let mineralsProduction = resources.mineralsProduction || 0;
  let knowledgeProduction = resources.knowledgeProduction || 0;
  let populationGrowth = resources.populationGrowth || 0;
  
  // Calculate bonus production from facilities
  gameState.starSystems.forEach(system => {
    system.celestialObjects.forEach(celestialObject => {
      if (!celestialObject.facilities) return;
      
      celestialObject.facilities.forEach(facility => {
        // Skip facilities under construction
        if (facility.status === 'BUILDING') return;
        
        // Add production from this facility
        if (facility.production) {
          energyProduction += facility.production.energy || 0;
          mineralsProduction += facility.production.minerals || 0;
          knowledgeProduction += facility.production.knowledge || 0;
        }
      });
    });
  });
  
  // Add production to current resources
  const updatedResources = {
    ...resources,
    energy: Math.max(0, resources.energy + energyProduction),
    minerals: Math.max(0, resources.minerals + mineralsProduction),
    knowledge: Math.max(0, resources.knowledge + knowledgeProduction),
    population: Math.max(0, resources.population + populationGrowth),
    
    // Save the current production rates
    energyProduction,
    mineralsProduction,
    knowledgeProduction,
    populationGrowth
  };
  
  return {
    ...gameState,
    resources: updatedResources
  };
};

/**
 * Check if there are sufficient resources for an action
 */
export const checkResourceRequirements = (gameState, requirements) => {
  const { resources } = gameState;
  
  // Check each resource type
  if (requirements.energy && resources.energy < requirements.energy) {
    return {
      sufficient: false,
      missing: 'energy',
      required: requirements.energy,
      available: resources.energy
    };
  }
  
  if (requirements.minerals && resources.minerals < requirements.minerals) {
    return {
      sufficient: false,
      missing: 'minerals',
      required: requirements.minerals,
      available: resources.minerals
    };
  }
  
  if (requirements.knowledge && resources.knowledge < requirements.knowledge) {
    return {
      sufficient: false,
      missing: 'knowledge',
      required: requirements.knowledge,
      available: resources.knowledge
    };
  }
  
  return { sufficient: true };
};

/**
 * Apply resource changes
 */
export const applyResourceChanges = (gameState, changes) => {
  const updatedResources = { ...gameState.resources };
  
  // Apply changes to each resource type
  if (changes.energy !== undefined) {
    updatedResources.energy = Math.max(0, updatedResources.energy + changes.energy);
  }
  
  if (changes.minerals !== undefined) {
    updatedResources.minerals = Math.max(0, updatedResources.minerals + changes.minerals);
  }
  
  if (changes.knowledge !== undefined) {
    updatedResources.knowledge = Math.max(0, updatedResources.knowledge + changes.knowledge);
  }
  
  if (changes.population !== undefined) {
    updatedResources.population = Math.max(0, updatedResources.population + changes.population);
  }
  
  return {
    ...gameState,
    resources: updatedResources
  };
};

