import React from 'react';
import { Home, Film, Tv, LayoutGrid, Heart, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Cut Crew</h1>
      </div>
      
      <div className="navbar-links">
        <a href="#home" className="nav-item">
          <Home className="nav-icon" />
          <span>Home</span>
        </a>
        <a href="#movies" className="nav-item">
          <Film className="nav-icon" />
          <span>Movies</span>
        </a>
        <a href="#shows" className="nav-item">
          <Tv className="nav-icon" />
          <span>Show</span>
        </a>
        <a href="#genre" className="nav-item">
          <LayoutGrid className="nav-icon" />
          <span>Genre</span>
        </a>
        <a href="#wishlist" className="nav-item">
          <Heart className="nav-icon" />
          <span>Wishlist</span>
        </a>
      </div>

      <div className="navbar-profile">
        <div className="profile-btn">
          <User className="profile-icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
