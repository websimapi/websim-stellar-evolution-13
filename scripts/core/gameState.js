// gameState.js - Manages the game state initialization and structure

/**
 * Initialize a new game state
 */
export const initializeGameState = () => {
  const initialState = {
    // Basic game information
    turnNumber: 1,
    gameTime: {
      year: 2150,
      cycle: 1
    },
    
    // Primary resources
    resources: {
      energy: 1000,
      minerals: 500,
      knowledge: 200,
      population: 1.2e9, // 1.2 billion
      
      // Resource production rates (per minute)
      energyProduction: 5,
      mineralsProduction: 2,
      knowledgeProduction: 1,
      populationGrowth: 100000 // 100,000 per minute
    },
    
    // Star systems and celestial objects
    starSystems: [
      {
        id: 'sol',
        name: 'Sol',
        type: 'G-type main-sequence',
        explored: true,
        celestialObjects: [
          {
            id: 'earth',
            name: 'Earth',
            type: 'terrestrial',
            size: 'medium',
            habitability: 1.0, // Perfect for humans
            explored: true,
            colonized: true,
            resources: {
              energy: 'medium',
              minerals: 'medium',
              specialResources: []
            },
            facilities: [
              {
                id: 'capital-city',
                name: 'Capital City',
                type: 'GOVERNMENT',
                level: 1,
                production: {
                  energy: 2,
                  minerals: 1,
                  knowledge: 1
                }
              }
            ]
          },
          {
            id: 'moon',
            name: 'Moon',
            type: 'moon',
            size: 'small',
            habitability: 0.1,
            explored: false,
            colonized: false,
            resources: {
              energy: 'low',
              minerals: 'high',
              specialResources: []
            },
            facilities: []
          },
          {
            id: 'mars',
            name: 'Mars',
            type: 'terrestrial',
            size: 'small',
            habitability: 0.3,
            explored: false,
            colonized: false,
            resources: {
              energy: 'medium',
              minerals: 'high',
              specialResources: []
            },
            facilities: []
          }
        ]
      }
    ],
    
    // Discovered but unexplored objects
    discoveredObjects: [],
    
    // Colonies and settlements
    colonies: [
      {
        id: 'earth-colony',
        planetId: 'earth',
        name: 'Earth Prime',
        population: 1.2e9,
        happiness: 0.8,
        stability: 0.9,
        specialization: 'BALANCED'
      }
    ],
    
    // Technology and research
    technologies: {
      researched: [
        {
          id: 'basic-computing',
          name: 'Basic Computing',
          category: 'COMPUTING',
          level: 1,
          completedAt: 0
        },
        {
          id: 'combustion-engines',
          name: 'Combustion Engines',
          category: 'PROPULSION',
          level: 1,
          completedAt: 0
        },
        {
          id: 'fossil-fuels',
          name: 'Fossil Fuels',
          category: 'ENERGY',
          level: 1,
          completedAt: 0
        }
      ],
      
      inProgress: null,
      
      available: [
        {
          id: 'solar-power',
          name: 'Solar Power',
          category: 'ENERGY',
          level: 2,
          cost: 300,
          description: 'Harness the power of your star with photovoltaic arrays.',
          prerequisites: ['fossil-fuels']
        },
        {
          id: 'satellite-networks',
          name: 'Satellite Networks',
          category: 'COMPUTING',
          level: 2,
          cost: 350,
          description: 'Global communications and observation capabilities.',
          prerequisites: ['basic-computing', 'combustion-engines']
        },
        {
          id: 'rocket-propulsion',
          name: 'Rocket Propulsion',
          category: 'PROPULSION',
          level: 2,
          cost: 400,
          description: 'Advanced chemical rockets for orbital and space exploration.',
          prerequisites: ['combustion-engines']
        }
      ]
    },
    
    // Fleets and vessels
    fleets: [],
    
    // Events and story progression
    events: [],
    
    // Command history
    commandHistory: [],
    lastCommand: '',
    
    // Message log for UI
    messages: []
  };
  
  return initialState;
};

/**
 * Get an object from the game state by ID
 */
export const getObjectById = (state, objectId) => {
  // Check star systems and their celestial objects
  for (const system of state.starSystems) {
    if (system.id === objectId) {
      return { object: system, type: 'starSystem' };
    }
    
    for (const celestialObject of system.celestialObjects) {
      if (celestialObject.id === objectId) {
        return { object: celestialObject, type: 'celestialObject', parentSystem: system };
      }
      
      // Check facilities on celestial objects
      for (const facility of (celestialObject.facilities || [])) {
        if (facility.id === objectId) {
          return { 
            object: facility, 
            type: 'facility', 
            parentObject: celestialObject, 
            parentSystem: system 
          };
        }
      }
    }
  }
  
  // Check colonies
  for (const colony of state.colonies) {
    if (colony.id === objectId) {
      return { object: colony, type: 'colony' };
    }
  }
  
  // Check technologies
  for (const tech of state.technologies.researched) {
    if (tech.id === objectId) {
      return { object: tech, type: 'technology', status: 'researched' };
    }
  }
  
  if (state.technologies.inProgress && state.technologies.inProgress.id === objectId) {
    return { 
      object: state.technologies.inProgress, 
      type: 'technology', 
      status: 'inProgress' 
    };
  }
  
  for (const tech of state.technologies.available) {
    if (tech.id === objectId) {
      return { object: tech, type: 'technology', status: 'available' };
    }
  }
  
  // Check fleets
  for (const fleet of state.fleets) {
    if (fleet.id === objectId) {
      return { object: fleet, type: 'fleet' };
    }
  }
  
  // Not found
  return null;
};

/**
 * Update the state with a new event
 */
export const addGameEvent = (state, eventData) => {
  const newEvent = {
    id: `event-${Date.now()}-${Math.floor(Math.random() * the1000)}`,
    timestamp: Date.now(),
    ...eventData
  };
  
  return {
    ...state,
    events: [...state.events, newEvent]
  };
};

/**
 * Record a command in the history
 */
export const recordCommand = (state, command) => {
  return {
    ...state,
    commandHistory: [...state.commandHistory, command],
    lastCommand: command,
    turnNumber: state.turnNumber + 1
  };
};

/**
 * Progress game time
 */
export const advanceGameTime = (state, cycles = 1) => {
  let { year, cycle } = state.gameTime;
  
  cycle += cycles;
  
  // Each year has 10 cycles
  if (cycle > 10) {
    year += Math.floor(cycle / 10);
    cycle = cycle % 10;
  }
  
  return {
    ...state,
    gameTime: { year, cycle }
  };
};

