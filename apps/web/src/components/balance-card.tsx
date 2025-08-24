import { useUsdcBalance } from "@/hooks/use-usdc-balance";
import { StatCard } from "./gradient-card";
import { Button } from "./ui/button";
import { useState } from "react";
import { ArrowUpRight, CirclePlus } from "lucide-react";
import { WalletScreen } from "./wallet-screen";

export function BalanceCard() {
    const { balance, isLoading } = useUsdcBalance({ address: "" })
    const [tab, setTab] = useState<"deposit" | "send">("deposit");
    const [isOpen, setIsOpen] = useState(false);
  
    const handleClick = (tab: "deposit" | "send") => {
        setIsOpen(true);
        setTab(tab);
      };
    return (
    <StatCard className="h-max p-5 py-8 border-[0.5px] w-full">
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-between w-full">
        <h2 className="text-lg font-semibold text-foreground">
          Wallet Balance
        </h2>
        <div className="">
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                ${balance ? balance?.toFixed(2) : 0}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <Button
          onClick={() => {
            handleClick("deposit");
          }}
          className="flex-1 rounded-sm border bg-transparent"
          variant={"outline"}
        >
          <CirclePlus />
          Deposit
        </Button>
        <Button
          onClick={() => {
            handleClick("send");
          }}
          className=" flex-1 rounded-sm border bg-transparent"
          variant={"outline"}
        >
          <ArrowUpRight />
          Send
        </Button>
      </div>
    </div>
    <WalletScreen tab={tab} isOpen={isOpen} setIsOpen={setIsOpen} />
  </StatCard>
  )
}