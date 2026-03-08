import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export function ClassesList() {
  const navigate = useNavigate();

  const classes = [
    {
      id: 1,
      name: "Advanced Mathematics",
      teacher: "Ms. Johnson",
      students: 24,
      nextDue: "Tomorrow",
      color: "primary",
      schedule: "Mon, Wed, Fri - 10:00 AM"
    },
    {
      id: 2,
      name: "English Literature",
      teacher: "Mr. Smith",
      students: 28,
      nextDue: "March 12",
      color: "secondary",
      schedule: "Tue, Thu - 2:00 PM"
    },
    {
      id: 3,
      name: "Physics 101",
      teacher: "Dr. Williams",
      students: 22,
      nextDue: "March 15",
      color: "warning",
      schedule: "Mon, Wed - 1:00 PM"
    },
    {
      id: 4,
      name: "World History",
      teacher: "Mrs. Davis",
      students: 26,
      nextDue: "March 20",
      color: "success",
      schedule: "Tue, Thu - 11:00 AM"
    }
  ];

  return (
    <div className="classes-list-page">
      <Navigation />

      <main className="classes-list-main">
        <div className="classes-list-header">
          <div>
            <h1 className="classes-list-title">My Classes</h1>
            <p className="classes-list-subtitle">View and manage all your enrolled classes</p>
          </div>
          <Button>
            <span className="classes-list-plus">+</span>
            Join Class
          </Button>
        </div>

        <div className="classes-grid">
          {classes.map((cls) => (
            <Card key={cls.id} hover onClick={() => navigate(`/classes/${cls.id}`)}>
              <div className="classes-card-head">
                <div className={`classes-card-icon classes-card-icon-${cls.color}`}>BK</div>
                <div className="classes-card-title-wrap">
                  <h3 className="classes-card-title">{cls.name}</h3>
                  <p className="classes-card-teacher">{cls.teacher}</p>
                </div>
              </div>

              <div className="classes-card-meta">
                <div className="classes-meta-row">
                  <span className="classes-meta-symbol">U</span>
                  {cls.students} students enrolled
                </div>
                <div className="classes-meta-row">
                  <span className="classes-meta-symbol">T</span>
                  {cls.schedule}
                </div>
              </div>

              <div className="classes-card-footer">
                <div className="classes-next-due">
                  <span className="classes-next-label">Next due: </span>
                  <span className="classes-next-value">{cls.nextDue}</span>
                </div>
                <Badge variant={cls.color}>Active</Badge>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ClassesList;
