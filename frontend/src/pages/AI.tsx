import { useParams, Link } from 'react-router-dom'
import { useFriend } from '../lib/hooks/useFriend'
import { IconArrowLeft, IconSearch } from '../components/Icons'

export default function AI() {
  return (
    <div className="page-container">
      <div className="animate-in" style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 'var(--radius-lg)',
          background: 'var(--ai-bg)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto var(--space-lg)',
          color: 'var(--ai)', fontSize: '1.6rem',
          fontFamily: 'var(--font-serif)', fontWeight: 600,
        }}>
          AI
        </div>
        <h1 className="page-title" style={{ marginBottom: 'var(--space-sm)' }}>AI Assistant</h1>
        <p className="text-sm text-muted text-sans" style={{ maxWidth: '420px', margin: '0 auto var(--space-2xl)' }}>
          Ask anything about your friendships. Get gift ideas, plan hangouts, or prepare for catching up.
        </p>

        <div className="flex flex-col gap-sm" style={{ maxWidth: '480px', margin: '0 auto var(--space-2xl)' }}>
          {[
            "Who haven't I seen in a while?",
            'Suggest a hangout for this weekend',
            'Help me plan a birthday surprise',
            'What should I catch up on?',
          ].map((q, i) => (
            <div key={i} className="card card-compact card-clickable" style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.88rem' }}>{q}</span>
            </div>
          ))}
        </div>

        <div className="search-bar" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <span className="search-icon" style={{ color: 'var(--ai)' }}><IconSearch size={16} /></span>
          <input placeholder="Ask about your friends..." />
          <button className="btn btn-primary btn-sm">Ask</button>
        </div>
      </div>
    </div>
  )
}

export function AIGiftIdeas() {
  const { friendId } = useParams()
  const { friend } = useFriend(friendId)
  if (!friend) return <div className="page-container"><p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Loading…</p></div>

  const drinkFact = friend.facts.find(f => f.category.toLowerCase().includes('drink'))?.value
  const artistFact = friend.facts.find(f => f.category.toLowerCase().includes('artist'))?.value
  const foodFact = friend.facts.find(f => f.category.toLowerCase().includes('food'))?.value

  const giftSuggestions = [
    { name: 'Experience gift', price: '$30 - $80', reason: `Something you can do together — ${friend.name.split(' ')[0]} would appreciate the memory more than an object.` },
    ...(drinkFact ? [{ name: 'Specialty drink kit', price: '$20 - $40', reason: `They love ${drinkFact} — a premium version would be a perfect surprise.` }] : []),
    ...(artistFact ? [{ name: `${artistFact} vinyl or merch`, price: '$25 - $60', reason: `${friend.name.split(' ')[0]}'s favorite — direct or heartfelt.` }] : []),
    ...(foodFact ? [{ name: `${foodFact} cooking class or kit`, price: '$40 - $100', reason: `They love ${foodFact} — help them make it at home.` }] : []),
    { name: 'Handwritten card', price: 'Free', reason: 'The rarest gift. Tell them what they mean to you in writing.' },
  ]

  return (
    <div className="page-container">
      <Link to={`/friends/${friend.id}`} className="back-link animate-in">
        <IconArrowLeft size={14} /> {friend.name}
      </Link>
      <h1 className="page-title animate-in animate-in-1" style={{ marginBottom: 'var(--space-lg)' }}>
        Gift ideas for {friend.name.split(' ')[0]}
      </h1>
      <div className="flex flex-col gap-md animate-in animate-in-2">
        {giftSuggestions.map((g, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-sm)' }}>
              <span style={{ fontWeight: 500 }}>{g.name}</span>
              <span className="pill pill-default">{g.price}</span>
            </div>
            <p className="text-sm text-secondary">{g.reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AICatchupBrief() {
  const { friendId } = useParams()
  const { friend } = useFriend(friendId)
  if (!friend) return <div className="page-container"><p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Loading…</p></div>

  return (
    <div className="page-container">
      <Link to={`/friends/${friend.id}`} className="back-link animate-in">
        <IconArrowLeft size={14} /> {friend.name}
      </Link>
      <h1 className="page-title animate-in animate-in-1" style={{ marginBottom: 'var(--space-lg)' }}>
        Catch-up brief
      </h1>

      <div className="section animate-in animate-in-2">
        <div className="section-header">
          <span className="section-label-sm">Before you see them</span>
        </div>
        <div className="card" style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.85 }}>
          {friend.notes.length > 0 ? (
            <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-lg)' }}>
              {friend.notes.map((n, i) => (
                <li key={i} style={{ marginBottom: 'var(--space-sm)' }}>{n.text}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted font-italic">No recent notes to surface.</p>
          )}
        </div>
      </div>

      <div className="section animate-in animate-in-3">
        <div className="section-header">
          <span className="section-label-sm">Quick facts</span>
        </div>
        <div className="fact-grid">
          {friend.facts.map(fact => (
            <div key={fact.id} className="card card-compact card-flat" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="text-xs text-muted text-sans" style={{ marginBottom: '4px' }}>{fact.category}</div>
              <div style={{ fontWeight: 500 }}>{fact.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AIHangoutIdeas() {
  const { friendId } = useParams()
  const { friend } = useFriend(friendId)
  if (!friend) return <div className="page-container"><p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Loading…</p></div>

  const foodFact = friend.facts.find(f => f.category.toLowerCase().includes('food'))?.value
  const ideas = [
    { type: 'Food', suggestion: `Try a new spot — ${friend.name.split(' ')[0]} loves ${foodFact || 'good food'}.` },
    { type: 'Activity', suggestion: 'Visit a gallery or museum. Something creative to match their interests.' },
    { type: 'Chill', suggestion: 'Coffee and a walk. Low-key, good for catching up.' },
    { type: 'Adventure', suggestion: "Day trip somewhere neither of you has been." },
  ]

  return (
    <div className="page-container">
      <Link to={`/friends/${friend.id}`} className="back-link animate-in">
        <IconArrowLeft size={14} /> {friend.name}
      </Link>
      <h1 className="page-title animate-in animate-in-1" style={{ marginBottom: 'var(--space-lg)' }}>
        Hangout ideas
      </h1>
      <div className="flex flex-col gap-md animate-in animate-in-2">
        {ideas.map((idea, i) => (
          <div key={i} className="card">
            <div className="pill pill-accent" style={{ marginBottom: 'var(--space-sm)', display: 'inline-flex' }}>
              {idea.type}
            </div>
            <p style={{ fontSize: '0.9rem' }}>{idea.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
