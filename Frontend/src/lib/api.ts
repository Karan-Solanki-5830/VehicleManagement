import axios from 'axios'

const API_BASE_URL = 'http://apigateway.tryasp.net'

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? sessionStorage.getItem('thisisjustarandomstring') : null

        if (token && token !== '') {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear auth state
            const { useAuthStore } = require('@/stores/auth-store')
            const { auth } = useAuthStore.getState()
            auth.reset()
            window.location.href = '/login'
        }
        if (error.response?.status === 403) {
            window.location.href = '/errors/forbidden'
        }
        if (error.response?.status === 500) {
            window.location.href = '/errors/internal-server-error'
        }
        return Promise.reject(error)
    }
)
