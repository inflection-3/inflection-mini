import { useBalance} from "@/hooks/use-usdc-balance";
import { StatCard } from "./gradient-card";
import { useUser } from "@/hooks/use-user";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useNavigate } from "@tanstack/react-router";


export function BalanceCard({action = false}: {
  action?: boolean
}) {
  const navigate = useNavigate()
    const { user } = useUser()
    const { balance, isLoading } = useBalance()
    const {setShowDynamicUserProfile} = useDynamicContext()
    return (
    <StatCard className="w-full ">
    <div className="flex flex-col">
        <h2 className="font-semibold text-foreground text-muted-foreground">
          Total Balance
        </h2>
        <div className="">
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                ${balance ? balance : "0.00"   }
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 w-full">
          <p className="text-sm text-muted-foreground truncate max-w-[100px]">{user?.walletAddress}</p>
          <Button size={"sm"} variant="secondary" className="py-2 gap-[2px]" onClick={() => action ? setShowDynamicUserProfile(true) : navigate({to: "/wallet"})}>
            <Wallet />
            Wallet
          </Button>
        </div>
    </div>
  </StatCard>
  )
}