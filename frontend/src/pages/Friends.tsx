import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFriends } from '../lib/hooks/useFriends'
import AddFriendFlow from '../components/AddFriendFlow'
import type { AddFriendPayload } from '../components/AddFriendFlow'
import { IconSearch, IconUserPlus, IconPlus } from '../components/Icons'

export default function Friends() {
  const { friends, loading, createFriend } = useFriends()
  const [search, setSearch] = useState('')
  const [showFlow, setShowFlow] = useState(false)

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.tags ?? []).some((t: string) => t.toLowerCase().includes(search.toLowerCase())) ||
    (f.interests ?? []).some((i: string) => i.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSave = async (payload: AddFriendPayload) => {
    return await createFriend(payload)
  }

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Friends</h1>
            <p className="page-subtitle">{friends.length} {friends.length === 1 ? 'person' : 'people'} in your graph</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowFlow(true)}>
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

      {loading ? (
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem' }}>
          Loading…
        </div>
      ) : (
        <div className="friend-grid animate-in animate-in-2">
          {filtered.map(f => (
            <Link key={f.id} to={`/friends/${f.id}`} className="friend-card">
              <div className="friend-card-avatar" style={{ background: f.avatar_color, overflow: 'hidden' }}>
                {f.avatar_url ? (
                  <img src={f.avatar_url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="avatar-initials">{f.initials}</span>
                )}
              </div>
              <div className="friend-card-info">
                <div className="friend-card-name">{f.name}</div>
                <div className="friend-card-meta">{f.location}</div>
                <div className="day-counter" style={{ marginTop: '4px' }}>day {f.day_count.toLocaleString()}</div>
              </div>
            </Link>
          ))}

          {friends.length === 0 && !loading && (
            <div style={{ gridColumn: '1 / -1', padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem' }}>
              No friends yet. Add someone you care about.
            </div>
          )}

          <button className="add-friend-card" onClick={() => setShowFlow(true)}>
            <div className="plus-icon"><IconPlus size={20} /></div>
            <span>Add friend</span>
          </button>
        </div>
      )}

      {showFlow && (
        <AddFriendFlow
          onClose={() => setShowFlow(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
