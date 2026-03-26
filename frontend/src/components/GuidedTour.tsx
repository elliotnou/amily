import { useState, useEffect, useCallback, useRef } from 'react'

export interface TourStep {
  selector: string
  title: string
  description: string
  arrowSide: 'left' | 'right' | 'top' | 'bottom'
  padding?: number
}

export const HOME_STEPS: TourStep[] = [
  {
    selector: '.sidebar-nav',
    title: 'Navigate around',
    description: 'Use the sidebar to jump between Friends, Groups, Hangouts, and Stats.',
    arrowSide: 'left',
  },
  {
    selector: '[data-tour="people"]',
    title: 'Your people',
    description: 'See your closest friends at a glance. Click anyone to view their profile.',
    arrowSide: 'bottom',
  },
  {
    selector: '[data-tour="actions"]',
    title: 'Quick actions',
    description: 'Log hangouts, add friends, and see upcoming birthdays right from here.',
    arrowSide: 'bottom',
  },
  {
    selector: '[data-tour="stats"]',
    title: 'Your activity',
    description: 'Track how often you\'re seeing people. The chart shows your last 12 months.',
    arrowSide: 'top',
  },
]

export const PROFILE_STEPS: TourStep[] = [
  {
    selector: '[data-tour="profile-hero"]',
    title: 'Your friend\'s profile',
    description: 'See their stats, tier, and how fresh your connection is at a glance.',
    arrowSide: 'top',
  },
  {
    selector: '[data-tour="profile-edit"]',
    title: 'Customize it',
    description: 'Edit their info or change the profile\'s look — colors, fonts, patterns, stickers.',
    arrowSide: 'right',
  },
  {
    selector: '[data-tour="profile-tabs"]',
    title: 'Explore the tabs',
    description: 'Overview for facts & notes, Impressions for journal entries, Gallery for photos, and AI for gift ideas & more.',
    arrowSide: 'bottom',
  },
  {
    selector: '[data-tour="profile-radar"]',
    title: 'Relationship radar',
    description: 'A visual snapshot of your friendship — recency, closeness, depth, knowledge, consistency, and longevity.',
    arrowSide: 'right',
    padding: 16,
  },
  {
    selector: '[data-tour="profile-facts"]',
    title: 'Remember the details',
    description: 'Store facts about them — favorite food, allergies, shoe size, anything. Never forget the little things.',
    arrowSide: 'right',
    padding: 14,
  },
]

function DoodleArrow({ side, size = 60 }: { side: string; size?: number }) {
  if (side === 'left') {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%) scaleX(-1)', marginRight: -4 }}>
        <path d="M8 30 C18 28, 30 26, 48 30" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M40 22 L50 30 L40 38" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  }
  if (side === 'right') {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: -4 }}>
        <path d="M8 30 C18 28, 30 26, 48 30" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M40 22 L50 30 L40 38" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  }
  if (side === 'top') {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', marginBottom: -4 }}>
        <path d="M30 52 C28 40, 26 28, 30 10" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M22 18 L30 8 L38 18" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', marginTop: -4 }}>
      <path d="M30 8 C28 20, 26 32, 30 50" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M22 42 L30 52 L38 42" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

const T = '450ms cubic-bezier(0.4, 0, 0.2, 1)'
const DEFAULT_PAD = 8

function measureEl(selector: string, arrowSide: string, pad = DEFAULT_PAD) {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  const spot = { x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 }

  const tw = 280, th = 160, gap = 66
  let top = 0, left = 0
  if (arrowSide === 'left') { top = r.top + r.height / 2 - th / 2; left = r.right + gap }
  else if (arrowSide === 'right') { top = r.top + r.height / 2 - th / 2; left = r.left - tw - gap }
  else if (arrowSide === 'top') { top = r.bottom + gap; left = r.left + r.width / 2 - tw / 2 }
  else { top = r.top - th - gap; left = r.left + r.width / 2 - tw / 2 }
  top = Math.max(20, Math.min(top, window.innerHeight - th - 20))
  left = Math.max(20, Math.min(left, window.innerWidth - tw - 20))

  return { spot, tip: { top, left } }
}

export default function GuidedTour({ steps, onComplete }: { steps: TourStep[]; onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [entered, setEntered] = useState(false)
  const posRef = useRef({ spot: { x: 0, y: 0, w: 0, h: 0 }, tip: { top: 0, left: 0 } })
  const [pos, setPos] = useState(posRef.current)

  const current = steps[step]

  const measure = useCallback(() => {
    const m = measureEl(current.selector, current.arrowSide, current.padding)
    if (m) {
      posRef.current = m
      setPos(m)
    }
  }, [current.selector, current.arrowSide])

  // Lock scroll while tour is active
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
      document.body.style.overflow = ''
    }
  }, [])

  // Initial entrance — wait for the first target element to exist in the DOM
  useEffect(() => {
    let cancelled = false
    const tryStart = () => {
      if (cancelled) return
      const el = document.querySelector(steps[0]?.selector)
      if (el) {
        measure()
        setEntered(true)
      } else {
        requestAnimationFrame(tryStart)
      }
    }
    const t = setTimeout(tryStart, 500)
    return () => { cancelled = true; clearTimeout(t) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Step changes — just re-measure, CSS handles the glide
  useEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const { spot, tip } = pos

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      opacity: entered ? 1 : 0,
      transition: 'opacity 400ms ease',
      cursor: 'pointer',
    }}
    onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete()}>
      {/* Overlay with cutout — the cutout rect animates via CSS */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={spot.x} y={spot.y} width={spot.w} height={spot.h} rx={14} fill="black"
              style={{ transition: `x ${T}, y ${T}, width ${T}, height ${T}` }} />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#tour-mask)" />
      </svg>

      {/* Spotlight border */}
      <div style={{
        position: 'absolute',
        left: spot.x, top: spot.y, width: spot.w, height: spot.h,
        borderRadius: 14,
        border: '2px solid rgba(224,122,95,0.4)',
        boxShadow: '0 0 0 4px rgba(224,122,95,0.08)',
        pointerEvents: 'none',
        transition: `left ${T}, top ${T}, width ${T}, height ${T}`,
      }} />

      {/* Tooltip */}
      <div style={{
        position: 'absolute',
        top: tip.top, left: tip.left,
        width: 280,
        background: 'var(--bg-card)',
        borderRadius: 18,
        padding: '24px 22px 20px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        border: '1px solid var(--border)',
        transition: `top ${T}, left ${T}`,
      }}>
        <DoodleArrow side={current.arrowSide} />

        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
          {current.title}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
          {current.description}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
            click anywhere to continue
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === step ? 'var(--accent)' : 'var(--border)',
                transition: 'background 300ms ease',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
