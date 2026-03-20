import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase'
import type { Database } from '../database.types'

export type FriendRow = Database['public']['Tables']['friends']['Row']
export type FriendContactRow = Database['public']['Tables']['friend_contacts']['Row']
export type FriendFactRow = Database['public']['Tables']['friend_facts']['Row']
export type FriendNoteRow = Database['public']['Tables']['friend_notes']['Row']

export interface FriendDetail extends FriendRow {
  contact: FriendContactRow | null
  facts: FriendFactRow[]
  notes: FriendNoteRow[]
}

export function useFriend(id: string | undefined) {
  const [friend, setFriend] = useState<FriendDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    const [friendRes, contactRes, factsRes, notesRes] = await Promise.all([
      supabase.from('friends').select('*').eq('id', id).single(),
      supabase.from('friend_contacts').select('*').eq('friend_id', id).maybeSingle(),
      supabase.from('friend_facts').select('*').eq('friend_id', id).order('created_at'),
      supabase.from('friend_notes').select('*').eq('friend_id', id).order('date', { ascending: false }),
    ])
    if (friendRes.error) { setError(friendRes.error.message); setLoading(false); return }
    setFriend({
      ...friendRes.data,
      contact: contactRes.data ?? null,
      facts: factsRes.data ?? [],
      notes: notesRes.data ?? [],
    })
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  const addFact = async (category: string, value: string) => {
    if (!id) return
    await supabase.from('friend_facts').insert({ friend_id: id, category, value })
    await load()
  }

  const deleteFact = async (factId: string) => {
    await supabase.from('friend_facts').delete().eq('id', factId)
    await load()
  }

  const addNote = async (text: string, date?: string) => {
    if (!id) return
    await supabase.from('friend_notes').insert({ friend_id: id, text, date: date ?? new Date().toISOString().slice(0, 10) })
    await load()
  }

  const deleteNote = async (noteId: string) => {
    await supabase.from('friend_notes').delete().eq('id', noteId)
    await load()
  }

  const upsertContact = async (contact: Partial<FriendContactRow>) => {
    if (!id) return
    await supabase.from('friend_contacts').upsert({ friend_id: id, ...contact })
    await load()
  }

  const updateFriend = async (updates: Partial<FriendRow>) => {
    if (!id) return
    await supabase.from('friends').update(updates).eq('id', id)
    await load()
  }

  return { friend, loading, error, reload: load, addFact, deleteFact, addNote, deleteNote, upsertContact, updateFriend }
}
