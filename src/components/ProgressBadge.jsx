export default function ProgressBadge({ label, value, tone = "default" }) {
  return (
    <div className={`badge badge-${tone}`}>
      <span className="badge-label">{label}</span>
      <strong className="badge-value">{value}</strong>
    </div>
  );
}
