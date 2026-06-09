import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Tv, LayoutGrid, Heart, User, Sidebar as SidebarIcon } from 'lucide-react';
import logoCrew from '../assets/logo-crew.png';
import './Sidebar.css';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="logo-wrapper-relative">
          <Link to="/" className="logo-link">
            <img src={logoCrew} className="logo-img" alt="Cut Crew Logo" />
          </Link>
          <button 
            className="collapse-toggle-btn" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarIcon size={18} />
          </button>
        </div>
        {!collapsed && (
          <Link to="/" className="logo-text-link">
            <span className="logo-text">crew</span>
          </Link>
        )}
      </div>

      <div className="sidebar-links-container">
        <div className="sidebar-links">
          <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
            <Home className="sidebar-icon" />
            {!collapsed && <span>Home</span>}
          </Link>
          <a href="#movies" className="sidebar-item">
            <Film className="sidebar-icon" />
            {!collapsed && <span>Movies</span>}
          </a>
          <a href="#shows" className="sidebar-item">
            <Tv className="sidebar-icon" />
            {!collapsed && <span>Show</span>}
          </a>
          <a href="#genre" className="sidebar-item">
            <LayoutGrid className="sidebar-icon" />
            {!collapsed && <span>Genre</span>}
          </a>
          <a href="#watchlist" className="sidebar-item">
            <Heart className="sidebar-icon" />
            {!collapsed && <span>Watchlist</span>}
          </a>
        </div>
      </div>

      <div className="sidebar-bottom">
        <button className="profile-btn-white" aria-label="Profile">
          <User className="profile-btn-icon" size={20} />
          {!collapsed && <span className="profile-btn-text">PROFILE</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
