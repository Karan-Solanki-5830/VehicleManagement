import { api } from '@/lib/api'

export interface DashboardStats {
    totalCustomers: number
    totalVehicles: number
    totalBookings: number
    totalRevenue: number
    revenueChart: object
}

export interface RecentBooking {
    id: number
    amount: number
    customerName: string
    vehicleNumber: string
    paymentDate: string
}

export interface RevenueData {
    date: string
    revenue: number
}

export const dashboardApi = {
    getStats: async (period?: string): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>(`/api/dashboard${period ? `?period=${period}` : ''}`)
        return response.data
    },
    getRevenueChart: async (view: string): Promise<RevenueData[]> => {
        const response = await api.get<RevenueData[]>(`/api/dashboard/chart?view=${view}`)
        return response.data
    },
    getRecentBookings: async (): Promise<RecentBooking[]> => {
        const response = await api.get<RecentBooking[]>('/api/dashboard/recent-bookings')
        return response.data
    },
}
