import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { Link } from "@tanstack/react-router";
import { Home, RadioIcon, Bell, Wallet } from "lucide-react";

const data = [
  {
    label: "Home",
    icon: <Home />,
    href: "/",
    type: "link",
  },
  {
    label: "Wallet",
    icon: <Wallet />,
    href: "/wallet",
    type: "action",
  },
  {
    label: "Notifications",
    icon: <Bell />,
    href: "/notifications",
    type: "link",
  },
  {
    label: "Network",
    icon: <RadioIcon />,
    href: "/network",
    type: "link",
  },
];

export function BottomNavigation() {
  return (
    <div className="fixed bottom-2 w-full max-w-md mx-auto inset-x-0">
      <Dock
        magnification={40}
        distance={10}
        className="items-end pb-3 bg-background justify-center w-full max-w-xs mx-auto"
      >
        {data.map((item, idx) => (
          <Link to={item.href} key={idx}>
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800"
            >
              <DockLabel>{item.label}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
}
