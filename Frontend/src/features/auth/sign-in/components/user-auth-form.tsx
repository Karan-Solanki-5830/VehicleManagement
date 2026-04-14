import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Mail, Lock, EyeOff, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  name: z.string().min(1, 'Please enter your username'),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { authApi } = await import('@/services/auth')
      const response = await authApi.login(data)

      const { parseJwt } = await import('@/lib/auth')
      const payload = parseJwt(response.token)

      const user = {
        accountNo: payload.sub || payload.nameid || 'N/A',
        email: data.name,
        name: payload.unique_name || payload.name || data.name,
        role: Array.isArray(payload.role) ? payload.role : payload.role ? [payload.role] : ['user'],
        exp: payload.exp * 1000,
      }

      auth.setUser(user)
      auth.setAccessToken(response.token)

      setIsLoading(false)

      let targetPath = redirectTo || '/'

      if (targetPath.startsWith('http')) {
        try {
          const url = new URL(targetPath)
          targetPath = url.pathname + url.search
        } catch (e) {
          targetPath = '/'
        }
      }

      if (targetPath.includes('/login') || targetPath.includes('/sign-in')) {
        targetPath = '/'
      }

      toast.success(`Welcome back, ${user.name}!`, { duration: 3000 })
      setTimeout(() => {
        navigate({ to: targetPath as any, replace: true })
      }, 2000)
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <Form {...form}>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #080f1a inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff;
        }
      `}</style>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-3', className)}
        {...props}
      >
        {/* Email field */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative flex items-center'>
                  <span className='pointer-events-none absolute left-4 text-white/30'>
                    <Mail size={16} />
                  </span>
                  <input
                    type='text'
                    placeholder='Enter your email address'
                    autoComplete='off'
                    className='w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20'
                    {...field}
                  />
                  {/* Blue right accent */}
                  <span className='absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-900/40' />
                </div>
              </FormControl>
              <FormMessage className='pl-4 text-xs text-red-400' />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative flex items-center'>
                  <span className='pointer-events-none absolute left-4 text-white/30'>
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    autoComplete='current-password'
                    className='w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20'
                    {...field}
                  />
                  {/* Eye toggle */}
                  <button
                    type='button'
                    onClick={() => setShowPassword((v) => !v)}
                    className='absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-blue-400 transition-colors hover:text-blue-300'
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className='pl-4 text-xs text-red-400' />
            </FormItem>
          )}
        />

        {/* Spacer */}
        <div className='mt-2' />

        {/* Log in button */}
        <button
          type='submit'
          disabled={isLoading}
          className='flex w-full items-center justify-center gap-2 rounded-full bg-[#1a2235] py-3.5 text-sm font-medium text-white shadow-inner transition-all hover:bg-[#1e293b] active:scale-[0.98] disabled:opacity-60'
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : null}
          Log in
        </button>

      </form>
    </Form>
  )
}
