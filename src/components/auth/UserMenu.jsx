import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Student";

  async function handleLogout() {
    await signOut();
    setOpen(false);
    navigate("/", { replace: true });
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    }
    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="user-avatar">{displayName.slice(0, 1).toUpperCase()}</span>
        <span>{displayName}</span>
      </button>
      {open && (
        <div className="user-dropdown" role="menu">
          <Link to="/dashboard" className="user-link" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/profile" className="user-link" onClick={() => setOpen(false)}>Profile</Link>
          <button type="button" className="user-link user-link-button" onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </div>
  );
}
