interface AvatarProps {
  initials: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// Generic user silhouette SVG for when there's no pic
function UserSilhouette() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '55%', height: '55%', opacity: 0.5 }}>
      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
    </svg>
  )
}

export default function Avatar({ initials, color, size = 'md', className = '' }: AvatarProps) {
  const showInitials = initials && initials.length > 0

  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ background: showInitials ? color : undefined }}
    >
      {showInitials ? (
        <span>{initials}</span>
      ) : (
        <div className="avatar avatar-placeholder" style={{ width: '100%', height: '100%' }}>
          <UserSilhouette />
        </div>
      )}
    </div>
  )
}
