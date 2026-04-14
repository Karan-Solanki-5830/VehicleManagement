import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { ImageUploadField } from '@/components/image-upload-field'

const formSchema = z
  .object({
    name: z.string().min(1, 'Please enter your name'),
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Please enter your email' : undefined,
    }),
    phone: z.string().min(1, 'Please enter your phone number'),
    address: z.string().min(1, 'Please enter your address'),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(7, 'Password must be at least 7 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })
  .and(
    z.object({
      image: z.instanceof(File).optional(),
    })
  )

// Pill input wrapper with icon
function PillInput({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className='relative flex items-center'>
      <span className='pointer-events-none absolute left-4 text-white/30'>
        {icon}
      </span>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white ' +
  'placeholder:text-white/25 outline-none transition-all duration-200 ' +
  '[&:-webkit-autofill]:shadow-[0_0_0_1000px_#0a1224_inset] [&:-webkit-autofill]:[−webkit-text-fill-color:#ffffff] ' +
  'focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 ' +
  'hover:border-white/20'

const labelCls = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-white/35'

const dividerLabel = (text: string) => (
  <div className='flex items-center gap-3 py-1'>
    <div className='h-px flex-1 bg-white/[0.07]' />
    <span className='text-[9px] font-semibold uppercase tracking-widest text-white/20'>
      {text}
    </span>
    <div className='h-px flex-1 bg-white/[0.07]' />
  </div>
)

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const imageFile = form.getValues('image')

      const { authApi } = await import('@/services/auth')
      const result = await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
        role: 'User',
        image: imageFile,
      })

      setIsLoading(false)
      const successMessage = result.message || 'Registration successful! Please sign in.'
      toast.success(successMessage, { duration: 3000 })
      setTimeout(() => {
        window.location.href = '/login'
      }, 3000)
    } catch (error: any) {
      setIsLoading(false)
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          'Registration failed. Please try again.'
      )
    }
  }

  return (
    <Form {...form}>
      {/* Autofill override global style */}
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
        className={cn('flex flex-col gap-5', className)}
        {...props}
      >
        {/* ── Avatar Upload ───────────────────────── */}
        <div className='flex flex-col items-center gap-2'>
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <ImageUploadField
                value={field.value}
                onChange={field.onChange}
                className='mb-0'
              />
            )}
          />
          <span className='text-[10px] text-white/25 tracking-wide'>
            Click to upload profile photo
          </span>
        </div>

        {/* ── Account Details ──────────────────────── */}
        {dividerLabel('Account Details')}

        <div className='grid grid-cols-2 gap-3'>
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <label className={labelCls}>Name</label>
                <FormControl>
                  <PillInput icon={<User size={15} />}>
                    <input
                      placeholder='John Doe'
                      className={inputCls}
                      {...field}
                    />
                  </PillInput>
                </FormControl>
                <FormMessage className='pl-4 text-[10px] text-red-400/80' />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <label className={labelCls}>Email</label>
                <FormControl>
                  <PillInput icon={<Mail size={15} />}>
                    <input
                      type='email'
                      placeholder='name@example.com'
                      className={inputCls}
                      {...field}
                    />
                  </PillInput>
                </FormControl>
                <FormMessage className='pl-4 text-[10px] text-red-400/80' />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <label className={labelCls}>Phone</label>
                <FormControl>
                  <PillInput icon={<Phone size={15} />}>
                    <input
                      placeholder='+1 234 567 890'
                      className={inputCls}
                      {...field}
                    />
                  </PillInput>
                </FormControl>
                <FormMessage className='pl-4 text-[10px] text-red-400/80' />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <label className={labelCls}>Address</label>
                <FormControl>
                  <PillInput icon={<MapPin size={15} />}>
                    <input
                      placeholder='123 Main St'
                      className={inputCls}
                      {...field}
                    />
                  </PillInput>
                </FormControl>
                <FormMessage className='pl-4 text-[10px] text-red-400/80' />
              </FormItem>
            )}
          />
        </div>

        {/* ── Security ────────────────────────────── */}
        {dividerLabel('Security')}

        <div className='grid grid-cols-2 gap-3'>
          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <label className={labelCls}>Password</label>
                <FormControl>
                  <div className='relative flex items-center'>
                    <span className='pointer-events-none absolute left-4 text-white/30'>
                      <Lock size={15} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className={cn(inputCls, 'pr-11')}
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((v) => !v)}
                      className='absolute right-3 text-blue-400/70 transition-colors hover:text-blue-300'
                      tabIndex={-1}
                    >
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='pl-4 text-[10px] text-red-400/80' />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <label className={labelCls}>Confirm</label>
                <FormControl>
                  <div className='relative flex items-center'>
                    <span className='pointer-events-none absolute left-4 text-white/30'>
                      <Lock size={15} />
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder='••••••••'
                      className={cn(inputCls, 'pr-11')}
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirm((v) => !v)}
                      className='absolute right-3 text-blue-400/70 transition-colors hover:text-blue-300'
                      tabIndex={-1}
                    >
                      {showConfirm ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='pl-4 text-[10px] text-red-400/80' />
              </FormItem>
            )}
          />
        </div>

        {/* ── Submit ───────────────────────────────── */}
        <button
          type='submit'
          disabled={isLoading}
          className='mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium text-white shadow-inner transition-all hover:bg-[#1e293b] active:scale-[0.98] disabled:opacity-60'
          style={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Creating account…
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </Form>
  )
}
