import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const topNav = [
    {
        title: 'Overview',
        href: '/',
    },
    {
        title: 'Customers',
        href: '/customers',
    },
    {
        title: 'Vehicles',
        href: '/vehicles',
    },
    {
        title: 'Bookings',
        href: '/bookings',
    },
    {
        title: 'Payments',
        href: '/payments',
    },
]

export function GlobalHeader() {
    return (
        <Header>
            <TopNav links={topNav} />
            <div className='ms-auto flex items-center space-x-4'>
                <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown />
            </div>
        </Header>
    )
}

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
    links: {
        title: string
        href: string
        disabled?: boolean
    }[]
}

function TopNav({ className, links, ...props }: TopNavProps) {
    return (
        <>
            <div className='lg:hidden'>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button size='icon' variant='outline' className='md:size-7'>
                            <Menu />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='start'>
                        {links.map(({ title, href, disabled }) => (
                            <DropdownMenuItem key={`${title}-${href}`} asChild>
                                <Link
                                    to={href}
                                    className='transition-colors hover:text-primary'
                                    activeProps={{ className: 'text-primary' }}
                                    inactiveProps={{ className: 'text-muted-foreground' }}
                                    disabled={disabled}
                                >
                                    {title}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <nav
                className={cn(
                    'hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6',
                    className
                )}
                {...props}
            >
                {links.map(({ title, href, disabled }) => (
                    <Link
                        key={`${title}-${href}`}
                        to={href}
                        disabled={disabled}
                        className='text-sm font-medium transition-colors hover:text-primary'
                        activeProps={{ className: 'text-primary' }}
                        inactiveProps={{ className: 'text-muted-foreground' }}
                    >
                        {title}
                    </Link>
                ))}
            </nav>
        </>
    )
}
