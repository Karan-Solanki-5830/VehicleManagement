import { CircleCheck, CircleX } from 'lucide-react'

export const vehicleTypes = [
    { label: 'SUV', value: 'SUV' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'Truck', value: 'Truck' },
    { label: 'Van', value: 'Van' },
    { label: 'Bus', value: 'Bus' },
] as const

export const vehicleStatuses = [
    {
        label: 'Available',
        value: 'Available',
        icon: CircleCheck,
    },
    {
        label: 'Maintenance',
        value: 'Maintenance',
        icon: CircleX,
    },
    {
        label: 'Disabled',
        value: 'Disabled',
        icon: CircleX,
    },
] as const
