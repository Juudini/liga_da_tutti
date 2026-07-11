# Liga da Tutti ⚽

Aplicación web para gestionar equipos, torneos, partidos y estadísticas de una liga de fútbol barrial.

## Integrantes

- Juan Debandi

## Descripción

Liga da Tutti es una plataforma de gestión deportiva para ligas de fútbol amateur. Cualquier usuario registrado puede crear equipos y torneos, y organizar partidos (con goleadores y tarjetas por jugador); el administrador además tiene acceso a un panel de estadísticas. El frontend consume una API REST propia (ver `liga_da_tutti/backend`).

## Requisito previo: backend corriendo

Este proyecto **no funciona de forma aislada**: el login y todas las pantallas dependen de la API REST real. Antes de levantar el frontend, hay que tener el backend andando — ver `liga_da_tutti/backend/README.md`, o levantar todo junto con Docker desde la raíz (`liga_da_tutti/README.md`).

## Instalación

```bash
cd liga_da_tutti/frontend
pnpm install
```

Requiere Node.js 18+ y [pnpm](https://pnpm.io/) (el proyecto usa `pnpm-lock.yaml`).

## Variables de entorno

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

| Variable       | Descripción                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_URL` | URL base de la API consumida por `infrastructure/api/client.js`. Debe incluir el prefijo `/api` y apuntar al backend corriendo. Por defecto `http://localhost:4000/api`. |

## Comandos

```bash
pnpm dev       # servidor de desarrollo (Vite), por defecto en http://localhost:5173
pnpm build     # build de producción
pnpm lint      # linter (ESLint)
pnpm preview   # sirve el build de producción localmente
```

## Docker

Ver `Dockerfile` (build multi-stage: Vite + pnpm en la etapa de build, nginx en runtime) y `docker-compose.yml` de esta carpeta para levantar solo el frontend dockerizado. Para levantar todo el proyecto junto, ver `liga_da_tutti/README.md`.

## Usuarios y roles

Creados por el `Seed_Script` del backend (`npm run seed`):

| Email          | Contraseña | Rol                  |
| -------------- | ---------- | -------------------- |
| admin@liga.com | admin123   | Administrador        |
| juan@liga.com  | juan123    | Organizador (common) |
| maria@liga.com | maria123   | Organizador (common) |

También se puede crear una cuenta nueva desde `/register` (queda con rol "common").

- **Administrador**: accede al panel de administración de equipos/torneos y al panel de Estadísticas globales (con filtro por torneo, incluyendo los ajenos).
- **Organizador (common)**: accede al Fixture de partidos, gestión de equipos y torneos. Solo puede editar/eliminar los equipos, torneos y partidos que él mismo creó (los de otros usuarios se muestran de solo lectura). Puede ver estadísticas únicamente de los torneos que él mismo creó (nunca amistosos ni torneos ajenos), desde el detalle de cada torneo en el Fixture.

## Funcionalidades principales

- **Fixture de partidos**: listado con filtros (búsqueda, estado, torneo), alta/edición con carga de goleadores y tarjetas por jugador (solo el organizador dueño del partido).
- **Torneos**: carga de todos los torneos existentes ; cada card lleva al detalle con todos los partidos de ese torneo y, si el usuario es el dueño, un resumen de estadísticas (o un aviso de "no hay suficientes datos" si el torneo aún no tiene partidos).
- **Equipos**: alta/edición con subida de logo (imagen), listado con búsqueda.
- **Estadísticas (admin)**: resumen general y tabla de posiciones, con filtro por torneo o vista global (incluye amistosos).
- **Registro/Login**: `/register` y `/login`, con rutas protegidas por rol (`RoleRoute`) y por sesión (`ProtectedRoute`).

## Arquitectura

El código de `src/` sigue una **screaming architecture** organizada por funcionalidad de negocio (Scope Rule: lo que usa una sola feature vive en esa feature, lo que usan dos o más vive en `shared/`):

```
src/
  app/              # composición raíz, árbol de rutas (React Router v7) y providers globales
  features/
    auth/            # login, registro, sesión (Zustand)
    matches/         # fixture, alta/edición/detalle de partidos
    teams/           # administración de equipos
    tournaments/      # administración de torneos, cards y detalle de partidos por torneo
    stats/           # resumen y tabla de posiciones (admin global, o por torneo propio para common)
  shared/           # componentes UI (compound components), layout, hooks y utilidades usados por 2+ features
  infrastructure/   # Api_Client (fetch nativo + JWT), autenticación de rutas (Protected_Route/Role_Route)
```

Las importaciones entre estas carpetas usan los alias `@app`, `@features`, `@shared` y `@infrastructure` (configurados en `vite.config.js` y `jsconfig.json`), en vez de rutas relativas largas.

Otras decisiones de diseño relevantes:

- **Estado global con Zustand**: sesión (`useAuthStore`), partidos (`useMatchesStore`), equipos (`useTeamsStore`) y torneos (`useTournamentsStore`) se manejan con stores de Zustand.
- **Formularios con React Hook Form**: login, registro, alta/edición de partidos, equipos y torneos, con validación en cliente antes de enviar la petición al backend.
- **Sistema de componentes UI propio** (`shared/components/ui/`): primitivas y compound components (`Button`, `Card`, `Input`, `Select`, `Dialog`, `Table`, `Toast`, etc.) con estética minimalista inspirada en shadcn/ui, pero sin adoptar esa librería.
- **Notificaciones y confirmaciones globales**: `useToast()` y `useConfirm()`, montados una sola vez en `app/providers.jsx`, se usan desde cualquier feature sin duplicar diálogos locales.

## Stack tecnológico

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Zustand (estado global)
- React Hook Form (formularios)

## Capturas de pantalla

### Login

![Login](/src/assets/screen_login.png)

### Admin Dashboard

![Admin Dashboard](/src/assets/screen_admin.png)

### Usuario - home

![Usuario - home](/src/assets/screen_common.png)

### Usuario - organizar

![Usuario - organizar](/src/assets/screen_organizer.png)

> Nota: las capturas corresponden a una versión anterior de la interfaz (previa a torneos, subida de imágenes y estadísticas por torneo); tengo que actualizarlas xd tarea para mi yo del futuro

## 🔗 Links

<a href="https://www.linkedin.com/in/juandebandi/"><img alt="LinkedIn" title="LinkedIn" src="https://custom-icon-badges.demolab.com/badge/-LinkedIn-231b2e?style=for-the-badge&logoColor=F8D866&logo=LinkedIn"/></a>
<a href="https://juandebandi.dev/"><img alt="Portfolio" title="Portfolio" src="https://custom-icon-badges.demolab.com/badge/-|Portfolio-1F222E?style=for-the-badge&logoColor=F8D866&logo=link-external"/></a>
<a href="mailto:juudinidev@gmail.com">
<img src="https://custom-icon-badges.demolab.com/badge/-Email-231b2e?style=for-the-badge&logoColor=F8D866&logo=gmail" alt="Email">
</a>
