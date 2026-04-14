// Bookings Module
import { api } from '@/lib/api'
import type { Booking, PagedResult } from '@/types'

export const bookingsApi = {
    getAll: async (page = 1, size = 10, search = '', status = ''): Promise<PagedResult<Booking>> => {
        const response = await api.get<PagedResult<Booking>>(`/bookings?page=${page}&size=${size}&search=${search}&status=${status}`)
        return response.data
    },
    create: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
        const response = await api.post<Booking>('/bookings', booking)
        return response.data
    },
    update: async (id: number, booking: Partial<Booking>): Promise<Booking> => {
        const response = await api.put<Booking>(`/bookings/${id}`, booking)
        return response.data
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/bookings/${id}`)
    },
    getCount: async (): Promise<number> => {
        const response = await api.get<number>('/bookings/count')
        return response.data
    },
}
