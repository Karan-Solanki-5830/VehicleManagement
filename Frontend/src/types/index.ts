import { type LinkProps } from '@tanstack/react-router'

// Data models for Vehicle Management System

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  password?: string
  role: 'User' | 'Admin'
  imageUrl?: string
}

export interface Vehicle {
  id: number
  vehicleNumber: string
  model: string
  type: string
  capacity: number
  status: 'Available' | 'Maintenance' | 'Disabled'
}

export interface Booking {
  id: number
  customerId: number
  vehicleId: number
  bookingDate: string
  returnDate: string | null
  price: number
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
}

export interface Payment {
  id: number
  bookingId: number
  amount: number
  paymentMethod: string
  isPaid: boolean
  paymentDate: string
}

// API Request/Response types
export interface LoginRequest {
  name: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  address: string
  password: string
  role?: string
  image?: File
}

export interface BookingLookup {
  bookingId: number
  customerId: number
  customerName: string
  vehicleId: number
  vehicleNumber: string
}

// Layout types
export type LayoutUser = {
  name: string
  email: string
  avatar?: string
}

export type Team = {
  name: string
  logo: React.ElementType
  plan: string
}

export type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
}

export type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

export type NavItem = NavCollapsible | NavLink

export type NavGroup = {
  title: string
  items: NavItem[]
}

export type SidebarData = {
  user: LayoutUser
  teams: Team[]
  navGroups: NavGroup[]
}
