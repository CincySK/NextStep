export default function ProgressBadge({ label, value, tone = "default" }) {
  return (
    <div className={`badge badge-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}