import HeroSection from './HeroSection';
import MovieRow from './MovieRow';
import { searchByGenre } from '../call/genre';

const Home = () => {
  return (
    <>
      <HeroSection />
      
      {/* Overlapping Content Rows */}
      <div style={{ marginTop: '-120px', position: 'relative', zIndex: 10, paddingBottom: '3rem' }}>
        <MovieRow 
          title="Action & Adventure" 
          fetchFunction={searchByGenre} 
          genre="action" 
        />
        <MovieRow 
          title="Comedy" 
          fetchFunction={searchByGenre} 
          genre="comedy" 
        />
        <MovieRow 
          title="Drama Series" 
          fetchFunction={searchByGenre} 
          genre="drama" 
        />
        <MovieRow 
          title="Horror & Thriller" 
          fetchFunction={searchByGenre} 
          genre="horror" 
        />
      </div>
    </>
  );
};

export default Home;
