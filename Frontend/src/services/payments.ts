// Payments Module
import { api } from '../lib/api'
import type { Payment, PagedResult } from '../types'

export const paymentsApi = {
    getAll: async (page = 1, size = 10, search = '', method = '', isPaid?: boolean): Promise<PagedResult<Payment>> => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            search: search,
            method: method
        })
        if (isPaid !== undefined) {
            queryParams.append('isPaid', isPaid.toString())
        }
        const response = await api.get<PagedResult<Payment>>(`/payments?${queryParams.toString()}`)
        return response.data
    },
    create: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
        const response = await api.post<Payment>('/payments', payment)
        return response.data
    },
    update: async (id: number, payment: Partial<Payment>): Promise<Payment> => {
        const response = await api.put<Payment>(`/payments/${id}`, payment)
        return response.data
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/payments/${id}`)
    },
    getBookingLookup: async (): Promise<any[]> => {
        const response = await api.get<any[]>('/payments/bookings/lookup')
        return response.data
    },

    getTotalRevenue: async (): Promise<number> => {
        const response = await api.get<number>('/payments/total')
        return response.data
    },

    getDailyRevenue: async (): Promise<{ date: string; revenue: number }[]> => {
        const response = await api.get<{ date: string; revenue: number }[]>('/payments/chart')
        return response.data
    },

    getMonthlyRevenue: async (): Promise<{ date: string; revenue: number }[]> => {
        const response = await api.get<{ date: string; revenue: number }[]>('/payments/chart/monthly')
        return response.data
    },

    getYearlyRevenue: async (): Promise<{ date: string; revenue: number }[]> => {
        const response = await api.get<{ date: string; revenue: number }[]>('/payments/chart/yearly')
        return response.data
    },
}
