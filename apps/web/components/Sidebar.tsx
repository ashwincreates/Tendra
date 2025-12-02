// components/Sidebar.tsx (Always collapsed, icon-only, with menu items array)
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  X,
  Home,
  History,
  Settings,
  User,
  MessageCircle,
  Orbit,
} from "lucide-react";
import { usePathname } from "next/navigation";

type MenuItem = {
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  label: string; // Included for potential future expansion, but hidden in collapsed mode
};

const menuItems: MenuItem[] = [
  { icon: Home, path: "/", label: "Home" },
  // { icon: MessageCircle, path: "/chat", label: "Chat" },
  // { icon: History, path: "/history", label: "History" },
  // { icon: Settings, path: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 border-r bg-background/80 backdrop-blur-sm flex flex-col h-screen sticky top-0 z-50">
      {/* Header with logo */}
      <div className="p-3 border-b flex items-center justify-center">
        <Link href="/" className="p-1">
          <Orbit className="size-6 text-primary" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Button
              key={item.path}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-center p-2"
            >
              <Link href={item.path} className="flex items-center w-full">
                <Icon className="h-4 w-4" />
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
