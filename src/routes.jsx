import React from "react";
import { createHashRouter } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboardDemo from "./pages/TeacherDashboardDemo";
import StudyAssistantDemo from "./pages/StudyAssistantDemo";
import ClassDetail from "./pages/ClassDetail";
import ClassesList from "./pages/ClassesList";
import PlaceholderPage from "./pages/PlaceholderPage";
import DesignSystem from "./pages/DesignSystem";

const placeholderIcon = (label) => (
  <div
    style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      display: "grid",
      placeItems: "center",
      color: "white",
      background: "linear-gradient(135deg, var(--primary), var(--secondary))",
      fontSize: 14,
      fontWeight: 700
    }}
  >
    {label}
  </div>
);

export const router = createHashRouter([
  {
    path: "/",
    Component: RoleSelection
  },
  {
    path: "/dashboard",
    Component: StudentDashboard
  },
  {
    path: "/teacher-dashboard",
    Component: TeacherDashboardDemo
  },
  {
    path: "/teacher/dashboard",
    Component: TeacherDashboardDemo
  },
  {
    path: "/study-assistant",
    Component: StudyAssistantDemo
  },
  {
    path: "/class/:id",
    Component: ClassDetail
  },
  {
    path: "/classes",
    Component: ClassesList
  },
  {
    path: "/design-system",
    Component: DesignSystem
  },
  {
    path: "/career-path",
    Component: () => (
      <PlaceholderPage
        title="Career Path Quiz"
        description="Discover careers that match your interests, skills, and passions. Take our quiz to explore strong-fit opportunities."
        icon={placeholderIcon("CP")}
      />
    )
  },
  {
    path: "/college-match",
    Component: () => (
      <PlaceholderPage
        title="College Match Quiz"
        description="Find colleges that align with your goals and preferences."
        icon={placeholderIcon("CM")}
      />
    )
  },
  {
    path: "/money-skills",
    Component: () => (
      <PlaceholderPage
        title="Money Skills"
        description="Learn budgeting, saving, and practical money habits for school and beyond."
        icon={placeholderIcon("MS")}
      />
    )
  },
  {
    path: "/teacher/class/:id",
    Component: () => (
      <PlaceholderPage
        title="Teacher Class Management"
        description="Manage class details, student progress, and assignment workflows."
        icon={placeholderIcon("TC")}
      />
    )
  }
]);
