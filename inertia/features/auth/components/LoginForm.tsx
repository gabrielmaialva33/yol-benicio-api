import { useId, useState } from 'react'
import { router, useForm } from '@inertiajs/react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
  const emailId = useId()
  const passwordId = useId()
  const [clientErrors, setClientErrors] = useState({ email: '', password: '' })

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newErrors = { email: '', password: '' }
    if (!data.email) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!EMAIL_REGEX.test(data.email)) {
      newErrors.email = 'E-mail inválido'
    }
    if (!data.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    if (newErrors.email || newErrors.password) {
      setClientErrors(newErrors)
      return
    }

    setClientErrors({ email: '', password: '' })
    post('/login', {
      onSuccess: () => {
        router.visit('/dashboard')
      },
    })
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 rounded-[15px] bg-white p-8 font-sans shadow-lg animate-in fade-in zoom-in-95 duration-1000 md:h-[607px] md:px-[32.5px] md:py-16">
      <div className="flex flex-col items-center gap-[15px] self-stretch">
        <h2 className="self-stretch text-center text-[40px] font-semibold leading-[0.6em] tracking-[-0.01em] text-gray-900">
          Fazer login
        </h2>
      </div>
      <form
        className="flex flex-col items-start gap-5 self-stretch"
        noValidate={true}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-start gap-5 self-stretch">
          <div className="flex h-[50px] items-center gap-2.5 self-stretch rounded-md border border-gray-300 px-3 py-2.5 focus-within:border-gray-500">
            <div className="flex w-full flex-col items-start justify-center">
              <label className="sr-only" htmlFor={emailId}>
                E-mail
              </label>
              <input
                autoComplete="email"
                className="w-full bg-transparent text-base font-semibold text-gray-700 placeholder-gray-500 focus:outline-none"
                id={emailId}
                name="email"
                placeholder="E-mail"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
            </div>
          </div>
          {(clientErrors.email || errors.email) && (
            <p className="text-red-500 text-sm -mt-3">{clientErrors.email || errors.email}</p>
          )}
          <div className="flex h-[50px] items-center gap-2.5 self-stretch rounded-md border border-gray-300 px-3 py-2.5 focus-within:border-gray-500">
            <div className="flex w-full flex-col items-start justify-center">
              <label className="sr-only" htmlFor={passwordId}>
                Senha
              </label>
              <input
                autoComplete="current-password"
                className="w-full bg-transparent text-base font-semibold text-gray-700 placeholder-gray-500 focus:outline-none"
                id={passwordId}
                name="password"
                placeholder="Senha"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
            </div>
          </div>
          {(clientErrors.password || errors.password) && (
            <p className="text-red-500 text-sm -mt-3">{clientErrors.password || errors.password}</p>
          )}
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          <a
            className="self-stretch text-right text-base font-medium text-gray-500 underline"
            href="/#"
          >
            Esqueci minha senha
          </a>
        </div>
        <button
          className="flex h-[50px] items-center justify-center gap-2.5 self-stretch rounded-full bg-gray-900 px-4 py-3 font-work-sans disabled:opacity-50 hover:bg-gray-800 transition-colors"
          disabled={processing}
          type="submit"
        >
          <span className="text-base font-semibold text-white">
            {processing ? 'Entrando...' : 'Entrar'}
          </span>
        </button>
      </form>
    </div>
  )
}
