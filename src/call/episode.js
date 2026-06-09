const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Get all episodes for a specific TV show/series.
 * @param {string} seriesId - The ID of the TV show/series (e.g., 'tt0944947').
 * @returns {Promise<any>} - The episodes data.
 */
export const getSeasonEpisodes = async (seriesId) => {
  try {
    const response = await fetch(`${BASE_URL}/title/${encodeURIComponent(seriesId)}/episodes`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching season episodes:", error);
    throw error;
  }
};
