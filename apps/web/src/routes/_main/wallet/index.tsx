import { StatCard } from "@/components/gradient-card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils";
import { DynamicEmbeddedUserProfile } from "@dynamic-labs/sdk-react-core";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/_main/wallet/")({
  component: RouteComponent,
});

type TransactionType =
  | "deposit"
  | "withdrawal"
  | "transfer"
  | "buy"
  | "sell"
  | "swap"
  | "receive"
  | "app_incentaction";

type TransactionItemProps = {
  type: TransactionType;
  amount: number;
  date: string;
  status: "pending" | "completed" | "failed";
};

const transactionItems: TransactionItemProps[] = [
  {
    type: "deposit",
    amount: 100,
    date: "2021-01-01",
    status: "completed",
  },
  {
    type: "withdrawal",
    amount: 100,
    date: "2021-01-01",
    status: "completed",
  },
  {
    type: "transfer",
    amount: 100,
    date: "2021-01-01",
    status: "completed",
  },
  {
    type: "buy",
    amount: 100,
    date: "2021-01-01",
    status: "pending",
  },
  {
    type: "sell",
    amount: 100,
    date: "2021-01-01",
    status: "failed",
  },
  {
    type: "swap",
    amount: 100,
    date: "2021-01-01",
    status: "completed",
  },
];

function RouteComponent() {
  return (
    <>
      {/* <BalanceCard />
      <MyPoints />
      <div className="h-5"></div>
      <h1 className="font-medium">Transction History</h1>
      <div className="flex justify-between">
        <SearchInput />
        <Button variant="outline">
          <Filter />
          Filter
        </Button>
      </div>
      <div className="flex flex-col gap-5 mb-20">
        {transactionItems.map((item) => (
          <TransactionItem key={item.type} {...item} />
        ))}
      </div> */}
      <DynamicEmbeddedUserProfile  />
    </>
  );
}

// function TransactionItem({ type, amount, date, status }: TransactionItemProps) {
//   const statusColor =
//     status === "completed"
//       ? "bg-green-500"
//       : status === "pending"
//         ? "bg-yellow-500"
//         : "bg-red-500";
//   const statusTextColor =
//     status === "completed"
//       ? "text-green-500"
//       : status === "pending"
//         ? "text-yellow-500"
//         : "text-red-500";
//   const Icon = type === "deposit" && <ArrowUp /> || type === "withdrawal" && <ArrowDown /> || type === "transfer" && <ArrowRight /> || type === "buy" && <ArrowUp /> || type === "sell" && <ArrowDown /> || type === "swap" && <ArrowRight /> || type === "receive" && <ArrowDown /> || type === "app_incentaction" && <ArrowUp />;

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <StatCard>
//           <div className="flex justify-between">
//             <div className="flex items-center gap-2">
//               <div
//                 className={cn(
//                   "w-10 h-10 rounded-full bg-muted flex items-center justify-center",
//                   statusColor
//                 )}
//               >
//                 {Icon}
//               </div>
//               <div className="flex flex-col">
//                 <p className="text-sm font-medium">{type}</p>
//                 <p className="text-sm text-muted-foreground">{date}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <p className="text-sm font-medium">{amount}</p>
//             </div>
//           </div>
//         </StatCard>
//       </DrawerTrigger>
//       <DrawerContent>
//         <div className="flex p-5 flex-col max-w-md mx-auto w-full gap-4 items-center">
//         <h2 className="capitalize">{type}</h2>
//         <div
//           className={cn(
//             "h-10 w-10 flex items-center justify-center rounded-full",
//             statusColor
//           )}
//         >
//           {Icon}
//         </div>
//         <p className="text-lg">{amount} USDC</p>
//         <div className="flex justify-between items-center w-full">
//           <p className="text-sm text-muted-foreground">Date</p>
//           <p>{date}</p>
//         </div>
//         <div className="flex justify-between items-center w-full">
//           <p className="text-sm text-muted-foreground">Status</p>
//           <p className={cn(statusTextColor)}>{status}</p>
//         </div>
//         <div className="flex justify-between items-center w-full">
//           <p className="text-sm text-muted-foreground">Network</p>
//           <p>Ethereum</p>
//         </div>
//         <a className="w-full" href="https://etherscan.io/tx/0x1234567890" target="_blank">
//           <Button className="w-full">view on explorer</Button>
//         </a>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }
