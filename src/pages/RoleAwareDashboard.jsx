import Dashboard from "./Dashboard";
import TeacherPage from "./TeacherPage";
import { useAuth } from "../auth/useAuth";

export default function RoleAwareDashboard({ onRestartOnboarding }) {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated && userRole === "teacher") {
    return <TeacherPage />;
  }

  return <Dashboard onRestartOnboarding={onRestartOnboarding} />;
}
