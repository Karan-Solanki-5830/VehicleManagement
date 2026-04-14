import { useState, useEffect } from 'react'
import {
    FormControl,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ImageUploadFieldProps {
    value?: File | string | null
    onChange: (file: File) => void
    previewUrl?: string | null
    baseUrl?: string
    className?: string
}

export function ImageUploadField({
    value,
    onChange,
    previewUrl: initialPreviewUrl,
    baseUrl = 'http://localhost:5001',
    className,
}: ImageUploadFieldProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialPreviewUrl || null)

    useEffect(() => {
        if (typeof value === 'string') {
            setImagePreview(value)
        } else if (value instanceof File) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(value)
        }
    }, [value])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onChange(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const displayUrl = imagePreview
        ? (imagePreview.startsWith('data:') || imagePreview.startsWith('http')
            ? imagePreview
            : `${baseUrl}${imagePreview}`)
        : null

    return (
        <FormItem className={cn('flex flex-col items-center justify-center space-y-2', className)}>
            <div className='relative group'>
                {/* Outer glow ring */}
                <div className='absolute -inset-1 rounded-full bg-blue-500/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100' />

                {/* Avatar circle */}
                <div className='relative h-28 w-28 rounded-full overflow-hidden border-2 border-dashed border-white/15 bg-white/5 shadow-lg shadow-black/30 transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-blue-900/30'>
                    {displayUrl ? (
                        <img
                            src={displayUrl}
                            alt='Preview'
                            className='h-full w-full object-cover'
                        />
                    ) : (
                        <div className='flex h-full w-full flex-col items-center justify-center gap-1'>
                            {/* Camera icon */}
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-8 w-8 text-white/20'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                strokeWidth={1.5}
                            >
                                <path strokeLinecap='round' strokeLinejoin='round' d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' />
                                <path strokeLinecap='round' strokeLinejoin='round' d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' />
                            </svg>
                            <span className='text-[9px] font-semibold uppercase tracking-widest text-white/25'>Photo</span>
                        </div>
                    )}
                </div>

                {/* Hover overlay */}
                <label
                    htmlFor='image-upload'
                    className='absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100'
                >
                    <span className='text-[10px] font-semibold uppercase tracking-wider text-white/80'>Change</span>
                </label>
            </div>

            <FormControl>
                <Input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    )
}
