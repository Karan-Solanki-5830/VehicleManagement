import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: ReactNode
    description: string
    icon?: LucideIcon
    rightElement?: ReactNode
    valueClassName?: string
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    rightElement,
    valueClassName,
}: StatsCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-zinc-500/5 to-transparent dark:from-zinc-500/10" />
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{title}</CardTitle>
                <div className="flex items-center gap-1 relative z-10">
                    {rightElement}
                    {Icon && (
                        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                            <Icon className='h-4 w-4 text-zinc-600 dark:text-zinc-400' />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn('text-2xl font-bold', valueClassName)}>{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    )
}
