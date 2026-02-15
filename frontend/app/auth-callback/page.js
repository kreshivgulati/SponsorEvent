'use client'
export const dynamic = "force-dynamic";

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    const requiresRoleSelection = searchParams.get('requiresRoleSelection')

    // ❌ No token → go back to login
    if (!token) {
      router.replace('/login')
      return
    }

    // ✅ Save token
    localStorage.setItem('token', token)

    // ✅ Decide next step
    if (requiresRoleSelection === 'true') {
      router.replace('/select-role')
    } else {
      // Role already exists (future-proof)
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
