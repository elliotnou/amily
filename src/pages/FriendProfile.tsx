import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { friends, hangouts, impressions, tierClass, tierDotClass, tierLabel, tierColor } from '../data/mock'
import Modal from '../components/Modal'
import { IconArrowLeft, IconPhone, IconMail, IconLink, IconPaintbrush } from '../components/Icons'

type Tab = 'overview' | 'impressions' | 'gallery' | 'gifts'

// SVG ring dial — "freshness" of friendship based on recency
function FreshnessRing({ percentage, color, size = 140, trackColor }: { percentage: number; color: string; size?: number; trackColor?: string }) {
  const strokeWidth = size > 100 ? 8 : 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor || 'rgba(255,255,255,0.2)'}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

export default function FriendProfile() {
  const { id } = useParams()
  const friend = friends.find(f => f.id === id)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showFactModal, setShowFactModal] = useState(false)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [showImpressionModal, setShowImpressionModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)

  // Customization state
  const [themeColor, setThemeColor] = useState<string | null>(null)
  const [profileFont, setProfileFont] = useState<string>('default')
  const [effect, setEffect] = useState<string>('none')

  if (!friend) return <div className="page-container"><p>Friend not found.</p></div>

  const friendHangouts = hangouts.filter(h => h.friends.some(f => f.id === id))
  const friendImpressions = impressions.filter(i => i.friendId === id)
  const tabs: Tab[] = ['overview', 'impressions', 'gallery', 'gifts']

  // "Freshness" — how recently you've hung out (mock: based on day count inversely)
  const freshness = Math.max(10, Math.min(95, 100 - Math.floor(friend.dayCount / 40)))
  // Closeness score based on hangout count
  const closeness = Math.min(100, Math.floor((friend.hangoutCount / 25) * 100))

  const tColor = tierColor(friend.tier)
  const bannerColor = themeColor || friend.avatarColor
  const fontFamily = profileFont === 'default' ? undefined
    : profileFont === 'mono' ? "'SF Mono', 'Fira Code', monospace"
    : profileFont === 'sans' ? 'var(--font-sans)'
    : profileFont === 'serif-alt' ? "'Playfair Display', Georgia, serif"
    : undefined

  const colorSwatches = [
    friend.avatarColor,
    '#e07a5f', '#457b9d', '#c9a96e', '#7c6fbd',
    '#4a7deb', '#2d6a4f', '#d4a373', '#e76f51',
    '#264653', '#6d597a', '#b56576',
  ]

  return (
    <div className="page-container" style={{ maxWidth: 1000, ...(fontFamily ? { fontFamily } : {}) }}>
      <Link to="/friends" className="back-link animate-in">
        <IconArrowLeft size={14} /> Friends
      </Link>

      {/* ═══ HERO BANNER ═══ */}
      <div className="animate-in animate-in-1" style={{
        background: bannerColor,
        borderRadius: 'var(--radius-xl)',
        padding: '0',
        marginBottom: 'var(--space-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        ...(effect === 'glow' ? { boxShadow: `0 0 40px ${bannerColor}44, var(--shadow-md)` } : {}),
      }}>
        {/* Paintbrush customize button */}
        <button
          onClick={() => setShowCustomize(!showCustomize)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            background: showCustomize ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            backdropFilter: 'blur(4px)',
            transition: 'background 0.2s',
          }}
          title="Customize profile"
        >
          <IconPaintbrush size={16} />
        </button>

        {/* Banner gradient overlay */}
        <div style={{
          background: `linear-gradient(135deg, ${bannerColor} 0%, ${bannerColor}cc 50%, ${bannerColor}88 100%)`,
          padding: '36px 32px 32px',
          display: 'flex',
          gap: 32,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Avatar with freshness ring */}
          <div style={{ position: 'relative', flexShrink: 0, width: 140, height: 140 }}>
            <FreshnessRing percentage={freshness} color="rgba(255,255,255,0.85)" size={140} trackColor="rgba(255,255,255,0.15)" />
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              right: 12,
              bottom: 12,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'var(--font-serif)',
              fontSize: '2.4rem',
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
            }}>
              {friend.initials}
            </div>
            {/* Freshness label */}
            <div style={{
              position: 'absolute',
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              borderRadius: 'var(--radius-full)',
              padding: '3px 12px',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              color: bannerColor,
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {freshness}% fresh
            </div>
          </div>

          {/* Name + info */}
          <div style={{ flex: 1, minWidth: 200, color: 'white' }}>
            <h1 style={{
              fontFamily: fontFamily || 'var(--font-serif)',
              fontSize: '1.8rem',
              fontWeight: 500,
              marginBottom: 4,
              ...(effect === 'gradient' ? {
                background: 'linear-gradient(135deg, white 0%, rgba(255,255,255,0.6) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : { color: 'white' }),
            }}>
              {friend.name}
            </h1>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              opacity: 0.8,
              marginBottom: 16,
            }}>
              {friend.location} · {friend.metHow} · since {friend.metDate}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                color: 'white',
              }}>
                {tierLabel(friend.tier)}
              </span>
              <span style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.2)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'white',
              }}>
                day {friend.dayCount.toLocaleString()}
              </span>
              <span style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.2)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-sans)',
                color: 'white',
              }}>
                {friend.birthday}
              </span>
              {friend.aiLabel && (
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.3)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  color: 'white',
                }}>
                  {friend.aiLabel}
                </span>
              )}
            </div>
          </div>

          {/* Quick stats — big numbers */}
          <div style={{
            display: 'flex',
            gap: 24,
            flexShrink: 0,
          }}>
            {[
              { label: 'Hangouts', value: friend.hangoutCount },
              { label: 'Notes', value: friend.notes.length },
              { label: 'Closeness', value: `${closeness}%` },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: 'white',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.7)',
                  marginTop: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CUSTOMIZE PANEL ═══ */}
      {showCustomize && (
        <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
            Customize profile
          </div>

          {/* Theme color */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div className="section-label-sm" style={{ marginBottom: 8 }}>Theme color</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colorSwatches.map(c => (
                <button
                  key={c}
                  onClick={() => setThemeColor(c === friend.avatarColor ? null : c)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: c,
                    border: (themeColor || friend.avatarColor) === c ? '3px solid var(--text)' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, transform 0.15s',
                    transform: (themeColor || friend.avatarColor) === c ? 'scale(1.15)' : 'scale(1)',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Font */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div className="section-label-sm" style={{ marginBottom: 8 }}>Font style</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { key: 'default', label: 'Default', preview: 'Lora' },
                { key: 'sans', label: 'Clean', preview: 'Inter' },
                { key: 'mono', label: 'Mono', preview: 'SF Mono' },
                { key: 'serif-alt', label: 'Classic', preview: 'Playfair' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setProfileFont(f.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: profileFont === f.key ? `2px solid ${bannerColor}` : '2px solid var(--border)',
                    background: profileFont === f.key ? `${bannerColor}10` : 'var(--bg)',
                    cursor: 'pointer',
                    fontFamily: f.key === 'mono' ? "'SF Mono', monospace"
                      : f.key === 'sans' ? 'var(--font-sans)'
                      : f.key === 'serif-alt' ? "'Playfair Display', Georgia, serif"
                      : 'var(--font-serif)',
                    fontSize: '0.82rem',
                    color: profileFont === f.key ? bannerColor : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <div className="section-label-sm" style={{ marginBottom: 8 }}>Effects</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { key: 'none', label: 'None' },
                { key: 'glow', label: 'Glow' },
                { key: 'gradient', label: 'Gradient text' },
              ].map(e => (
                <button
                  key={e.key}
                  onClick={() => setEffect(e.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: effect === e.key ? `2px solid ${bannerColor}` : '2px solid var(--border)',
                    background: effect === e.key ? `${bannerColor}10` : 'var(--bg)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    color: effect === e.key ? bannerColor : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TABS ═══ */}
      <div className="tabs animate-in animate-in-2">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === 'overview' && (
        <div className="animate-in">
          {/* AI actions */}
          {friend.aiLabel && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
              <Link to={`/ai/gifts/${friend.id}`} className="btn btn-ai btn-sm">Gift ideas</Link>
              <Link to={`/ai/catchup/${friend.id}`} className="btn btn-ai btn-sm">Catch-up brief</Link>
              <Link to={`/ai/hangout-ideas/${friend.id}`} className="btn btn-ai btn-sm">Hangout ideas</Link>
            </div>
          )}

          {/* ── 2 column layout: Left = tags/interests/contact, Right = facts + mini stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-md">
              {/* Tags + Interests combined card */}
              <div className="card">
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="section-label-sm" style={{ marginBottom: 8 }}>Tags</div>
                  <div className="pill-wrap">
                    {friend.tags.map(tag => (
                      <span key={tag} className="pill pill-default">{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <span className="section-label-sm">Interests</span>
                    <button className="btn btn-ghost btn-sm text-sans" style={{ padding: '2px 6px', fontSize: '0.68rem' }} onClick={() => setShowInterestModal(true)}>+ add</button>
                  </div>
                  <div className="pill-wrap">
                    {friend.interests.map(interest => (
                      <span key={interest} className="pill pill-accent">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact card */}
              <div className="card">
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <span className="section-label-sm">Contact</span>
                  <button className="btn btn-ghost btn-sm text-sans" style={{ padding: '2px 6px', fontSize: '0.68rem' }} onClick={() => setShowContactModal(true)}>Edit</button>
                </div>
                {Object.values(friend.contact).some(Boolean) ? (
                  <div className="flex flex-col gap-sm">
                    {friend.contact.phone && (
                      <div className="flex items-center gap-sm">
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--positive-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--positive)', flexShrink: 0 }}>
                          <IconPhone size={12} />
                        </div>
                        <span style={{ fontSize: '0.82rem' }}>{friend.contact.phone}</span>
                      </div>
                    )}
                    {friend.contact.email && (
                      <div className="flex items-center gap-sm">
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                          <IconMail size={12} />
                        </div>
                        <span style={{ fontSize: '0.82rem' }}>{friend.contact.email}</span>
                      </div>
                    )}
                    {friend.contact.instagram && (
                      <div className="flex items-center gap-sm">
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--inner-circle-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--inner-circle)', flexShrink: 0 }}>
                          <IconLink size={12} />
                        </div>
                        <span style={{ fontSize: '0.82rem' }}>{friend.contact.instagram}</span>
                      </div>
                    )}
                    {friend.contact.twitter && (
                      <div className="flex items-center gap-sm">
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--close-friend-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--close-friend)', flexShrink: 0 }}>
                          <IconLink size={12} />
                        </div>
                        <span style={{ fontSize: '0.82rem' }}>{friend.contact.twitter}</span>
                      </div>
                    )}
                    {friend.contact.linkedin && (
                      <div className="flex items-center gap-sm">
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                          <IconLink size={12} />
                        </div>
                        <span style={{ fontSize: '0.82rem' }}>{friend.contact.linkedin}</span>
                      </div>
                    )}
                    {friend.contact.snapchat && (
                      <div className="flex items-center gap-sm">
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--casual-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--casual)', flexShrink: 0 }}>
                          <IconLink size={12} />
                        </div>
                        <span style={{ fontSize: '0.82rem' }}>{friend.contact.snapchat}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button className="btn btn-default btn-sm" onClick={() => setShowContactModal(true)}>Add contact info</button>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-md">
              {/* Mini visual stats card */}
              <div className="card" style={{ display: 'flex', gap: 20, justifyContent: 'center', padding: 'var(--space-lg)' }}>
                {/* Freshness ring */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 8px' }}>
                    <FreshnessRing percentage={freshness} color={friend.avatarColor} size={80} trackColor="var(--border)" />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: friend.avatarColor,
                    }}>{freshness}%</div>
                  </div>
                  <div className="text-xs text-muted text-sans">Freshness</div>
                </div>
                {/* Closeness ring */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 8px' }}>
                    <FreshnessRing percentage={closeness} color={tColor} size={80} trackColor="var(--border)" />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: tColor,
                    }}>{closeness}%</div>
                  </div>
                  <div className="text-xs text-muted text-sans">Closeness</div>
                </div>
                {/* Hangout frequency */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    flexDirection: 'column',
                  }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--text)', lineHeight: 1 }}>
                      {friend.hangoutCount}
                    </div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 2 }}>hangouts</div>
                  </div>
                  <div className="text-xs text-muted text-sans">Total</div>
                </div>
              </div>

              {/* Facts grid */}
              <div className="card">
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <span className="section-label-sm">Facts</span>
                  <button className="btn btn-ghost btn-sm text-sans" style={{ padding: '2px 6px', fontSize: '0.68rem' }} onClick={() => setShowFactModal(true)}>+ add</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {friend.facts.map(fact => (
                    <div key={fact.category} style={{
                      padding: '10px 12px',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div className="text-xs text-muted text-sans" style={{ marginBottom: 2 }}>{fact.category}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Notes — full width ── */}
          <div className="section">
            <div className="section-header">
              <span className="section-label">Notes</span>
            </div>
            {friend.notes.length > 0 ? (
              <div className="card">
                <div className="flex flex-col" style={{ gap: '10px' }}>
                  {friend.notes.map((note, i) => (
                    <div key={i} className="flex gap-md items-start" style={{ fontSize: '0.88rem' }}>
                      <span className="text-muted text-sans" style={{ width: '80px', flexShrink: 0, fontSize: '0.72rem', paddingTop: '3px' }}>{note.date}</span>
                      <span>{note.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted font-italic">No notes yet.</p>
            )}
          </div>

          {/* ── Hangouts — full width ── */}
          <div className="section">
            <div className="section-header">
              <span className="section-label">Hangouts</span>
            </div>
            <div className="flex flex-col gap-sm">
              {friendHangouts.map(h => {
                const friendInHangout = h.friends.find(f => f.id === id)
                return (
                  <Link key={h.id} to={`/hangouts/${h.id}`} className="hangout-row" style={{ padding: 'var(--space-md)' }}>
                    <div className="hangout-type-badge" style={{ width: 36, height: 36, fontSize: '0.6rem' }}>
                      {h.type.slice(0, 3)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{h.type} — {h.location}</div>
                      <div className="text-xs text-muted text-sans">{h.date}</div>
                    </div>
                    {friendInHangout?.feeling && (
                      <span className="pill pill-default">{friendInHangout.feeling.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ IMPRESSIONS TAB ═══ */}
      {activeTab === 'impressions' && (
        <div className="animate-in">
          <button className="btn btn-default" onClick={() => setShowImpressionModal(true)} style={{ marginBottom: 'var(--space-lg)' }}>
            Write an impression
          </button>
          {friendImpressions.length > 0 ? (
            friendImpressions.map(imp => (
              <div key={imp.id} className="impression">
                <div className="impression-title">{imp.title}</div>
                <div className="impression-date">{imp.date}</div>
                <div className="impression-body">{imp.body}</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No impressions yet. Write one — it's just for you.</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ GALLERY TAB ═══ */}
      {activeTab === 'gallery' && (
        <div className="animate-in">
          <button className="btn btn-default" style={{ marginBottom: 'var(--space-lg)' }}>Add photos</button>
          <div className="empty-state">
            <p>No photos yet. Add some memories.</p>
          </div>
        </div>
      )}

      {/* ═══ GIFTS TAB ═══ */}
      {activeTab === 'gifts' && (
        <div className="animate-in">
          {friend.aiLabel && (
            <Link to={`/ai/gifts/${friend.id}`} className="btn btn-ai" style={{ marginBottom: 'var(--space-lg)' }}>
              AI gift suggestions
            </Link>
          )}
          <div className="section">
            <div className="section-header">
              <span className="section-label-sm">Gift history</span>
            </div>
            <div className="empty-state">
              <p>No gifts logged yet.</p>
            </div>
          </div>
          <div className="section">
            <div className="section-header">
              <span className="section-label-sm">Ideas</span>
            </div>
            <div className="pill-wrap">
              <span className="pill pill-default">Camera film</span>
              <span className="pill pill-default">Coffee subscription</span>
              <span className="pill pill-default">Art print</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      <Modal open={showFactModal} onClose={() => setShowFactModal(false)} title="Add a fact">
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="pill-wrap">
            {['Fave food', 'Drink order', 'Dietary', 'Fave artist', 'Fave color', 'Fave movie', 'Fave book', 'Shirt size'].map(cat => (
              <button key={cat} className="pill pill-default" style={{ cursor: 'pointer' }}>{cat}</button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Value</label>
          <input className="form-input" placeholder="Enter value..." />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowFactModal(false)}>Cancel</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </Modal>

      <Modal open={showInterestModal} onClose={() => setShowInterestModal(false)} title="Add an interest">
        <div className="form-group">
          <input className="form-input" placeholder="e.g. film photography, hiking..." />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowInterestModal(false)}>Cancel</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </Modal>

      <Modal open={showImpressionModal} onClose={() => setShowImpressionModal(false)} title="Write an impression">
        <div className="form-group">
          <input className="form-input" placeholder="Title (optional)" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }} />
        </div>
        <div className="form-group">
          <textarea className="form-textarea form-textarea-serif" placeholder="Write freely. This is just for you..." />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowImpressionModal(false)}>Cancel</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </Modal>

      <Modal open={showContactModal} onClose={() => setShowContactModal(false)} title="Edit contact info">
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" placeholder="(555) 000-0000" defaultValue={friend.contact.phone || ''} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" placeholder="name@email.com" defaultValue={friend.contact.email || ''} />
        </div>
        <div className="form-group">
          <label className="form-label">Instagram</label>
          <input className="form-input" placeholder="@username" defaultValue={friend.contact.instagram || ''} />
        </div>
        <div className="form-group">
          <label className="form-label">Twitter / X</label>
          <input className="form-input" placeholder="@handle" defaultValue={friend.contact.twitter || ''} />
        </div>
        <div className="form-group">
          <label className="form-label">LinkedIn</label>
          <input className="form-input" placeholder="username" defaultValue={friend.contact.linkedin || ''} />
        </div>
        <div className="form-group">
          <label className="form-label">Snapchat</label>
          <input className="form-input" placeholder="username" defaultValue={friend.contact.snapchat || ''} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowContactModal(false)}>Cancel</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </Modal>
    </div>
  )
}
