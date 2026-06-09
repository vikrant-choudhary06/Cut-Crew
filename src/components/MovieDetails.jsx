import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../call/movieID';
import { Play, ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import gsap from 'gsap';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error("Failed to load details", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && movie && pageRef.current) {
      // GSAP entrance animation on mount
      const tl = gsap.timeline();
      tl.fromTo(".details-main-poster", 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
      tl.fromTo([".details-title", ".details-meta", ".details-genres", ".details-plot", ".details-actions"],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.6"
      );
      tl.fromTo(".details-cast-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }
  }, [loading, movie]);

  if (loading) return <div className="details-loading">Loading Movie Details...</div>;
  if (error) return <div className="details-error">{error}</div>;
  if (!movie) return <div className="details-error">Movie not found.</div>;

  const bgImage = movie.poster_url || "https://via.placeholder.com/1200x800?text=No+Background";

  return (
    <div className="movie-details-page" ref={pageRef}>
      <button className="back-button" onClick={() => navigate(-1)} aria-label="Go Back">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="details-hero">
        <div className="details-hero-bg" style={{ backgroundImage: `url(${bgImage})` }}></div>
        <div className="details-hero-overlay"></div>
        
        <div className="details-hero-content">
          <div className="details-poster-container">
            <img src={bgImage} alt={movie.title} className="details-main-poster" />
          </div>
          
          <div className="details-info-container">
            <h1 className="details-title">{movie.title}</h1>
            
            <div className="details-meta">
              {movie.rating && (
                <span className="imdb-badge">
                  <span className="imdb-logo">IMDb</span>
                  <span className="imdb-rating">{movie.rating}</span>
                </span>
              )}
              {movie.release_year && (
                <span className="meta-item">
                  <Calendar size={18} className="meta-icon" />
                  {movie.release_year}
                </span>
              )}
              {movie.runtime_minutes && (
                <span className="meta-item">
                  <Clock size={18} className="meta-icon" />
                  {movie.runtime_minutes} min
                </span>
              )}
              {movie.certificate && (
                <span className="meta-item certificate">
                  {movie.certificate}
                </span>
              )}
            </div>
            
            {movie.genres && movie.genres.length > 0 && (
              <div className="details-genres">
                {movie.genres.map(g => (
                  <span key={g} className="genre-pill">{g}</span>
                ))}
              </div>
            )}
            
            <p className="details-plot">{movie.plot}</p>
            
            <div className="details-actions">
              {movie.trailer ? (
                <a href={movie.trailer.url} target="_blank" rel="noreferrer" className="action-btn play">
                  <Play size={18} fill="currentColor" />
                  <span>Watch Trailer</span>
                </a>
              ) : (
                <button className="action-btn play disabled">
                  <Play size={18} fill="currentColor" />
                  <span>No Trailer Available</span>
                </button>
              )}
            </div>

            {/* Cast Section */}
            {movie.credits && movie.credits.Stars && movie.credits.Stars.length > 0 && (
              <div className="details-cast-section">
                <h3>Top Cast</h3>
                <div className="cast-list">
                  {movie.credits.Stars.map(star => (
                    <div className="cast-card" key={star.id}>
                      <div className="cast-photo-wrapper">
                        <img 
                          src={star.profile_image || "https://via.placeholder.com/150x150?text=No+Photo"} 
                          alt={star.name} 
                          className="cast-photo"
                        />
                      </div>
                      <span className="cast-name">{star.name}</span>
                      {star.characters && star.characters.length > 0 && (
                        <span className="cast-role">{star.characters[0]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
