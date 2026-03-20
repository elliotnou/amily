import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hangouts, friends, feelings } from '../data/mock'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import { IconPlus } from '../components/Icons'

export default function Hangouts() {
  const [showLogModal, setShowLogModal] = useState(false)

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

      <div className="flex flex-col gap-md animate-in animate-in-1">
        {hangouts.map(h => (
          <Link key={h.id} to={`/hangouts/${h.id}`} className="hangout-row">
            <div className="hangout-type-badge">
              {h.type.slice(0, 3)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                  {h.type} — {h.location}
                </span>
                <span className="text-xs text-muted text-sans">{h.date}</span>
              </div>
              <p className="text-sm text-secondary text-sans" style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '8px'
              }}>
                {h.highlights}
              </p>
              <div className="pill-wrap">
                {h.friends.map(f => {
                  const fd = friends.find(fr => fr.id === f.id)
                  return (
                    <span key={f.id} className="pill pill-default">
                      {fd && (
                        <span style={{
                          width: 14, height: 14, borderRadius: '50%', background: fd.avatarColor,
                          display: 'inline-block', verticalAlign: 'middle', marginRight: 3
                        }} />
                      )}
                      {f.name}
                      {f.feeling && <span className="text-muted" style={{ marginLeft: 3 }}>· {f.feeling.label}</span>}
                    </span>
                  )
                })}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Log hangout modal */}
      <Modal open={showLogModal} onClose={() => setShowLogModal(false)} title="Log a hangout">
        <div style={{
          padding: 'var(--space-md)',
          border: '1px solid var(--ai-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--ai-bg)',
          marginBottom: 'var(--space-md)'
        }}>
          <div className="text-xs text-sans" style={{ color: 'var(--ai)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
            Describe your hangout naturally
          </div>
          <textarea
            className="form-textarea"
            style={{ background: 'transparent', border: 'none', minHeight: '80px' }}
            placeholder="e.g. Had dinner with Maya at Tatiana last Friday. The food was incredible..."
          />
        </div>

        <div className="flex items-center gap-md" style={{ margin: 'var(--space-md) 0', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span className="text-sans">or fill in manually</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <input className="form-input" placeholder="Dinner, Coffee..." />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Who was there</label>
          <div className="pill-wrap">
            {friends.map(f => (
              <button key={f.id} className="pill pill-default" style={{ cursor: 'pointer' }}>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%', background: f.avatarColor,
                  display: 'inline-block', verticalAlign: 'middle', marginRight: 3
                }} />
                {f.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" placeholder="Where?" />
        </div>

        <div className="form-group">
          <label className="form-label">How did it feel?</label>
          <div className="pill-wrap">
            {feelings.map(f => (
              <button key={f.label} className="pill pill-default" style={{ cursor: 'pointer' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Highlights</label>
          <textarea className="form-textarea" placeholder="What stood out?" />
        </div>

        {/* Debt section in log modal */}
        <div style={{
          padding: 'var(--space-md)',
          background: 'var(--bg)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-md)'
        }}>
          <div className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Split costs / IOUs</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 'var(--space-sm)', alignItems: 'end' }}>
            <div>
              <label className="text-xs text-muted text-sans" style={{ display: 'block', marginBottom: 4 }}>Who</label>
              <select className="form-input" style={{ padding: '8px' }}>
                <option>Select friend</option>
                {friends.map(f => <option key={f.id}>{f.name.split(' ')[0]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted text-sans" style={{ display: 'block', marginBottom: 4 }}>Amount</label>
              <input className="form-input" placeholder="$0.00" />
            </div>
            <div className="pill-wrap" style={{ paddingBottom: 2 }}>
              <button className="pill pill-positive" style={{ cursor: 'pointer' }}>They owe me</button>
              <button className="pill pill-negative" style={{ cursor: 'pointer' }}>I owe them</button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowLogModal(false)}>Cancel</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </Modal>
    </div>
  )
}
