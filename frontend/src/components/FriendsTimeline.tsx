import { Link } from 'react-router-dom'

interface TF {
  id: string
  name: string
  initials: string
  avatar_color: string
  avatar_url: string | null
  met_date: string | null
  met_how: string | null
  location: string | null
  tier: string | null
  day_count: number
  hangout_count: number
  starred: boolean
}

const TIER_COLOR: Record<string, string> = {
  'inner-circle': '#e07a5f',
  'close-friend': '#457b9d',
  'casual':       '#c9a96e',
}

const TIER_LABEL: Record<string, string> = {
  'inner-circle': 'Inner circle',
  'close-friend': 'Close friend',
  'casual':       'Casual',
}

function Avatar({ f, size = 38 }: { f: TF; size?: number }) {
  const tc = TIER_COLOR[f.tier ?? '']
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: f.avatar_color,
      border: `2.5px solid ${tc ?? 'transparent'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {f.avatar_url
        ? <img src={f.avatar_url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: size * 0.32, fontWeight: 500 }}>{f.initials}</span>}
    </div>
  )
}

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr + 'T00:00:00').getTime()) / 86400000)
  if (days < 30) return `${days}d ago`
  const mo = Math.floor(days / 30)
  if (mo < 12) return `${mo}mo ago`
  const yr = Math.floor(days / 365)
  return `${yr}y ago`
}

export default function FriendsTimeline({ friends }: { friends: TF[] }) {
  const withDate    = friends.filter(f => f.met_date)
  const withoutDate = friends.filter(f => !f.met_date)

  const byYear: Record<number, TF[]> = {}
  for (const f of withDate) {
    const y = new Date(f.met_date! + 'T00:00:00').getFullYear()
    ;(byYear[y] ??= []).push(f)
  }
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  if (friends.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
        No friends yet.
      </div>
    )
  }

  const renderEntry = (f: TF, isLast: boolean) => {
    const tc = TIER_COLOR[f.tier ?? ''] ?? 'var(--text-muted)'
    const meta = [f.met_how, f.location].filter(Boolean).join(' · ')
    return (
      <div key={f.id} style={{ display: 'flex', gap: 0 }}>
        {/* Timeline stem + dot */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: tc, flexShrink: 0, marginTop: 18,
          }} />
          {!isLast && <div style={{ width: 1.5, flex: 1, background: 'var(--border)', marginTop: 2 }} />}
        </div>

        {/* Card */}
        <Link to={`/friends/${f.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : 10 }}>
          <div
            className="timeline-entry"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              transition: 'transform 150ms ease, box-shadow 150ms ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
          >
            <Avatar f={f} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{f.name}</span>
                {f.starred && <span style={{ color: tc, fontSize: '0.65rem', opacity: 0.8 }}>★</span>}
                {f.tier && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 600, color: tc, background: tc + '18', padding: '2px 7px', borderRadius: 20 }}>
                    {TIER_LABEL[f.tier]}
                  </span>
                )}
              </div>
              {meta && (
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{meta}</div>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {f.met_date && (
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{timeAgo(f.met_date)}</div>
              )}
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>
                day {f.day_count.toLocaleString()}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 1 }}>
                {f.hangout_count} hang{f.hangout_count !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 48 }}>
      {years.map(year => {
        const entries = byYear[year]
        return (
          <div key={year} style={{ marginBottom: 36 }}>
            {/* Year marker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 600,
                color: 'var(--text)', lineHeight: 1, flexShrink: 0,
              }}>{year}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                {entries.length} {entries.length === 1 ? 'friend' : 'friends'}
              </span>
            </div>
            <div style={{ paddingLeft: 8 }}>
              {entries.map((f, i) => renderEntry(f, i === entries.length - 1))}
            </div>
          </div>
        )
      })}

      {withoutDate.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 600, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1 }}>?</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>no met date · set it on their profile</span>
          </div>
          <div style={{ paddingLeft: 8, opacity: 0.65 }}>
            {withoutDate.map((f, i) => renderEntry(f, i === withoutDate.length - 1))}
          </div>
        </div>
      )}
    </div>
  )
}
