import { useState } from "react";
import { Button } from "./ui/button";
import { useSubmitInteractionMutation } from "@/lib/mutations";

export function MissionAction({
    actionTitle,
    interactionUrl,
    interactionId,
}: {
    actionTitle: string | null;
    interactionUrl: string;
    interactionId: string;
}) {
    const [linkVisited, setLinkVisited] = useState(false)
    const {mutate: submitInteraction, isPending} = useSubmitInteractionMutation()
    const vistiLink = () => {
        window.open(interactionUrl, "_blank")
        setLinkVisited(true)
    }
    if(linkVisited) {
       return <Button className="w-full" disabled={isPending} onClick={() => submitInteraction(interactionId)}>{isPending ? "Claiming Points..." : "Claim Points"}</Button>
    }
  return <Button variant="outline" className="w-full" onClick={vistiLink}>{actionTitle}</Button> 
}