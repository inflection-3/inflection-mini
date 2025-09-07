export function useUsdcBalance({ address }: {
    address: string
}) {
    
    return {
        balance: 0.00,
        isLoading: false,
    }
}