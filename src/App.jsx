import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
