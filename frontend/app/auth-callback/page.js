'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    const requiresRoleSelection = searchParams.get('requiresRoleSelection')

    if (!token) {
      router.replace('/login')
      return
    }

    localStorage.setItem('token', token)

    if (requiresRoleSelection === 'true') {
      router.replace('/select-role')
    } else {
      const role = localStorage.getItem('role')

      if (role === 'organizer') {
        router.replace('/organizer/dashboard')
      } else {
        router.replace('/sponsor/dashboard')
      }
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Signing you in…</p>
    </div>
  )
}