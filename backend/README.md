# Liga da Tutti — Backend

API REST para la gestión de una liga de fútbol barrial: usuarios, equipos, torneos, partidos (con goleadores y tarjetas) y estadísticas. Construida Express y MongoDB/Mongoose, con autenticación JWT y autorización por roles.

## Stack tecnológico

- Node.js (ESM, `"type": "module"`) + Express 5
- MongoDB + Mongoose 9
- JWT (`jsonwebtoken`) para autenticación
- `bcrypt` para hash de contraseñas
- `zod` para validación de payloads de entrada
- `multer` para la subida de logos de equipos
- Docker / Docker Compose (backend, MongoDB y mongo-express)

## Entidades y relaciones

- **User**: `email`, `password` (hasheada), `name`, `role` (`admin` | `common`).
- **Team**: `name`, `dt` (director técnico), `logoUrl` (imagen subida, opcional), `createdBy` (`User`).
- **Tournament**: `name`, `createdBy` (`User`).
- **Match**: `localTeam`/`visitorTeam` (`Team`), `tournament` (`Tournament`, opcional — sin torneo es "amistoso"), `date`, `stadium`, `status` (`programado`|`finalizado`|`cancelado`), `localGoals`/`visitorGoals`, `goals[]`/`cards[]` (subdocumentos con goleador/tarjeta por jugador), `createdBy` (`User`).

## Instalación

```bash
git clone <url-del-repositorio>
cd liga_da_tutti/backend
npm install
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar los valores:

```bash
cp .env.example .env
```

| Variable         | Descripción                                                                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`           | Puerto en el que escucha el servidor Express. Por defecto `4000`.                                                                                                                                                      |
| `MONGO_URI`      | Cadena de conexión a MongoDB. Debe incluir usuario/contraseña (`liga`/`liga_dev_password`, mismos valores que `docker-compose.yml`) y `authSource=admin`, porque el usuario se crea contra la base `admin` de MongoDB. |
| `JWT_SECRET`     | Secreto usado para firmar y verificar los JWT emitidos en el login. Cambiar por un valor propio y no versionarlo en producción.                                                                                        |
| `JWT_EXPIRES_IN` | Tiempo de expiración de los JWT (formato aceptado por `jsonwebtoken`, ej. `1d`, `12h`).                                                                                                                                |
| `CORS_ORIGIN`    | Origen permitido por CORS: la URL donde corre el frontend (por defecto `http://localhost:5173`, el puerto default de Vite).                                                                                            |

Si `MONGO_URI` o `JWT_SECRET` faltan, el servidor no arranca: falla rápido con un mensaje de error claro en consola.

## Levantar el proyecto

### Opción A — Con Docker (recomendado)

El `docker-compose.yml` de esta carpeta levanta **MongoDB + mongo-express + el propio backend**, todo dockerizado:

```bash
docker compose up --build -d
```

Esto levanta:

- **`mongo`** (imagen oficial `mongo:7`): expuesto en `localhost:27017`, con autenticación root (`liga` / `liga_dev_password`) y un volumen persistente (`mongo_data`).
- **`mongo-express`**: interfaz web de inspección visual de la base, en [http://localhost:8081](http://localhost:8081).
- **`backend`**: la API construida desde el `Dockerfile` local, expuesta en `localhost:4000`, con un volumen (`backend_uploads`) para persistir los logos de equipos subidos entre reinicios.

Poblar datos de ejemplo (dentro del contenedor, una sola vez):

```bash
docker compose exec backend npm run seed
```

Para detener los contenedores: `docker compose down` (agregar `-v` solo si se quiere borrar también los volúmenes con los datos).

> Si se levanta todo el proyecto (frontend + backend + base) con un solo comando, ver el `docker-compose.yml` de la raíz de `liga_da_tutti/` (`../README.md`).

### Opción B — Sin Docker

Requiere una instancia de MongoDB corriendo (local o remota) y `MONGO_URI` apuntando a ella.

```bash
npm run seed   # puebla datos de ejemplo

npm run dev    # desarrollo, reinicia automáticamente ante cambios (--watch)
npm start      # producción / ejecución simple
```

Por defecto el servidor escucha en `http://localhost:4000`.

## Poblar datos iniciales

```bash
npm run seed
```

Es **idempotente**: limpia por completo las colecciones `users`, `teams`, `tournaments` y `matches` antes de insertar los datos de ejemplo, así se puede correr cualquier cantidad de veces sin duplicar datos. Las contraseñas se guardan hasheadas con bcrypt.

Datos generados: 3 usuarios, 6 equipos (2 por cada usuario), 2 torneos (uno de `admin`, uno de `juan`) y 6 partidos (2 en un torneo, 1 en el otro, 3 amistosos sin torneo).

## Usuarios de prueba

| Email          | Contraseña | Rol      |
| -------------- | ---------- | -------- |
| admin@liga.com | admin123   | `admin`  |
| juan@liga.com  | juan123    | `common` |
| maria@liga.com | maria123   | `common` |

También se puede registrar un usuario nuevo (rol `common` fijo) vía `POST /api/auth/register`, ver más abajo.

## Autenticación y autorización

- **JWT**: `POST /api/auth/login` devuelve un token que debe enviarse en el header `Authorization: Bearer <token>` para las rutas protegidas.
- **Roles**: `admin` y `common`. Algunas rutas exigen un rol específico (`authorize("admin")`).
- **Ownership (dueño del recurso)**: para equipos, torneos y partidos, un usuario `common` solo puede editar/eliminar los recursos que **él mismo creó** (`createdBy === req.user.id`); `admin` tiene bypass total sobre cualquier recurso. Se implementa con middlewares dedicados por entidad: `ensureTeamOwnership`, `ensureTournamentOwnership`, `ensureMatchOwnership`, `ensureStatsAccess` — todos devuelven `403` si el usuario no es el dueño ni admin.

## Endpoints

Todas las routes están con el prefijo `/api`.

### Health

| Método | Ruta          | Auth | Descripción                            |
| ------ | ------------- | ---- | -------------------------------------- |
| GET    | `/api/health` | No   | Chequeo de disponibilidad del servicio |

### Autenticación

| Método | Ruta                 | Auth     | Descripción                                                                                            |
| ------ | -------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| POST   | `/api/auth/register` | No       | Registro de un usuario nuevo (email + contraseña), rol forzado a `common`. `409` si el email ya existe |
| POST   | `/api/auth/login`    | No       | Login con email/contraseña, devuelve JWT + datos públicos del usuario                                  |
| GET    | `/api/auth/me`       | Sí (JWT) | Datos del usuario autenticado asociado al token                                                        |

### Equipos

| Método | Ruta             | Auth | Permiso                       | Descripción                                                                    |
| ------ | ---------------- | ---- | ----------------------------- | ------------------------------------------------------------------------------ |
| GET    | `/api/teams`     | No   | —                             | Listado de equipos                                                             |
| GET    | `/api/teams/:id` | No   | —                             | Detalle de un equipo                                                           |
| POST   | `/api/teams`     | Sí   | cualquier usuario autenticado | Crear equipo (`multipart/form-data`, admite `logo` como archivo de imagen)     |
| PUT    | `/api/teams/:id` | Sí   | dueño del equipo o `admin`    | Editar equipo (admite reemplazar el logo; borra el archivo anterior del disco) |
| DELETE | `/api/teams/:id` | Sí   | `admin`                       | Eliminar equipo (borra también su logo del disco)                              |

### Torneos

| Método | Ruta                   | Auth | Permiso                       | Descripción          |
| ------ | ---------------------- | ---- | ----------------------------- | -------------------- |
| GET    | `/api/tournaments`     | No   | —                             | Listado de torneos   |
| GET    | `/api/tournaments/:id` | No   | —                             | Detalle de un torneo |
| POST   | `/api/tournaments`     | Sí   | cualquier usuario autenticado | Crear torneo         |
| PUT    | `/api/tournaments/:id` | Sí   | dueño del torneo o `admin`    | Editar torneo        |
| DELETE | `/api/tournaments/:id` | Sí   | `admin`                       | Eliminar torneo      |

### Partidos

| Método | Ruta               | Auth | Permiso                       | Descripción                                                                                                                                                                                                     |
| ------ | ------------------ | ---- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/matches`     | No   | —                             | Listado de partidos (equipos, torneo y creador poblados)                                                                                                                                                        |
| GET    | `/api/matches/:id` | No   | —                             | Detalle de un partido                                                                                                                                                                                           |
| POST   | `/api/matches`     | Sí   | cualquier usuario autenticado | Crear partido (`createdBy` = usuario autenticado; `tournament` opcional, ausencia = amistoso). Valida que la cantidad de goleadores por equipo en `goals[]` no supere el marcador (`localGoals`/`visitorGoals`) |
| PUT    | `/api/matches/:id` | Sí   | dueño del partido o `admin`   | Editar partido propio (misma validación de goleadores vs. marcador)                                                                                                                                             |
| DELETE | `/api/matches/:id` | Sí   | dueño del partido o `admin`   | Eliminar partido propio                                                                                                                                                                                         |

### Estadísticas

| Método | Ruta         | Auth | Permiso                                                                                | Descripción                                                                                                                                                                                                                                                                                                            |
| ------ | ------------ | ---- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/stats` | Sí   | `admin`: sin restricción · `common`: solo con `?tournamentId=<id>` de un torneo propio | Resumen (total de partidos, goles, tarjetas, promedio) + tabla de posiciones. `admin` puede pedirlo global (sin `tournamentId`, incluye amistosos y todos los torneos) o filtrado por cualquier torneo. `common` está obligado a pasar `tournamentId` (si no, `400`) de un torneo que **él mismo creó** (si no, `403`) |

## Subida de imágenes (logos de equipos)

`POST`/`PUT /api/teams` aceptan `multipart/form-data` con un campo `logo` (archivo). Se valida tipo (`image/*`) y tamaño en `middleware/upload.js`; los archivos se guardan en `uploads/teams/` y se exponen públicamente sin autenticación en `GET /uploads/teams/<archivo>` (son logos, no datos sensibles). Al reemplazar o eliminar un equipo, el archivo anterior se borra del disco.

## 🔗 Links

<a href="https://www.linkedin.com/in/juandebandi/"><img alt="LinkedIn" title="LinkedIn" src="https://custom-icon-badges.demolab.com/badge/-LinkedIn-231b2e?style=for-the-badge&logoColor=F8D866&logo=LinkedIn"/></a>
<a href="https://juandebandi.dev/"><img alt="Portfolio" title="Portfolio" src="https://custom-icon-badges.demolab.com/badge/-|Portfolio-1F222E?style=for-the-badge&logoColor=F8D866&logo=link-external"/></a>
<a href="mailto:juudinidev@gmail.com">
<img src="https://custom-icon-badges.demolab.com/badge/-Email-231b2e?style=for-the-badge&logoColor=F8D866&logo=gmail" alt="Email">
</a>