import { Link } from '@tanstack/react-router'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  return (
    <div className='relative flex min-h-svh items-center justify-center overflow-hidden bg-[#080c14]'>
      {/* Background blue glow - bottom left (same as login) */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-700/20 blur-[120px]' />
        <div className='absolute bottom-[-100px] left-[-100px] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]' />
      </div>

      {/* Card */}
      <div
        className='relative z-10 w-full max-w-[520px] rounded-3xl px-10 py-10 shadow-2xl'
        style={{
          background:
            'linear-gradient(160deg, #0e1520 0%, #080f1a 40%, #050c14 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Title */}
        <h1 className='mb-2 text-center text-4xl font-light tracking-tight text-white'>
          Create account
        </h1>

        {/* Subtitle */}
        <p className='mb-8 text-center text-sm leading-relaxed text-white/50'>
          Fill in your details below to get started on your journey.
        </p>

        {/* Form */}
        <SignUpForm />

        {/* Sign in link */}
        <p className='mt-5 text-center text-sm text-white/40'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-blue-400 underline-offset-4 hover:underline'
          >
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className='mt-3 text-center text-[10px] leading-relaxed text-white/20'>
          By creating an account, you agree to our{' '}
          <a href='/terms' className='underline underline-offset-4 hover:text-white/40'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='/privacy' className='underline underline-offset-4 hover:text-white/40'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
