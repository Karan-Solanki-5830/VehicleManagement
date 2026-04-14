type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='relative min-h-svh overflow-hidden bg-[#0a0f1e]'>
      {/* Subtle radial glow in background */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-900/20 blur-[120px]' />
        <div className='absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full bg-indigo-900/15 blur-[100px]' />
      </div>

      {/* Subtle grid overlay */}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className='container relative grid h-svh max-w-none items-center justify-center'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-4 py-8 sm:w-[480px] sm:p-8'>
          {/* Logo */}
          <div className='mb-2 flex items-center justify-center'>
            <img
              src='http://localhost:7000/uploads/MAIN%20LOGO.png'
              alt='Vehicle Management System'
              className='h-24 w-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]'
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
