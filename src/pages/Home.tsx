import { Link } from 'react-router-dom'
import { friends, hangouts, nudges, getGreeting, tierDotClass, tierLabel, tierColor } from '../data/mock'
import Avatar from '../components/Avatar'
import { IconClock, IconCake, IconCheck, IconPlus } from '../components/Icons'
import { useState } from 'react'

const nudgeIcons = { clock: IconClock, cake: IconCake, check: IconCheck }

export default function Home() {
  const recentHangouts = hangouts.slice(0, 3)
  const [debts] = useState([
    { id: '1', friendId: '1', friendName: 'Maya', amount: 24, direction: 'they-owe' as const, note: 'Dinner at Tatiana', settled: false },
    { id: '2', friendId: '2', friendName: 'Jordan', amount: 12, direction: 'you-owe' as const, note: 'Smoothies after basketball', settled: false },
    { id: '3', friendId: '4', friendName: 'Leo', amount: 35, direction: 'they-owe' as const, note: 'Birthday gift share', settled: true },
  ])

  const unsettledDebts = debts.filter(d => !d.settled)
  const totalOwed = unsettledDebts.filter(d => d.direction === 'they-owe').reduce((s, d) => s + d.amount, 0)
  const totalOwe = unsettledDebts.filter(d => d.direction === 'you-owe').reduce((s, d) => s + d.amount, 0)

  const totalHangouts = hangouts.length
  const newThisMonth = 2 // simulated: friends added this month
  const longestFriend = [...friends].sort((a, b) => b.dayCount - a.dayCount)[0]

  return (
    <div className="page-container">
      {/* Greeting */}
      <div className="page-header animate-in">
        <h1 className="page-title">{getGreeting()}</h1>
        <p className="page-subtitle">{totalHangouts} hangouts logged · {friends.length} friends</p>
      </div>

      {/* Dashboard stat cards */}
      <div className="stat-grid animate-in animate-in-1">
        <div className="stat-card">
          <span className="stat-card-label">Friends</span>
          <span className="stat-card-value">{friends.length}</span>
          <div className="flex items-center gap-sm">
            <span className="stat-card-accent" style={{ background: 'var(--positive-bg)', color: 'var(--positive)' }}>
              +{newThisMonth} this month
            </span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Hangouts</span>
          <span className="stat-card-value">{totalHangouts}</span>
          <span className="stat-card-sub">this month</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Longest streak</span>
          <span className="stat-card-value" style={{ fontSize: '1.6rem' }}>
            <span style={{ fontStyle: 'italic' }}>day {longestFriend.dayCount.toLocaleString()}</span>
          </span>
          <span className="stat-card-sub">{longestFriend.name}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Debts</span>
          <div className="flex items-center gap-md">
            <div>
              <span className="stat-card-value" style={{ color: 'var(--positive)' }}>+${totalOwed}</span>
              <div className="text-xs text-muted">owed to you</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
            <div>
              <span className="stat-card-value" style={{ color: 'var(--negative)' }}>-${totalOwe}</span>
              <div className="text-xs text-muted">you owe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Debts / IOUs */}
      <div className="section animate-in animate-in-2">
        <div className="section-header">
          <span className="section-label">Settle up</span>
          <Link to="/hangouts" className="btn btn-ghost btn-sm text-sans">View all</Link>
        </div>
        <div className="flex flex-col gap-sm">
          {debts.map(debt => {
            const friend = friends.find(f => f.id === debt.friendId)
            return (
              <div
                key={debt.id}
                className="flex items-center gap-md"
                style={{
                  padding: '10px var(--space-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: debt.settled ? 0.5 : 1,
                }}
              >
                <div
                  className="checkbox"
                  style={debt.settled ? { background: 'var(--positive)', borderColor: 'var(--positive)' } : {}}
                />
                {friend && (
                  <Avatar initials={friend.initials} color={friend.avatarColor} size="sm" />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {debt.direction === 'they-owe' ? `${debt.friendName} owes you` : `You owe ${debt.friendName}`}
                  </div>
                  <div className="text-xs text-muted">{debt.note}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: debt.direction === 'they-owe' ? 'var(--positive)' : 'var(--negative)',
                  textDecoration: debt.settled ? 'line-through' : 'none',
                }}>
                  ${debt.amount}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Nudges */}
      <div className="section animate-in animate-in-3">
        <div className="section-header">
          <span className="section-label">Nudges</span>
        </div>
        <div className="flex flex-col gap-sm">
          {nudges.map(nudge => {
            const NudgeIcon = nudgeIcons[nudge.icon]
            return (
              <div key={nudge.id} className="nudge-item">
                <div className={`nudge-icon nudge-icon-${nudge.icon}`}>
                  <NudgeIcon size={16} />
                </div>
                <span style={{ flex: 1, fontSize: '0.85rem' }}>{nudge.message}</span>
                {nudge.aiAction && (
                  <button className="btn btn-ai btn-sm">Draft message</button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent hangouts */}
      <div className="section animate-in animate-in-4">
        <div className="section-header">
          <span className="section-label">Recent hangouts</span>
          <Link to="/hangouts" className="btn btn-ghost btn-sm text-sans">
            <IconPlus size={14} /> Log
          </Link>
        </div>
        <div className="flex flex-col gap-sm">
          {recentHangouts.map(h => {
            const firstFriend = friends.find(f => f.id === h.friends[0]?.id)
            return (
              <Link key={h.id} to={`/hangouts/${h.id}`} className="hangout-row">
                <div className="hangout-type-badge">
                  {h.type.slice(0, 3)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{h.type} — {h.location}</span>
                    <span className="text-xs text-muted text-sans">{h.date}</span>
                  </div>
                  <div className="pill-wrap" style={{ marginTop: '6px' }}>
                    {h.friends.map(f => {
                      const fd = friends.find(fr => fr.id === f.id)
                      return (
                        <span key={f.id} className="pill pill-default">
                          {fd && (
                            <span style={{
                              width: 14, height: 14, borderRadius: '50%', background: fd.avatarColor,
                              display: 'inline-block', verticalAlign: 'middle', marginRight: 4
                            }} />
                          )}
                          {f.name}
                          {f.feeling && <span className="text-muted" style={{ marginLeft: 4 }}>· {f.feeling.label}</span>}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Your people */}
      <div className="section animate-in animate-in-5">
        <div className="section-header">
          <span className="section-label">Your people</span>
          <Link to="/friends" className="btn btn-ghost btn-sm text-sans">View all</Link>
        </div>
        <div className="friend-grid">
          {friends.map(f => (
            <Link key={f.id} to={`/friends/${f.id}`} className="friend-card">
              <div className="friend-card-avatar" style={{ background: f.avatarColor }}>
                <span className="avatar-initials">{f.initials}</span>
                <div className="friend-card-tier">
                  <span className={`pill pill-${f.tier}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    {tierLabel(f.tier)}
                  </span>
                </div>
              </div>
              <div className="friend-card-info">
                <div className="friend-card-name">{f.name}</div>
                <div className="friend-card-meta">day {f.dayCount.toLocaleString()}</div>
              </div>
            </Link>
          ))}
          <Link to="/friends" className="add-friend-card">
            <div className="plus-icon"><IconPlus size={20} /></div>
            <span>Add friend</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
