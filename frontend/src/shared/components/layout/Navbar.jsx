import { Link, NavLink } from "react-router-dom";
import { Icon, Button } from "@shared/components/ui";
import { cn } from "@shared/utils/cn";
import useAuthStore from "@features/auth/hooks/useAuthStore";

const linkBase =
  "flex items-center gap-sm px-4 py-3 rounded-md font-label-md text-label-md transition-colors duration-150";

function navLinkClass({ isActive }) {
  return cn(
    linkBase,
    isActive
      ? "bg-accent text-accent-foreground font-bold"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );
}

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isCommon = useAuthStore((s) => s.isCommon);
  const logout = useAuthStore((s) => s.logout);

  const links = (
    <>
      {isCommon && (
        <>
          <NavLink to="/fixture" className={navLinkClass}>
            <Icon name="calendar_today" size={20} />
            <span>Fixture</span>
          </NavLink>
          <NavLink to="/matches/new" className={navLinkClass}>
            <Icon name="add_circle" size={20} />
            <span>Organizar Partido</span>
          </NavLink>
        </>
      )}
      <NavLink to="/teams" className={navLinkClass}>
        <Icon name="sports_soccer" size={20} />
        <span>Equipos</span>
      </NavLink>
      <NavLink to="/tournaments" className={navLinkClass}>
        <Icon name="trophy" size={20} />
        <span>Torneos</span>
      </NavLink>
      {isAdmin && (
        <NavLink to="/stats" className={navLinkClass}>
          <Icon name="leaderboard" size={20} />
          <span>Estadísticas</span>
        </NavLink>
      )}
    </>
  );

  return (
    <>
      <nav className="hidden md:flex flex-col sticky top-0 h-screen w-64 shrink-0 p-md bg-card border-r border-border z-40">
        <Link to="/" className="flex items-center gap-sm mb-lg">
          <span className="flex flex-col min-w-0">
            <span className="font-headline-md text-headline-md text-foreground leading-tight break-words">
              Liga da Tutti
            </span>
            <span className="font-label-md text-label-md text-muted-foreground">
              {isAdmin ? "Administrador" : "Organizador"}
            </span>
          </span>
        </Link>

        <div className="flex flex-col gap-base flex-1">{links}</div>

        <div className="mt-auto pt-sm border-t border-border flex items-center justify-between gap-sm">
          <span className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-foreground truncate">
              {user?.name}
            </span>
            <span className="font-body-md text-[12px] text-muted-foreground truncate">
              {user?.email}
            </span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Cerrar sesión"
            className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Icon name="logout" size={20} />
          </Button>
        </div>
      </nav>

      {/* Top bar (mobile) */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-20 bg-card border-b border-border">
        <Link
          to="/"
          className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">
          Liga da Tutti
        </Link>
        <div className="flex items-center gap-md text-muted-foreground">
          {isCommon && (
            <>
              <NavLink to="/fixture" title="Fixture">
                <Icon name="calendar_today" size={24} />
              </NavLink>
              <NavLink to="/matches/new" title="Organizar partido">
                <Icon name="add_circle" size={24} />
              </NavLink>
            </>
          )}
          <NavLink to="/teams" title="Equipos">
            <Icon name="sports_soccer" size={24} />
          </NavLink>
          <NavLink to="/tournaments" title="Torneos">
            <Icon name="trophy" size={24} />
          </NavLink>
          {isAdmin && (
            <NavLink to="/stats" title="Estadísticas">
              <Icon name="leaderboard" size={24} />
            </NavLink>
          )}
          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="hover:text-destructive transition-colors cursor-pointer">
            <Icon name="logout" size={24} />
          </button>
        </div>
      </header>
    </>
  );
}
