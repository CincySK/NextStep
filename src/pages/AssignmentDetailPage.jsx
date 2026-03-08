import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import AssignmentPage from "../classes/AssignmentPage";
import { loadSchoolData } from "../classes/sharedSchoolStore";
import { canAccessClass, getCurrentUserId } from "../classes/schoolService";

export default function AssignmentDetailPage() {
  const { classId, assignmentId } = useParams();
  const { user, isGuestMode } = useAuth();
  const userId = getCurrentUserId(user, isGuestMode);
  const school = loadSchoolData();

  if (!userId) return <Navigate to="/login" replace />;

  const classObj = classId ? school.classes?.[classId] : null;
  const assignment = assignmentId ? school.assignments?.[assignmentId] : null;
  const hasAccess = canAccessClass({ school, classId, userId });

  if (!hasAccess) {
    return (
      <section className="section-card module-card">
        <h2>Access restricted</h2>
        <p>You need class access to view this assignment.</p>
      </section>
    );
  }

  return <AssignmentPage classObj={classObj} assignment={assignment} documents={school.documents} />;
}
