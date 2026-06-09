const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Get currently trending trailers.
 * @param {Object} [options] - Optional query parameters.
 * @param {number} [options.limit] - Number of trailers to return (e.g., 20).
 * @returns {Promise<any>} - The trending trailers data.
 */
export const getTrendingTrailers = async (options = {}) => {
  try {
    let url = new URL(`${BASE_URL}/trending/trailers`);
    
    if (options.limit !== undefined) {
      url.searchParams.append('limit', options.limit);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching trending trailers:", error);
    throw error;
  }
};
