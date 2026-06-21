import { Link } from "react-router-dom";
import { useTournament } from "../hooks/useTournament";
import { useAuth } from "../hooks/useAuth";
import { useMatchFilters } from "../hooks/useMatchFilters";
import MatchList from "../components/matches/MatchList";
import Icon from "../components/ui/Icon";

const CHIPS = [
  { value: "todos", label: "Todos" },
  { value: "programado", label: "Programados" },
  { value: "finalizado", label: "Finalizados" },
  { value: "cancelado", label: "Cancelados" },
];

export default function FixturePage() {
  const { matches } = useTournament();
  const { user } = useAuth();
  const { filter, setFilter, onlyMine, setOnlyMine, visible } = useMatchFilters(
    matches,
    user.email,
  );

  return (
    <>
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
            Fixture
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Tus próximos encuentros y resultados.
          </p>
        </div>
        <Link
          to="/matches/new"
          className="md:hidden w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-full glow-primary flex items-center justify-center gap-sm font-bold">
          <Icon name="add" size={20} />
          Organizar Partido
        </Link>
      </section>

      <section className="flex flex-wrap items-center gap-sm">
        <div className="flex flex-wrap gap-xs">
          {CHIPS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={
                filter === c.value
                  ? "px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold cursor-pointer"
                  : "px-4 py-2 rounded-full border border-white/10 text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant/40 transition-colors cursor-pointer"
              }>
              {c.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-xs ml-auto font-label-md text-label-md text-on-surface-variant cursor-pointer">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="w-4 h-4 rounded-md accent-primary cursor-pointer"
          />
          Solo mis partidos
        </label>
      </section>

      <MatchList matches={visible} />
    </>
  );
}
