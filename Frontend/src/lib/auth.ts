export interface AuthPayload {
    sub?: string
    nameid?: string
    unique_name?: string
    name?: string
    role?: string | string[]
    ImageUrl?: string
    exp: number
}

export function parseJwt(token: string): AuthPayload {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch (e) {
        throw new Error('Invalid JWT token')
    }
}
