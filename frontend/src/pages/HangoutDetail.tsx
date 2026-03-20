import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useHangout, useHangouts } from '../lib/hooks/useHangouts'
import { useGallery } from '../lib/hooks/useGallery'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'

function typeGradient(type: string): string {
  const t = type.toLowerCase()
  if (t.includes('dinner') || t.includes('food') || t.includes('eat') || t.includes('lunch')) return 'linear-gradient(145deg, #e07a5f 0%, #c9a96e 100%)'
  if (t.includes('coffee') || t.includes('cafe') || t.includes('brunch')) return 'linear-gradient(145deg, #a0784d 0%, #c9a96e 100%)'
  if (t.includes('hike') || t.includes('outdoor') || t.includes('walk') || t.includes('park')) return 'linear-gradient(145deg, #2d6a4f 0%, #52b788 100%)'
  if (t.includes('bar') || t.includes('drink') || t.includes('club')) return 'linear-gradient(145deg, #264653 0%, #2a9d8f 100%)'
  if (t.includes('movie') || t.includes('film') || t.includes('cinema')) return 'linear-gradient(145deg, #6d597a 0%, #9b8ec4 100%)'
  if (t.includes('sport') || t.includes('gym') || t.includes('game')) return 'linear-gradient(145deg, #457b9d 0%, #7ca5b8 100%)'
  const defaults = ['linear-gradient(145deg, #264653 0%, #457b9d 100%)', 'linear-gradient(145deg, #6d597a 0%, #b5838d 100%)', 'linear-gradient(145deg, #2d6a4f 0%, #457b9d 100%)']
  return defaults[type.length % defaults.length]
}

export default function HangoutDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hangout, loading } = useHangout(id)
  const { deleteHangout } = useHangouts()
  const { images } = useGallery(undefined, id)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    await deleteHangout(id)
    setDeleting(false)
    navigate('/hangouts')
  }

  if (loading) return <div className="page-container"><p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Loading…</p></div>
  if (!hangout) return <div className="page-container"><p>Hangout not found.</p></div>

  const banner = images[0]
  const gradient = typeGradient(hangout.type)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 'var(--space-3xl)' }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 320, marginBottom: -40 }}>

        {/* Background */}
        {banner
          ? <img src={banner.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setLightboxIdx(0)} />
          : <div style={{ position: 'absolute', inset: 0, background: gradient }} />
        }

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Back button */}
        <Link to="/hangouts" style={{
          position: 'absolute', top: 18, left: 18, zIndex: 2,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', textDecoration: 'none', fontSize: '1.1rem',
          transition: 'background 0.15s',
        }}>‹</Link>

        {/* Delete button */}
        <button onClick={() => setShowDeleteConfirm(true)} style={{
          position: 'absolute', top: 18, right: 18, zIndex: 2,
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 'var(--radius-full)', padding: '8px 14px',
          color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
          cursor: 'pointer', fontWeight: 500,
        }}>Delete</button>

        {/* Photo count badge */}
        {images.length > 1 && (
          <button onClick={() => setLightboxIdx(0)} style={{
            position: 'absolute', bottom: 60, right: 18, zIndex: 2,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)', padding: '6px 14px',
            color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
            cursor: 'pointer',
          }}>{images.length} photos</button>
        )}
      </div>

      {/* ── Content sheet ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--bg)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-xl)',
        padding: 'var(--space-xl) var(--space-xl) 0',
        boxShadow: '0 -2px 20px rgba(0,0,0,0.07)',
        marginLeft: 'var(--space-lg)',
        marginRight: 'var(--space-lg)',
      }}>
        {/* Pull handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto var(--space-lg)' }} />

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>{hangout.type}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{hangout.location}</span>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{hangout.date}</span>
            </div>
          </div>
          {/* Type pill */}
          <div style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600,
            color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
            flexShrink: 0, marginTop: 2,
          }}>{hangout.type.slice(0, 3)}</div>
        </div>

        {/* Who was there */}
        {hangout.hangout_friends.length > 0 && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>Who was there</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hangout.hangout_friends.map(hf => (
                <Link key={hf.id} to={`/friends/${hf.friend_id}`} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  textDecoration: 'none', transition: 'background 0.15s',
                }}>
                  <Avatar initials={hf.friend_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)} color="var(--accent)" size="sm" />
                  <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>{hf.friend_name}</span>
                  {hf.feeling_label && <span className="pill pill-default">{hf.feeling_label}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {hangout.highlights && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>Highlights</div>
            <div style={{
              padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              fontFamily: 'var(--font-serif)', fontSize: '0.95rem', lineHeight: 1.85,
              color: 'var(--text-primary)',
            }}>
              {hangout.highlights}
            </div>
          </div>
        )}

        {/* Photo grid */}
        {images.length > 1 && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>Photos · {images.length}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
              {images.map((img, i) => (
                <div key={img.id} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => setLightboxIdx(i)}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {i === 0 && (
                    <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.55)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                      <span style={{ color: 'white', fontSize: '0.55rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.06em' }}>COVER</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Follow-ups */}
        {hangout.follow_ups.length > 0 && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>Follow-ups</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hangout.follow_ups.map((fu, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px var(--space-md)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', fontFamily: 'var(--font-sans)' }}>
                  <div className="checkbox" />
                  <span>{fu}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete this hangout?">
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          This will permanently remove the hangout with <strong>{hangout.hangout_friends.map(hf => hf.friend_name).join(', ') || 'no one'}</strong> on <strong>{hangout.date}</strong>, including all photos. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          <button className="btn btn-primary" style={{ background: 'var(--negative)', borderColor: 'var(--negative)' }} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIdx(null)}>
          <button style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIdx(null)}>×</button>
          {lightboxIdx > 0 && (
            <button style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { e.stopPropagation(); setLightboxIdx(i => i! - 1) }}>‹</button>
          )}
          <img src={images[lightboxIdx]?.url} alt="" style={{ maxWidth: '90vw', maxHeight: '88vh', borderRadius: 'var(--radius-lg)', objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
          {lightboxIdx < images.length - 1 && (
            <button style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { e.stopPropagation(); setLightboxIdx(i => i! + 1) }}>›</button>
          )}
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)', fontSize: '0.75rem' }}>{lightboxIdx + 1} / {images.length}</div>
        </div>
      )}
    </div>
  )
}
