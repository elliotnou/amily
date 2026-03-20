import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHangouts } from '../lib/hooks/useHangouts'
import { useFriends } from '../lib/hooks/useFriends'
import { feelings } from '../data/mock'
import { uploadImage } from '../lib/cloudinary'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import Modal from '../components/Modal'
import { IconPlus } from '../components/Icons'

const MAX_PHOTOS = 5

function IconImage({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

interface AlbumPhoto {
  preview: string
  url: string | null
  uploading: boolean
}

function typeGradient(type: string): string {
  const t = type.toLowerCase()
  if (t.includes('dinner') || t.includes('food') || t.includes('eat') || t.includes('lunch')) return 'linear-gradient(145deg, #e07a5f 0%, #c9a96e 100%)'
  if (t.includes('coffee') || t.includes('cafe') || t.includes('brunch')) return 'linear-gradient(145deg, #a0784d 0%, #c9a96e 100%)'
  if (t.includes('hike') || t.includes('outdoor') || t.includes('walk') || t.includes('park') || t.includes('nature')) return 'linear-gradient(145deg, #2d6a4f 0%, #52b788 100%)'
  if (t.includes('bar') || t.includes('drink') || t.includes('club') || t.includes('cocktail')) return 'linear-gradient(145deg, #264653 0%, #2a9d8f 100%)'
  if (t.includes('movie') || t.includes('film') || t.includes('cinema') || t.includes('show')) return 'linear-gradient(145deg, #6d597a 0%, #9b8ec4 100%)'
  if (t.includes('sport') || t.includes('gym') || t.includes('game') || t.includes('tennis')) return 'linear-gradient(145deg, #457b9d 0%, #7ca5b8 100%)'
  if (t.includes('travel') || t.includes('trip') || t.includes('beach') || t.includes('road')) return 'linear-gradient(145deg, #4a7deb 0%, #7ca5b8 100%)'
  const defaults = [
    'linear-gradient(145deg, #264653 0%, #457b9d 100%)',
    'linear-gradient(145deg, #6d597a 0%, #b5838d 100%)',
    'linear-gradient(145deg, #2d6a4f 0%, #457b9d 100%)',
    'linear-gradient(145deg, #e07a5f 0%, #6d597a 100%)',
  ]
  return defaults[type.length % defaults.length]
}

export default function Hangouts() {
  const { hangouts, loading, createHangout } = useHangouts()
  const { friends } = useFriends()
  const { user } = useAuth()
  const [showLogModal, setShowLogModal] = useState(false)
  const [bannerMap, setBannerMap] = useState<Record<string, string>>({})
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Load first photo per hangout for banner display
  useEffect(() => {
    if (!user) return
    supabase
      .from('gallery_images')
      .select('hangout_id, url')
      .not('hangout_id', 'is', null)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        const map: Record<string, string> = {}
        for (const row of data ?? []) {
          if (row.hangout_id && !map[row.hangout_id]) map[row.hangout_id] = row.url
        }
        setBannerMap(map)
      })
  }, [user, hangouts])

  // Form state
  const [hDate, setHDate] = useState(new Date().toISOString().slice(0, 10))
  const [hType, setHType] = useState('')
  const [hLocation, setHLocation] = useState('')
  const [hHighlights, setHHighlights] = useState('')
  const [hSelectedFriends, setHSelectedFriends] = useState<string[]>([])
  const [hFeeling, setHFeeling] = useState('')
  const [album, setAlbum] = useState<AlbumPhoto[]>([])
  const [saving, setSaving] = useState(false)

  const toggleFriend = (id: string) =>
    setHSelectedFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

  const handlePhotoAdd = async (files: FileList) => {
    const slots = MAX_PHOTOS - album.length
    const toAdd = Array.from(files).slice(0, slots)
    if (toAdd.length === 0) return
    const placeholders: AlbumPhoto[] = toAdd.map(f => ({ preview: URL.createObjectURL(f), url: null, uploading: true }))
    setAlbum(prev => [...prev, ...placeholders])
    await Promise.all(toAdd.map(async (file, i) => {
      try {
        const url = await uploadImage(file, { maxWidth: 1400, quality: 0.84 })
        setAlbum(prev => { const next = [...prev]; const idx = prev.length - toAdd.length + i; if (next[idx]) next[idx] = { ...next[idx], url, uploading: false }; return next })
      } catch {
        setAlbum(prev => { const next = [...prev]; const idx = prev.length - toAdd.length + i; if (next[idx]) next[idx] = { ...next[idx], uploading: false }; return next })
      }
    }))
  }

  const removePhoto = (i: number) => setAlbum(prev => prev.filter((_, idx) => idx !== i))
  const moveFirst = (i: number) => {
    if (i === 0) return
    setAlbum(prev => { const next = [...prev]; const [moved] = next.splice(i, 1); next.unshift(moved); return next })
  }

  const resetForm = () => {
    setHType(''); setHLocation(''); setHHighlights('')
    setHSelectedFriends([]); setHFeeling(''); setAlbum([])
    setHDate(new Date().toISOString().slice(0, 10))
  }

  const anyUploading = album.some(p => p.uploading)

  const handleLog = async () => {
    if (!hType.trim() || !hLocation.trim() || anyUploading) return
    setSaving(true)
    const result = await createHangout(
      { type: hType, location: hLocation, date: hDate, highlights: hHighlights || undefined },
      hSelectedFriends.map(id => ({ id, feeling_label: hFeeling || undefined }))
    )
    if (result?.id && user && album.length > 0) {
      const rows = album.filter(p => p.url).map(p => ({ hangout_id: result.id, url: p.url!, user_id: user.id, caption: null, friend_id: null }))
      if (rows.length > 0) await supabase.from('gallery_images').insert(rows)
    }
    setSaving(false)
    setShowLogModal(false)
    resetForm()
  }

  // Stats
  const now = new Date()
  const thisMonth = hangouts.filter(h => {
    const d = new Date(h.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length

  return (
    <div className="page-container">

      {/* Header */}
      <div className="animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>Hangouts</h1>
            <p className="page-subtitle">{hangouts.length} {hangouts.length === 1 ? 'memory' : 'memories'} logged</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowLogModal(true)}>
            <IconPlus size={16} /> Log hangout
          </button>
        </div>

        {/* Stats strip */}
        {hangouts.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            {[
              { label: 'Total', value: hangouts.length },
              { label: 'This month', value: thisMonth },
              { label: 'With photos', value: Object.keys(bannerMap).length },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, padding: '10px 14px', background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: 2,
              }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 500, lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem' }}>Loading…</div>
      ) : hangouts.length === 0 ? (
        <div style={{
          padding: 'var(--space-3xl)', textAlign: 'center', color: 'var(--text-muted)',
          fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius-xl)',
        }}>
          <div style={{ fontSize: '1.6rem', marginBottom: 'var(--space-md)', opacity: 0.4 }}>✦</div>
          No memories yet. Log your first hangout.
        </div>
      ) : (
        <div className="animate-in animate-in-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-lg)' }}>
          {hangouts.map(h => {
            const banner = bannerMap[h.id]
            const gradient = typeGradient(h.type)
            return (
              <Link
                key={h.id}
                to={`/hangouts/${h.id}`}
                className="hangout-card-link"
                style={{
                  display: 'block', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                  aspectRatio: '4/3', position: 'relative', textDecoration: 'none',
                  boxShadow: 'var(--shadow-md)', flexShrink: 0,
                }}
              >
                {/* Background */}
                {banner
                  ? <img src={banner} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, background: gradient }} />
                }

                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 35%, rgba(0,0,0,0.72) 100%)' }} />

                {/* Type badge — top left */}
                <div style={{
                  position: 'absolute', top: 14, left: 14,
                  background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  borderRadius: 'var(--radius-full)', padding: '4px 12px',
                  color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.68rem',
                  fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>{h.type}</div>

                {/* Bottom info */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 18px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
                      <div style={{
                        fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'white',
                        fontWeight: 500, marginBottom: 3, lineHeight: 1.25,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{h.location}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)' }}>{h.date}</div>
                    </div>

                    {/* Friend avatar stack */}
                    {h.hangout_friends.length > 0 && (
                      <div style={{ display: 'flex', flexShrink: 0 }}>
                        {h.hangout_friends.slice(0, 3).map((hf, i) => (
                          <div key={hf.id} style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            border: '2px solid rgba(255,255,255,0.55)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 700,
                            color: 'white', marginLeft: i > 0 ? -8 : 0,
                            position: 'relative', zIndex: 3 - i,
                          }}>
                            {hf.friend_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Highlights snippet */}
                  {h.highlights && (
                    <div style={{
                      marginTop: 8, fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
                      color: 'rgba(255,255,255,0.6)', lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{h.highlights}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Log hangout modal */}
      <Modal open={showLogModal} onClose={() => { setShowLogModal(false); resetForm() }} title="Log a hangout">

        {/* Photo album */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: 8 }}>
            Photos <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>— up to {MAX_PHOTOS}, first is banner</span>
          </label>
          {album.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 8 }}>
              {album.map((photo, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg)' }}>
                  <img src={photo.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: photo.uploading ? 0.5 : 1 }} />
                  {photo.uploading && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                      <span style={{ color: 'white', fontSize: '0.65rem', fontFamily: 'var(--font-sans)' }}>↑</span>
                    </div>
                  )}
                  {i === 0 && !photo.uploading && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '3px', textAlign: 'center' }}>
                      <span style={{ color: 'white', fontSize: '0.55rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>BANNER</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 3, right: 3, display: 'flex', gap: 3 }}>
                    {i !== 0 && (
                      <button onClick={() => moveFirst(i)} style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Set as banner">★</button>
                    )}
                    <button onClick={() => removePhoto(i)} style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', color: 'white', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                  </div>
                </div>
              ))}
              {album.length < MAX_PHOTOS && (
                <button onClick={() => photoInputRef.current?.click()} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--text-muted)' }}>
                  <IconImage size={16} />
                  <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-sans)' }}>Add</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => photoInputRef.current?.click()}
              style={{ width: '100%', padding: '18px', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)', transition: 'border-color 0.15s, background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-bg)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)' }}
            >
              <IconImage size={20} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>Add photos (up to {MAX_PHOTOS})</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', opacity: 0.7 }}>First photo becomes the banner</span>
            </button>
          )}
          <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => e.target.files && handlePhotoAdd(e.target.files)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={hDate} onChange={e => setHDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type *</label>
            <input className="form-input" placeholder="Dinner, Coffee, Hike…" value={hType} onChange={e => setHType(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location *</label>
          <input className="form-input" placeholder="Where?" value={hLocation} onChange={e => setHLocation(e.target.value)} />
        </div>

        {friends.length > 0 && (
          <div className="form-group">
            <label className="form-label">Who was there</label>
            <div className="pill-wrap">
              {friends.map(f => (
                <button key={f.id} className="pill pill-default" style={{ cursor: 'pointer', opacity: hSelectedFriends.includes(f.id) ? 1 : 0.45 }} onClick={() => toggleFriend(f.id)}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: f.avatar_color, display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} />
                  {f.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">How did it feel?</label>
          <div className="pill-wrap">
            {feelings.map(f => (
              <button key={f.label} className="pill pill-default" style={{ cursor: 'pointer', opacity: hFeeling === f.label ? 1 : 0.45 }} onClick={() => setHFeeling(prev => prev === f.label ? '' : f.label)}>{f.label}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Highlights</label>
          <textarea className="form-textarea" placeholder="What stood out?" value={hHighlights} onChange={e => setHHighlights(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => { setShowLogModal(false); resetForm() }}>Cancel</button>
          <button className="btn btn-primary" onClick={handleLog} disabled={saving || !hType.trim() || !hLocation.trim() || anyUploading}>
            {saving ? 'Saving…' : anyUploading ? 'Uploading photos…' : 'Save'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
