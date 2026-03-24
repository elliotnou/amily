import { Link, Navigate } from 'react-router-dom'
import { useFriends } from '../lib/hooks/useFriends'
import { useHangouts } from '../lib/hooks/useHangouts'
import { useNudges } from '../lib/hooks/useNudges'
import { useDebts } from '../lib/hooks/useDebts'
import { useAuth } from '../lib/auth'
import Avatar from '../components/Avatar'
import { IconClock, IconCake, IconCheck, IconPlus } from '../components/Icons'

const nudgeIcons = { clock: IconClock, cake: IconCake, check: IconCheck }

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Monthly hangout bar chart ──────────────────────────────────────
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getLastNMonths(n: number) {
  const result = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_ABBR[d.getMonth()] })
  }
  return result
}

function MonthlyChart({ hangouts }: { hangouts: { date: string }[] }) {
  const months = getLastNMonths(6)
  const counts = months.map(m =>
    hangouts.filter(h => {
      const d = new Date(h.date)
      return d.getFullYear() === m.year && d.getMonth() === m.month
    }).length
  )
  const max = Math.max(...counts, 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, padding: '0 4px' }}>
      {months.map((m, i) => {
        const pct = counts[i] / max
        const isCurrentMonth = i === months.length - 1
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }} title={`${m.label}: ${counts[i]} hangout${counts[i] !== 1 ? 's' : ''}`}>
            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-secondary)', opacity: counts[i] > 0 ? 1 : 0, lineHeight: 1 }}>
              {counts[i]}
            </span>
            <div style={{
              width: '100%', maxWidth: 48, borderRadius: 6,
              height: `${Math.max(pct * 64, counts[i] > 0 ? 10 : 4)}px`,
              background: isCurrentMonth ? 'var(--accent)' : 'var(--accent)',
              opacity: isCurrentMonth ? 1 : counts[i] > 0 ? 0.25 + pct * 0.45 : 0.1,
              transition: 'height 600ms ease',
            }} />
            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-sans)', color: isCurrentMonth ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: isCurrentMonth ? 600 : 400, lineHeight: 1 }}>
              {m.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ───────────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useAuth()
  const { friends, loading: friendsLoading } = useFriends()
  const { hangouts } = useHangouts()
  const { nudges, dismissNudge } = useNudges()
  const { debts, settleDebt } = useDebts()

  const recentHangouts = hangouts.slice(0, 5)
  const unsettledDebts = debts.filter(d => !d.settled)
  const totalOwed = unsettledDebts.filter(d => d.direction === 'owed').reduce((s, d) => s + Number(d.amount), 0)
  const totalOwe = unsettledDebts.filter(d => d.direction === 'owe').reduce((s, d) => s + Number(d.amount), 0)
  const longestFriend = [...friends].sort((a, b) => b.day_count - a.day_count)[0]
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''

  const innerCircleCount = friends.filter((f: any) => f.tier === 'inner-circle').length
  const thisMonthCount = hangouts.filter(h => {
    const d = new Date(h.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  if (!friendsLoading && friends.length === 0) return <Navigate to="/onboarding" replace />

  return (
    <div className="page-container">
      {/* ── Greeting ── */}
      <div className="animate-in" style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 500,
          color: 'var(--text)', marginBottom: 4, lineHeight: 1.2,
        }}>
          {getGreeting()}{displayName ? `, ${displayName}` : ''}
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {thisMonthCount > 0
            ? `${thisMonthCount} hangout${thisMonthCount !== 1 ? 's' : ''} this month`
            : 'No hangouts yet this month'}
          <span style={{ color: 'var(--border-strong)' }}>·</span>
          {friends.length} friend{friends.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Metrics row ── */}
      <div className="animate-in animate-in-1" style={{
        display: 'grid', gridTemplateColumns: longestFriend && longestFriend.day_count > 0 ? '1fr 1fr 1fr' : '1fr 1fr',
        gap: 12, marginBottom: 28,
      }}>
        <div style={metricCardStyle}>
          <span style={metricValueStyle}>{friends.length}</span>
          <span style={metricLabelStyle}>friends</span>
          {innerCircleCount > 0 && (
            <span style={{ ...metricSubStyle, color: 'var(--inner-circle)' }}>{innerCircleCount} inner circle</span>
          )}
        </div>
        <div style={metricCardStyle}>
          <span style={metricValueStyle}>{hangouts.length}</span>
          <span style={metricLabelStyle}>hangouts</span>
          <span style={metricSubStyle}>total logged</span>
        </div>
        {longestFriend && longestFriend.day_count > 0 && (
          <div style={metricCardStyle}>
            <span style={{ ...metricValueStyle, fontSize: '1.5rem' }}>
              <span style={{ fontStyle: 'italic' }}>day {longestFriend.day_count.toLocaleString()}</span>
            </span>
            <span style={metricLabelStyle}>longest streak</span>
            <span style={metricSubStyle}>{longestFriend.name}</span>
          </div>
        )}
      </div>

      {/* ── Activity chart ── */}
      <div className="animate-in animate-in-2" style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>
            Activity
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            last 6 months
          </span>
        </div>
        <MonthlyChart hangouts={hangouts} />
        {hangouts.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10 }}>
            Log your first hangout to see your activity
          </p>
        )}
      </div>

      {/* ── Recent hangouts ── */}
      {recentHangouts.length > 0 && (
        <div className="animate-in animate-in-3" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 500 }}>
              Recent hangouts
            </span>
            <Link to="/hangouts" style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
              color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <IconPlus size={13} /> Log new
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentHangouts.map((h: any) => (
              <Link key={h.id} to={`/hangouts/${h.id}`} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)', transition: 'all 150ms ease',
                textDecoration: 'none', color: 'inherit',
              }}>
                {/* Type badge */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'var(--accent-bg)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: 'var(--font-serif)', fontSize: '0.65rem',
                  fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase',
                }}>
                  {h.type.slice(0, 3)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text)' }}>
                      {h.type}
                    </span>
                    {h.location && (
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {h.location}
                      </span>
                    )}
                  </div>
                  {h.hangout_friends.length > 0 && (
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      with {h.hangout_friends.map((hf: any) => hf.friend_name).join(', ')}
                    </span>
                  )}
                </div>

                {/* Date */}
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {formatDate(h.date)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Your people ── */}
      <div className="animate-in animate-in-3" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 500 }}>
            Your people
          </span>
          <Link to="/friends" style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)',
          }}>
            View all
          </Link>
        </div>

        {friends.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', padding: 'var(--space-lg) 0' }}>
            No friends yet. <Link to="/friends" style={{ color: 'var(--accent)' }}>Add someone →</Link>
          </div>
        ) : (
          <div style={{
            display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            {friends.slice(0, 10).map((f: any) => (
              <Link key={f.id} to={`/friends/${f.id}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                flexShrink: 0, width: 76, textDecoration: 'none',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: f.avatar_color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  {f.avatar_url
                    ? <img src={f.avatar_url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 500, color: 'white', opacity: 0.9 }}>{f.initials}</span>}
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-secondary)',
                  textAlign: 'center', lineHeight: 1.2, maxWidth: '100%',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {f.name.split(' ')[0]}
                </span>
              </Link>
            ))}
            <Link to="/friends" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              flexShrink: 0, width: 76, textDecoration: 'none',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: '2px dashed var(--border-strong)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', transition: 'all 150ms ease',
              }}>
                <IconPlus size={18} />
              </div>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-muted)',
              }}>
                Add
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* ── Bottom row: Nudges + Debts ── */}
      {(nudges.length > 0 || unsettledDebts.length > 0) && (
        <div className="animate-in animate-in-4" style={{
          display: 'grid',
          gridTemplateColumns: nudges.length > 0 && unsettledDebts.length > 0 ? '1fr 1fr' : '1fr',
          gap: 16, marginBottom: 28,
        }}>
          {/* Nudges */}
          {nudges.length > 0 && (
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 500, display: 'block', marginBottom: 12 }}>
                Nudges
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nudges.map((nudge: any) => {
                  const NudgeIcon = nudgeIcons[nudge.icon as keyof typeof nudgeIcons]
                  return (
                    <div key={nudge.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', background: 'var(--bg-card)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <div className={`nudge-icon nudge-icon-${nudge.icon}`} style={{ width: 32, height: 32, flexShrink: 0 }}>
                        <NudgeIcon size={14} />
                      </div>
                      <span style={{ flex: 1, fontSize: '0.78rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {nudge.message}
                      </span>
                      <button
                        style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '2px 6px', cursor: 'pointer', background: 'none', border: 'none' }}
                        onClick={() => dismissNudge(nudge.id)}
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Debts */}
          {unsettledDebts.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 500 }}>
                  Settle up
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {totalOwed > 0 && <span style={{ color: 'var(--positive)' }}>+${totalOwed}</span>}
                  {totalOwed > 0 && totalOwe > 0 && ' / '}
                  {totalOwe > 0 && <span style={{ color: 'var(--negative)' }}>-${totalOwe}</span>}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {unsettledDebts.slice(0, 4).map((debt: any) => {
                  const friend = friends.find((f: any) => f.id === debt.friend_id)
                  return (
                    <div key={debt.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', background: 'var(--bg-card)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <div
                        className="checkbox"
                        style={{ cursor: 'pointer' }}
                        onClick={() => settleDebt(debt.id)}
                      />
                      {friend && <Avatar initials={friend.initials} color={friend.avatar_color} size="sm" />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
                          {debt.direction === 'owed' ? `${friend?.name ?? 'Someone'} owes you` : `You owe ${friend?.name ?? 'someone'}`}
                        </div>
                        {debt.description && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                            {debt.description}
                          </div>
                        )}
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.85rem',
                        color: debt.direction === 'owed' ? 'var(--positive)' : 'var(--negative)',
                      }}>
                        ${debt.amount}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────

const metricCardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '18px 20px',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

const metricValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontSize: '1.75rem',
  fontWeight: 600,
  color: 'var(--text)',
  lineHeight: 1,
}

const metricLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.72rem',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginTop: 4,
}

const metricSubStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.68rem',
  color: 'var(--text-muted)',
  marginTop: 2,
}
