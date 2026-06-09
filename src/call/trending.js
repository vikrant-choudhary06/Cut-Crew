const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Get currently trending movies.
 * @param {Object} [options] - Optional query parameters.
 * @param {number} [options.count] - Number of trending movies to return (e.g., 8).
 * @returns {Promise<any>} - The trending movies data.
 */
export const getTrendingMovies = async (options = {}) => {
  try {
    let url = new URL(`${BASE_URL}/trending/movies`);
    
    if (options.count !== undefined) {
      url.searchParams.append('count', options.count);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};
