export function useUser() {
    return {
        authenticated: true,
        user: {
            phone: "1234567890",
            name: "John Doe",
            email: "john.doe@example.com",
            walletAddress: "0x1234567890012345678900123456789001234567890",
        },
        isLoading: false,
    }
}
