import { useState, useRef } from 'react'
import { uploadImage } from '../lib/cloudinary'
import { tierLabel, tierColor } from '../data/mock'

const COLORS = [
  '#e07a5f','#457b9d','#6b8f71','#c9a96e',
  '#7ca5b8','#9b8ec4','#4a7deb','#d4a373',
  '#e76f51','#2d6a4f','#6d597a','#264653',
]

function getInitials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export interface AddFriendPayload {
  name: string
  initials: string
  avatar_color: string
  avatar_url: string | null
  location: string | null
  birthday: string | null
  met_how: string | null
  met_date: string | null
  tier: 'inner-circle' | 'close-friend' | 'casual'
  tags: string[]
  interests: string[]
}

interface Props {
  onClose: () => void
  onSave: (payload: AddFriendPayload) => Promise<{ error: string | null } | void>
}

const TIERS: { key: 'inner-circle' | 'close-friend' | 'casual'; emoji: string; desc: string }[] = [
  { key: 'inner-circle', emoji: '✦', desc: 'Your closest people. The ones you call first.' },
  { key: 'close-friend', emoji: '◆', desc: 'Real friends. You check in, they check in.' },
  { key: 'casual', emoji: '◇', desc: 'People you enjoy. Seeing them is always a good vibe.' },
]

const MET_HOW_OPTIONS = ['School','Work','Mutual friend','Online','Neighborhood','Event','Travel','Family','Other']

export default function AddFriendFlow({ onClose, onSave }: Props) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[1])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [tier, setTier] = useState<'inner-circle' | 'close-friend' | 'casual'>('casual')
  const [metHow, setMetHow] = useState('')
  const [metDate, setMetDate] = useState('')
  const [location, setLocation] = useState('')
  const [birthday, setBirthday] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const fileRef = useRef<HTMLInputElement>(null)

  const initials = name.trim() ? getInitials(name) : '?'
  const steps = ['Who?', 'Connection', 'Details']
  const progress = ((step + 1) / steps.length) * 100

  const goNext = () => { setDirection('forward'); setStep(prev => prev + 1) }
  const goBack = () => { setDirection('back'); setStep(prev => prev - 1) }

  const handlePhotoSelect = async (file: File) => {
    setAvatarPreview(URL.createObjectURL(file))
    setUploadError(null)
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setAvatarUrl(url)
    } catch (e: unknown) {
      setUploadError('Photo upload failed. Check Cloudinary config in .env')
      setAvatarPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    const result = await onSave({
      name: name.trim(),
      initials: getInitials(name),
      avatar_color: color,
      avatar_url: avatarUrl,
      location: location || null,
      birthday: birthday || null,
      met_how: metHow || null,
      met_date: metDate || null,
      tier,
      tags: [],
      interests: [],
    })
    setSaving(false)
    if (result && result.error) { setSaveError(result.error); return }
    onClose()
  }

  // ── overlay styles ──
  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px',
    animation: 'fadeIn 200ms ease',
  }

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
    width: '100%', maxWidth: 520,
    overflow: 'hidden',
    animation: `${direction === 'forward' ? 'slideUp' : 'slideDown'} 280ms cubic-bezier(0.34,1.56,0.64,1)`,
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes slideDown { from { transform: translateY(-16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.04) } }
        .tier-card:hover { transform: translateY(-2px); border-color: var(--accent) !important; }
      `}</style>

      <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div style={card}>
          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--border)' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: color, transition: 'width 400ms ease, background 300ms ease' }} />
          </div>

          {/* Step header */}
          <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {steps.map((_label, i) => (
                <div key={i} style={{
                  width: i === step ? 20 : 6, height: 6,
                  borderRadius: 'var(--radius-full)',
                  background: i <= step ? color : 'var(--border)',
                  transition: 'all 300ms ease',
                }} />
              ))}
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem', padding: 4, lineHeight: 1 }}>×</button>
          </div>

          {/* ═══ STEP 0: WHO ═══ */}
          {step === 0 && (
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Live avatar preview */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: 110, height: 110, borderRadius: '50%',
                    background: avatarPreview ? 'transparent' : color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    boxShadow: `0 0 0 4px var(--bg-card), 0 0 0 6px ${color}33`,
                    transition: 'background 300ms, box-shadow 300ms',
                    animation: name.trim() ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 500, color: 'white' }}>{initials}</span>
                  )}
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 200ms',
                    color: 'white', fontSize: '0.7rem', fontFamily: 'var(--font-sans)',
                  }}
                    className="avatar-overlay"
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >
                    {uploading ? '⏳' : '+ photo'}
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && handlePhotoSelect(e.target.files[0])} />
                {uploading && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 8 }}>Uploading…</p>}
                {uploadError && <p style={{ fontSize: '0.72rem', color: '#dc2626', fontFamily: 'var(--font-sans)', marginTop: 8 }}>{uploadError}</p>}
                {avatarUrl && !uploading && <p style={{ fontSize: '0.72rem', color: 'var(--positive)', fontFamily: 'var(--font-sans)', marginTop: 8 }}>✓ Photo saved</p>}
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, marginBottom: 6, textAlign: 'center' }}>
                Who are you adding?
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
                Tap the circle to add a photo, or just start with initials.
              </p>

              <input
                autoFocus
                className="form-input"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && goNext()}
                style={{ fontSize: '1.1rem', textAlign: 'center', fontFamily: 'var(--font-serif)', marginBottom: 20, letterSpacing: '0.01em' }}
              />

              {/* Color swatches */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, textAlign: 'center' }}>Pick a colour</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)} style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, padding: 0, cursor: 'pointer',
                      border: color === c ? '3px solid var(--text)' : '3px solid transparent',
                      transform: color === c ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 200ms ease', outline: 'none',
                    }} />
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }} onClick={goNext} disabled={!name.trim()}>
                Continue →
              </button>
            </div>
          )}

          {/* ═══ STEP 1: CONNECTION ═══ */}
          {step === 1 && (
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Mini avatar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: avatarPreview ? 'transparent' : color, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 3px var(--bg-card), 0 0 0 5px ${color}33` }}>
                  {avatarPreview ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'white', fontWeight: 500 }}>{initials}</span>}
                </div>
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 500, marginBottom: 4, textAlign: 'center' }}>
                How do you know {name.split(' ')[0]}?
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
                Where do they fit in your world?
              </p>

              {/* Tier cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                {TIERS.map(t => (
                  <button key={t.key} className="tier-card" onClick={() => setTier(t.key)} style={{
                    padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: `2px solid ${tier === t.key ? tierColor(t.key) : 'var(--border)'}`,
                    background: tier === t.key ? `${tierColor(t.key)}10` : 'var(--bg)',
                    textAlign: 'left', transition: 'all 200ms ease',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <span style={{ fontSize: '1.4rem', color: tierColor(t.key), flexShrink: 0, width: 28, textAlign: 'center' }}>{t.emoji}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: tier === t.key ? tierColor(t.key) : 'var(--text)', marginBottom: 2 }}>{tierLabel(t.key)}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* How / when you met */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>How did you meet?</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MET_HOW_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => setMetHow(metHow === opt ? '' : opt)} style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                      fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                      border: `1.5px solid ${metHow === opt ? color : 'var(--border)'}`,
                      background: metHow === opt ? `${color}15` : 'transparent',
                      color: metHow === opt ? color : 'var(--text-secondary)',
                      transition: 'all 180ms ease', fontWeight: metHow === opt ? 600 : 400,
                    }}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 22 }}>
                <label className="form-label">When did you meet?</label>
                <input className="form-input" type="date" value={metDate} onChange={e => setMetDate(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={goBack}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2, padding: '12px', background: color, borderColor: color }} onClick={goNext}>Continue →</button>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: DETAILS ═══ */}
          {step === 2 && (
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Mini avatar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: avatarPreview ? 'transparent' : color, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 3px var(--bg-card), 0 0 0 5px ${color}33` }}>
                  {avatarPreview ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'white', fontWeight: 500 }}>{initials}</span>}
                </div>
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 500, marginBottom: 4, textAlign: 'center' }}>
                A little more about {name.split(' ')[0]}
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
                All optional — you can always fill these in later.
              </p>

              <div className="form-group">
                <label className="form-label">Where are they based?</label>
                <input className="form-input" placeholder="City, State or Country" value={location} onChange={e => setLocation(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Birthday</label>
                <input className="form-input" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
              </div>

              {saveError && (
                <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#dc2626', marginBottom: 'var(--space-md)' }}>
                  {saveError}
                </div>
              )}

              {/* Final CTA */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={goBack}>← Back</button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  style={{
                    flex: 2, padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                    background: color, color: 'white', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.95rem',
                    opacity: (saving || uploading) ? 0.6 : 1, transition: 'opacity 200ms',
                  }}
                >
                  {saving ? 'Adding…' : `Add ${name.split(' ')[0]} ✦`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
