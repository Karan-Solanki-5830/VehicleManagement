import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dashboardApi } from '@/services/dashboard'

type ViewType = 'daily' | 'monthly' | 'yearly'

export function Overview({ view }: { view: ViewType }) {
  const [data, setData] = useState<{ date: string; revenue: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await dashboardApi.getRevenueChart(view)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch chart data', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [view])

  return (
    <div className='space-y-4'>

      {isLoading ? (
        <div className='flex h-[340px] w-full items-center justify-center text-muted-foreground'>
          Loading chart data...
        </div>
      ) : !data || data.length === 0 ? (
        <div className='flex h-[340px] w-full items-center justify-center text-muted-foreground'>
          No payment data available for this period.
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={340}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#71717a' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#71717a' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray='3 3' opacity={0.1} />
            <XAxis
              dataKey='date'
              stroke='#71717a'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#71717a'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
              }}
              itemStyle={{ color: '#71717a' }}
            />
            <Area
              type='monotone'
              dataKey='revenue'
              stroke='#71717a'
              strokeWidth={2}
              fillOpacity={1}
              fill='url(#colorRevenue)'
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
