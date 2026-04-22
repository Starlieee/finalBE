import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Ticket as TicketIcon } from "lucide-react";
import { getUser, logout } from "@/lib/auth";

export function Navbar() {
  const navigate = useNavigate();
  const state = useRouterState();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  if (state.location.pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight">
            TICKET<span className="text-primary text-glow">WAVE</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-semibold" }} activeOptions={{ exact: true }}>Explore</Link>
          <Link to="/my-tickets" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-semibold" }}>My Tickets</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link to="/my-tickets" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card">
                <TicketIcon className="h-4 w-4" />
              </Link>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-accent">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
