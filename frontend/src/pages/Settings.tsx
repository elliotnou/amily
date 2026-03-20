import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { LogoIcon } from '../components/Icons'

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account</p>
      </div>

      {/* Account */}
      <div className="section animate-in animate-in-1">
        <div className="section-header">
          <span className="section-label">Account</span>
        </div>
        <div className="card">
          <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--text)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', flexShrink: 0,
            }}>
              <LogoIcon size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{user?.user_metadata?.display_name || 'Your account'}</div>
              <div className="text-sm text-muted text-sans">{user?.email}</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-lg)' }}>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--text)',
                textAlign: 'left',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="section animate-in animate-in-2">
        <div className="section-header">
          <span className="section-label">About</span>
        </div>
        <div className="card">
          <div className="flex items-center gap-md" style={{ marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--text)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white',
            }}>
              <LogoIcon size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontFamily: 'var(--font-serif)' }}>amily</div>
              <div className="text-xs text-muted text-sans">v0.1.0</div>
            </div>
          </div>
          <p className="text-sm text-secondary text-sans" style={{ lineHeight: 1.6, marginTop: 12 }}>
            A personal CRM for the people who matter. Keep track of friends, log time together, and never lose the thread.
          </p>
        </div>
      </div>
    </div>
  )
}
