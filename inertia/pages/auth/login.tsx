import { Head } from '@inertiajs/react'
import { LoginForm } from '~/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <>
      <Head title="Login - YOL Benício" />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img alt="YOL" className="h-16 mx-auto" src="/logo-yol.svg" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              YOL Project - Sistema Jurídico
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  )
}
