import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  )
}
