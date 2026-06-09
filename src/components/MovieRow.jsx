import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MovieRow.css';

const MovieRow = ({ title, fetchFunction, genre }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchFunction(genre, { limit: 20 });
        
        // The API returns an array where the first element is the list of nodes
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const extractedMovies = data[0].map(item => item?.node?.title).filter(Boolean);
          setMovies(extractedMovies);
        } else if (data?.results) {
           setMovies(data.results);
        } else {
           setMovies([]);
        }
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [fetchFunction, genre, title]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleMovieClick = (movieId) => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  if (loading) return <div className="row-loading">Loading {title}...</div>;
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row-container">
      <h2 className="row-title">{title}</h2>
      <div className="row-wrapper">
        <button className="slider-arrow left" onClick={() => scroll('left')}>
          <ChevronLeft size={32} />
        </button>
        
        <div className="movie-row" ref={rowRef}>
          {movies.map((movie) => {
            const bgImage = movie?.primaryImage?.url || movie?.poster_url || movie?.image || "https://via.placeholder.com/220x330/27272a/a1a1aa?text=No+Image";
            const movieTitle = movie?.titleText?.text || movie?.title || "Unknown Title";
            
            return (
              <div 
                className="movie-card" 
                key={movie?.id || Math.random()}
                onClick={() => handleMovieClick(movie?.id)}
              >
                <img src={bgImage} alt={movieTitle} className="movie-poster" loading="lazy" />
                <div className="movie-info">
                  <h4 className="movie-card-title">{movieTitle}</h4>
                </div>
              </div>
            );
          })}
        </div>

        <button className="slider-arrow right" onClick={() => scroll('right')}>
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
