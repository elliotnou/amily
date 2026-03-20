import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { LogoIcon } from '../components/Icons'

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(user?.user_metadata?.display_name || '')
  const [savingName, setSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSaveName = async () => {
    if (!nameValue.trim()) return
    setSavingName(true)
    await supabase.auth.updateUser({ data: { display_name: nameValue.trim() } })
    setSavingName(false)
    setEditingName(false)
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
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
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          {/* Display name row */}
          <div style={{ marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Display name</div>
            {editingName ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  autoFocus
                  className="form-input"
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false) }}
                  placeholder="Your name"
                  style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: '1rem' }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleSaveName} disabled={savingName || !nameValue.trim()}>
                  {savingName ? 'Saving…' : 'Save'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setEditingName(false); setNameValue(user?.user_metadata?.display_name || '') }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--text)' }}>
                  {user?.user_metadata?.display_name || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not set</span>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {nameSaved && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--positive)' }}>Saved ✓</span>}
                  <button className="btn btn-ghost btn-sm text-sans" style={{ fontSize: '0.75rem' }} onClick={() => setEditingName(true)}>Edit</button>
                </div>
              </div>
            )}
          </div>

          {/* Email row */}
          <div style={{ marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Email</div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{user?.email}</span>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              fontWeight: 500,
              color: 'var(--text)',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Sign out
          </button>
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
              <div style={{ fontWeight: 500, fontFamily: 'var(--font-serif)' }}>amiro</div>
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
