import { Button, Icon, Input, Table } from "@shared/components/ui";
import { resolveAssetUrl } from "@shared/utils/assetUrl";
import { useTeamFilters } from "../hooks/useTeamFilters";

export default function TeamList({
  teams,
  onEdit,
  onDelete,
  canDelete = true,
  canEdit = () => true,
}) {
  const { search, setSearch, visible: filteredTeams } = useTeamFilters(teams);

  if (!teams.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-xl text-center text-muted-foreground flex flex-col items-center gap-sm">
        <Icon name="sports_soccer" size={40} />
        <p className="font-body-md text-body-md">
          No hay equipos registrados todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
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

      {filteredTeams.length === 0 ? (
        <div className="p-xl text-center text-muted-foreground">
          <p className="font-body-md text-body-md">
            Ningún equipo coincide con "{search}".
          </p>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell head>Equipo</Table.Cell>
              <Table.Cell head>Director técnico</Table.Cell>
              <Table.Cell head className="text-right">
                Acciones
              </Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTeams.map((team) => {
              const logoUrl = resolveAssetUrl(team.logoUrl);
              return (
                <Table.Row key={team.id}>
                  <Table.Cell>
                    <span className="flex items-center gap-sm">
                      <span className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon
                            name="sports_soccer"
                            size={16}
                            className="text-muted-foreground"
                          />
                        )}
                      </span>
                      <span className="font-label-md text-label-md text-foreground">
                        {team.name}
                      </span>
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {team.dt || "—"}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-xs">
                      {canEdit(team) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(team)}>
                          <Icon name="edit" size={16} />
                          Editar
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(team)}>
                          <Icon name="delete" size={16} />
                          Eliminar
                        </Button>
                      )}
                    </div>
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
