import { NavLink } from "react-router-dom";
import UserMenu from "./auth/UserMenu";
import { useAuth } from "../auth/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/career", label: "Career Path" },
  { to: "/college", label: "College Match" },
  { to: "/money", label: "Money Skills" },
  { to: "/study-assistant", label: "Study Assistant" }
];

export default function Navbar() {
  const { isAuthenticated, isGuestMode } = useAuth();

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav container">
        <div className="brand-wrap">
          <div className="brand">NextStep</div>
          <p className="brand-subtitle">Future Planning for Students</p>
        </div>
        <div className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              Dashboard
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/classes" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              My Classes
            </NavLink>
          )}
          {!isAuthenticated && !isGuestMode && (
            <>
              <NavLink to="/login" className="nav-link nav-link-auth">Log in</NavLink>
              <NavLink to="/signup" className="nav-link nav-link-cta">Sign up</NavLink>
            </>
          )}
          {!isAuthenticated && isGuestMode && (
            <>
              <NavLink to="/signup" className="nav-link nav-link-cta">Create account</NavLink>
            </>
          )}
          {isAuthenticated && <UserMenu />}
        </div>
      </nav>
    </header>
  );
}
