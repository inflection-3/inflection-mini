import { useState } from "react";
import { Button } from "./ui/button";
import { useSubmitInteractionMutation } from "@/lib/mutations";
import { useRouteContext } from "@tanstack/react-router";
import { appsQueries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function MissionAction({
    actionTitle,
    interactionUrl,
    interactionId,
}: {
    actionTitle: string | null;
    interactionUrl: string;
    interactionId: string;
}) {
    const {auth} = useRouteContext({
        from: "/_main/apps/$id"
    })
    const {
        data: isSubmited,
        isLoading: isSubmitedLoading,
    } = useQuery({
        ...appsQueries.interactionsSubmitedOptions( interactionId, auth.isAuthenticated),
    })
    const [linkVisited, setLinkVisited] = useState(false)
    const {mutate: submitInteraction, isPending} = useSubmitInteractionMutation()
    const vistiLink = () => {
        window.open(interactionUrl, "_blank")
        setLinkVisited(true)
    }
    if(isSubmitedLoading) {
        return <Button className="w-full" disabled={true}>Loading...</Button>
    }
    console.log(isSubmited)
    if(isSubmited) {
        return <Button className="w-full text-green-500" variant={"secondary"}>Already Claimed</Button>
    }
    if(linkVisited) {
       return <Button className="w-full" disabled={isPending} onClick={() => submitInteraction(interactionId)}>{isPending ? "Claiming Points..." : "Claim Points"}</Button>
    }
  return <Button variant="outline" className="w-full" onClick={vistiLink}>{actionTitle}</Button> 
}