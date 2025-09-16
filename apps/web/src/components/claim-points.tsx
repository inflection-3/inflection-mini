import type { PartnerApplication } from "@mini/types";
import { Button } from "./ui/button";

export function ClaimPoints({}: {
    app?:PartnerApplication
}) {
  return <Button  className="w-full">Claim Points</Button>
}