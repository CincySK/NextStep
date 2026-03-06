export default function FeatureCard({ title, description, supportText, to, onNavigate }) {
  return (
    <button className="feature-card" onClick={() => onNavigate(to)}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="support-copy">{supportText}</p>
      <span className="feature-link">Open module</span>
    </button>
  );
}
