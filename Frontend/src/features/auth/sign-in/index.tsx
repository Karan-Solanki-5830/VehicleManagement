import { Link, useSearch } from '@tanstack/react-router'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/login' })

  return (
    <div className='relative flex min-h-svh items-center justify-center overflow-hidden bg-[#080c14]'>
      {/* Background blue glow - bottom left */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-700/20 blur-[120px]' />
        <div className='absolute bottom-[-100px] left-[-100px] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]' />
      </div>

      {/* Card */}
      <div
        className='relative z-10 w-full max-w-[480px] rounded-3xl px-10 py-12 shadow-2xl'
        style={{
          background:
            'linear-gradient(160deg, #0e1520 0%, #080f1a 40%, #050c14 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Title */}
        <h1 className='mb-3 text-center text-5xl font-light tracking-tight text-white'>
          Log in
        </h1>

        {/* Subtitle */}
        <p className='mb-10 text-center text-sm leading-relaxed text-white/50'>
          Log in to your account and seamlessly continue managing your
          <br />
          projects, ideas, and progress just where you left off.
        </p>

        {/* Form */}
        <UserAuthForm redirectTo={redirect} />

        {/* Sign up link */}
        <p className='mt-6 text-center text-sm text-white/40'>
          Didn't have an account?{' '}
          <Link
            to='/register'
            className='text-blue-400 underline-offset-4 hover:underline'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
