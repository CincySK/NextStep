import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/career", label: "Career Path" },
  { to: "/college", label: "College Match" },
  { to: "/money", label: "Money Skills" },
  { to: "/dashboard", label: "Dashboard" }
];

export default function Navbar() {
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
        </div>
      </nav>
    </header>
  );
}
