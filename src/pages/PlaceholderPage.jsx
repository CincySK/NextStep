import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function PlaceholderPage({ title, description, icon }) {
  const navigate = useNavigate();

  return (
    <div className="placeholder-page">
      <Navigation />
      <main className="placeholder-main">
        <Card className="placeholder-card">
          <div className="placeholder-icon-wrap">
            {icon}
          </div>
          <h1 className="placeholder-title">{title}</h1>
          <p className="placeholder-description">{description}</p>
          <Button onClick={() => navigate(-1)}>
            <span className="placeholder-back-arrow">{"<"}</span>
            Go Back
          </Button>
        </Card>
      </main>
    </div>
  );
}

export default PlaceholderPage;
