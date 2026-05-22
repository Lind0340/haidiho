import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export default function SignInPage() {
  return (
    <div className="px-4 py-16">
      <Suspense>
        <AuthForm mode="signin" />
      </Suspense>
    </div>
  )
}
