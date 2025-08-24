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
          "rounded-[28px] px-5 bg-gradient-to-b from-[#0E0E0E] to-[#1A1A1A] min-h-[118px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }