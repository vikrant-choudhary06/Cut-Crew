const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Search for movies, TV shows, and people by a string (name) query.
 * @param {string} query - The search query string.
 * @returns {Promise<any>} - The search results from the API.
 */
export const searchByString = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};
