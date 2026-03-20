import { friends, hangouts, tierDotClass, tierColor, tierLabel, feelingColor } from '../data/mock'
import Avatar from '../components/Avatar'

export default function Stats() {
  const hangoutCounts = friends.map(f => ({
    ...f,
    count: hangouts.filter(h => h.friends.some(hf => hf.id === f.id)).length
  })).sort((a, b) => b.count - a.count)

  const maxCount = Math.max(...hangoutCounts.map(f => f.count))

  // Feelings distribution
  const feelingMap = new Map<string, { label: string; count: number }>()
  hangouts.forEach(h => {
    h.friends.forEach(f => {
      if (f.feeling) {
        const existing = feelingMap.get(f.feeling.label)
        if (existing) existing.count++
        else feelingMap.set(f.feeling.label, { label: f.feeling.label, count: 1 })
      }
    })
  })
  const feelingsSorted = [...feelingMap.values()].sort((a, b) => b.count - a.count)
  const totalFeelings = feelingsSorted.reduce((s, f) => s + f.count, 0)

  const getMilestone = (days: number): string | null => {
    if (days >= 1000) return '1,000+ days'
    if (days >= 500) return '500+ days'
    if (days >= 365) return '1 year+'
    if (days >= 200) return '200+ days'
    if (days >= 100) return '100+ days'
    return null
  }

  const topPeople = hangoutCounts.slice(0, 3)
  const totalHangouts = hangouts.length
  const tierBreakdown = {
    'inner-circle': friends.filter(f => f.tier === 'inner-circle').length,
    'close-friend': friends.filter(f => f.tier === 'close-friend').length,
    'casual': friends.filter(f => f.tier === 'casual').length,
  }

  const rankColors = ['var(--inner-circle)', 'var(--close-friend)', 'var(--casual)']

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1 className="page-title">Stats</h1>
        <p className="page-subtitle">A quiet look at your connections</p>
      </div>

      {/* Summary cards — colorized */}
      <div className="stat-grid animate-in animate-in-1">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <span className="stat-card-label">Total hangouts</span>
          <span className="stat-card-value" style={{ color: 'var(--accent)' }}>{totalHangouts}</span>
          <span className="stat-card-sub">across {friends.length} friends</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--positive)' }}>
          <span className="stat-card-label">Feelings logged</span>
          <span className="stat-card-value" style={{ color: 'var(--positive)' }}>{totalFeelings}</span>
          <span className="stat-card-sub">{feelingsSorted.length} unique</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--inner-circle)' }}>
          <span className="stat-card-label">Most seen</span>
          <div className="flex items-center gap-sm" style={{ marginTop: 4 }}>
            {topPeople[0] && <Avatar initials={topPeople[0].initials} color={topPeople[0].avatarColor} size="sm" />}
            <div>
              <span className="stat-card-value" style={{ fontSize: '1.2rem', color: 'var(--inner-circle)' }}>
                {topPeople[0]?.name.split(' ')[0]}
              </span>
              <div className="stat-card-sub">{topPeople[0]?.count} hangouts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier breakdown — visual bar */}
      <div className="section animate-in animate-in-2">
        <div className="section-header">
          <span className="section-label">Friend tiers</span>
        </div>
        <div className="card">
          {/* Stacked bar */}
          <div style={{
            display: 'flex',
            height: 12,
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: 'var(--space-md)',
          }}>
            <div style={{ width: `${(tierBreakdown['inner-circle'] / friends.length) * 100}%`, background: 'var(--inner-circle)', transition: 'width 600ms ease' }} />
            <div style={{ width: `${(tierBreakdown['close-friend'] / friends.length) * 100}%`, background: 'var(--close-friend)', transition: 'width 600ms ease' }} />
            <div style={{ width: `${(tierBreakdown['casual'] / friends.length) * 100}%`, background: 'var(--casual)', transition: 'width 600ms ease' }} />
          </div>
          <div className="flex gap-lg">
            {(['inner-circle', 'close-friend', 'casual'] as const).map(tier => (
              <div key={tier} className="flex items-center gap-sm">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: tierColor(tier) }} />
                <span className="text-sm">{tierLabel(tier)}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: tierColor(tier) }}>
                  {tierBreakdown[tier]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hangouts by friend — colored bar chart */}
      <div className="section animate-in animate-in-3">
        <div className="section-header">
          <span className="section-label">Hangouts by friend</span>
        </div>
        <div className="card">
          {hangoutCounts.map(f => (
            <div key={f.id} className="bar-row">
              <div className="bar-label">
                <Avatar initials={f.initials} color={f.avatarColor} size="sm" />
                <span>{f.name.split(' ')[0]}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(f.count / maxCount) * 100}%`,
                    background: tierColor(f.tier),
                  }}
                />
              </div>
              <span className="bar-count" style={{ color: tierColor(f.tier) }}>{f.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feelings distribution — colored blocks */}
      <div className="section animate-in animate-in-4">
        <div className="section-header">
          <span className="section-label">Feelings</span>
        </div>
        <div className="card">
          {/* Horizontal proportional bar */}
          <div style={{
            display: 'flex',
            height: 10,
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: 'var(--space-lg)',
          }}>
            {feelingsSorted.map(f => (
              <div
                key={f.label}
                style={{
                  width: `${(f.count / totalFeelings) * 100}%`,
                  background: feelingColor(f.label),
                  transition: 'width 600ms ease',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
            {feelingsSorted.map(f => (
              <div key={f.label} className="flex items-center gap-sm" style={{
                padding: '10px 14px',
                background: 'var(--bg)',
                borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${feelingColor(f.label)}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize' }}>{f.label}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: feelingColor(f.label),
                }}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top people — podium style */}
      <div className="section animate-in animate-in-5">
        <div className="section-header">
          <span className="section-label">Top people</span>
        </div>
        <div className="flex flex-col gap-sm">
          {topPeople.map((f, i) => (
            <div key={f.id} className="card card-compact flex items-center gap-md" style={{
              borderLeft: `4px solid ${rankColors[i]}`,
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                fontWeight: 600,
                color: rankColors[i],
                width: '32px',
                textAlign: 'center',
              }}>
                {i + 1}
              </span>
              <Avatar initials={f.initials} color={f.avatarColor} size="md" />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{f.name}</span>
                {f.aiLabel && (
                  <div className="text-xs" style={{ color: 'var(--ai)', marginTop: 2 }}>{f.aiLabel}</div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: rankColors[i] }}>
                  {f.count}
                </span>
                <div className="text-xs text-muted text-sans">hangouts</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day counters — with tier colors */}
      <div className="section animate-in">
        <div className="section-header">
          <span className="section-label">TheDayBefore</span>
        </div>
        <div className="flex flex-col gap-sm">
          {[...friends].sort((a, b) => b.dayCount - a.dayCount).map(f => {
            const milestone = getMilestone(f.dayCount)
            return (
              <div key={f.id} className="card card-compact" style={{ borderLeft: `3px solid ${tierColor(f.tier)}` }}>
                <div className="flex items-center gap-md">
                  <Avatar initials={f.initials} color={f.avatarColor} size="sm" />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{f.name}</span>
                    <div className="flex items-center gap-xs" style={{ marginTop: '2px' }}>
                      <span className={`tier-dot ${tierDotClass(f.tier)}`} />
                      <span className="text-xs text-muted text-sans">{tierLabel(f.tier)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="day-counter day-counter-lg" style={{ color: tierColor(f.tier) }}>
                      day {f.dayCount.toLocaleString()}
                    </div>
                    {milestone && <div className="milestone">{milestone}</div>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
