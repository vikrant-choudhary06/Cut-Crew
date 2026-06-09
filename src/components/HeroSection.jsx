import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingMovies } from '../call/trending';
import { searchByGenre } from '../call/genre';
import { getMovieDetails } from '../call/movieID';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import './HeroSection.css';

const FALLBACK_MOVIES = [
  {
    id: "tt12145918",
    title: "JYOTSNA",
    subtitle: "BEDER MEYE",
    presenter: "STAR FOX ENTERTAINMENT PRESENTS",
    rating: "8.4",
    release_year: 2019,
    runtime: "2h 7m",
    language: "Bengali",
    genres: ["Sci-Fi", "Adventure"],
    plot: "A joyride at a wildlife amusement park, which contains cloned dinosaurs, soon becomes a horrifying experience.",
    poster_url: "https://m.media-amazon.com/images/M/MV5BZWYxN2M3MzQtZWRlMC00MTRjLWFlNGQtMDA0ZGQxNTcwNDNjXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: "tt1877830",
    title: "THE BATMAN",
    rating: "4.8",
    release_year: 2022,
    runtime: "2h 56m",
    language: "English",
    genres: ["Fantasy", "Action"],
    plot: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
    poster_url: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiYTUtYjA0OC00Y2Q5LWIzNDUtZDU3MDI3YWMzOTM3XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg"
  },
  {
    id: "tt2306299",
    title: "VIKINGS",
    rating: "4.6",
    release_year: 2013,
    runtime: "45m",
    language: "English",
    genres: ["Action", "Drama"],
    plot: "Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer.",
    poster_url: "https://m.media-amazon.com/images/M/MV5BOTFmZmExYTEtYmE0Mi00MzRmLWE4ZDYtOThiNzNlOTIyODljXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: "tt0120157",
    title: "ULTIMATE SOLDIER SABOO",
    rating: "4.9",
    release_year: 1998,
    runtime: "2h 15m",
    language: "English",
    genres: ["Action", "Thriller"],
    plot: "The ultimate soldier embark on a deadly rescue mission in the hostile territory of enemy lines.",
    poster_url: "https://m.media-amazon.com/images/M/MV5BZjY2ZDg4ZTktNDU2Zi00NzA0LThlZDktZjUwOTQwMDgyZjhjXkEyXkFqcGc@._V1_.jpg"
  },
  {
    id: "tt1190634",
    title: "THE BOYS",
    rating: "8.7",
    release_year: 2019,
    runtime: "1h",
    language: "English",
    genres: ["Action", "Comedy", "Drama"],
    plot: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
    poster_url: "https://m.media-amazon.com/images/M/MV5BMzFiYjEzNTMtYTY4NS00MzFhLWIyMjQtYTlhMDcwMDNlZDFkXkEyXkFqcGc@._V1_.jpg"
  }
];

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [activeDetails, setActiveDetails] = useState(null);
  const navigate = useNavigate();

  // Helper function to format minutes (e.g. 108) to hours/mins (e.g. 1h 48m)
  const formatRuntime = (minutes) => {
    if (!minutes) return "2h 7m";
    const mins = parseInt(minutes, 10);
    if (isNaN(mins)) return minutes;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;
  };

  // Fetch trending movies on mount, fall back to genre search if trending is broken
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        let sortedFetched = [];
        try {
          const data = await getTrendingMovies({ count: 10 });
          sortedFetched = data?.trending_movies || data?.results || [];
        } catch (err) {
          console.warn("Trending API failed, falling back to genre search:", err);
        }

        // Backup plan: call searchByGenre if trending returns empty or fails
        if (sortedFetched.length === 0) {
          try {
            const data = await searchByGenre('action', { limit: 15 });
            if (Array.isArray(data) && Array.isArray(data[0])) {
              sortedFetched = data[0].map(item => item?.node?.title).filter(Boolean);
            } else if (data?.results) {
              sortedFetched = data.results;
            } else if (Array.isArray(data)) {
              sortedFetched = data;
            }
          } catch (genreErr) {
            console.error("Genre fallback failed too:", genreErr);
          }
        }

        // Standardize the API results
        const formattedFetched = sortedFetched.filter(Boolean).map(m => ({
          id: m.id || m.node?.title?.id || "",
          title: m.title || m.titleText?.text || m.name || "Unknown Title",
          release_year: m.release_year || m.year || m.releaseYear?.year || "2024",
          runtime: m.runtime || (m.runtime_minutes ? `${m.runtime_minutes}m` : "2h 7m"),
          language: m.languages?.[0] || m.language || "English",
          genres: Array.isArray(m.genres) ? m.genres : (m.genres?.genres ? m.genres.genres.map(g => g.text) : ["Action"]),
          plot: m.plot || "A featured movie presentation.",
          poster_url: m.poster_url || m.primaryImage?.url || m.image || ""
        })).filter(m => m.poster_url && m.id);

        const combined = [
          ...formattedFetched,
          ...FALLBACK_MOVIES
        ];
        
        const unique = [];
        const seen = new Set();
        for (const m of combined) {
          const t = (m.title || "").toUpperCase();
          if (t && !seen.has(t)) {
            seen.add(t);
            unique.push(m);
          }
        }

        setMovies(unique.slice(0, 10));
      } catch (error) {
        console.error("Failed to load trending movies", error);
        setMovies(FALLBACK_MOVIES);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Fetch trailer and details for current movie
  useEffect(() => {
    if (movies.length === 0) return;

    const activeMovie = movies[currentIndex];
    if (!activeMovie) return;

    let isMounted = true;
    setActiveDetails(null); // Reset when current index changes

    const fetchDetailsAndTrailer = async () => {
      setVideoLoading(true);
      setTrailerUrl(null); // Clear previous trailer
      try {
        const isMockup = ["tt12145918", "tt1877830", "tt2306299", "tt0120157", "tt1190634"].includes(activeMovie.id);
        if (activeMovie.id && !isMockup) {
          const details = await getMovieDetails(activeMovie.id);
          if (isMounted) {
            if (details) {
              setActiveDetails(details);
              if (details.trailer?.url) {
                setTrailerUrl(details.trailer.url);
              }
            }
          }
        } else {
          setActiveDetails(activeMovie);
        }
      } catch (err) {
        console.error("Failed to fetch movie details or trailer:", err);
      } finally {
        if (isMounted) setVideoLoading(false);
      }
    };

    fetchDetailsAndTrailer();

    return () => {
      isMounted = false;
    };
  }, [currentIndex, movies]);

  // Auto-slide timer: transitions every 8 seconds
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      nextMovie();
    }, 8000);

    return () => clearInterval(interval);
  }, [movies, currentIndex]);

  const handleMovieClick = () => {
    const movie = movies[currentIndex];
    if (movie && movie.id) {
      navigate(`/movie/${movie.id}`);
    }
  };

  const selectMovie = (index) => {
    setCurrentIndex(index);
  };

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  if (loading) {
    return <div className="hero-loading">Loading featured movies...</div>;
  }

  if (movies.length === 0) {
    return <div className="hero-loading">No featured movies found.</div>;
  }

  const movie = movies[currentIndex];
  const bgImage = movie?.poster_url || "";
  const title = movie?.title || "Unknown Title";

  // Dynamic presenter mapping (Director name + PRESENTS)
  let presenter = "STAR FOX ENTERTAINMENT PRESENTS";
  if (activeDetails?.credits?.Director?.[0]?.name) {
    presenter = `${activeDetails.credits.Director[0].name.toUpperCase()} PRESENTS`;
  } else if (movie?.presenter) {
    presenter = movie.presenter;
  }

  // Dynamic subtitle mapping (first genre)
  let subtitle = "ACTION";
  if (activeDetails?.genres?.[0]) {
    subtitle = activeDetails.genres[0].toUpperCase();
  } else if (movie?.subtitle) {
    subtitle = movie.subtitle.toUpperCase();
  } else if (movie?.genres?.[0]) {
    subtitle = movie.genres[0].toUpperCase();
  }
  
  const yearVal = activeDetails?.release_year || movie?.release_year || "2023";

  // Dynamic runtime formatting
  let durationVal = "2h 7m";
  if (activeDetails?.runtime_minutes) {
    durationVal = formatRuntime(activeDetails.runtime_minutes);
  } else if (movie?.runtime) {
    durationVal = movie.runtime;
  }

  // Dynamic language mapping
  let languageVal = "English";
  if (activeDetails?.languages && activeDetails.languages.length > 0) {
    languageVal = activeDetails.languages.length > 1 ? "Multi Language" : activeDetails.languages[0];
  } else if (movie?.language) {
    languageVal = movie.language;
  }

  // Dynamic genres formatting
  let genreVal = "Sci-Fi / Adventure";
  if (activeDetails?.genres && activeDetails.genres.length > 0) {
    genreVal = activeDetails.genres.join(' / ');
  } else if (Array.isArray(movie?.genres)) {
    genreVal = movie.genres.join(' / ');
  }

  const plotVal = activeDetails?.plot || movie?.plot || "A movie preview.";

  // Get preview movies (4 cards bottom-right of the main backdrop)
  const getPreviewMovies = () => {
    return movies.slice(0, 4).map((m, idx) => ({ movie: m, index: idx }));
  };

  return (
    <div className="hero-section">
      {/* Backdrop image is the clean cover layer */}
      <div className="hero-blur-bg" style={{ backgroundImage: `url(${bgImage})` }}></div>
      
      {/* Background trailer video overlay when available */}
      {trailerUrl && (
        <video 
          key={trailerUrl}
          src={trailerUrl} 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="hero-bg-video"
        />
      )}
      
      <div className="hero-blur-overlay"></div>
      
      <div className="hero-content-container">
        {/* Left Movie Meta and Details */}
        <div className="hero-details">
          {presenter && <span className="hero-presenter">{presenter}</span>}
          {subtitle && <h2 className="hero-subtitle">{subtitle}</h2>}
          <h1 className="hero-title">{title}</h1>
          
          {/* Metadata row */}
          <div className="hero-metadata">
            <span>{yearVal}</span>
            <span className="dot">•</span>
            <span>{durationVal}</span>
            <span className="dot">•</span>
            <span>{languageVal}</span>
            <span className="dot">•</span>
            <span>{genreVal}</span>
          </div>

          {/* <p className="hero-plot">{plotVal}</p> */}
        </div>

        {/* Bottom Actions Row: Navigation, Play, and Previews */}
        <div className="hero-actions-row">
          {/* Slide Arrow Navigation Bottom Left */}
          <div className="hero-nav-arrows">
            <button className="hero-nav-arrow-btn" onClick={prevMovie} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button className="hero-nav-arrow-btn" onClick={nextMovie} aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Center Play Button and Streaming Text */}
          <div className="hero-streaming-action" onClick={handleMovieClick}>
            <button className="play-circle-btn" aria-label="Play">
              <Play fill="#fff" size={24} className="play-icon" style={{ transform: 'translateX(2px)' }} />
            </button>
            <span className="streaming-text">STREAMING NOW</span>
          </div>

          {/* Embedded Thumbnail Previews (4 horizontal cards bottom-right) */}
          <div className="hero-bottom-previews">
            {getPreviewMovies().map(({ movie: m, index }) => {
              const mPoster = m.poster_url || "https://via.placeholder.com/150";
              return (
                <div 
                  className={`preview-card ${currentIndex === index ? 'active' : ''}`}
                  key={m.id || index}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectMovie(index);
                  }}
                >
                  <img src={mPoster} alt={m.title} className="preview-card-img" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side Vertical Indicators */}
      <div className="hero-vertical-indicators">
        {Array.from({ length: Math.min(movies.length, 5) }).map((_, i) => (
          <div 
            key={i} 
            className={`indicator-line ${currentIndex % Math.min(movies.length, 5) === i ? 'active' : ''}`}
            onClick={() => selectMovie(i)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

