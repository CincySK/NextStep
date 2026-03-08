import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const navLinks = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "Career Path", path: "/career-path" },
      { name: "College Match", path: "/college-match" },
      { name: "Money Skills", path: "/money-skills" },
      { name: "Study Assistant", path: "/study-assistant" },
      { name: "Dashboard", path: "/dashboard" },
      { name: "My Classes", path: "/classes" }
    ],
    []
  );

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="modern-nav">
      <div className="modern-nav-inner">
        <div className="modern-nav-row">
          <Link to="/" className="modern-nav-brand">
            <div className="modern-nav-logo">
              <span>N</span>
            </div>
            <span className="modern-nav-brand-text">NextStep</span>
          </Link>

          <div className="modern-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`modern-nav-link ${isActive(link.path) ? "modern-nav-link-active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="modern-nav-profile-wrap">
            <button
              type="button"
              onClick={() => setShowProfileMenu((v) => !v)}
              className="modern-nav-profile-btn"
              aria-label="Open profile menu"
            >
              <span className="modern-nav-avatar">U</span>
            </button>

            {showProfileMenu ? (
              <>
                <div className="modern-nav-overlay" onClick={() => setShowProfileMenu(false)} />
                <div className="modern-nav-profile-menu">
                  <button type="button" className="modern-nav-menu-item">Profile</button>
                  <button type="button" className="modern-nav-menu-item">Settings</button>
                  <hr className="modern-nav-divider" />
                  <button type="button" className="modern-nav-menu-item modern-nav-menu-item-danger">Logout</button>
                </div>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setShowMobileMenu((v) => !v)}
            className="modern-nav-mobile-btn"
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? "✕" : "☰"}
          </button>
        </div>

        {showMobileMenu ? (
          <div className="modern-nav-mobile-panel">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setShowMobileMenu(false)}
                className={`modern-nav-mobile-link ${isActive(link.path) ? "modern-nav-mobile-link-active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="modern-nav-divider" />
            <button type="button" className="modern-nav-mobile-action">Profile</button>
            <button type="button" className="modern-nav-mobile-action">Settings</button>
            <button type="button" className="modern-nav-mobile-action modern-nav-menu-item-danger">Logout</button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export default Navigation;
