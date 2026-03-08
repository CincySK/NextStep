import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function StudyAssistantDemo() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI study assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");

  const quickActions = [
    "Help me with math",
    "Improve my essay",
    "Explain this concept",
    "Study for a test"
  ];

  const classes = ["Advanced Mathematics", "English Literature", "Physics 101", "World History"];
  const assignments = ["Homework #5", "Essay Draft", "Lab Report", "Chapter Review"];

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInput("");

    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        text: "I'd be happy to help you with that! Let me break this down for you...",
        sender: "assistant",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    setInput(action);
  };

  return (
    <div className="study-demo-page">
      <Navigation />

      <main className="study-demo-main">
        <div className="study-demo-header">
          <h1 className="study-demo-title">AI Study Assistant</h1>
          <p className="study-demo-subtitle">Get help with your coursework anytime</p>
        </div>

        <div className="study-demo-select-grid">
          <div>
            <label className="study-demo-label">Class Context</label>
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="study-demo-select"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="study-demo-label">Assignment</label>
            <select
              value={selectedAssignment}
              onChange={(event) => setSelectedAssignment(event.target.value)}
              className="study-demo-select"
            >
              <option value="">Select an assignment</option>
              {assignments.map((assignment) => (
                <option key={assignment} value={assignment}>{assignment}</option>
              ))}
            </select>
          </div>
        </div>

        <Card className="study-demo-chat-card">
          <div className="study-demo-chat-scroll">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`study-demo-msg-row ${message.sender === "user" ? "study-demo-msg-row-user" : ""}`}
              >
                <div className={`study-demo-avatar ${message.sender === "user" ? "study-demo-avatar-user" : "study-demo-avatar-ai"}`}>
                  {message.sender === "user" ? "U" : "AI"}
                </div>
                <div className={`study-demo-bubble ${message.sender === "user" ? "study-demo-bubble-user" : "study-demo-bubble-ai"}`}>
                  <p>{message.text}</p>
                  <p className={`study-demo-time ${message.sender === "user" ? "study-demo-time-user" : ""}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="study-demo-quick-actions">
          <p className="study-demo-quick-label">Quick actions:</p>
          <div className="study-demo-quick-wrap">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="study-demo-chip"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="study-demo-input-row">
          <button className="study-demo-attach-btn" type="button">+</button>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && handleSend()}
            placeholder="Type your question here..."
            className="study-demo-input"
          />
          <Button onClick={handleSend} className="study-demo-send-btn">
            Send
          </Button>
        </div>
      </main>
    </div>
  );
}

export default StudyAssistantDemo;
