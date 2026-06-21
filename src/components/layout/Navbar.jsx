import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../ui/Icon";

const linkBase =
  "flex items-center gap-sm px-4 py-3 rounded-lg font-label-md text-label-md transition-all duration-200";

function navLinkClass({ isActive }) {
  return isActive
    ? `${linkBase} bg-primary-container text-on-primary-container font-bold`
    : `${linkBase} text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1`;
}

export default function Navbar() {
  const { user, isAdmin, isCommon, logout } = useAuth();

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
      <nav className="hidden md:flex flex-col sticky top-0 h-screen w-64 shrink-0 p-md bg-surface-container-low border-r border-white/5 shadow-xl z-40">
        <Link to="/" className="flex items-center gap-sm mb-lg">
          <span className="w-11 h-11 rounded-full bg-primary/15 border border-white/10 flex items-center justify-center shrink-0 text-primary">
            <Icon name="sports_soccer" size={24} />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="font-headline-md text-headline-md text-primary leading-tight break-words">
              Liga da Tutti
            </span>
            <span className="font-label-md text-label-md text-secondary">
              {isAdmin ? "Administrador" : "Organizador"}
            </span>
          </span>
        </Link>

        <div className="flex flex-col gap-base flex-1">{links}</div>

        <div className="mt-auto pt-sm border-t border-white/5 flex items-center justify-between gap-sm">
          <span className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface truncate">
              {user?.name}
            </span>
            <span className="font-body-md text-[12px] text-secondary truncate">
              {user?.email}
            </span>
          </span>
          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="shrink-0 text-secondary hover:text-error hover:bg-error/10 transition-colors p-2 rounded-full cursor-pointer">
            <Icon name="logout" size={22} />
          </button>
        </div>
      </nav>

      {/* Top bar (mobile) */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-20 bg-surface-dim/70 backdrop-blur-md border-b border-white/10">
        <Link
          to="/"
          className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">
          Liga da Tutti
        </Link>
        <div className="flex items-center gap-md text-on-surface-variant">
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
          {isAdmin && (
            <NavLink to="/stats" title="Estadísticas">
              <Icon name="leaderboard" size={24} />
            </NavLink>
          )}
          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="hover:text-error transition-colors cursor-pointer">
            <Icon name="logout" size={24} />
          </button>
        </div>
      </header>
    </>
  );
}
