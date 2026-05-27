import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ visible }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = ['Home', 'About', 'Services', 'Resources', 'Contact'];

  return (
    <nav className={`navbar ${visible ? 'navbar--visible' : ''}`}>
      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link} className="navbar__item">
            <a href={`#${link.toLowerCase()}`} className="navbar__link">
              {link}
            </a>
          </li>
        ))}
      </ul>

      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
};

export default Navbar;
