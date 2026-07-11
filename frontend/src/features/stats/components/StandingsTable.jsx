import { Badge, Icon, Input, Table } from "@shared/components/ui";
import { cn } from "@shared/utils/cn";
import { resolveAssetUrl } from "@shared/utils/assetUrl";
import {
  STANDINGS_SORTABLE_COLUMNS,
  useStandingsFilters,
} from "../hooks/useStandingsFilters";

export default function StandingsTable({ standings }) {
  const { search, setSearch, sort, toggleSort, isDefaultSort, visible } =
    useStandingsFilters(standings);

  if (!standings.length) {
    return (
      <div className="p-xl text-center text-muted-foreground">
        <p className="font-body-md text-body-md">
          No hay datos suficientes para armar la tabla.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      <div className="p-md pb-0">
        <div className="relative w-full max-w-[24rem]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Icon name="search" size={16} />
          </span>
          <Input
            type="text"
            placeholder="Buscar equipo por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="p-xl text-center text-muted-foreground">
          <p className="font-body-md text-body-md">
            Ningún equipo coincide con "{search}".
          </p>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell head className="text-center w-16">
                Pos
              </Table.Cell>
              {STANDINGS_SORTABLE_COLUMNS.map((col) => {
                const isActive = sort.key === col.key;
                return (
                  <Table.Cell
                    key={col.key}
                    head
                    className={cn(
                      col.align === "left" ? "text-left" : "text-center",
                      col.highlight && "text-primary",
                      col.hideOnMobile && "hidden sm:table-cell",
                    )}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-xs rounded-md px-2 py-1 -mx-2 transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-inherit hover:bg-muted hover:text-foreground",
                      )}>
                      {col.label}
                      {isActive ? (
                        <Icon
                          name="arrow_forward"
                          size={13}
                          className={cn(
                            "shrink-0 transition-transform",
                            sort.direction === "asc"
                              ? "-rotate-90"
                              : "rotate-90",
                          )}
                        />
                      ) : (
                        <Icon
                          name="unfold_more"
                          size={13}
                          className="shrink-0 opacity-40"
                        />
                      )}
                    </button>
                  </Table.Cell>
                );
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visible.map((row) => {
              const isLeader =
                isDefaultSort && row.position === 1 && row.played > 0;
              const logoUrl = resolveAssetUrl(row.logoUrl);
              return (
                <Table.Row
                  key={row.teamId}
                  className={isLeader ? "bg-primary/5" : undefined}>
                  <Table.Cell className="text-center">
                    {isLeader ? (
                      <Badge>1</Badge>
                    ) : (
                      <span className="text-muted-foreground">
                        {row.position}
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell
                    className={cn(
                      "font-bold",
                      isLeader ? "text-primary" : "text-foreground",
                    )}>
                    <span className="flex items-center gap-sm">
                      <span className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon
                            name="sports_soccer"
                            size={14}
                            className="text-muted-foreground"
                          />
                        )}
                      </span>
                      {row.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-center">{row.played}</Table.Cell>
                  <Table.Cell className="text-center">{row.won}</Table.Cell>
                  <Table.Cell className="text-center">{row.drawn}</Table.Cell>
                  <Table.Cell className="text-center">{row.lost}</Table.Cell>
                  <Table.Cell className="text-center hidden sm:table-cell text-muted-foreground">
                    {row.goalsFor}
                  </Table.Cell>
                  <Table.Cell className="text-center hidden sm:table-cell text-muted-foreground">
                    {row.goalsAgainst}
                  </Table.Cell>
                  <Table.Cell className="text-center hidden sm:table-cell text-muted-foreground">
                    {row.yellowCards}
                  </Table.Cell>
                  <Table.Cell className="text-center hidden sm:table-cell text-muted-foreground">
                    {row.redCards}
                  </Table.Cell>
                  <Table.Cell
                    className={cn(
                      "text-center font-bold text-[18px]",
                      isLeader ? "text-primary" : "text-foreground",
                    )}>
                    {row.points}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
