// Vehicles Module
import { api } from '@/lib/api'
import type { Vehicle, PagedResult } from '@/types'

export const vehiclesApi = {
    getAll: async (page = 1, size = 10, search = '', status = ''): Promise<PagedResult<Vehicle>> => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            search: search
        })
        if (status) {
            queryParams.append('status', status)
        }
        const response = await api.get<PagedResult<Vehicle>>(`/vehicles?${queryParams.toString()}`)
        return response.data
    },
    getAvailable: async (): Promise<Vehicle[]> => {
        const response = await api.get<Vehicle[]>('/vehicles/available')
        return response.data
    },
    create: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
        const response = await api.post<Vehicle>('/vehicles', vehicle)
        return response.data
    },
    update: async (id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
        const response = await api.put<Vehicle>(`/vehicles/${id}`, vehicle)
        return response.data
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/vehicles/${id}`)
    },
    getCount: async (): Promise<number> => {
        const response = await api.get<number>('/vehicles/count')
        return response.data
    },
}
