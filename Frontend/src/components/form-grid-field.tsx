import { ReactNode } from 'react'
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface FormGridFieldProps {
    label: string
    children: ReactNode
    className?: string
    labelClassName?: string
    optional?: boolean
}

export function FormGridField({
    label,
    children,
    className,
    labelClassName,
    optional,
}: FormGridFieldProps) {
    return (
        <FormItem className={cn('grid grid-cols-12 items-center space-y-0 gap-x-4 gap-y-4', className)}>
            <FormLabel className={cn('col-span-4 text-end leading-tight', labelClassName)}>
                {label}
                {optional && (
                    <span className='block text-[10px] font-normal text-muted-foreground uppercase mt-0.5 tracking-tight'>
                        (Optional)
                    </span>
                )}
            </FormLabel>
            <div className='col-span-8'>
                <FormControl>
                    {children}
                </FormControl>
            </div>
            <FormMessage className='col-span-8 col-start-5' />
        </FormItem>
    )
}
