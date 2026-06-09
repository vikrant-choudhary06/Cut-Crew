import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingMovies } from '../call/trending';
import { Play, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingMovies({ count: 10 });
        const moviesList = data?.trending_movies || data?.results || [];
        
        if (moviesList && moviesList.length > 0) {
          setMovies(moviesList.slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to load trending movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleMovieClick = () => {
    const movie = movies[currentIndex];
    if (movie && movie.id) {
      navigate(`/movie/${movie.id}`);
    }
  };

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  if (loading) {
    return <div className="hero-loading">Loading trending 10 movies...</div>;
  }

  if (movies.length === 0) {
    return <div className="hero-loading">No trending movies found.</div>;
  }

  const movie = movies[currentIndex];
  const bgImage = movie?.poster_url || movie?.image || "";
  const title = movie?.title || movie?.original_title || "Unknown Title";
  const description = movie?.plot || movie?.overview || "No description available for this trending title.";

  return (
    <div 
      className="hero-section" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-description">
          {description.length > 180 ? description.slice(0, 180) + '...' : description}
        </p>
        <div className="hero-buttons">
          <button className="btn-play" onClick={handleMovieClick}>
            <Play className="btn-icon" fill="currentColor" /> Play
          </button>
          <button className="btn-info" onClick={handleMovieClick}>
            <Info className="btn-icon" /> More Info
          </button>
        </div>
      </div>

      <div className="hero-controls">
        <button className="control-btn" onClick={prevMovie}>
          <ArrowLeft size={28} />
        </button>
        <button className="control-btn" onClick={nextMovie}>
          <ArrowRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
