import { NavLink } from "react-router-dom";
import UserMenu from "./auth/UserMenu";
import { useAuth } from "../auth/useAuth";

const studentLinks = [
  { to: "/", label: "Home" },
  { to: "/career", label: "Career Path" },
  { to: "/college", label: "College Match" },
  { to: "/money", label: "Money Skills" },
  { to: "/study-assistant", label: "Study Assistant" },
  { to: "/classes", label: "My Classes" }
];

const teacherLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/classes", label: "My Classes" },
  { to: "/teacher", label: "Assignments" },
  { to: "/teacher/students", label: "Students" },
  { to: "/teacher/upload", label: "Upload Materials" },
  { to: "/study-assistant", label: "AI Assistant" }
];

export default function Navbar() {
  const { isAuthenticated, isGuestMode, userRole } = useAuth();
  const links = isAuthenticated && userRole === "teacher" ? teacherLinks : studentLinks;

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav container">
        <NavLink to="/" className="brand-wrap brand-wrap-link" aria-label="Go to home">
          <div className="nextstep-logo" aria-label="NextStep">
            <svg
              className="nextstep-logo-mark"
              viewBox="0 0 64 64"
              role="img"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="nextstepMarkGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#312eaa" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
              </defs>
              <path
                fill="url(#nextstepMarkGradInline)"
                d="M4 54h18c16 0 30-10 35-24h-8C45 39 35 46 22 46H4v8Zm0-16h17c8 0 15-3 20-9h-9c-3 1-6 2-11 2H4v7Z"
              />
              <path
                fill="url(#nextstepMarkGradInline)"
                d="M20 18h13v-6l16 12-16 12v-6H20v-12Z"
              />
            </svg>
            <span className="nextstep-logo-text" aria-hidden="true">
              <span className="nextstep-logo-next">Next</span>
              <span className="nextstep-logo-step">Step</span>
            </span>
          </div>
        </NavLink>

        <div className="top-nav-center">
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
          {isAuthenticated && userRole !== "teacher" && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="top-nav-right">
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
