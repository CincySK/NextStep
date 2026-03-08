import React from "react";
import Navigation from "../components/Navigation";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Select } from "../components/ui/Select";

export function DesignSystem() {
  return (
    <div className="design-system-page">
      <Navigation />

      <main className="design-system-main">
        <header className="design-system-hero">
          <h1 className="design-system-title">NextStep Design System</h1>
          <p className="design-system-subtitle">
            A comprehensive UI/UX system for the NextStep platform
          </p>
        </header>

        <section className="design-section">
          <h2 className="design-section-title">Colors</h2>
          <div className="design-colors-grid">
            <Card>
              <div className="design-color-swatch design-color-primary" />
              <h3 className="design-card-title">Primary</h3>
              <p className="design-card-meta">#2563EB</p>
            </Card>
            <Card>
              <div className="design-color-swatch design-color-secondary" />
              <h3 className="design-card-title">Secondary</h3>
              <p className="design-card-meta">#14B8A6</p>
            </Card>
            <Card>
              <div className="design-color-swatch design-color-muted" />
              <h3 className="design-card-title">Muted</h3>
              <p className="design-card-meta">#E5E7EB</p>
            </Card>
          </div>
        </section>

        <section className="design-section">
          <h2 className="design-section-title">Typography</h2>
          <Card>
            <div className="design-typography-list">
              <div>
                <h1 className="design-typo-h1">Heading 1 - The quick brown fox</h1>
                <p className="design-card-meta">32px / Inter Medium</p>
              </div>
              <div>
                <h2 className="design-typo-h2">Heading 2 - The quick brown fox</h2>
                <p className="design-card-meta">24px / Inter Medium</p>
              </div>
              <div>
                <h3 className="design-typo-h3">Heading 3 - The quick brown fox</h3>
                <p className="design-card-meta">20px / Inter Medium</p>
              </div>
              <div>
                <p className="design-typo-body">Body Text - The quick brown fox jumps over the lazy dog.</p>
                <p className="design-card-meta">16px / Inter Regular</p>
              </div>
              <div>
                <p className="design-typo-small">Small Text - The quick brown fox jumps over the lazy dog.</p>
                <p className="design-card-meta">14px / Inter Regular</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="design-section">
          <h2 className="design-section-title">Buttons</h2>
          <Card>
            <div className="design-stack">
              <div>
                <h3 className="design-card-title">Variants</h3>
                <div className="design-inline-wrap">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>
              <div>
                <h3 className="design-card-title">Sizes</h3>
                <div className="design-inline-wrap">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="design-card-title">With Icons</h3>
                <div className="design-inline-wrap">
                  <Button><span className="design-icon">U</span>With Icon</Button>
                  <Button variant="secondary"><span className="design-icon">S</span>Send Message</Button>
                  <Button variant="outline"><span className="design-icon">D</span>Download</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="design-section">
          <h2 className="design-section-title">Cards</h2>
          <div className="design-two-grid">
            <Card>
              <h3 className="design-card-title">Basic Card</h3>
              <p className="design-card-copy">Cards are used to group related content and actions.</p>
            </Card>
            <Card hover>
              <h3 className="design-card-title">Hover Card</h3>
              <p className="design-card-copy">This card has hover effects and scales slightly.</p>
            </Card>
          </div>
        </section>

        <section className="design-section">
          <h2 className="design-section-title">Inputs</h2>
          <Card>
            <div className="design-form-stack">
              <Input label="Email Address" type="email" placeholder="Enter your email" />
              <Input label="Password" type="password" placeholder="Enter your password" />
              <Input placeholder="Input without label" />
              <Select
                label="Role"
                options={[
                  { value: "student", label: "Student" },
                  { value: "teacher", label: "Teacher" }
                ]}
                defaultValue="student"
              />
            </div>
          </Card>
        </section>

        <section className="design-section">
          <h2 className="design-section-title">Badges</h2>
          <Card>
            <div className="design-inline-wrap">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
          </Card>
        </section>

        <section className="design-section">
          <h2 className="design-section-title">Chat Bubbles</h2>
          <Card>
            <div className="design-chat">
              <div className="design-chat-row">
                <div className="design-chat-avatar design-chat-avatar-muted">U</div>
                <div className="design-chat-bubble design-chat-bubble-assistant">
                  <p>This is an assistant message bubble. It appears on the left side.</p>
                  <p className="design-chat-time">10:30 AM</p>
                </div>
              </div>
              <div className="design-chat-row design-chat-row-user">
                <div className="design-chat-avatar design-chat-avatar-gradient">U</div>
                <div className="design-chat-bubble design-chat-bubble-user">
                  <p>This is a user message bubble. It appears on the right side.</p>
                  <p className="design-chat-time design-chat-time-user">10:31 AM</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="design-section">
          <h2 className="design-section-title">Spacing & Rounded Corners</h2>
          <Card>
            <div className="design-stack">
              <div className="design-radius-row">
                <div className="design-radius-box design-radius-lg" />
                <p>rounded-lg (12px)</p>
              </div>
              <div className="design-radius-row">
                <div className="design-radius-box design-radius-xl" />
                <p>rounded-xl (16px)</p>
              </div>
              <div className="design-radius-row">
                <div className="design-radius-box design-radius-2xl" />
                <p>rounded-2xl (24px)</p>
              </div>
              <div className="design-radius-row">
                <div className="design-radius-box design-radius-full" />
                <p>rounded-full (50%)</p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default DesignSystem;
