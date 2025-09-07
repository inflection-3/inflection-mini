import { useUserLeaderboard } from "@/hooks/use-user-leaderboard";
import { StatCard } from "./gradient-card";

export function MyPoints() {
    const {  points } = useUserLeaderboard()
  return (
   <StatCard className="flex justify-between items-center">
   <h2 className="text-lg">My INX Points</h2> 
   <p className="text-lg font-extrabold">{points} INX</p>
   </StatCard>
  );
}