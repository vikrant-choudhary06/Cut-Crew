import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getMovieDetails } from '../call/movieID';
import { Play, ArrowLeft, Star, Clock, Calendar, X } from 'lucide-react';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

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

  if (loading) return <div className="details-loading">Loading Movie Details...</div>;
  if (error) return <div className="details-error">{error}</div>;
  if (!movie) return <div className="details-error">Movie not found.</div>;

  const bgImage = movie.poster_url || "https://via.placeholder.com/1200x800?text=No+Background";

  return (
    <div className="movie-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={24} />
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
                <span className="meta-item rating">
                  <Star size={18} fill="#f5c518" color="#f5c518" />
                  {movie.rating} / 10
                </span>
              )}
              {movie.release_year && (
                <span className="meta-item">
                  <Calendar size={18} />
                  {movie.release_year}
                </span>
              )}
              {movie.runtime_minutes && (
                <span className="meta-item">
                  <Clock size={18} />
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
                <button className="action-btn play" onClick={() => setShowTrailer(true)}>
                  <Play size={20} fill="black" />
                  <span>Watch Trailer</span>
                </button>
              ) : (
                <button className="action-btn play disabled">
                  <Play size={20} fill="black" />
                  <span>No Trailer</span>
                </button>
              )}
            </div>

            {/* Cast Section */}
            {movie.credits && movie.credits.Stars && (
              <div className="details-cast-section">
                <h3>Top Cast</h3>
                <div className="cast-list">
                  {movie.credits.Stars.map(star => (
                    <div className="cast-card" key={star.id}>
                      <img 
                        src={star.profile_image || "https://via.placeholder.com/150x150?text=No+Photo"} 
                        alt={star.name} 
                        className="cast-photo"
                      />
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

      {showTrailer && movie.trailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <button className="close-modal-btn" onClick={() => setShowTrailer(false)}>
            <X size={32} />
          </button>
          <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
            <ReactPlayer 
              url={movie.trailer.url} 
              playing 
              controls 
              width="100%" 
              height="100%" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
