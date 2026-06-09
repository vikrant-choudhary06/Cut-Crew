const BASE_URL = "https://imdbapi-gv4r.onrender.com";

/**
 * Alternative endpoint for movie info mapping to the older JSON schema.
 * @param {string} movieId - The IMDb ID of the movie or show (e.g., 'tt23037654').
 * @returns {Promise<any>} - The movie info from the alternative API endpoint.
 */
export const getMovieInfoFallback = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie_info/${encodeURIComponent(movieId)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching fallback movie info:", error);
    throw error;
  }
};
