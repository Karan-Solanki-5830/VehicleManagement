import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface FeatureShellProps {
    icon: LucideIcon
    title: string
    primaryButtons?: ReactNode
    table: ReactNode
    dialogs?: ReactNode
    loading?: boolean
    isEmpty?: boolean
    loadingText?: string
}

export function FeatureShell({
    icon: Icon,
    title,
    primaryButtons,
    table,
    dialogs,
    loading,
    isEmpty,
    loadingText = 'Loading...',
}: FeatureShellProps) {
    return (
        <div className='flex flex-col gap-4 p-4 md:p-8'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Icon className='h-5 w-5' />
                    <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{title}</h1>
                </div>
                {primaryButtons}
            </div>
            <Separator />

            {loading && isEmpty ? (
                <div className='flex items-center justify-center h-96 text-muted-foreground'>
                    {loadingText}
                </div>
            ) : (
                <>
                    {table}
                    {dialogs}
                </>
            )}
        </div>
    )
}
