import { useUserLeaderboard } from "@/hooks/use-user-leaderboard";
import { StatCard } from "./gradient-card";
import { useQuery } from "@tanstack/react-query";
import { userQueries } from "@/lib/queries";

export function MyPoints({appId}: {appId?: string}) {
  const { data: points } = useQuery(userQueries.userPointsOptions())
  const { data: pointsByApp } = useQuery(userQueries.userPointsByAppOptions( appId ?? "", !!appId))
  return (
   <StatCard className="flex justify-between items-center">
   <h2 className="text-lg">My INX Points</h2> 
   <p className="text-lg font-extrabold">{appId ? pointsByApp : points} INX</p>
   </StatCard>
  );
}