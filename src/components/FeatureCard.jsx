export default function FeatureCard({ title, description, to, tone, onNavigate }) {
  return (
    <button className={`feature-card ${tone}`} onClick={() => onNavigate(to)}>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="feature-link">Explore -&gt;</span>
    </button>
  );
}
