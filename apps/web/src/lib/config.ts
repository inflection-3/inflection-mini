export const SUPPORTED_CURRENCIES = [
    "USDC",
    "USDT",
    "USDB",
    "BRL",
    "USD",
    "MXN",
    "COP",
    "ARS",
  ] as const;
export const config = {
  dynamic: {
    environmentId: "a00775da-8e48-4541-a4f8-6385995b62ee",
  },

  // Contract Addresses
  contracts: {
    usdb: "0x4D423D2cfB373862B8E12843B6175752dc75f795" as `0x${string}`,
  },
  currencies: {
    stablecoins: ["USDC", "USDT", "USDB"],
    fiat: ["USD", "BRL", "MXN", "COP", "ARS"],
    // All supported currencies for FX quotes
    all: SUPPORTED_CURRENCIES,
  },
} as const;