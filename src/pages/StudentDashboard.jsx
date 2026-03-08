import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export function StudentDashboard() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Career Path Quiz",
      description: "Discover careers that match your interests and skills.",
      icon: "CP",
      path: "/career-path"
    },
    {
      title: "College Match Quiz",
      description: "Find colleges aligned with your goals and preferences.",
      icon: "CM",
      path: "/college-match"
    },
    {
      title: "Money Skills",
      description: "Build strong financial literacy and planning habits.",
      icon: "MS",
      path: "/money-skills"
    }
  ];

  const classes = [
    { id: 1, name: "Advanced Mathematics", teacher: "Ms. Johnson", nextDue: "Tomorrow", color: "primary" },
    { id: 2, name: "English Literature", teacher: "Mr. Smith", nextDue: "March 12", color: "secondary" },
    { id: 3, name: "Physics 101", teacher: "Dr. Williams", nextDue: "March 15", color: "warning" }
  ];

  return (
    <div className="student-dashboard-page">
      <Navigation />

      <main className="student-dashboard-main">
        <div className="student-dashboard-header">
          <h1 className="student-dashboard-title">Welcome back, Alex!</h1>
          <p className="student-dashboard-subtitle">Ready to continue your learning journey?</p>
        </div>

        <div className="student-features-grid">
          {features.map((feature) => (
            <Card key={feature.title} hover onClick={() => navigate(feature.path)}>
              <div className="student-feature-icon">{feature.icon}</div>
              <h3 className="student-feature-title">{feature.title}</h3>
              <p className="student-feature-description">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card
          hover
          onClick={() => navigate("/study-assistant")}
          className="student-ai-card"
        >
          <div className="student-ai-row">
            <div className="student-ai-icon">AI</div>
            <div className="student-ai-copy">
              <h3>AI Study Assistant</h3>
              <p>Get instant help with homework, essays, and test prep.</p>
            </div>
            <Button>Start Chat</Button>
          </div>
        </Card>

        <section>
          <div className="student-section-head">
            <h2>My Classes</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/classes")}>
              View All
            </Button>
          </div>
          <div className="student-classes-grid">
            {classes.map((cls) => (
              <Card key={cls.id} hover onClick={() => navigate(`/class/${cls.id}`)}>
                <div className="student-class-row">
                  <Badge variant={cls.color}>{cls.name}</Badge>
                </div>
                <p className="student-class-teacher">{cls.teacher}</p>
                <p className="student-class-due">Next due: {cls.nextDue}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
