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
          {isAuthenticated && userRole !== "teacher" && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              Dashboard
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
