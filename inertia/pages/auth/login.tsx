import { Head } from '@inertiajs/react'
import { LoginForm } from '~/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <>
      <Head title="Login - YOL Benício" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md px-4">
          <img src="/logo-yol.svg" alt="YOL Benício" className="h-16 mx-auto mb-8" />
          <LoginForm />
        </div>
      </div>
    </>
  )
}
