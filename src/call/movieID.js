const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Get full movie/show details by its IMDb ID.
 * @param {string} movieId - The IMDb ID of the movie or show (e.g., 'tt0468569').
 * @returns {Promise<any>} - The full details of the movie/show from the API.
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${encodeURIComponent(movieId)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
