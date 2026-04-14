import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { BookingsProvider } from './components/bookings-provider'
import { BookingsDialogs } from './components/bookings-dialogs'
import { BookingsTable } from './components/bookings-table'
import { BookingsPrimaryButtons } from './components/bookings-primary-buttons'
import { FeatureShell } from '@/components/feature-shell'
import { bookingsApi } from '@/services/bookings'
import { customersApi } from '@/services/customers'
import { vehiclesApi } from '@/services/vehicles'

export function Bookings() {
    const [bookings, setBookings] = useState<any[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(true)

    // Reset pagination on search or status change
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, [search, status])

    const loadBookings = async () => {
        try {
            setLoading(true)
            const [bookingsResult, customers, vehicles] = await Promise.all([
                bookingsApi.getAll(pagination.pageIndex + 1, pagination.pageSize, search, status),
                customersApi.getLookup(),
                vehiclesApi.getAll(1, 1000) // Get enough vehicles for lookup
            ])

            // Enrich bookings with names and numbers
            const enrichedBookings = bookingsResult.items.map(booking => {
                const customer = customers.find(c => c.id === booking.customerId)
                const vehicle = vehicles.items.find(v => v.id === booking.vehicleId)
                return {
                    ...booking,
                    customerName: customer ? customer.name : 'Unknown',
                    vehicleNumber: vehicle ? vehicle.vehicleNumber : 'Unknown'
                }
            })

            setBookings(enrichedBookings)
            setTotalCount(bookingsResult.totalCount)
        } catch (error) {
            console.error('Failed to load bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBookings()
    }, [pagination, search, status])

    return (
        <BookingsProvider>
            <FeatureShell
                icon={Calendar}
                title="Bookings"
                loading={loading}
                isEmpty={bookings.length === 0 && search === '' && status === ''}
                primaryButtons={<BookingsPrimaryButtons />}
                table={
                    <BookingsTable
                        data={bookings}
                        rowCount={totalCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        search={search}
                        onSearch={setSearch}
                        status={status}
                        onStatusChange={setStatus}
                    />
                }
                dialogs={
                    <BookingsDialogs onSuccess={() => {
                        if (pagination.pageIndex === 0) {
                            loadBookings()
                        } else {
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                        }
                    }} />
                }
            />
        </BookingsProvider>
    )
}
