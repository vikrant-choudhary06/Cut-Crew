import { Home, Film, Tv, LayoutGrid, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <h1>CUT CREW</h1>
        </div>
        
        <div className="sidebar-links">
          <Link to="/" className="sidebar-item">
            <Home className="sidebar-icon" />
            <span>home</span>
          </Link>
          <a href="#movies" className="sidebar-item">
            <Film className="sidebar-icon" />
            <span>movies</span>
          </a>
          <a href="#shows" className="sidebar-item">
            <Tv className="sidebar-icon" />
            <span>show</span>
          </a>
          <a href="#genre" className="sidebar-item">
            <LayoutGrid className="sidebar-icon" />
            <span>genre</span>
          </a>
          <a href="#watchlist" className="sidebar-item">
            <Heart className="sidebar-icon" />
            <span>watchlist</span>
          </a>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-profile">
          <User className="profile-icon" />
          <span>PROFILE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
