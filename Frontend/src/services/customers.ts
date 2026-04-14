import { api } from '@/lib/api'
import type { Customer, PagedResult } from '@/types'

export const customersApi = {
    getAll: async (page = 1, size = 10, search = '', role = ''): Promise<PagedResult<Customer>> => {
        const response = await api.get<PagedResult<Customer>>(`/customers?page=${page}&size=${size}&search=${search}&role=${role}`)
        return response.data
    },

    getLookup: async (): Promise<{ id: number; name: string }[]> => {
        const response = await api.get<{ id: number; name: string }[]>('/customers/lookup')
        return response.data
    },

    getById: async (id: number): Promise<Customer> => {
        const response = await api.get<Customer>(`/customers/${id}`)
        return response.data
    },

    create: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
        const response = await api.post<Customer>('/customers', customer)
        return response.data
    },

    update: async (id: number, customer: Partial<Customer>): Promise<Customer> => {
        const response = await api.put<Customer>(`/customers/${id}`, customer)
        return response.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/customers/${id}`)
    },

    getBookings: async (id: number): Promise<any[]> => {
        const response = await api.get(`/customers/${id}/bookings`)
        return response.data
    },

    bulkCreate: async (file: File): Promise<void> => {
        const formData = new FormData()
        formData.append('file', file)
        await api.post('/customers/bulk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },

    getCount: async (): Promise<number> => {
        const response = await api.get<number>('/customers/count')
        return response.data
    },

    uploadImage: async (id: number, file: File): Promise<{ imageUrl: string }> => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await api.post<{ imageUrl: string }>(`/customers/upload-image/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },
}
