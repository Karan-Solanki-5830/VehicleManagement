import { useState, useEffect } from 'react'
import { Car } from 'lucide-react'
import { VehiclesProvider } from './components/vehicles-provider'
import { VehiclesDialogs } from './components/vehicles-dialogs'
import { VehiclesTable } from './components/vehicles-table'
import { VehiclesPrimaryButtons } from './components/vehicles-primary-buttons'
import { FeatureShell } from '@/components/feature-shell'
import { vehiclesApi } from '@/services/vehicles'
import type { Vehicle } from '@/types'

export function Vehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, [search, status])

    const loadVehicles = async () => {
        try {
            setLoading(true)
            const result = await vehiclesApi.getAll(pagination.pageIndex + 1, pagination.pageSize, search, status)
            setVehicles(result.items)
            setTotalCount(result.totalCount)
        } catch (error) {
            console.error('Failed to load vehicles:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadVehicles()
    }, [pagination, search, status])

    return (
        <VehiclesProvider>
            <FeatureShell
                icon={Car}
                title="Vehicles"
                loading={loading}
                isEmpty={vehicles.length === 0 && search === '' && status === undefined}
                primaryButtons={<VehiclesPrimaryButtons />}
                table={
                    <VehiclesTable
                        data={vehicles}
                        rowCount={totalCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        search={search}
                        onSearch={setSearch}
                        status={status}
                        onStatusChange={setStatus}
                    />
                }
                dialogs={<VehiclesDialogs onSuccess={loadVehicles} />}
            />
        </VehiclesProvider>
    )
}
