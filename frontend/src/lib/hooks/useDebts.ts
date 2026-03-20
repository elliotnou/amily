import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import type { Database } from '../database.types'

export type DebtRow = Database['public']['Tables']['debts']['Row']

export function useDebts() {
  const { user } = useAuth()
  const [debts, setDebts] = useState<DebtRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('debts')
      .select('*, friends(name)')
      .order('created_at', { ascending: false })
    setDebts((data ?? []) as DebtRow[])
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const settleDebt = async (id: string) => {
    await supabase.from('debts').update({ settled: true }).eq('id', id)
    setDebts(prev => prev.map(d => d.id === id ? { ...d, settled: true } : d))
  }

  const createDebt = async (input: Omit<Database['public']['Tables']['debts']['Insert'], 'user_id'>) => {
    if (!user) return
    await supabase.from('debts').insert({ ...input, user_id: user.id })
    await load()
  }

  return { debts, loading, settleDebt, createDebt, reload: load }
}
