import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import type { Database } from '../database.types'

export type NudgeRow = Database['public']['Tables']['nudges']['Row']

export function useNudges() {
  const { user } = useAuth()
  const [nudges, setNudges] = useState<NudgeRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('nudges')
      .select('*')
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
    setNudges(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const dismissNudge = async (id: string) => {
    await supabase.from('nudges').update({ dismissed: true }).eq('id', id)
    setNudges(prev => prev.filter(n => n.id !== id))
  }

  return { nudges, loading, dismissNudge }
}
