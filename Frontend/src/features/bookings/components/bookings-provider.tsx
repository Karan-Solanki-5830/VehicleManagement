import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Booking } from '@/types'

type BookingsDialogType = 'add' | 'edit' | 'delete'

type BookingsContextType = {
    open: BookingsDialogType | null
    setOpen: (str: BookingsDialogType | null) => void
    currentRow: Booking | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Booking | null>>
}

const BookingsContext = React.createContext<BookingsContextType | null>(null)

type BookingsProviderProps = {
    children: React.ReactNode
}

export function BookingsProvider({ children }: BookingsProviderProps) {
    const [open, setOpen] = useDialogState<BookingsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Booking | null>(null)

    return (
        <BookingsContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </BookingsContext.Provider>
    )
}

export const useBookings = () => {
    const context = React.useContext(BookingsContext)
    if (!context) {
        throw new Error('useBookings must be used within BookingsProvider')
    }
    return context
}
