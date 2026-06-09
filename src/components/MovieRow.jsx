import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MovieRow.css';

const MovieRow = ({ title, fetchFunction, genre, variant = "standard", onGenreClick }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(variant !== "genre");
  const rowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (variant === "genre") return;

    const fetchMovies = async () => {
      try {
        const data = await fetchFunction(genre, { limit: 15 });
        let extractedMovies = [];
        
        if (Array.isArray(data) && Array.isArray(data[0])) {
          extractedMovies = data[0].map(item => item?.node?.title).filter(Boolean);
        } else if (data?.results) {
          extractedMovies = data.results;
        } else if (Array.isArray(data)) {
          extractedMovies = data;
        }

        const formatted = extractedMovies.map(m => ({
          id: m.id,
          title: m.titleText?.text || m.title || "Unknown Title",
          year: m.releaseYear?.year || m.year || "",
          poster_url: m.primaryImage?.url || m.poster_url || m.image || "https://via.placeholder.com/300x450/1c1c24/8e8e93?text=No+Image"
        }));

        setMovies(formatted);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [fetchFunction, genre, title, variant]);

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

  const genresList = [
    { name: "ROMANTIC", color: "#e53e3e", apiGenre: "romance" },
    { name: "THRILLER", color: "#8b5cf6", apiGenre: "thriller" },
    { name: "COMEDY", color: "#06b6d4", apiGenre: "comedy" },
    { name: "ADVENTURE", color: "#f97316", apiGenre: "adventure" }
  ];

  const showRightArrow = (title !== "LATEST RELEASE");

  return (
    <div className="new-movie-row-container">
      {/* Left Column: Title and subtitle */}
      <div className="new-row-left-header">
        <h2 className="new-row-vertical-title">
          {title.split(' ').map((word, idx) => (
            <span key={idx} className="title-word-block">{word}</span>
          ))}
        </h2>
        <span className="new-row-drag-subtitle">DRAG TO NEXT ───&gt;</span>
      </div>

      {/* Right Column: Scrollable cards container */}
      <div className="new-row-right-wrapper">
        <button className="new-slider-arrow left" onClick={() => scroll('left')} aria-label="Scroll left">
          <ChevronLeft size={20} />
        </button>

        <div className="new-movie-row" ref={rowRef}>
          {variant === "genre" ? (
            genresList.map((g, idx) => (
              <div 
                className="new-genre-card" 
                key={idx}
                style={{ backgroundColor: g.color }}
                onClick={() => onGenreClick && onGenreClick(g.apiGenre)}
              >
                <span className="new-genre-card-title">{g.name}</span>
              </div>
            ))
          ) : (
            movies.map((movie, index) => {
              const bgImage = movie.poster_url;
              const movieTitle = movie.title;

              if (variant === "trending") {
                return (
                  <div 
                    className="new-trending-movie-card" 
                    key={movie.id || index}
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <img src={bgImage} alt={movieTitle} className="new-trending-card-poster" loading="lazy" />
                    <div className="new-trending-card-info">
                      <h4 className="new-trending-card-title">{movieTitle}</h4>
                    </div>
                    {index < 4 && <div className="new-trending-rank-overlay">{index + 1}</div>}
                  </div>
                );
              }

              return (
                <div 
                  className="new-latest-movie-card" 
                  key={movie.id || index}
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <img src={bgImage} alt={movieTitle} className="new-latest-card-poster" loading="lazy" />
                  <div className="new-latest-card-info">
                    <h4 className="new-latest-card-title">{movieTitle}</h4>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showRightArrow && (
          <button className="new-slider-arrow right" onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
