import { useParams, Link } from 'react-router-dom'
import { hangouts, friends } from '../data/mock'
import Avatar from '../components/Avatar'
import { IconArrowLeft } from '../components/Icons'

export default function HangoutDetail() {
  const { id } = useParams()
  const hangout = hangouts.find(h => h.id === id)

  if (!hangout) return <div className="page-container"><p>Hangout not found.</p></div>

  return (
    <div className="page-container">
      <Link to="/hangouts" className="back-link animate-in">
        <IconArrowLeft size={14} /> Hangouts
      </Link>

      {/* Header */}
      <div className="card animate-in animate-in-1" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-xl)' }}>
        <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-sm)' }}>
          <div className="hangout-type-badge" style={{ width: 48, height: 48 }}>
            {hangout.type.slice(0, 3)}
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>{hangout.type}</h1>
            <p className="text-sm text-muted text-sans">{hangout.location} · {hangout.date}</p>
          </div>
        </div>
      </div>

      {/* Who was there */}
      <div className="section animate-in animate-in-2">
        <div className="section-header">
          <span className="section-label">Who was there</span>
        </div>
        <div className="flex flex-col gap-sm">
          {hangout.friends.map(f => {
            const friendData = friends.find(fr => fr.id === f.id)
            return (
              <Link key={f.id} to={`/friends/${f.id}`} className="card card-compact card-clickable">
                <div className="flex items-center gap-md">
                  {friendData ? (
                    <Avatar initials={friendData.initials} color={friendData.avatarColor} size="sm" />
                  ) : (
                    <Avatar initials="" color="" size="sm" />
                  )}
                  <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{f.name}</span>
                  {f.feeling && (
                    <span className="pill pill-default">{f.feeling.label}</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="section animate-in animate-in-3">
        <div className="section-header">
          <span className="section-label">Highlights</span>
        </div>
        <div className="card" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.95rem',
          lineHeight: 1.85,
        }}>
          {hangout.highlights}
        </div>
      </div>

      {/* Follow-ups */}
      {hangout.followUps.length > 0 && (
        <div className="section animate-in animate-in-4">
          <div className="section-header">
            <span className="section-label">Follow-ups</span>
          </div>
          <div className="flex flex-col gap-sm">
            {hangout.followUps.map((fu, i) => (
              <div key={i} className="flex items-center gap-md" style={{
                padding: '10px var(--space-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
              }}>
                <div className="checkbox" />
                <span>{fu}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
