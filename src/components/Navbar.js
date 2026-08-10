import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

/* `to` = real route, `href` = in-page anchor */
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: ' VIP Holistic Healing', href: '#vip-holistic-healing' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = ({ visible }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${visible ? 'navbar--visible' : ''}`}>
      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map(({ label, to, href }) => (
          <li key={label} className="navbar__item">
            {to ? (
              <Link to={to} className="navbar__link">
                {label}
              </Link>
            ) : (
              <a href={href} className="navbar__link">
                {label}
              </a>
            )}
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
