const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Get video IDs and metadata from a title's video gallery.
 * @param {string} titleId - The ID of the title (e.g., 'tt0468569').
 * @param {Object} [options] - Optional query parameters.
 * @param {number} [options.limit] - Limit the number of videos (e.g., 10).
 * @returns {Promise<any>} - The gallery videos data.
 */
export const getGalleryVideos = async (titleId, options = {}) => {
  try {
    let url = new URL(`${BASE_URL}/videos/${encodeURIComponent(titleId)}`);
    
    if (options.limit !== undefined) {
      url.searchParams.append('limit', options.limit);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching gallery videos:", error);
    throw error;
  }
};
