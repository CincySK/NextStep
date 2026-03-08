import { useMemo, useState } from "react";
import { useAuth } from "../auth/useAuth";
import ClassDashboard from "../classes/ClassDashboard";
import { loadSchoolData } from "../classes/sharedSchoolStore";
import { getCurrentUserId } from "../classes/schoolService";

export default function ClassesPage() {
  const { user, isGuestMode } = useAuth();
  const userId = getCurrentUserId(user, isGuestMode);
  const [school, setSchool] = useState(() => loadSchoolData());

  const teachingClasses = useMemo(
    () =>
      (school.teacherClasses?.[userId] ?? [])
        .map((id) => school.classes?.[id])
        .filter(Boolean),
    [school, userId]
  );

  const enrolledClasses = useMemo(
    () =>
      (school.studentClasses?.[userId] ?? [])
        .map((id) => school.classes?.[id])
        .filter(Boolean),
    [school, userId]
  );

  if (!userId) {
    return (
      <section className="section-card module-card">
        <h2>My Classes</h2>
        <p>Sign in to join classes and access coursework materials.</p>
      </section>
    );
  }

  return (
    <ClassDashboard
      userId={userId}
      enrolledClasses={enrolledClasses}
      teachingClasses={teachingClasses}
      onRefresh={() => setSchool(loadSchoolData())}
    />
  );
}
