const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Search movies by genre with advanced filters.
 * @param {string} genre - The genre to search for (e.g., 'comedy').
 * @param {Object} [options] - Optional query parameters.
 * @param {number} [options.limit] - Limit the number of results (e.g., 50).
 * @param {string} [options.languages] - Filter by languages (e.g., 'hi').
 * @param {number} [options.min_year] - Filter by minimum year (e.g., 2022).
 * @returns {Promise<any>} - The search results from the API.
 */
export const searchByGenre = async (genre, options = {}) => {
  try {
    let url = new URL(`${BASE_URL}/search/genre/${encodeURIComponent(genre)}`);
    
    // Add query parameters if they exist
    Object.keys(options).forEach(key => {
      if (options[key] !== undefined && options[key] !== null) {
        url.searchParams.append(key, options[key]);
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching genre search results:", error);
    throw error;
  }
};
