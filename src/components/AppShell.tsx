import { Link } from "@tanstack/react-router";
import { Home, MessageSquareText, Instagram, Drama, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

import logo from "@/assets/talksy-logo.png.asset.json";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/analyze", label: "Analyze", icon: MessageSquareText },
  { to: "/profile", label: "Profile", icon: Instagram },
  { to: "/practice", label: "Practice", icon: Drama },
  { to: "/coach", label: "Coach", icon: GraduationCap },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src={logo.url}
              alt="Talksy"
              className="h-6 w-auto shrink-0 opacity-95"
              width={120}
              height={24}
            />
          </Link>
          <nav className="hidden gap-1 md:flex">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-6 pb-28 md:pb-16">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
