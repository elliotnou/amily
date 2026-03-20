import { useState } from 'react'
import { Link } from 'react-router-dom'
import { friends, tierDotClass, tierLabel } from '../data/mock'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import { IconSearch, IconPlus, IconUserPlus } from '../components/Icons'

export default function Friends() {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    f.interests.some(i => i.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Friends</h1>
            <p className="page-subtitle">{friends.length} people in your graph</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <IconUserPlus size={16} />
            Add friend
          </button>
        </div>
      </div>

      <div className="search-bar animate-in animate-in-1">
        <span className="search-icon"><IconSearch size={16} /></span>
        <input
          type="text"
          placeholder="Search by name, tag, or interest..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid view */}
      <div className="friend-grid animate-in animate-in-2">
        {filtered.map(f => (
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
              <div className="friend-card-meta">{f.location}</div>
              <div className="day-counter" style={{ marginTop: '4px' }}>day {f.dayCount.toLocaleString()}</div>
            </div>
          </Link>
        ))}
        <button className="add-friend-card" onClick={() => setShowAddModal(true)}>
          <div className="plus-icon"><IconPlus size={20} /></div>
          <span>Add friend</span>
        </button>
      </div>

      {/* Add Friend Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add a friend">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" placeholder="Full name" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="City, State" />
          </div>
          <div className="form-group">
            <label className="form-label">Birthday</label>
            <input className="form-input" type="date" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">How did you meet?</label>
          <input className="form-input" placeholder="e.g. College, work, mutual friend..." />
        </div>
        <div className="form-group">
          <label className="form-label">When did you meet?</label>
          <input className="form-input" type="date" />
        </div>
        <div className="form-group">
          <label className="form-label">Tier</label>
          <div className="pill-wrap">
            <button className="pill pill-inner-circle" style={{ cursor: 'pointer' }}>Inner Circle</button>
            <button className="pill pill-close-friend" style={{ cursor: 'pointer' }}>Close Friend</button>
            <button className="pill pill-casual" style={{ cursor: 'pointer' }}>Casual</button>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Tags</label>
          <input className="form-input" placeholder="e.g. creative, foodie, tech (comma separated)" />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
          <button className="btn btn-primary">Add friend</button>
        </div>
      </Modal>
    </div>
  )
}
