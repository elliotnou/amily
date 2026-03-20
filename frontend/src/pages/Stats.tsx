import { useFriends } from '../lib/hooks/useFriends'
import { useHangouts } from '../lib/hooks/useHangouts'
import { tierColor, tierLabel, feelingColor } from '../data/mock'
import Avatar from '../components/Avatar'

export default function Stats() {
  const { friends } = useFriends()
  const { hangouts } = useHangouts()

  const hangoutCounts = friends.map(f => ({
    ...f,
    count: hangouts.filter(h => h.hangout_friends.some(hf => hf.friend_id === f.id)).length
  })).sort((a, b) => b.count - a.count)

  const maxCount = Math.max(...hangoutCounts.map(f => f.count), 1)

  // Feelings distribution
  const feelingMap = new Map<string, { label: string; count: number }>()
  hangouts.forEach(h => {
    h.hangout_friends.forEach(hf => {
      if (hf.feeling_label) {
        const existing = feelingMap.get(hf.feeling_label)
        if (existing) existing.count++
        else feelingMap.set(hf.feeling_label, { label: hf.feeling_label, count: 1 })
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

  if (friends.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header animate-in">
          <h1 className="page-title">Stats</h1>
          <p className="page-subtitle">A quiet look at your connections</p>
        </div>
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem' }}>
          Add some friends and log some hangouts to see your stats.
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1 className="page-title">Stats</h1>
        <p className="page-subtitle">A quiet look at your connections</p>
      </div>

      {/* Summary cards */}
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
          {topPeople[0] ? (
            <div className="flex items-center gap-sm" style={{ marginTop: 4 }}>
              <Avatar initials={topPeople[0].initials} color={topPeople[0].avatar_color} size="sm" />
              <div>
                <span className="stat-card-value" style={{ fontSize: '1.2rem', color: 'var(--inner-circle)' }}>
                  {topPeople[0].name.split(' ')[0]}
                </span>
                <div className="stat-card-sub">{topPeople[0].count} hangouts</div>
              </div>
            </div>
          ) : <span className="stat-card-sub">—</span>}
        </div>
      </div>

      {/* Tier breakdown */}
      <div className="section animate-in animate-in-2">
        <div className="section-header"><span className="section-label">Friend tiers</span></div>
        <div className="card">
          <div style={{ display: 'flex', height: 12, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
            <div style={{ width: `${(tierBreakdown['inner-circle'] / (friends.length || 1)) * 100}%`, background: 'var(--inner-circle)', transition: 'width 600ms ease' }} />
            <div style={{ width: `${(tierBreakdown['close-friend'] / (friends.length || 1)) * 100}%`, background: 'var(--close-friend)', transition: 'width 600ms ease' }} />
            <div style={{ width: `${(tierBreakdown['casual'] / (friends.length || 1)) * 100}%`, background: 'var(--casual)', transition: 'width 600ms ease' }} />
          </div>
          <div className="flex gap-lg">
            {(['inner-circle', 'close-friend', 'casual'] as const).map(tier => (
              <div key={tier} className="flex items-center gap-sm">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: tierColor(tier) }} />
                <span className="text-sm">{tierLabel(tier)}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: tierColor(tier) }}>{tierBreakdown[tier]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hangouts by friend */}
      <div className="section animate-in animate-in-3">
        <div className="section-header"><span className="section-label">Hangouts by friend</span></div>
        <div className="card">
          {hangoutCounts.map(f => (
            <div key={f.id} className="bar-row">
              <div className="bar-label">
                <Avatar initials={f.initials} color={f.avatar_color} size="sm" />
                <span>{f.name.split(' ')[0]}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(f.count / maxCount) * 100}%`, background: tierColor(f.tier) }} />
              </div>
              <span className="bar-count" style={{ color: tierColor(f.tier) }}>{f.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feelings */}
      {feelingsSorted.length > 0 && (
        <div className="section animate-in animate-in-4">
          <div className="section-header"><span className="section-label">Feelings</span></div>
          <div className="card">
            <div style={{ display: 'flex', height: 10, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 'var(--space-lg)' }}>
              {feelingsSorted.map(f => (
                <div key={f.label} style={{ width: `${(f.count / totalFeelings) * 100}%`, background: feelingColor(f.label), transition: 'width 600ms ease' }} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {feelingsSorted.map(f => (
                <div key={f.label} className="flex items-center gap-sm" style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${feelingColor(f.label)}` }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize' }}>{f.label}</div></div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: feelingColor(f.label) }}>{f.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top people */}
      {topPeople.length > 0 && (
        <div className="section animate-in animate-in-5">
          <div className="section-header"><span className="section-label">Top people</span></div>
          <div className="flex flex-col gap-sm">
            {topPeople.map((f, i) => (
              <div key={f.id} className="card card-compact flex items-center gap-md" style={{ borderLeft: `4px solid ${rankColors[i]}` }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, color: rankColors[i], width: '32px', textAlign: 'center' }}>{i + 1}</span>
                <Avatar initials={f.initials} color={f.avatar_color} size="md" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{f.name}</span>
                  {f.ai_label && <div className="text-xs" style={{ color: 'var(--ai)', marginTop: 2 }}>{f.ai_label}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: rankColors[i] }}>{f.count}</span>
                  <div className="text-xs text-muted text-sans">hangouts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day counters */}
      <div className="section animate-in">
        <div className="section-header"><span className="section-label">Day counters</span></div>
        <div className="flex flex-col gap-sm">
          {[...friends].sort((a, b) => b.day_count - a.day_count).map(f => {
            const milestone = getMilestone(f.day_count)
            return (
              <div key={f.id} className="card card-compact" style={{ borderLeft: `3px solid ${tierColor(f.tier)}` }}>
                <div className="flex items-center gap-md">
                  <Avatar initials={f.initials} color={f.avatar_color} size="sm" />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{f.name}</span>
                    <div className="flex items-center gap-xs" style={{ marginTop: '2px' }}>
                      <span className="text-xs text-muted text-sans">{tierLabel(f.tier)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="day-counter day-counter-lg" style={{ color: tierColor(f.tier) }}>day {f.day_count.toLocaleString()}</div>
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
