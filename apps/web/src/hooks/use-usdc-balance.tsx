export function useUsdcBalance({}: {
    address: string
}) {
    return {
        balance: 0,
        isLoading: false,
    }
}