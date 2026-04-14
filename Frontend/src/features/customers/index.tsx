import { useState, useEffect } from 'react'
import { UsersRound } from 'lucide-react'
import { CustomersProvider } from './components/customers-provider'
import { CustomersDialogs } from './components/customers-dialogs'
import { CustomersTable } from './components/customers-table'
import { CustomersPrimaryButtons } from './components/customers-primary-buttons'
import { FeatureShell } from '@/components/feature-shell'
import { customersApi } from '@/services/customers'
import type { Customer } from '@/types'
import { useDebounce } from '@/hooks/use-debounce'

export function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)

    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, [debouncedSearch, role])

    const loadCustomers = async () => {
        try {
            setLoading(true)
            const result = await customersApi.getAll(pagination.pageIndex + 1, pagination.pageSize, debouncedSearch, role)
            setCustomers(result.items)
            setTotalCount(result.totalCount)
        } catch (error) {
            console.error('Failed to load customers:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCustomers()
    }, [pagination, debouncedSearch, role])

    return (
        <CustomersProvider>
            <FeatureShell
                icon={UsersRound}
                title="Customers"
                loading={loading}
                isEmpty={customers.length === 0 && search === '' && role === ''}
                primaryButtons={<CustomersPrimaryButtons />}
                table={
                    <CustomersTable
                        data={customers}
                        rowCount={totalCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        search={search}
                        onSearch={setSearch}
                        role={role}
                        onRoleChange={setRole}
                    />
                }
                dialogs={<CustomersDialogs onSuccess={loadCustomers} />}
            />
        </CustomersProvider>
    )
}
