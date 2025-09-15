"use client";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import {  QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config as wagmiConfig } from "@/lib/wagmi";
import {  config } from "@/lib/config";
import { queryClient } from "@/lib/query-client";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { api } from "@/lib/api";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { toast } from "sonner";
import { userQueries } from "@/lib/queries";



export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: config.dynamic.environmentId,
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
        events: {
          onLogout: async () => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            queryClient.clear()
            window.location.reload()
          },
          onAuthSuccess: async (user) => {
            try {
              const dynamicAccessToken =await getAuthToken()
              const response = await api('/auth/login', {
                method: 'POST',
                body: {
                  email: user?.user?.email,
                  name: user?.user?.username,
                  phone: user?.user?.phoneNumber,
                  walletAddress: user?.primaryWallet?.address,
                },
                headers: {
                  'Content-Type': 'application/json',
                  "x-dynamic-access-token": dynamicAccessToken!,
                },
              })
              if (!response.success) {
                toast.error(response.message)
              }
              localStorage.setItem("accessToken", response.data.accessToken)
              localStorage.setItem("refreshToken", response.data.refreshToken)
              queryClient.setQueryData(userQueries.me(), response.data)
              toast.success("Logged in successfully")
              window.location.reload()
            } catch (error) {
             toast.error(error instanceof Error ? error.message : "An unknown error occurred")
             queryClient.clear()
            }
           
          }
        }
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}