export default function StatCard({ label, value, detail, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`} aria-hidden="true">{tone === 'blue' ? 'Σ' : tone === 'green' ? '⌁' : '◈'}</div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-detail">{detail}</p>
      </div>
    </article>
  );
}
