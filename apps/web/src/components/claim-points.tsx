import type { PartnerApplication } from "@mini/types";
import { Button } from "./ui/button";

export function ClaimPoints({app}: {
    app?:PartnerApplication
}) {
  if(!app?.openForClaim) {
    return null;
  }
  return <Button  className="w-full">Claim Points</Button>
}