// commandProcessor.js - Handles the processing of player commands
import { recordCommand, advanceGameTime } from './gameState.js';
import { makeApiRequest } from '../utilities/api.js';
import { generateEventId } from '../utilities/helpers.js';

// Structure for sending a request to the LLM
const createRequest = (gameState, userCommand) => {
  // Create a lightweight version of the game state to save tokens
  const { resources, starSystems, colonies, technologies, events } = gameState;
  
  // Only include the last 10 commands and last 10 events
  const commandHistory = gameState.commandHistory.slice(-10);
  const recentEvents = events.slice(-10);
  
  // Use the LLM to process the command
  return {
    gameState: {
      resources,
      starSystems,
      colonies,
      technologies,
      events: recentEvents,
      turnNumber: gameState.turnNumber,
      lastCommand: gameState.lastCommand,
      commandHistory,
      gameTime: gameState.gameTime
    },
    userCommand,
    timestamp: Date.now(),
    sessionId: generateEventId()
  };
};

/**
 * Process a player command and update the game state
 */
export const processCommand = async (gameState, command) => {
  try {
    // Prepare the request for the LLM
    const request = createRequest(gameState, command);
    
    // Send the request to the LLM
    let response;
    try {
      // Try to use the LLM
      response = await processCommandWithLLM(request);
    } catch (error) {
      console.error('LLM processing failed, using fallback:', error);
      
      // If LLM fails, use a fallback processing method
      response = fallbackCommandProcessor(request);
    }
    
    // Update the game state with the command results
    let newState = recordCommand(gameState, command);
    newState = advanceGameTime(newState);
    
    // Apply game state changes from the response
    if (response.gameStateChanges) {
      newState = applyGameStateChanges(newState, response.gameStateChanges);
    }
    
    return {
      newState,
      response,
      offlineMode: !response.isFromLLM
    };
  } catch (error) {
    console.error('Error processing command:', error);
    return {
      error: 'Unable to process your command. Please try again.',
      newState: gameState
    };
  }
};

/**
 * Process command using the LLM
 */
const processCommandWithLLM = async (request) => {
  try {
    // Craft a system prompt for the LLM
    const systemPrompt = `You are the AI game engine for "Stellar Evolution", a text-based space civilization game. 
Players use natural language commands to guide their civilization's development.

Your task is to:
1. Interpret the player's command in the context of the game state
2. Determine the appropriate action type and outcome
3. Generate a narrative response and game state changes
4. Follow the required JSON response format exactly

The game includes exploration, research, construction, colonization, production, diplomacy, management, combat, and special events.
Your responses should be creative but consistent with the existing game state and sci-fi realism.

Always respond with ONLY a valid JSON object following this structure:
{
  "action": {
    "type": "[ACTION_TYPE]",
    "subtype": "[SUBTYPE]",
    "target": "[TARGET_ID]",
    "resources": { "energy": number, "minerals": number, "knowledge": number },
    "timeToComplete": number,
    "success": boolean
  },
  "gameStateChanges": {
    "resources": { "energy": number, "minerals": number, "knowledge": number },
    "facilities": [ new facilities objects ],
    "celestialObjects": [ updated celestial objects ],
    "technologies": { changes to tech tree },
    "events": [ new event objects ]
  },
  "narrative": {
    "mainText": "Main description of the outcome (250-500 chars)",
    "detailText": "Additional context or information (optional)",
    "tone": "[positive/neutral/negative/urgent]",
    "imagePrompt": "Text prompt for image generation"
  }
}

ACTION_TYPE must be one of: EXPLORATION, RESEARCH, CONSTRUCTION, COLONIZATION, PRODUCTION, DIPLOMACY, MANAGEMENT, COMBAT, SPECIAL_EVENT`;

    // Make the LLM request
    const completion = await websim.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify(request),
        }
      ],
      json: true,
    });

    // Parse and validate the response
    const llmResponse = JSON.parse(completion.content);
    llmResponse.isFromLLM = true;
    
    return llmResponse;
  } catch (error) {
    console.error('Error communicating with LLM:', error);
    throw new Error('LLM processing failed');
  }
};

/**
 * Fallback command processor when LLM is unavailable
 */
const fallbackCommandProcessor = (request) => {
  const { userCommand, gameState } = request;
  const command = userCommand.toLowerCase();
  
  // Simple pattern matching for common command types
  let type = 'MANAGEMENT';
  let subtype = 'UNKNOWN';
  let target = null;
  let success = true;
  let mainText = 'Command processed in offline mode.';
  let detailText = 'Full AI processing unavailable. Basic command interpretation applied.';
  let tone = 'neutral';
  let imagePrompt = '';
  
  // Resource changes
  let energyChange = 0;
  let mineralsChange = 0;
  let knowledgeChange = 0;
  
  // Check for exploration commands
  if (command.includes('explore') || command.includes('survey') || command.includes('scan')) {
    type = 'EXPLORATION';
    
    if (command.includes('moon')) {
      subtype = 'CELESTIAL_SURVEY';
      target = 'moon';
      mainText = 'Your survey team has begun mapping the Moon\'s surface. Initial scans reveal a heavily cratered landscape rich in minerals.';
      detailText = 'The low gravity and lack of atmosphere will make future mining operations efficient but will require specialized equipment.';
      imagePrompt = 'detailed scan of Moon surface showing craters and geological features';
      tone = 'positive';
      
      // Exploration costs energy
      energyChange = -50;
    } else if (command.includes('mars')) {
      subtype = 'CELESTIAL_SURVEY';
      target = 'mars';
      mainText = 'Your probes have begun a detailed survey of Mars. Initial data shows evidence of past water flows and potential subsurface ice deposits.';
      detailText = 'The thin atmosphere and rusty regolith present challenges, but the planet has significant potential for resource extraction and possible future terraforming.';
      imagePrompt = 'detailed map of Martian surface showing valleys and potential water features';
      tone = 'positive';
      
      // Exploration costs energy
      energyChange = -75;
    } else {
      subtype = 'LOCAL_SURVEY';
      mainText = 'Your survey teams have conducted a general exploration of the local area, gathering useful but non-specific data.';
      tone = 'neutral';
      energyChange = -25;
    }
  }
  // Check for research commands
  else if (command.includes('research') || command.includes('study') || command.includes('develop')) {
    type = 'RESEARCH';
    
    if (command.includes('solar')) {
      subtype = 'TECHNOLOGY_RESEARCH';
      target = 'solar-power';
      mainText = 'Your scientists have begun researching solar power technologies. They are developing more efficient photovoltaic materials and orbital collection systems.';
      detailText = 'This technology will reduce dependence on fossil fuels and enable sustainable energy production for future space infrastructure.';
      imagePrompt = 'futuristic solar panel array with advanced photovoltaic cells';
      tone = 'positive';
      
      // Research costs knowledge
      knowledgeChange = -150;
    } else if (command.includes('rocket') || command.includes('propulsion')) {
      subtype = 'TECHNOLOGY_RESEARCH';
      target = 'rocket-propulsion';
      mainText = 'Your engineers have started developing advanced rocket propulsion systems. They are testing new fuel mixtures and engine designs.';
      detailText = 'These improvements will significantly enhance your space capabilities, enabling deeper exploration of your star system.';
      imagePrompt = 'advanced rocket engine test firing with blue flame exhaust';
      tone = 'positive';
      
      // Research costs knowledge
      knowledgeChange = -200;
    } else if (command.includes('satellite') || command.includes('network')) {
      subtype = 'TECHNOLOGY_RESEARCH';
      target = 'satellite-networks';
      mainText = 'Your researchers have begun developing an integrated satellite network. They are working on miniaturized components and communication protocols.';
      detailText = 'This technology will enhance global communications, provide detailed planetary monitoring, and serve as infrastructure for future space endeavors.';
      imagePrompt = 'constellation of advanced satellites orbiting Earth with communication beams';
      tone = 'positive';
      
      // Research costs knowledge
      knowledgeChange = -175;
    } else {
      subtype = 'GENERAL_RESEARCH';
      mainText = 'Your scientists have begun a general research initiative. While not focused on a specific technology, this will expand your knowledge base.';
      tone = 'neutral';
      knowledgeChange = -100;
    }
  }
  // Check for construction commands
  else if (command.includes('build') || command.includes('construct') || command.includes('create')) {
    type = 'CONSTRUCTION';
    
    if (command.includes('mine') || command.includes('mining')) {
      subtype = 'MINING_FACILITY';
      target = 'earth';
      mainText = 'Your engineers have begun constructing a new mining facility. Heavy machinery is being moved into position to extract valuable minerals.';
      detailText = 'Once operational, this facility will significantly increase your mineral production capacity.';
      imagePrompt = 'massive mining operation with futuristic excavation vehicles and sorting facilities';
      tone = 'positive';
      
      // Construction costs
      energyChange = -100;
      mineralsChange = -200;
    } else if (command.includes('lab') || command.includes('research')) {
      subtype = 'RESEARCH_LAB';
      target = 'earth';
      mainText = 'Construction of a new research laboratory has begun. Scientists are already setting up specialized equipment and planning experiments.';
      detailText = 'This facility will accelerate your technology development and provide breakthroughs in various scientific fields.';
      imagePrompt = 'advanced research laboratory with scientists working on futuristic equipment';
      tone = 'positive';
      
      // Construction costs
      energyChange = -150;
      mineralsChange = -100;
    } else if (command.includes('power') || command.includes('energy')) {
      subtype = 'POWER_PLANT';
      target = 'earth';
      mainText = 'Construction crews have broken ground on a new power generation facility. Engineers are installing advanced generators and power distribution systems.';
      detailText = 'This facility will boost your energy production, supporting future expansion and technological development.';
      imagePrompt = 'futuristic power plant with glowing energy reactors and transmission towers';
      tone = 'positive';
      
      // Construction costs
      energyChange = -50;
      mineralsChange = -250;
    } else {
      subtype = 'GENERAL_FACILITY';
      target = 'earth';
      mainText = 'Your construction teams have begun building a new facility. The foundation has been laid and framework is being assembled.';
      tone = 'neutral';
      energyChange = -75;
      mineralsChange = -150;
    }
  } else {
    // Default response for unrecognized commands
    mainText = 'Your administration is processing your directive. Initial organizational steps have been taken.';
    detailText = 'The specific outcomes will depend on future clarification and resource allocation.';
    tone = 'neutral';
  }
  
  // Check if we have sufficient resources
  if (
    (gameState.resources.energy + energyChange < 0) ||
    (gameState.resources.minerals + mineralsChange < 0) ||
    (gameState.resources.knowledge + knowledgeChange < 0)
  ) {
    success = false;
    mainText = 'Unable to complete the requested action due to insufficient resources.';
    detailText = `Required: Energy: ${Math.abs(energyChange)}, Minerals: ${Math.abs(mineralsChange)}, Knowledge: ${Math.abs(knowledgeChange)}`;
    tone = 'negative';
    
    // Reset resource changes
    energyChange = 0;
    mineralsChange = 0;
    knowledgeChange = 0;
  }
  
  // Create the response structure
  const response = {
    action: {
      type,
      subtype,
      target,
      resources: {
        energy: energyChange,
        minerals: mineralsChange,
        knowledge: knowledgeChange
      },
      timeToComplete: 4,
      success
    },
    gameStateChanges: {
      resources: {
        energy: energyChange,
        minerals: mineralsChange,
        knowledge: knowledgeChange
      },
      events: [
        {
          id: `event-${Date.now()}`,
          type,
          description: mainText
        }
      ]
    },
    narrative: {
      mainText,
      detailText,
      tone,
      imagePrompt
    },
    isFromLLM: false
  };
  
  return response;
};

/**
 * Apply game state changes from the LLM response
 */
const applyGameStateChanges = (state, changes) => {
  let newState = { ...state };
  
  // Update resources
  if (changes.resources) {
    newState.resources = {
      ...newState.resources,
      energy: newState.resources.energy + (changes.resources.energy || 0),
      minerals: newState.resources.minerals + (changes.resources.minerals || 0),
      knowledge: newState.resources.knowledge + (changes.resources.knowledge || 0),
      population: newState.resources.population + (changes.resources.population || 0)
    };
  }
  
  // Add new facilities if provided
  if (changes.facilities && changes.facilities.length > 0) {
    // Iterate through each new facility
    for (const facility of changes.facilities) {
      // Find the target celestial object
      let targetFound = false;
      
      newState.starSystems = newState.starSystems.map(system => {
        const updatedCelestialObjects = system.celestialObjects.map(object => {
          if (object.id === facility.location) {
            targetFound = true;
            return {
              ...object,
              facilities: [...(object.facilities || []), facility]
            };
          }
          return object;
        });
        
        return {
          ...system,
          celestialObjects: updatedCelestialObjects
        };
      });
      
      // If target wasn't found, log a warning
      if (!targetFound) {
        console.warn(`Facility target location not found: ${facility.location}`);
      }
    }
  }
  
  // Update celestial objects if provided
  if (changes.celestialObjects && changes.celestialObjects.length > 0) {
    for (const updatedObject of changes.celestialObjects) {
      newState.starSystems = newState.starSystems.map(system => {
        const updatedCelestialObjects = system.celestialObjects.map(object => {
          if (object.id === updatedObject.id) {
            return { ...object, ...updatedObject };
          }
          return object;
        });
        
        return {
          ...system,
          celestialObjects: updatedCelestialObjects
        };
      });
    }
  }
  
  // Update technologies if provided
  if (changes.technologies) {
    // Handle research progress
    if (changes.technologies.inProgress) {
      newState.technologies.inProgress = changes.technologies.inProgress;
    }
    
    // Add newly researched technologies
    if (changes.technologies.researched && changes.technologies.researched.length > 0) {
      newState.technologies.researched = [
        ...newState.technologies.researched,
        ...changes.technologies.researched
      ];
      
      // If a technology was completed, remove it from inProgress
      if (newState.technologies.inProgress && 
          changes.technologies.researched.some(tech => tech.id === newState.technologies.inProgress.id)) {
        newState.technologies.inProgress = null;
      }
    }
    
    // Update available technologies
    if (changes.technologies.available) {
      newState.technologies.available = changes.technologies.available;
    }
  }
  
  // Add new events
  if (changes.events && changes.events.length > 0) {
    newState.events = [...newState.events, ...changes.events];
  }
  
  return newState;
};

