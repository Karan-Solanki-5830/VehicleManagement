export const paymentMethods = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'Debit Card', value: 'Debit Card' },
    { label: 'PayPal', value: 'PayPal' },
] as const

export const paymentStatuses = [
    { label: 'Paid', value: true },
    { label: 'Unpaid', value: false },
] as const
