import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight } from '../components/Icons'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Real face avatars from randomuser.me (stable seed URLs)
const avatars = [
  { initials: 'MC', color: '#e07a5f', name: 'Maya Chen', img: 'https://i.pravatar.cc/300?img=5' },
  { initials: 'JW', color: '#457b9d', name: 'Jordan Williams', img: 'https://i.pravatar.cc/300?img=12' },
  { initials: 'PS', color: '#6b8f71', name: 'Priya Sharma', img: 'https://i.pravatar.cc/300?img=32' },
  { initials: 'LM', color: '#c9a96e', name: 'Leo Morales', img: 'https://i.pravatar.cc/300?img=53' },
  { initials: 'SR', color: '#7ca5b8', name: 'Sam Rivera', img: 'https://i.pravatar.cc/300?img=11' },
  { initials: 'AO', color: '#9b8ec4', name: 'Aisha Okafor', img: 'https://i.pravatar.cc/300?img=44' },
]

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)
  const howRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.hero-title', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })
      gsap.from('.hero-sub', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
      gsap.from('.hero-buttons', { y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' })
      gsap.from('.hero-avatar', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.6,
        ease: 'back.out(1.7)',
      })

      // Features cards stagger on scroll
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // Demo section
      gsap.from('.demo-label', {
        scrollTrigger: { trigger: demoRef.current, start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
      gsap.from('.demo-screen', {
        scrollTrigger: { trigger: demoRef.current, start: 'top 75%' },
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
      })

      // How it works steps
      gsap.from('.how-step', {
        scrollTrigger: { trigger: howRef.current, start: 'top 80%' },
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // Bottom CTA
      gsap.from('.cta-block', {
        scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      {/* ═══ NAV ═══ */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(240,240,243,0.85)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.35rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.75rem', fontWeight: 600,
          }}>fg</div>
          friendgraph
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/home" className="btn btn-ghost" style={{ fontFamily: 'var(--font-serif)' }}>Log in</Link>
          <Link to="/home" className="btn btn-primary">Sign up free</Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} style={{
        textAlign: 'center',
        padding: '80px 24px 100px',
        maxWidth: 800,
        margin: '0 auto',
      }}>
        {/* Avatar stack */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          {avatars.map((a, i) => (
            <div
              key={i}
              className="hero-avatar"
              style={{
                width: 60, height: 60, borderRadius: '50%',
                border: '3px solid var(--bg)',
                marginLeft: i === 0 ? 0 : -14,
                zIndex: 6 - i,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                background: a.color,
              }}
            >
              <img
                src={a.img}
                alt={a.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to initials if image fails
                  const target = e.currentTarget
                  target.style.display = 'none'
                  target.parentElement!.style.display = 'flex'
                  target.parentElement!.style.alignItems = 'center'
                  target.parentElement!.style.justifyContent = 'center'
                }}
              />
            </div>
          ))}
        </div>

        <h1 className="hero-title" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
          fontWeight: 500,
          lineHeight: 1.12,
          color: 'var(--text)',
          marginBottom: 20,
          letterSpacing: '-0.025em',
        }}>
          Remember the people<br />
          who matter to you
        </h1>

        <p className="hero-sub" style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          maxWidth: 520,
          margin: '0 auto 40px',
        }}>
          A personal journal for your friendships. Track hangouts, log impressions,
          split costs, and never forget the little things about the people you love.
        </p>

        <div className="hero-buttons" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/home" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            Get started — it's free <IconArrowRight size={16} />
          </Link>
          <Link to="/home" className="btn btn-default" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}>
            Log in
          </Link>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section ref={featuresRef} style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '0 24px 100px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {[
            {
              color: 'var(--inner-circle)', bg: 'var(--inner-circle-bg)',
              title: 'Track friendships',
              desc: 'Day counters, tiers, notes, and contact info for everyone. A living profile for each person in your life.',
              stat: '2,757', statLabel: 'longest streak',
            },
            {
              color: 'var(--close-friend)', bg: 'var(--close-friend-bg)',
              title: 'Log hangouts',
              desc: 'Capture who was there, where, and how it felt. Split costs and track who owes what.',
              stat: '23', statLabel: 'hangouts logged',
            },
            {
              color: 'var(--ai)', bg: 'var(--ai-bg)',
              title: 'AI insights',
              desc: 'Gift ideas based on their favorites. Catch-up briefs before you meet. Smart suggestions, always.',
              stat: 'Pro', statLabel: 'powered by AI',
            },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px 28px',
              boxShadow: 'var(--shadow-sm)',
              borderTop: `3px solid ${f.color}`,
            }}>
              {/* Mini stat */}
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                fontWeight: 600,
                color: f.color,
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {f.stat}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 20,
              }}>
                {f.statLabel}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                fontSize: '1.1rem',
                marginBottom: 8,
              }}>
                {f.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
              }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DEMO SECTION — placeholder rectangles ═══ */}
      <section ref={demoRef} style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px 120px',
      }}>
        <div className="demo-label" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            marginBottom: 8,
          }}>
            See it in action
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 500,
            color: 'var(--text)',
          }}>
            Your friendship dashboard
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 20,
        }}>
          {/* Main screen — home dashboard mock */}
          <div className="demo-screen" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 28,
            boxShadow: 'var(--shadow-md)',
            minHeight: 400,
          }}>
            {/* Fake nav bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--text)' }} />
              <div style={{ width: 80, height: 10, borderRadius: 5, background: 'var(--bg-active)' }} />
              <div style={{ flex: 1 }} />
              <div style={{ width: 60, height: 10, borderRadius: 5, background: 'var(--bg-active)' }} />
              <div style={{ width: 60, height: 10, borderRadius: 5, background: 'var(--bg-active)' }} />
            </div>
            {/* Greeting */}
            <div style={{ width: 180, height: 16, borderRadius: 8, background: 'var(--bg-active)', marginBottom: 8 }} />
            <div style={{ width: 120, height: 10, borderRadius: 5, background: 'var(--bg)', marginBottom: 24 }} />
            {/* Stat cards row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { color: 'var(--accent)', value: '6', label: 'Friends' },
                { color: 'var(--positive)', value: '5', label: 'Hangouts' },
                { color: 'var(--inner-circle)', value: '2,757', label: 'Days' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 14px',
                  borderLeft: `3px solid ${s.color}`,
                }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Friend cards preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {avatars.slice(0, 4).map((a, i) => (
                <div key={i} style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ aspectRatio: '1', background: a.color, position: 'relative', overflow: 'hidden' }}>
                    <img src={a.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.72rem', fontWeight: 500 }}>{a.name.split(' ')[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — profile + hangout mock */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile mock */}
            <div className="demo-screen" style={{
              background: avatars[0].color,
              borderRadius: 'var(--radius-xl)',
              padding: 24,
              boxShadow: 'var(--shadow-md)',
              color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.4)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <img src={avatars[0].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 500 }}>{avatars[0].name}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', opacity: 0.8 }}>Brooklyn, NY · day 2,404</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {[
                  { v: '23', l: 'Hangouts' },
                  { v: '92%', l: 'Freshness' },
                  { v: '3', l: 'Notes' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>{s.v}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hangout log mock */}
            <div className="demo-screen" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: 24,
              boxShadow: 'var(--shadow-md)',
              flex: 1,
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '0.95rem', marginBottom: 16 }}>Recent hangouts</div>
              {[
                { type: 'Dinner', loc: 'Tatiana, NYC', date: 'Mar 8', color: 'var(--inner-circle)' },
                { type: 'Basketball', loc: 'Mosswood Park', date: 'Mar 3', color: 'var(--close-friend)' },
                { type: 'Book club', loc: "Priya's apt", date: 'Feb 25', color: 'var(--positive)' },
              ].map((h, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 8,
                  borderLeft: `3px solid ${h.color}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.82rem', fontWeight: 500 }}>{h.type}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{h.loc}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{h.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={howRef} style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '0 24px 120px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--positive)',
            marginBottom: 8,
          }}>
            Simple by design
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 500,
            color: 'var(--text)',
          }}>
            How it works
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              num: '01', color: 'var(--inner-circle)',
              title: 'Add your people',
              desc: 'Start by adding the friends who matter. Name, how you met, a photo — the basics.',
            },
            {
              num: '02', color: 'var(--close-friend)',
              title: 'Log your hangouts',
              desc: 'After you meet up, jot down what happened. Who was there, how it felt, what to follow up on.',
            },
            {
              num: '03', color: 'var(--ai)',
              title: 'Watch your graph grow',
              desc: 'Day counters tick up. Freshness scores update. Nudges remind you who to reach out to.',
            },
            {
              num: '04', color: 'var(--casual)',
              title: 'Never forget the details',
              desc: 'Their drink order, favorite movie, that thing they mentioned — it\'s all there when you need it.',
            },
          ].map((step, i) => (
            <div key={i} className="how-step" style={{
              display: 'flex',
              gap: 20,
              alignItems: 'flex-start',
              padding: '24px 28px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                fontWeight: 600,
                color: step.color,
                lineHeight: 1,
                flexShrink: 0,
                width: 44,
              }}>
                {step.num}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  marginBottom: 4,
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SOCIAL PROOF — avatar row ═══ */}
      <section style={{
        textAlign: 'center',
        padding: '0 24px 100px',
        maxWidth: 600,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          {avatars.map((a, i) => (
            <div key={i} style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '2px solid var(--bg)', marginLeft: i === 0 ? 0 : -10,
              zIndex: 6 - i, position: 'relative', overflow: 'hidden',
              background: a.color,
            }}>
              <img src={a.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
        }}>
          "I used to forget birthdays and lose touch. Now I have a quiet place for all of it."
        </p>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section ref={ctaRef} style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '0 24px 100px',
        textAlign: 'center',
      }}>
        <div className="cta-block" style={{
          background: 'var(--text)',
          borderRadius: 'var(--radius-xl)',
          padding: '56px 40px',
          color: 'white',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            fontWeight: 500,
            marginBottom: 12,
          }}>
            Start your graph
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.92rem',
            opacity: 0.7,
            marginBottom: 28,
            maxWidth: 400,
            margin: '0 auto 28px',
            lineHeight: 1.5,
          }}>
            Free forever. Your data stays yours. No social features, no sharing — just a private space for the people who matter.
          </p>
          <Link to="/home" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 32px',
            background: 'white',
            color: 'var(--text)',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            fontSize: '1rem',
            transition: 'opacity 150ms ease',
          }}>
            Get started <IconArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 24px',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
      }}>
        friendgraph — a personal tool for the people who matter
      </footer>
    </div>
  )
}
