// api.js - Handles API communications and error handling

/**
 * Make an API request to an endpoint
 */
export const makeApiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Generate an image using AI
 */
export const generateImage = async (prompt, options = {}) => {
  try {
    const result = await websim.imageGen({
      prompt,
      aspect_ratio: options.aspect_ratio || "16:9",
      seed: options.seed,
    });
    return result.url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

