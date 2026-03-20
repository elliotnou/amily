export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-lg)',
    }}>
      <img
        src="/loading.gif"
        alt="Loading…"
        style={{
          width: 96,
          height: 96,
          objectFit: 'contain',
          borderRadius: 'var(--radius-lg)',
          opacity: 0.85,
        }}
      />
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
      }}>
        loading…
      </p>
    </div>
  )
}
