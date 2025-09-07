import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function StatCard({
    className,
    children,
    ...props
  }: ComponentProps<"div">) {
    return (
      <div
        className={cn(
          "rounded-[16px] p-5 bg-gradient-to-b from-[#0E0E0E] to-[#1A1A1A] border-[0.5px] min-h-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }