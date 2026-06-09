import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, FileText, Bell, X } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  return (
    <header className={`navbar ${isMobileSearchActive ? 'mobile-search-active' : ''}`}>
      {!isMobileSearchActive ? (
        <>
          <div className="navbar-left">
            <div className="history-arrows">
              <button className="arrow-btn" onClick={() => navigate(-1)} aria-label="Go Back">
                <ChevronLeft size={20} />
              </button>
              <button className="arrow-btn" onClick={() => navigate(1)} aria-label="Go Forward">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="search-container desktop-search">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search everything" 
                className="search-input" 
                value={searchQuery}
                onChange={(e) => {
                  // If not on homepage, navigate to homepage to display search results
                  if (window.location.pathname !== '/') {
                    navigate('/');
                  }
                  setSearchQuery(e.target.value);
                }}
              />
              <button className="filter-btn" aria-label="Filters">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          <div className="navbar-right">
            <button 
              className="nav-action-btn mobile-search-trigger" 
              onClick={() => setIsMobileSearchActive(true)}
              aria-label="Open Search"
            >
              <Search size={20} />
            </button>

            <button className="nav-action-btn activity-btn" aria-label="Activity">
              <FileText size={20} />
            </button>
            <button className="nav-action-btn notify" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="navbar-profile-avatar">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60" 
                alt="User Profile" 
                className="profile-img"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="mobile-search-overlay">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="search-input mobile-search-input" 
            autoFocus
            value={searchQuery}
            onChange={(e) => {
              if (window.location.pathname !== '/') {
                navigate('/');
              }
              setSearchQuery(e.target.value);
            }}
          />
          <button 
            className="close-search-btn" 
            onClick={() => {
              setIsMobileSearchActive(false);
              setSearchQuery('');
            }}
            aria-label="Close Search"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
