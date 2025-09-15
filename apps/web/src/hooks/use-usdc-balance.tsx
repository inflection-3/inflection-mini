export function useUsdcBalance(props: {
    address: string
}) {
    
    console.log(props)
    return {
        balance: 0.00,
        isLoading: false,
    }
}