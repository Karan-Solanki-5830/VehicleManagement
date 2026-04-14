import { api } from '@/lib/api'
import type { LoginRequest, LoginResponse, RegisterRequest, Customer } from '@/types'

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/customers/login', credentials)
        return response.data
    },

    register: async (userData: RegisterRequest): Promise<{ message: string; customer: Customer }> => {
        const formData = new FormData()
        formData.append('name', userData.name)
        formData.append('email', userData.email)
        formData.append('phone', userData.phone)
        formData.append('address', userData.address)
        formData.append('password', userData.password)
        formData.append('role', userData.role || 'User')

        if (userData.image) {
            formData.append('image', userData.image)
        }

        const response = await api.post<{ message: string; customer: Customer }>('/customers/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    logout: () => {
        // Clear token from cookies via auth store
        return Promise.resolve()
    },
}
