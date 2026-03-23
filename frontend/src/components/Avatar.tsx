interface AvatarProps {
  initials: string
  color: string
  url?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({ initials, color, url, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ background: color, overflow: 'hidden' }}
    >
      {url ? (
        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
