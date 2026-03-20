import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import type { Database } from '../database.types'

export type HangoutRow = Database['public']['Tables']['hangouts']['Row']
export type HangoutFriendRow = Database['public']['Tables']['hangout_friends']['Row']

export interface HangoutWithFriends extends HangoutRow {
  hangout_friends: (HangoutFriendRow & { friend_name: string })[]
}

export function useHangouts() {
  const { user } = useAuth()
  const [hangouts, setHangouts] = useState<HangoutWithFriends[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    // Fetch hangouts + their friend links + friend names in one go
    const { data, error } = await supabase
      .from('hangouts')
      .select(`
        *,
        hangout_friends (
          id,
          friend_id,
          feeling_label,
          friends ( name )
        )
      `)
      .order('date', { ascending: false })

    if (error) { setError(error.message); setLoading(false); return }

    // Flatten nested friend names
    const shaped: HangoutWithFriends[] = (data ?? []).map((h: any) => ({
      ...h,
      hangout_friends: (h.hangout_friends ?? []).map((hf: any) => ({
        ...hf,
        friend_name: hf.friends?.name ?? '',
      })),
    }))
    setHangouts(shaped)
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const createHangout = async (
    input: { type: string; location: string; date: string; highlights?: string; follow_ups?: string[] },
    friendIds: { id: string; feeling_label?: string }[]
  ) => {
    if (!user) return { error: 'Not authenticated' }
    const { data, error } = await supabase
      .from('hangouts')
      .insert({ ...input, user_id: user.id })
      .select()
      .single()
    if (error) return { error: error.message }

    if (friendIds.length > 0) {
      await supabase.from('hangout_friends').insert(
        friendIds.map(f => ({ hangout_id: data.id, friend_id: f.id, feeling_label: f.feeling_label }))
      )
    }
    await load()
    return { error: null, id: data.id }
  }

  const deleteHangout = async (id: string) => {
    const { error } = await supabase.from('hangouts').delete().eq('id', id)
    if (!error) setHangouts(prev => prev.filter(h => h.id !== id))
    return { error: error?.message ?? null }
  }

  return { hangouts, loading, error, createHangout, deleteHangout, reload: load }
}

export function useHangout(id: string | undefined) {
  const [hangout, setHangout] = useState<HangoutWithFriends | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('hangouts')
      .select(`*, hangout_friends (id, friend_id, feeling_label, friends (name))`)
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setHangout({
            ...data,
            hangout_friends: ((data as any).hangout_friends ?? []).map((hf: any) => ({
              ...hf,
              friend_name: hf.friends?.name ?? '',
            })),
          })
        }
        setLoading(false)
      })
  }, [id])

  return { hangout, loading }
}
