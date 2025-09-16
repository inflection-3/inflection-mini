"use client";

import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { erc20Abi } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export function useBalance() {
  const { primaryWallet } = useDynamicContext();
  const publicClient = usePublicClient();

  const {
    data: contractBalance,
    isLoading: contractLoading,
    error: contractError,
  } = useQuery({
    queryKey: ["user-balance", primaryWallet?.address, USDC_ADDRESS],
    queryFn: async () => {
      if (!publicClient || !primaryWallet?.address) return null;
      return await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [primaryWallet?.address as `0x${string}`],
      });
    },
    enabled: !!primaryWallet?.address && !!publicClient,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  return {
    balance: contractBalance ? Number(contractBalance) / 1e6 : 0,
    isLoading: contractLoading,
    error: contractError,
  };
}