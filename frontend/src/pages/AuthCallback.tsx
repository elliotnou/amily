import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LoadingScreen from '../components/LoadingScreen'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase puts tokens in the URL hash after email confirmation.
    // Calling getSession() picks them up automatically.
    supabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session ? '/home' : '/login', { replace: true })
    })
  }, [navigate])

  return <LoadingScreen />
}
