//@ts-ignore
//@ts-nocheck

import { BalanceCard } from "@/components/balance-card";
import { ClaimPoints } from "@/components/claim-points";
import { StatCard } from "@/components/gradient-card";
import { MissionAction } from "@/components/mission-action";
import { MyPoints } from "@/components/my-points";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { appsQueries } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams, useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/apps/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context;
    const app = await queryClient.fetchQuery(
      appsQueries.detailOptions(params.id)
    );
    return { app };
  },
});

function RouteComponent() {
  const {auth} = useRouteContext({
    from: "/_main/apps/$id",
  })
  const { id } = useParams({
    from: "/_main/apps/$id",
  });
  const { data: app } = useSuspenseQuery(appsQueries.detailOptions(id));
  return (
    <div className="flex flex-col gap-10 rounded-lg p-4 ">
      <BalanceCard />
      <MyPoints appId={id} />
      <StatCard className=" w-full">
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="flex items-center gap-3x">
            <img
              src={app?.appLogo ?? ""}
              alt={app?.appName ?? ""}
              width={32}
              height={32}
              className="rounded-full"
            />
            <h3 className="text-lg font-semibold text-foreground w-max">
              {app?.appName}
            </h3>
          </div>
        </div>
        {/* Missions Accordion */}
        <Accordion type="single" collapsible className="space-y-2">
          {app?.interactions?.map((interaction, index) => {
            return (
              <AccordionItem
                key={interaction.id}
                value={interaction.id.toString()}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {interaction?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {interaction.description}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="w-full mt-4">
                  {
                    auth.isAuthenticated ? (
                      <MissionAction
                        actionTitle={interaction.actionTitle}
                        interactionUrl={interaction.interactionUrl}
                        interactionId={interaction.id}
                      />) :( 
                        <Link className={cn(buttonVariants({
                          variant: "default",
                        }), "w-full")}  to="/login" params={{
                          redirect: "apps/" + id,
                        }}>
                          Login
                        </Link>
                      )
                    
                  }
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="h-5"></div>
        <ClaimPoints app={app ?? undefined} />
      </StatCard>
    </div>
  );
}
