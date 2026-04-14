import { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import { PaymentsProvider } from './components/payments-provider'
import { PaymentsDialogs } from './components/payments-dialogs'
import { PaymentsTable } from './components/payments-table'
import { PaymentsPrimaryButtons } from './components/payments-primary-buttons'
import { FeatureShell } from '@/components/feature-shell'
import { paymentsApi } from '@/services/payments'

export function Payments() {
    const [payments, setPayments] = useState<any[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [search, setSearch] = useState('')
    const [method, setMethod] = useState('')
    const [isPaid, setIsPaid] = useState<boolean | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    // Reset pagination on filter change
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, [search, method, isPaid])

    const loadPayments = async () => {
        try {
            setLoading(true)
            const [paymentsResult, lookups] = await Promise.all([
                paymentsApi.getAll(pagination.pageIndex + 1, pagination.pageSize, search, method, isPaid),
                paymentsApi.getBookingLookup()
            ])

            // Enrich payments with lookup data
            const enrichedPayments = paymentsResult.items.map(payment => {
                const lookup = lookups.find(l => l.bookingId === payment.bookingId)
                return {
                    ...payment,
                    bookingLabel: lookup ? `${lookup.customerName}` : `Booking #${payment.bookingId}`,
                    vehicleLabel: lookup ? lookup.vehicleNumber : ''
                }
            })

            setPayments(enrichedPayments)
            setTotalCount(paymentsResult.totalCount)
        } catch (error) {
            console.error('Failed to load payments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPayments()
    }, [pagination, search, method, isPaid])

    return (
        <PaymentsProvider>
            <FeatureShell
                icon={CreditCard}
                title="Payments"
                loading={loading}
                isEmpty={payments.length === 0 && search === '' && method === '' && isPaid === undefined}
                primaryButtons={<PaymentsPrimaryButtons />}
                table={
                    <PaymentsTable
                        data={payments}
                        rowCount={totalCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        search={search}
                        onSearch={setSearch}
                        method={method}
                        onMethodChange={setMethod}
                        isPaid={isPaid}
                        onIsPaidChange={setIsPaid}
                    />
                }
                dialogs={<PaymentsDialogs onSuccess={loadPayments} />}
            />
        </PaymentsProvider>
    )
}
