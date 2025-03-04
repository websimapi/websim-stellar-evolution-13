// TutorialHint.js - Displays tutorial hints for new players
export const TutorialHint = () => {
  const hints = [
    "Try entering commands like 'survey our home planet' or 'research solar energy'.",
    "You can direct your scientists to research new technologies by typing 'research [technology name]'.",
    "Explore your surroundings with commands like 'explore nearby asteroids' or 'send probes to neighboring planets'.",
    "Manage your resources by using commands such as 'build mining facility' or 'construct research lab'.",
    "Use natural language to communicate with your civilization. Be specific about what you want them to do."
  ];
  
  const randomHint = hints[Math.floor(Math.random() * hints.length)];
  
  return (
    <div className="tutorial-hint">
      <strong>Hint:</strong> {randomHint}
    </div>
  );
};

