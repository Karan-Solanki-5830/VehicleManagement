import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Payment } from '@/types'

type PaymentsDialogType = 'add' | 'edit' | 'delete'

type PaymentsContextType = {
    open: PaymentsDialogType | null
    setOpen: (str: PaymentsDialogType | null) => void
    currentRow: Payment | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Payment | null>>
}

const PaymentsContext = React.createContext<PaymentsContextType | null>(null)

type PaymentsProviderProps = {
    children: React.ReactNode
}

export function PaymentsProvider({ children }: PaymentsProviderProps) {
    const [open, setOpen] = useDialogState<PaymentsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Payment | null>(null)

    return (
        <PaymentsContext.Provider
            value={{ open, setOpen, currentRow, setCurrentRow }}
        >
            {children}
        </PaymentsContext.Provider>
    )
}

export const usePayments = () => {
    const context = React.useContext(PaymentsContext)
    if (!context) {
        throw new Error('usePayments must be used within PaymentsProvider')
    }
    return context
}
