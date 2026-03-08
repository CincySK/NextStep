import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export function ClassDetail() {
  const { classId, id } = useParams();
  const navigate = useNavigate();

  const classData = {
    id: classId ?? id,
    name: "Advanced Mathematics",
    teacher: "Ms. Johnson",
    description:
      "Explore advanced mathematical concepts including calculus, linear algebra, and differential equations."
  };

  const assignments = [
    {
      id: 1,
      title: "Calculus Problem Set #5",
      dueDate: "March 10, 2026",
      status: "pending",
      points: 100
    },
    {
      id: 2,
      title: "Linear Algebra Quiz",
      dueDate: "March 12, 2026",
      status: "pending",
      points: 50
    },
    {
      id: 3,
      title: "Integration Practice",
      dueDate: "March 8, 2026",
      status: "submitted",
      points: 75
    }
  ];

  const materials = [
    { id: 1, name: "Chapter 7 Notes.pdf", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "Practice Problems.pdf", type: "PDF", size: "1.8 MB" },
    { id: 3, name: "Lecture Slides Week 5.pptx", type: "Slides", size: "5.2 MB" }
  ];

  return (
    <div className="class-detail-page">
      <Navigation />

      <main className="class-detail-main">
        <div className="class-detail-header">
          <Button variant="ghost" onClick={() => navigate("/classes")} className="class-back-btn">
            {"<"} Back to Classes
          </Button>
          <h1 className="class-title">{classData.name}</h1>
          <p className="class-teacher">{classData.teacher}</p>
          <p className="class-description">{classData.description}</p>
        </div>

        <div className="class-layout-grid">
          <div className="class-main-column">
            <section>
              <h2 className="class-section-title">Assignments</h2>
              <div className="class-assignment-list">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} hover>
                    <div className="class-assignment-row">
                      <div className="class-assignment-body">
                        <div className="class-assignment-head">
                          <h3 className="class-assignment-title">{assignment.title}</h3>
                          <Badge variant={assignment.status === "submitted" ? "success" : "warning"}>
                            {assignment.status === "submitted" ? "Submitted" : "Pending"}
                          </Badge>
                        </div>
                        <div className="class-meta-row">
                          <span>Due: {assignment.dueDate}</span>
                          <span>{assignment.points} points</span>
                        </div>
                      </div>
                      <div className="class-assignment-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/study-assistant")}
                        >
                          Ask AI
                        </Button>
                        {assignment.status === "pending" ? <Button size="sm">Submit</Button> : null}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="class-section-title">Course Materials</h2>
              <Card>
                <div className="class-material-list">
                  {materials.map((material) => (
                    <div key={material.id} className="class-material-row">
                      <div className="class-material-left">
                        <div className="class-material-icon">F</div>
                        <div>
                          <p className="class-material-name">{material.name}</p>
                          <p className="class-material-meta">
                            {material.type} - {material.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          </div>

          <aside className="class-side-column">
            <Card>
              <h3 className="class-side-title">Class Info</h3>
              <div className="class-info-list">
                <div>
                  <p className="class-label">Instructor</p>
                  <p>{classData.teacher}</p>
                </div>
                <div>
                  <p className="class-label">Schedule</p>
                  <p>Mon, Wed, Fri - 10:00 AM</p>
                </div>
                <div>
                  <p className="class-label">Room</p>
                  <p>Building A, Room 204</p>
                </div>
              </div>
            </Card>

            <Card className="class-ai-card">
              <div className="class-ai-inner">
                <div className="class-ai-icon">AI</div>
                <h3 className="class-side-title">Need Help?</h3>
                <p className="class-ai-copy">Ask the study assistant about this class.</p>
                <Button className="class-ai-btn" onClick={() => navigate("/study-assistant")}>
                  Open AI Assistant
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="class-side-title">Upcoming</h3>
              <div className="class-upcoming-list">
                <div>
                  <p className="class-upcoming-title">Problem Set Due</p>
                  <p className="class-upcoming-meta">Tomorrow at 11:59 PM</p>
                </div>
                <div>
                  <p className="class-upcoming-title">Quiz on Thursday</p>
                  <p className="class-upcoming-meta">March 12 at 10:00 AM</p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ClassDetail;
