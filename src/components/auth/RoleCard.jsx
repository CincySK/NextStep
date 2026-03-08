export default function RoleCard({ icon, title, description, buttonLabel, onClick }) {
  return (
    <article className="role-card">
      <div className="role-card-icon" aria-hidden>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button type="button" className="primary-btn" onClick={onClick}>
        {buttonLabel}
      </button>
    </article>
  );
}
