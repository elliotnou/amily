import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHangouts } from '../lib/hooks/useHangouts'
import { useFriends } from '../lib/hooks/useFriends'
import { feelings } from '../data/mock'
import Modal from '../components/Modal'
import { IconPlus } from '../components/Icons'

export default function Hangouts() {
  const { hangouts, loading, createHangout } = useHangouts()
  const { friends } = useFriends()
  const [showLogModal, setShowLogModal] = useState(false)

  // Form state
  const [hDate, setHDate] = useState(new Date().toISOString().slice(0, 10))
  const [hType, setHType] = useState('')
  const [hLocation, setHLocation] = useState('')
  const [hHighlights, setHHighlights] = useState('')
  const [hSelectedFriends, setHSelectedFriends] = useState<string[]>([])
  const [hFeeling, setHFeeling] = useState('')
  const [saving, setSaving] = useState(false)

  const toggleFriend = (id: string) =>
    setHSelectedFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

  const handleLog = async () => {
    if (!hType.trim() || !hLocation.trim()) return
    setSaving(true)
    await createHangout(
      { type: hType, location: hLocation, date: hDate, highlights: hHighlights || undefined },
      hSelectedFriends.map(id => ({ id, feeling_label: hFeeling || undefined }))
    )
    setSaving(false)
    setShowLogModal(false)
    setHType(''); setHLocation(''); setHHighlights(''); setHSelectedFriends([]); setHFeeling('')
    setHDate(new Date().toISOString().slice(0, 10))
  }

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Hangouts</h1>
            <p className="page-subtitle">{hangouts.length} logged</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowLogModal(true)}>
            <IconPlus size={16} /> Log hangout
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem' }}>Loading…</div>
      ) : hangouts.length === 0 ? (
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem' }}>
          No hangouts yet. Log your first one.
        </div>
      ) : (
        <div className="flex flex-col gap-md animate-in animate-in-1">
          {hangouts.map(h => (
            <Link key={h.id} to={`/hangouts/${h.id}`} className="hangout-row">
              <div className="hangout-type-badge">{h.type.slice(0, 3)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{h.type} — {h.location}</span>
                  <span className="text-xs text-muted text-sans">{h.date}</span>
                </div>
                {h.highlights && (
                  <p className="text-sm text-secondary text-sans" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '8px' }}>
                    {h.highlights}
                  </p>
                )}
                {h.hangout_friends.length > 0 && (
                  <div className="pill-wrap">
                    {h.hangout_friends.map(hf => (
                      <span key={hf.id} className="pill pill-default">
                        {hf.friend_name}
                        {hf.feeling_label && <span className="text-muted" style={{ marginLeft: 3 }}>· {hf.feeling_label}</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Log hangout modal */}
      <Modal open={showLogModal} onClose={() => setShowLogModal(false)} title="Log a hangout">
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
                <button
                  key={f.id}
                  className={`pill pill-default`}
                  style={{ cursor: 'pointer', opacity: hSelectedFriends.includes(f.id) ? 1 : 0.45 }}
                  onClick={() => toggleFriend(f.id)}
                >
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
              <button
                key={f.label}
                className="pill pill-default"
                style={{ cursor: 'pointer', opacity: hFeeling === f.label ? 1 : 0.45 }}
                onClick={() => setHFeeling(prev => prev === f.label ? '' : f.label)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Highlights</label>
          <textarea className="form-textarea" placeholder="What stood out?" value={hHighlights} onChange={e => setHHighlights(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowLogModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleLog} disabled={saving || !hType.trim() || !hLocation.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
