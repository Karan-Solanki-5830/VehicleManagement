import { useEffect, useState } from 'react'
import {
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from './components/overview'
import { RecentBookings } from './components/recent-sales'
import { UserBookings } from './components/user-bookings'
import { StatsCard } from './components/stats-card'
import { dashboardApi, type DashboardStats } from '@/services/dashboard'
import { useAuthStore } from '@/stores/auth-store'

export function Dashboard() {
  const { auth } = useAuthStore()
  const isAdmin = auth.user?.role?.includes('Admin') ?? false
  const userId = Number(auth.user?.accountNo ?? 0)
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
    revenueChart: {},
  })
  const [periodIndex, setPeriodIndex] = useState(0)
  const periods = [
    { id: 'all', label: 'Total Revenue' },
    { id: 'month', label: 'Monthly Revenue' },
    { id: 'year', label: 'Yearly Revenue' },
  ]
  const currentPeriod = periods[periodIndex]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats(currentPeriod.id === 'all' ? undefined : currentPeriod.id)
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      }
    }
    fetchStats()
  }, [periodIndex])

  const nextPeriod = () => setPeriodIndex((prev) => (prev + 1) % periods.length)
  const prevPeriod = () => setPeriodIndex((prev) => (prev - 1 + periods.length) % periods.length)

  const [graphPeriodIndex, setGraphPeriodIndex] = useState(0)
  const graphPeriods = [
    { id: 'daily', label: 'Revenue Overview (Daily)' },
    { id: 'monthly', label: 'Revenue Overview (Monthly)' },
    { id: 'yearly', label: 'Revenue Overview (Yearly)' },
  ] as const
  const currentGraphPeriod = graphPeriods[graphPeriodIndex]

  const nextGraphPeriod = () => setGraphPeriodIndex((prev) => (prev + 1) % graphPeriods.length)
  const prevGraphPeriod = () => setGraphPeriodIndex((prev) => (prev - 1 + graphPeriods.length) % graphPeriods.length)

  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
      </div>
      <Tabs
        orientation='vertical'
        defaultValue='overview'
        className='space-y-4'
      >
        <div className='w-full overflow-x-auto pb-2'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
              title='Total Customers'
              value={stats.totalCustomers}
              description='Active registered users'
              icon={Users}
            />

            <StatsCard
              title='Total Vehicles'
              value={stats.totalVehicles}
              description='Fleet size in inventory'
              icon={Car}
            />

            <StatsCard
              title='Bookings'
              value={stats.totalBookings}
              description='Total reservations handled'
              icon={Calendar}
            />

            <StatsCard
              title={currentPeriod.label}
              value={
                <span
                  key={currentPeriod.id}
                  className='animate-in fade-in slide-in-from-right-4 duration-500'
                >
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(stats.totalRevenue)}
                </span>
              }
              description={`Showing ${currentPeriod.id === 'all' ? 'complete' : `this ${currentPeriod.id}`} history`}
              rightElement={
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={prevPeriod}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={nextPeriod}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='group relative col-span-1 overflow-hidden transition-all hover:shadow-lg lg:col-span-4'>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-zinc-500/5 to-transparent dark:from-zinc-500/10" />
              <CardHeader className='relative z-10 flex flex-row items-center justify-between space-y-0'>
                <CardTitle>{currentGraphPeriod.label}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={prevGraphPeriod}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={nextGraphPeriod}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='ps-2'>
                <Overview view={currentGraphPeriod.id} />
              </CardContent>
            </Card>
            <Card className='group relative col-span-1 overflow-hidden transition-all hover:shadow-lg lg:col-span-3'>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-zinc-500/5 to-transparent dark:from-zinc-500/10" />
              <CardHeader className="relative z-10">
                <CardTitle>{isAdmin ? 'Recent Bookings' : 'My Bookings'}</CardTitle>
                <CardDescription>
                  {isAdmin ? 'Latest bookings and payments.' : 'Your recent reservations.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <RecentBookings />
                ) : (
                  <UserBookings customerId={userId} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  )
}
