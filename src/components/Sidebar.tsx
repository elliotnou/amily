import { NavLink, Link } from 'react-router-dom'
import { IconHome, IconUsers, IconCalendar, IconChart, IconSparkle } from './Icons'
import { friends, hangouts } from '../data/mock'

const navItems = [
  { to: '/home', label: 'Home', Icon: IconHome },
  { to: '/friends', label: 'Friends', Icon: IconUsers },
  { to: '/hangouts', label: 'Hangouts', Icon: IconCalendar },
  { to: '/stats', label: 'Stats', Icon: IconChart },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
        <div className="logo-mark">fg</div>
        friendgraph
      </Link>

      <div className="sidebar-section-label">Menu</div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/home'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-icon"><item.Icon size={18} /></span>
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to="/ai"
          className={({ isActive }) => `sidebar-link ai-link ${isActive ? 'active' : ''}`}
        >
          <span className="link-icon"><IconSparkle size={18} /></span>
          AI Assistant
        </NavLink>
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-section-label">Overview</div>
      <div className="sidebar-stats">
        <div className="sidebar-stat">
          <span>Friends</span>
          <span className="sidebar-stat-value">{friends.length}</span>
        </div>
        <div className="sidebar-stat">
          <span>Hangouts</span>
          <span className="sidebar-stat-value">{hangouts.length}</span>
        </div>
        <div className="sidebar-stat">
          <span>Inner circle</span>
          <span className="sidebar-stat-value">{friends.filter(f => f.tier === 'inner-circle').length}</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Recent friends mini list */}
      <div className="sidebar-section-label">Recent</div>
      <nav className="sidebar-nav">
        {friends.slice(0, 4).map(f => (
          <NavLink
            key={f.id}
            to={`/friends/${f.id}`}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: f.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.55rem',
                color: 'white',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {f.initials}
            </div>
            <span style={{ fontSize: '0.85rem' }}>{f.name.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div style={{
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--ai-bg)',
          border: '1px solid var(--ai-border)',
        }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '0.85rem', color: 'var(--ai)', marginBottom: '4px' }}>
            Pro
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            AI insights, smart logging, and gift ideas.
          </div>
        </div>
      </div>
    </aside>
  )
}
