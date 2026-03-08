import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";

export function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      description: "Explore careers, find colleges, get AI tutoring help, and join classes.",
      icon: "GR",
      colorClass: "role-selection-icon-student",
      path: "/dashboard"
    },
    {
      title: "Teacher",
      description: "Create classes, upload assignments, and connect coursework to the AI assistant.",
      icon: "BK",
      colorClass: "role-selection-icon-teacher",
      path: "/teacher/dashboard"
    }
  ];

  return (
    <div className="role-selection-page">
      <div className="role-selection-shell">
        <header className="role-selection-header">
          <div className="role-selection-brand">
            <div className="role-selection-brand-badge">
              <span>N</span>
            </div>
          </div>
          <h1 className="role-selection-title">Welcome to NextStep</h1>
          <p className="role-selection-subtitle">How will you use NextStep?</p>
        </header>

        <div className="role-selection-grid">
          {roles.map((role) => (
            <Card
              key={role.title}
              hover
              onClick={() => navigate(role.path)}
              className="role-selection-card"
            >
              <div className={`role-selection-icon ${role.colorClass}`}>
                <span>{role.icon}</span>
              </div>
              <h2 className="role-selection-card-title">{role.title}</h2>
              <p className="role-selection-card-copy">{role.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
