// StatusBar.js - Displays resource indicators and game time
import { GameContext } from '../context/GameContext.js';
import { formatGameTime } from '../utilities/helpers.js';

export const StatusBar = () => {
  const { gameState } = React.useContext(GameContext);
  
  if (!gameState) return null;
  
  const { resources, gameTime } = gameState;
  
  // Format the resource value for display
  const formatResourceValue = (value) => {
    // For small values, show the actual number
    if (value < 1000) return value.toFixed(0);
    
    // For thousands
    if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
    
    // For millions
    if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`;
    
    // For billions
    return `${(value / 1000000000).toFixed(1)}B`;
  };
  
  return (
    <div className="status-bar">
      <div className="resources-container">
        <div className="resources-grid">
          {/* Energy */}
          <div className="resource-item">
            <svg className="resource-icon" viewBox="0 0 24 24" width="16" height="16">
              <path d="M13 3L2 14h11l-1 7 11-11H12l1-7z" fill="#f8d848" />
            </svg>
            <span className="resource-value">{formatResourceValue(resources.energy)}</span>
          </div>
          
          {/* Minerals */}
          <div className="resource-item">
            <svg className="resource-icon" viewBox="0 0 24 24" width="16" height="16">
              <path d="M12 2L2 8l10 6 10-6-10-6zM2 14l10 6 10-6M2 20l10 6 10-6" fill="#48a9f8" />
            </svg>
            <span className="resource-value">{formatResourceValue(resources.minerals)}</span>
          </div>
          
          {/* Knowledge */}
          <div className="resource-item">
            <svg className="resource-icon" viewBox="0 0 24 24" width="16" height="16">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#34eb98" strokeWidth="2" />
              <path d="M12 6a2 2 0 100 4 2 2 0 000-4z" fill="#34eb98" />
              <path d="M10 14a2 2 0 114 0" stroke="#34eb98" strokeWidth="2" />
            </svg>
            <span className="resource-value">{formatResourceValue(resources.knowledge)}</span>
          </div>
          
          {/* Population */}
          <div className="resource-item">
            <svg className="resource-icon" viewBox="0 0 24 24" width="16" height="16">
              <circle cx="12" cy="7" r="5" fill="#f89e48" />
              <path d="M17 14H7a6 6 0 00-6 6v2h22v-2a6 6 0 00-6-6z" fill="#f89e48" />
            </svg>
            <span className="resource-value">{formatResourceValue(resources.population)}</span>
          </div>
        </div>
      </div>
      
      <div className="time-indicator">
        <svg className="resource-icon" viewBox="0 0 24 24" width="16" height="16">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="2" />
          <polyline points="12,6 12,12 16,14" fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
        <span>{formatGameTime(gameTime)}</span>
      </div>
    </div>
  );
};

