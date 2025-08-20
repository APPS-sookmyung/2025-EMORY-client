"use client";

import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../sidebar/SidebarContext";

interface Props {
  className?: string;
}

export default function Hamburger({ className }: Props) {
  const { open } = useSidebar();
  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon"
        onClick={open}
        className="p-2 rounded-lg hover:bg-white/20 text-gray-600"
        aria-label="open menu"
      >
        <Menu className="w-6 h-6" />
      </Button>
    </div>
  );
}

