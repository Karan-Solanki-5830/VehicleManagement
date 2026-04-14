import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Vehicle } from '@/types'

type VehiclesDialogType = 'add' | 'edit' | 'delete'

type VehiclesContextType = {
    open: VehiclesDialogType | null
    setOpen: (str: VehiclesDialogType | null) => void
    currentRow: Vehicle | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Vehicle | null>>
    bookingOpen: boolean
    setBookingOpen: (open: boolean) => void
}

const VehiclesContext = React.createContext<VehiclesContextType | null>(null)

type VehiclesProviderProps = {
    children: React.ReactNode
}

export function VehiclesProvider({ children }: VehiclesProviderProps) {
    const [open, setOpen] = useDialogState<VehiclesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Vehicle | null>(null)
    const [bookingOpen, setBookingOpen] = useState(false)

    return (
        <VehiclesContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow, bookingOpen, setBookingOpen }}
        >
            {children}
        </VehiclesContext.Provider>
    )
}

export const useVehicles = () => {
    const context = React.useContext(VehiclesContext)
    if (!context) {
        throw new Error('useVehicles must be used within VehiclesProvider')
    }
    return context
}
