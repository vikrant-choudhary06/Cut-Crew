import { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import MovieRow from './MovieRow';
import { searchByGenre } from '../call/genre';
import { searchByString } from '../call/string';
import { useNavigate } from 'react-router-dom';

const Home = ({ searchQuery, setSearchQuery }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchByString(searchQuery);
        let list = [];
        // The search API returns either an array of objects or an object containing results
        if (data && data.results) {
          list = data.results;
        } else if (Array.isArray(data)) {
          list = data;
        } else if (data && typeof data === 'object') {
          list = Object.values(data).filter(Array.isArray)[0] || [];
        }
        setSearchResults(list);
      } catch (err) {
        console.error("Failed search:", err);
      } finally {
        setSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleMovieClick = (movieId) => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  if (searchQuery) {
    return (
      <div className="search-results-page" style={{ padding: '2rem 4rem' }}>
        <div className="search-results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="search-title" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff' }}>Search Results for "{searchQuery}"</h2>
          <button 
            className="clear-search-btn" 
            onClick={() => setSearchQuery('')}
            style={{ padding: '0.5rem 1.2rem', backgroundColor: 'var(--accent-color)', color: '#fff', borderRadius: '8px', fontWeight: '600' }}
          >
            Clear Search
          </button>
        </div>
        {searching ? (
          <div className="search-loading" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', padding: '2rem 0' }}>Searching movies...</div>
        ) : searchResults.length === 0 ? (
          <div className="search-no-results" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', padding: '2rem 0' }}>No movies found matching your search.</div>
        ) : (
          <div className="search-results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {searchResults.map((movie) => {
              const bgImage = movie?.primaryImage?.url || movie?.poster_url || movie?.image || "https://via.placeholder.com/220x330/27272a/a1a1aa?text=No+Image";
              const movieTitle = movie?.titleText?.text || movie?.title || "Unknown Title";
              return (
                <div 
                  className="movie-card" 
                  key={movie?.id || Math.random()}
                  onClick={() => handleMovieClick(movie?.id)}
                  style={{ width: '100%', height: '300px', cursor: 'pointer', position: 'relative', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--card-bg)' }}
                >
                  <img src={bgImage} alt={movieTitle} className="movie-poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div className="movie-info" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1rem 1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                    <h4 className="movie-card-title" style={{ color: '#fff', fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{movieTitle}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      
      {/* Redesigned content rows to align with mockup categories */}
      <div className="home-rows-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', backgroundColor: '#0c0c0e' }}>
        <MovieRow 
          title="Action & Adventure" 
          fetchFunction={searchByGenre} 
          genre="action" 
          variant="action"
        />
        <MovieRow 
          title="Comedy" 
          fetchFunction={searchByGenre} 
          genre="comedy" 
          variant="comedy"
        />
        <MovieRow 
          title="Drama Series" 
          fetchFunction={searchByGenre} 
          genre="drama" 
          variant="drama"
        />
        <MovieRow 
          title="Horror & Thriller" 
          fetchFunction={searchByGenre} 
          genre="horror" 
          variant="horror"
        />
      </div>
    </>
  );
};

export default Home;
