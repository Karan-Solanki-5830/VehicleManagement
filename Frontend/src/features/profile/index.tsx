import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { customersApi } from '@/services/customers'
import { type Customer } from '@/types'
import { Main } from '@/components/layout/main'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Mail,
    Phone,
    MapPin,
    Hash,
    AlertCircle,
    Eye,
    EyeOff,
    User,
    ShieldCheck,
    UserPlus,
} from 'lucide-react'

export function Profile() {
    const { auth } = useAuthStore()
    const [user, setUser] = useState<Customer | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.user?.accountNo && auth.user.accountNo !== 'N/A') {
                try {
                    const data = await customersApi.getById(parseInt(auth.user.accountNo))
                    setUser(data)
                } catch (error) {
                    console.error('Failed to fetch user data', error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [auth.user?.accountNo])

    const avatarUrl = user?.imageUrl
        ? user.imageUrl.startsWith('http')
            ? user.imageUrl
            : `http://custtapi.runasp.net${user.imageUrl}`
        : ''

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : '??'

    if (isLoading) {
        return (
            <Main>
                <div className='flex h-[70vh] w-full items-center justify-center'>
                    <Skeleton className='h-64 w-full max-w-3xl rounded-xl' />
                </div>
            </Main>
        )
    }

    if (!user) {
        return (
            <Main>
                <div className='flex h-[70vh] w-full items-center justify-center'>
                    <Card className='w-full max-w-md border-destructive/50 p-6 text-center'>
                        <AlertCircle className='mx-auto mb-4 h-10 w-10 text-destructive' />
                        <h3 className='text-lg font-bold'>Profile Load Failed</h3>
                        <p className='text-muted-foreground'>Could not retrieve user data.</p>
                    </Card>
                </div>
            </Main>
        )
    }

    return (
        <Main>
            <div className='flex h-[75vh] flex-col items-center justify-center'>
                <div className='mb-6 w-full max-w-4xl'>
                    <h1 className='text-2xl font-bold tracking-tight'>Profile Overview</h1>
                    <p className='text-muted-foreground'>Manage your account settings.</p>
                </div>
                <Card className='w-full max-w-4xl overflow-hidden border-none bg-card/60 shadow-xl backdrop-blur-sm'>
                    <div className='flex flex-col md:flex-row'>
                        {/* Left Side: Identity */}
                        <div className='flex min-w-[280px] flex-col items-center justify-center border-b border-border/50 bg-muted/40 p-8 md:w-1/3 md:border-b-0 md:border-r'>
                            <Avatar className='mb-4 h-32 w-32 border-4 border-background shadow-lg'>
                                <AvatarImage src={avatarUrl} alt={user.name} />
                                <AvatarFallback className='bg-primary/10 text-4xl font-bold text-primary'>
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <h2 className='text-center text-2xl font-bold tracking-tight'>
                                {user.name}
                            </h2>

                            <div className='mt-3 flex items-center gap-2'>
                                <Badge
                                    variant={user.role === 'Admin' ? 'default' : 'secondary'}
                                    className='px-3 py-1'
                                >
                                    {user.role}
                                </Badge>
                                <div className='flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600'>
                                    <ShieldCheck className='h-3 w-3' />
                                    Verified
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details Grid */}
                        <div className='flex flex-1 flex-col justify-center p-8'>
                            <div className='grid gap-6 md:grid-cols-2'>
                                <div className='space-y-1.5'>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <Hash className='h-4 w-4' />
                                        <span className='text-xs font-semibold uppercase tracking-wider'>
                                            Customer ID
                                        </span>
                                    </div>
                                    <p className='pl-6 text-sm font-medium'>#{user.id}</p>
                                </div>

                                <div className='space-y-1.5'>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <User className='h-4 w-4' />
                                        <span className='text-xs font-semibold uppercase tracking-wider'>
                                            Account Type
                                        </span>
                                    </div>
                                    <p className='pl-6 text-sm font-medium capitalize'>
                                        {user.role.toLowerCase()} Account
                                    </p>
                                </div>

                                <div className='space-y-1.5'>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <Mail className='h-4 w-4' />
                                        <span className='text-xs font-semibold uppercase tracking-wider'>
                                            Email
                                        </span>
                                    </div>
                                    <p className='pl-6 text-sm font-medium'>{user.email}</p>
                                </div>

                                <div className='space-y-1.5'>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <Phone className='h-4 w-4' />
                                        <span className='text-xs font-semibold uppercase tracking-wider'>
                                            Phone
                                        </span>
                                    </div>
                                    <p className='pl-6 text-sm font-medium'>{user.phone}</p>
                                </div>

                                <div className='space-y-1.5 md:col-span-2'>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <MapPin className='h-4 w-4' />
                                        <span className='text-xs font-semibold uppercase tracking-wider'>
                                            Address
                                        </span>
                                    </div>
                                    <p className='min-h-[1.25rem] pl-6 text-sm font-medium line-clamp-1'>
                                        {user.address}
                                    </p>
                                </div>

                                <div className='space-y-1.5 md:col-span-2'>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <div className='flex h-4 w-4 items-center justify-center'>
                                            {showPassword ? (
                                                <EyeOff className='h-4 w-4' />
                                            ) : (
                                                <Eye className='h-4 w-4' />
                                            )}
                                        </div>
                                        <span className='text-xs font-semibold uppercase tracking-wider'>
                                            Password
                                        </span>
                                    </div>
                                    <div className='flex h-6 items-center justify-between pl-6'>
                                        <p className='font-mono text-sm font-medium tracking-wider'>
                                            {showPassword
                                                ? user.password || '••••••••'
                                                : '••••••••'}
                                        </p>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='h-6 text-xs text-muted-foreground hover:text-primary'
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 'Hide' : 'Reveal'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6 flex items-center justify-between border-t border-border/50 pt-4'>
                                <div className='space-y-0.5'>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <UserPlus className='h-4 w-4' />
                                        <span className='text-xs font-semibold uppercase tracking-wider'>
                                            Create New Account
                                        </span>
                                    </div>
                                </div>
                                <Button variant='outline' size='sm' className='h-8 text-xs' asChild>
                                    <Link to='/register'>Register</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Main>
    )
}
