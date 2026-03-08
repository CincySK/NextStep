import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import TeacherDashboard from "../teacher/TeacherDashboard";
import { getCurrentUserId } from "../classes/schoolService";

export default function TeacherPage() {
  const { user, isGuestMode } = useAuth();
  const teacherId = getCurrentUserId(user, isGuestMode);

  if (!teacherId || isGuestMode) {
    return <Navigate to="/login" replace />;
  }

  return <TeacherDashboard teacherId={teacherId} />;
}
