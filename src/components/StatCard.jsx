function StatCard({ title, value, detail, accent = 'cyan' }) {
  return (
    <article className={`stat-card accent-${accent}`}>
      <span className="stat-label">{title}</span>
      <strong className="stat-value">{value}</strong>
      <p className="stat-detail">{detail}</p>
    </article>
  )
}

export default StatCard
