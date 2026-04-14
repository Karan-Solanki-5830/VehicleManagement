import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group z-[9999] absolute'
      position='bottom-right'
      toastOptions={{
        style: {
          background: '#18181b',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.12)',
          fontSize: '14px',
        },
        classNames: {
          success: 'border-l-4 border-l-green-500',
          error: 'border-l-4 border-l-red-500',
        },
      }}
      {...props}
    />
  )
}
