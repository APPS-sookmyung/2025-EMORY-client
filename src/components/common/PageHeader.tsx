"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Hamburger from "./Hamburger";

interface Props {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, onBack, right, className }: Props) {
  return (
    <header className={`flex items-center justify-between px-6 pt-6 pb-2 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        {onBack ? (
          <button onClick={onBack} aria-label="back" className="p-2 rounded-lg hover:bg-white/20">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <span />
        )}
      </div>

      <h1 className="text-gray-600 text-lg font-medium">{title}</h1>

      <div className="flex items-center gap-2">
        {right}
        <Hamburger />
      </div>
    </header>
  );
}

