const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file: File): Promise<string> {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData },
  )

  if (!res.ok) throw new Error('Image upload failed')

  const data = await res.json()
  return data.secure_url as string
}

export function imageUrl(publicId: string, opts?: { width?: number; height?: number }): string {
  if (!cloudName) return publicId
  const transforms = []
  if (opts?.width) transforms.push(`w_${opts.width}`)
  if (opts?.height) transforms.push(`h_${opts.height}`)
  transforms.push('c_fill', 'q_auto', 'f_auto')
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`
}
