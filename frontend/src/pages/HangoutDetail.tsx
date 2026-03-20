import { useParams, Link } from 'react-router-dom'
import { useHangout } from '../lib/hooks/useHangouts'
import Avatar from '../components/Avatar'
import { IconArrowLeft } from '../components/Icons'

export default function HangoutDetail() {
  const { id } = useParams()
  const { hangout, loading } = useHangout(id)

  if (loading) return <div className="page-container"><p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Loading…</p></div>
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
      {hangout.hangout_friends.length > 0 && (
        <div className="section animate-in animate-in-2">
          <div className="section-header">
            <span className="section-label">Who was there</span>
          </div>
          <div className="flex flex-col gap-sm">
            {hangout.hangout_friends.map(hf => (
              <Link key={hf.id} to={`/friends/${hf.friend_id}`} className="card card-compact card-clickable">
                <div className="flex items-center gap-md">
                  <Avatar initials={hf.friend_name.split(' ').map(w => w[0]).join('').slice(0, 2)} color="var(--accent)" size="sm" />
                  <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{hf.friend_name}</span>
                  {hf.feeling_label && (
                    <span className="pill pill-default">{hf.feeling_label}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      {hangout.highlights && (
        <div className="section animate-in animate-in-3">
          <div className="section-header">
            <span className="section-label">Highlights</span>
          </div>
          <div className="card" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', lineHeight: 1.85 }}>
            {hangout.highlights}
          </div>
        </div>
      )}

      {/* Follow-ups */}
      {hangout.follow_ups.length > 0 && (
        <div className="section animate-in animate-in-4">
          <div className="section-header">
            <span className="section-label">Follow-ups</span>
          </div>
          <div className="flex flex-col gap-sm">
            {hangout.follow_ups.map((fu, i) => (
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
