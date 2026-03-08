import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";

export function TeacherDashboardDemo() {
  const navigate = useNavigate();
  const [showCreateClass, setShowCreateClass] = useState(false);

  const classes = [
    { id: 1, name: "Advanced Mathematics", students: 24, assignments: 8, color: "primary" },
    { id: 2, name: "Algebra 1", students: 28, assignments: 12, color: "secondary" },
    { id: 3, name: "Geometry", students: 22, assignments: 10, color: "success" }
  ];

  const recentAssignments = [
    { id: 1, title: "Calculus Problem Set #5", class: "Advanced Mathematics", submitted: 18, total: 24, dueDate: "March 10" },
    { id: 2, title: "Linear Equations Quiz", class: "Algebra 1", submitted: 25, total: 28, dueDate: "March 12" },
    { id: 3, title: "Triangle Properties", class: "Geometry", submitted: 22, total: 22, dueDate: "March 8" }
  ];

  const recentStudentActivity = [
    { student: "Emma Wilson", activity: "Submitted Problem Set #5", time: "10 minutes ago" },
    { student: "James Chen", activity: "Asked AI about derivatives", time: "1 hour ago" },
    { student: "Sofia Rodriguez", activity: "Completed quiz", time: "2 hours ago" }
  ];

  return (
    <div className="teacher-demo-page">
      <Navigation />

      <main className="teacher-demo-main">
        <div className="teacher-demo-header">
          <div>
            <h1 className="teacher-demo-title">Teacher Dashboard</h1>
            <p className="teacher-demo-subtitle">Manage your classes and assignments</p>
          </div>
          <Button onClick={() => setShowCreateClass(true)}>
            <span className="teacher-demo-plus">+</span>
            Create Class
          </Button>
        </div>

        <div className="teacher-stats-grid">
          <Card>
            <div className="teacher-stat-row">
              <div>
                <p className="teacher-stat-label">Total Classes</p>
                <p className="teacher-stat-value">{classes.length}</p>
              </div>
              <div className="teacher-stat-icon teacher-stat-icon-primary">BK</div>
            </div>
          </Card>
          <Card>
            <div className="teacher-stat-row">
              <div>
                <p className="teacher-stat-label">Total Students</p>
                <p className="teacher-stat-value">74</p>
              </div>
              <div className="teacher-stat-icon teacher-stat-icon-secondary">US</div>
            </div>
          </Card>
          <Card>
            <div className="teacher-stat-row">
              <div>
                <p className="teacher-stat-label">Active Assignments</p>
                <p className="teacher-stat-value">30</p>
              </div>
              <div className="teacher-stat-icon teacher-stat-icon-purple">FL</div>
            </div>
          </Card>
          <Card>
            <div className="teacher-stat-row">
              <div>
                <p className="teacher-stat-label">Pending Reviews</p>
                <p className="teacher-stat-value">12</p>
              </div>
              <div className="teacher-stat-icon teacher-stat-icon-orange">CL</div>
            </div>
          </Card>
        </div>

        <div className="teacher-layout-grid">
          <div className="teacher-main-col">
            <section>
              <h2 className="teacher-section-title">My Classes</h2>
              <div className="teacher-class-list">
                {classes.map((cls) => (
                  <Card key={cls.id} hover onClick={() => navigate(`/teacher/class/${cls.id}`)}>
                    <div className="teacher-class-row">
                      <div className="teacher-class-left">
                        <div className={`teacher-class-icon teacher-class-icon-${cls.color}`}>BK</div>
                        <div>
                          <h3 className="teacher-class-title">{cls.name}</h3>
                          <div className="teacher-class-meta">
                            <span>{cls.students} students</span>
                            <span>{cls.assignments} assignments</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="teacher-section-title">Recent Assignments</h2>
              <Card>
                <div className="teacher-assignment-list">
                  {recentAssignments.map((assignment) => (
                    <div key={assignment.id} className="teacher-assignment-row">
                      <div className="teacher-assignment-main">
                        <h4>{assignment.title}</h4>
                        <p>{assignment.class}</p>
                      </div>
                      <div className="teacher-assignment-submitted">
                        <p>{assignment.submitted}/{assignment.total} submitted</p>
                        <p>Due: {assignment.dueDate}</p>
                      </div>
                      <Badge variant={assignment.submitted === assignment.total ? "success" : "warning"}>
                        {assignment.submitted === assignment.total ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          </div>

          <aside className="teacher-side-col">
            <Card className="teacher-upload-card">
              <h3 className="teacher-side-title">Upload Materials</h3>
              <div className="teacher-upload-actions">
                <Button variant="outline" className="teacher-full-btn">Upload PDF Worksheets</Button>
                <Button variant="outline" className="teacher-full-btn">Upload Presentation Slides</Button>
                <Button variant="outline" className="teacher-full-btn">Upload Problem Sets</Button>
              </div>
            </Card>

            <Card>
              <h3 className="teacher-side-title">Recent Student Activity</h3>
              <div className="teacher-activity-list">
                {recentStudentActivity.map((item, index) => (
                  <div key={`${item.student}-${index}`} className="teacher-activity-row">
                    <p className="teacher-activity-student">{item.student}</p>
                    <p className="teacher-activity-text">{item.activity}</p>
                    <p className="teacher-activity-time">{item.time}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="teacher-side-title">Quick Actions</h3>
              <div className="teacher-quick-actions">
                <Button variant="outline" size="sm" className="teacher-full-btn">Create Assignment</Button>
                <Button variant="outline" size="sm" className="teacher-full-btn">View All Students</Button>
                <Button variant="outline" size="sm" className="teacher-full-btn">Grade Submissions</Button>
              </div>
            </Card>
          </aside>
        </div>
      </main>

      {showCreateClass ? (
        <div className="teacher-modal-overlay">
          <Card className="teacher-modal-card">
            <h2 className="teacher-modal-title">Create New Class</h2>
            <div className="teacher-modal-form">
              <Input label="Class Name" placeholder="e.g., Advanced Mathematics" />
              <Textarea label="Description" placeholder="Brief description of the class..." rows={3} />
              <Input label="Class Code" placeholder="Students will use this to join" />
            </div>
            <div className="teacher-modal-actions">
              <Button variant="outline" className="teacher-full-btn" onClick={() => setShowCreateClass(false)}>
                Cancel
              </Button>
              <Button className="teacher-full-btn" onClick={() => setShowCreateClass(false)}>
                Create Class
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export default TeacherDashboardDemo;
