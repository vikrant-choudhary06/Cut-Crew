const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Check where a title is streaming.
 * @param {string} titleId - The ID of the title (e.g., 'tt0468569').
 * @returns {Promise<any>} - The streaming availability data.
 */
export const checkStreamingAvailability = async (titleId) => {
  try {
    const response = await fetch(`${BASE_URL}/streaming/${encodeURIComponent(titleId)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error checking streaming availability:", error);
    throw error;
  }
};
