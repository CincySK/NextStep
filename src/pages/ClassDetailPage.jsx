import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import ClassPage from "../classes/ClassPage";
import { loadSchoolData } from "../classes/sharedSchoolStore";
import { canAccessClass, canManageClass, getCurrentUserId } from "../classes/schoolService";

export default function ClassDetailPage() {
  const { classId } = useParams();
  const { user, isGuestMode } = useAuth();
  const userId = getCurrentUserId(user, isGuestMode);
  const school = loadSchoolData();

  const classObj = classId ? school.classes?.[classId] : null;
  const assignments = useMemo(
    () =>
      (classObj?.assignmentIds ?? [])
        .map((id) => school.assignments?.[id])
        .filter(Boolean),
    [classObj?.assignmentIds, school.assignments]
  );

  if (!userId) return <Navigate to="/login" replace />;
  if (!classObj) return <ClassPage classObj={null} assignments={[]} canManage={false} />;

  const hasAccess = canAccessClass({ school, classId, userId });
  const canManage = canManageClass({ school, classId, userId });

  if (!hasAccess) {
    return (
      <section className="section-card module-card">
        <h2>Access restricted</h2>
        <p>You need to join this class first.</p>
      </section>
    );
  }

  return <ClassPage classObj={classObj} assignments={assignments} canManage={canManage} />;
}
