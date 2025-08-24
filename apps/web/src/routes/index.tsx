import { createFileRoute } from '@tanstack/react-router'
import { BalanceCard } from '@/components/balance-card'
import { ParternerApps, partnerApps } from '@/components/partner-apps'
import { getAuthToken } from "@dynamic-labs/sdk-react-core";


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const token = getAuthToken();
  console.log(token);

  return (
    <div className="flex flex-col gap-y-4 w-full">
<BalanceCard />
<ParternerApps data={partnerApps} />
    </div>
  )
}
