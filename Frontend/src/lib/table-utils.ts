export const columnAlignments = {
    numeric: {
        header: 'justify-end text-right',
        cell: 'text-right justify-end font-mono',
    },
    text: {
        header: 'justify-start text-left',
        cell: 'text-left justify-start',
    },
    center: {
        header: 'flex justify-center items-center text-center',
        cell: 'flex justify-center items-center text-center',
    },
    actions: {
        header: 'flex justify-center items-center text-center',
        cell: 'flex justify-center items-center text-center',
    },
}

export function getAlignmentClasses(type: keyof typeof columnAlignments) {
    return columnAlignments[type]
}

export const tableFormatters = {
    currency: (value: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value),

    date: (date: string | Date) =>
        new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
        }).format(new Date(date)),
}
