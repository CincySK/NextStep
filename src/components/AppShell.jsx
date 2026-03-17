import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../auth/useAuth";
import { loadAppData } from "../storage";
import { loadSchoolData } from "../classes/sharedSchoolStore";
import { getCurrentUserId } from "../classes/schoolService";
import UserMenu from "./auth/UserMenu";
import logoSvg from "../assets/nextstep-logo-colored.svg?raw";

function ShellIcon({ name }) {
  const icons = {
    dashboard: (
      <path d="M4 13.5h6.5V20H4v-6.5Zm9.5-9.5H20v8h-6.5V4ZM4 4h6.5v6.5H4V4Zm9.5 11H20V20h-6.5v-5Z" />
    ),
    career: (
      <path d="M12 3.5 4.5 7.3V13c0 4.2 3 8.1 7.5 9 4.5-.9 7.5-4.8 7.5-9V7.3L12 3.5Zm0 4.2a3.3 3.3 0 1 1-.001 6.601A3.3 3.3 0 0 1 12 7.7Zm0 10.9c-1.6-.4-3-1.3-4-2.6.9-1.4 2.4-2.2 4-2.2s3.1.8 4 2.2c-1 1.3-2.4 2.2-4 2.6Z" />
    ),
    college: (
      <path d="M12 4 3 8.5 12 13l7.4-3.7V15H21V8.5L12 4Zm-6 8.2V15c0 2.1 3.1 4 6 4s6-1.9 6-4v-2.8L12 15l-6-2.8Z" />
    ),
    money: (
      <path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5v-9Zm8 2c-1.8 0-3 1.1-3 2.5s1.2 2.5 3 2.5 3 1.1 3 2.5-1.2 2.5-3 2.5m0-10v2m0 14v2" />
    ),
    assistant: (
      <path d="M8 6.5A3.5 3.5 0 0 1 11.5 3h1A3.5 3.5 0 0 1 16 6.5V8h.5A2.5 2.5 0 0 1 19 10.5v4A2.5 2.5 0 0 1 16.5 17H16v1.5a1 1 0 0 1-1.7.7L11.6 17H7.5A2.5 2.5 0 0 1 5 14.5v-4A2.5 2.5 0 0 1 7.5 8H8V6.5Zm2.4 5.5h.01m3.19 0h.01" />
    ),
    classes: (
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v13.2a.3.3 0 0 1-.46.26L12 15.2l-6.54 3.75a.3.3 0 0 1-.46-.26V5.5Zm3 1.5h8m-8 3h8m-8 3h5" />
    ),
    upload: (
      <path d="M12 16V6m0 0 3.5 3.5M12 6 8.5 9.5M6.5 18h11A2.5 2.5 0 0 0 20 15.5v-7A2.5 2.5 0 0 0 17.5 6H16" />
    ),
    students: (
      <path d="M9.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4 18a5.5 5.5 0 0 1 11 0m1.5 0c.2-1.8 1.6-3.2 3.5-3.5" />
    ),
    profile: (
      <path d="M12 12a3.75 3.75 0 1 0 0-7.5A3.75 3.75 0 0 0 12 12Zm0 2c-4.2 0-7 2.2-7 5v1h14v-1c0-2.8-2.8-5-7-5Z" />
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="app-shell-icon">
      {icons[name] ?? icons.dashboard}
    </svg>
  );
}

const studentLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", match: ["/dashboard", "/"] },
  { to: "/career", label: "Career Path", icon: "career", match: ["/career", "/career-path"] },
  { to: "/college", label: "College Match", icon: "college", match: ["/college", "/college-match"] },
  { to: "/money", label: "Money Skills", icon: "money", match: ["/money", "/money-skills"] },
  { to: "/study-assistant", label: "Study Assistant", icon: "assistant", match: ["/study-assistant"] },
  { to: "/classes", label: "My Classes", icon: "classes", match: ["/classes", "/class"] },
  { to: "/profile", label: "Profile", icon: "profile", match: ["/profile"] }
];

const teacherLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", match: ["/dashboard"] },
  { to: "/teacher", label: "Teacher Hub", icon: "career", match: ["/teacher"] },
  { to: "/classes", label: "My Classes", icon: "classes", match: ["/classes", "/class"] },
  { to: "/teacher/upload", label: "Upload Materials", icon: "upload", match: ["/teacher/upload"] },
  { to: "/teacher/students", label: "Students", icon: "students", match: ["/teacher/students"] },
  { to: "/study-assistant", label: "Study Assistant", icon: "assistant", match: ["/study-assistant"] },
  { to: "/profile", label: "Profile", icon: "profile", match: ["/profile"] }
];

function isLinkActive(pathname, matchers = []) {
  return matchers.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function AppShell({ children }) {
  const { user, isAuthenticated, isGuestMode, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const data = loadAppData();
  const school = loadSchoolData();
  const userId = getCurrentUserId(user, isGuestMode);
  const links = isAuthenticated && userRole === "teacher" ? teacherLinks : studentLinks;
  const completedCount = Object.values(data.progress ?? {}).filter(Boolean).length;
  const favoritesCount = data.favorites?.length ?? 0;
  const threadCount = Object.keys(data.studyAssistant?.conversationsByUser?.[userId] ?? {}).length;
  const enrolledCount = (school.studentClasses?.[userId] ?? []).length;
  const taughtCount = (school.teacherClasses?.[userId] ?? []).length;
  const assignmentCount = useMemo(() => {
    const ownedClassIds = userRole === "teacher"
      ? school.teacherClasses?.[userId] ?? []
      : school.studentClasses?.[userId] ?? [];
    return ownedClassIds
      .map((id) => school.classes?.[id])
      .filter(Boolean)
      .reduce((sum, item) => sum + (item.assignmentIds?.length ?? 0), 0);
  }, [school, userId, userRole]);

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? (isGuestMode ? "Guest Explorer" : "Student");
  const firstName = String(displayName).split(" ")[0] || "Student";
  const railActions = userRole === "teacher"
    ? [
        { label: "Create or manage classes", to: "/teacher" },
        { label: "Review uploaded materials", to: "/teacher/upload" },
        { label: "Open class hub", to: "/classes" }
      ]
    : [
        { label: "Continue Career Path", to: "/career" },
        { label: "Ask the Study Assistant", to: "/study-assistant" },
        { label: "Review my classes", to: "/classes" }
      ];

  return (
    <div className="immersive-shell">
      <aside className="immersive-sidebar">
        <NavLink to={isAuthenticated ? "/dashboard" : "/"} className="immersive-brand" aria-label="Go to NextStep home">
          <span className="immersive-brand-logo" dangerouslySetInnerHTML={{ __html: logoSvg }} />
          <span className="immersive-brand-copy">
            <strong className="immersive-brand-title">NextStep</strong>
            <span className="immersive-brand-subtitle">No stops to success</span>
          </span>
        </NavLink>

        <div className="immersive-sidebar-section">
          <p className="immersive-sidebar-label">{isAuthenticated ? `${userRole === "teacher" ? "Teacher" : "Student"} workspace` : "Explore the platform"}</p>
          <nav className="immersive-nav" aria-label="Primary">
            {links.map((link) => {
              const active = isLinkActive(location.pathname, link.match);
              return (
                <NavLink key={link.to} to={link.to} className={`immersive-nav-item ${active ? "immersive-nav-item-active" : ""}`}>
                  <span className="immersive-nav-icon"><ShellIcon name={link.icon} /></span>
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="immersive-sidebar-section">
          <p className="immersive-sidebar-label">Momentum</p>
          <div className="immersive-streak-card">
            <span className="immersive-streak-pill">{completedCount}/3 complete</span>
            <h3>Keep your momentum up, {firstName}.</h3>
            <p>{userRole === "teacher" ? "Grow your classroom toolkit and keep materials flowing." : "One module, one class task, or one AI question keeps your progress moving."}</p>
          </div>
        </div>

        <div className="immersive-sidebar-footer">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="immersive-auth-actions">
              <button className="secondary-btn" onClick={() => navigate("/login")}>Log In</button>
              <button className="primary-btn" onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
          )}
        </div>
      </aside>

      <div className="immersive-main-column">
        <div className="immersive-mobile-brand">
          <NavLink to={isAuthenticated ? "/dashboard" : "/"} className="immersive-brand" aria-label="Go to NextStep home">
            <span className="immersive-brand-logo" dangerouslySetInnerHTML={{ __html: logoSvg }} />
            <span className="immersive-brand-copy">
              <strong className="immersive-brand-title">NextStep</strong>
              <span className="immersive-brand-subtitle">No stops to success</span>
            </span>
          </NavLink>
          {isAuthenticated && <UserMenu />}
        </div>

        <main className="immersive-content">
          {children}
        </main>
      </div>

      <aside className="immersive-rail">
        <article className="rail-card rail-card-profile">
          <p className="rail-kicker">{userRole === "teacher" ? "Teacher status" : "Student status"}</p>
          <h3>{displayName}</h3>
          <p>{isGuestMode ? "Guest mode is active. Save your progress by creating an account." : userRole === "teacher" ? "Manage classes, assignments, and tutoring context." : "Build progress across careers, college, money, and class support."}</p>
        </article>

        <article className="rail-card">
          <div className="rail-card-head">
            <h3>Progress snapshot</h3>
            <span className="rail-badge">{completedCount}/3</span>
          </div>
          <div className="rail-stat-grid">
            <div className="rail-stat">
              <strong>{favoritesCount}</strong>
              <span>Saved items</span>
            </div>
            <div className="rail-stat">
              <strong>{threadCount}</strong>
              <span>AI threads</span>
            </div>
            <div className="rail-stat">
              <strong>{userRole === "teacher" ? taughtCount : enrolledCount}</strong>
              <span>{userRole === "teacher" ? "Classes led" : "Classes joined"}</span>
            </div>
            <div className="rail-stat">
              <strong>{assignmentCount}</strong>
              <span>{userRole === "teacher" ? "Assignments shared" : "Assignments visible"}</span>
            </div>
          </div>
        </article>

        <article className="rail-card">
          <div className="rail-card-head">
            <h3>Recommended next</h3>
            <span className="rail-badge rail-badge-accent">Live</span>
          </div>
          <div className="rail-action-list">
            {railActions.map((action) => (
              <button key={action.to} className="rail-action" onClick={() => navigate(action.to)}>
                {action.label}
              </button>
            ))}
          </div>
        </article>
      </aside>
    </div>
  );
}
