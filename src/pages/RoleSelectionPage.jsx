import { Navigate, useNavigate } from "react-router-dom";
import RoleCard from "../components/auth/RoleCard";
import { useAuth } from "../auth/useAuth";

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { chooseRole, isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  function handleSelect(role) {
    chooseRole(role);
    navigate("/login", { replace: true });
  }

  return (
    <section className="auth-shell">
      <article className="auth-card role-select-shell auth-card-enter">
        <p className="quiz-flow-label">Choose Role</p>
        <h1>How will you use NextStep?</h1>
        <p>Select your role to continue to login or account creation.</p>
        <div className="role-card-grid">
          <RoleCard
            icon="S"
            title="Student"
            description="Explore careers, discover colleges, get AI tutoring help, and join classes."
            buttonLabel="Continue as Student"
            onClick={() => handleSelect("student")}
          />
          <RoleCard
            icon="T"
            title="Teacher"
            description="Create classes, upload assignments, and help students learn with AI-powered support."
            buttonLabel="Continue as Teacher"
            onClick={() => handleSelect("teacher")}
          />
        </div>
      </article>
    </section>
  );
}
