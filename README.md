# Liga da Tutti ⚽

Aplicativo web Full Stack para gestionar equipos, torneos, partidos y estadísticas de una liga de fútbol barrial. Trabajo práctico final de la materia **Plataformas de Desarrollo** (Escuela Da Vinci).

- **Backend**: Node.js + Express + MongoDB/Mongoose, JWT, autorización por roles — ver [`backend/README.md`](./backend/README.md).
- **Frontend**: React + Vite + Zustand + React Hook Form + Tailwind + React Router — ver [`frontend/README.md`](./frontend/README.md).

## Integrantes

- Juan Debandi

## Tabla de contenidos

- [Liga da Tutti ⚽](#liga-da-tutti-)
  - [Integrantes](#integrantes)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Levantar el proyecto con Docker (1 comando)](#levantar-el-proyecto-con-docker-1-comando)
  - [Levantar el proyecto sin Docker](#levantar-el-proyecto-sin-docker)
  - [Variables de entorno](#variables-de-entorno)
    - [Backend (`backend/.env`, ver `backend/.env.example`)](#backend-backendenv-ver-backendenvexample)
    - [Frontend (`frontend/.env`, ver `frontend/.env.example`)](#frontend-frontendenv-ver-frontendenvexample)
  - [Usuarios de prueba](#usuarios-de-prueba)
  - [Entidades y modelo de datos](#entidades-y-modelo-de-datos)
  - [Endpoints principales](#endpoints-principales)
  - [Capturas de pantalla](#capturas-de-pantalla)
  - [Deploy](#deploy)
  - [Arquitectura y decisiones de diseño](#arquitectura-y-decisiones-de-diseño)
  - [🔗 Links](#-links)

---

## Levantar el proyecto con Docker (1 comando)

Requiere [Docker](https://docs.docker.com/get-docker/) y Docker Compose v2.20+ (soporte de `include:`).

Desde esta carpeta (`liga_da_tutti/`):

```bash
docker compose up --build -d
```

Esto construye y levanta **los 4 contenedores** del proyecto (usando `include:` para componer los `docker-compose.yml` de `backend/` y `frontend/` en una sola red):

| Servicio        | Puerto (host) | Descripción                                    |
| --------------- | ------------- | ---------------------------------------------- |
| `mongo`         | `27017`       | Base de datos MongoDB, con volumen persistente |
| `mongo-express` | `8081`        | Interfaz web de inspección de la base          |
| `backend`       | `4000`        | API REST (Express)                             |
| `frontend`      | `5173`        | SPA de React, servida con nginx                |

Poblar datos de ejemplo (una sola vez, dentro del contenedor del backend):

```bash
docker compose exec backend npm run seed
```

Luego abrir [http://localhost:5173](http://localhost:5173) e iniciar sesión con cualquiera de los [usuarios de prueba](#usuarios-de-prueba).

Para detener todo: `docker compose down` (agregar `-v` solo si se quiere borrar también los volúmenes con los datos).

Para levantar únicamente un servicio (por ejemplo, solo el backend con su base) se puede usar el `docker-compose.yml` propio de cada subcarpeta (`backend/`, `frontend/`) de forma independiente — ver el README de cada una para el detalle.

## Levantar el proyecto sin Docker

Requiere Node.js 18+, [pnpm](https://pnpm.io/) y una instancia de MongoDB accesible (local o remota).

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env      # completar MONGO_URI si no se usa el docker-compose de mongo
npm run seed                # datos de ejemplo
npm run dev                  # http://localhost:4000

# 2. Frontend (en otra terminal)
cd frontend
pnpm install
cp .env.example .env
pnpm dev                     # http://localhost:5173
```

Ver el detalle completo (incluyendo cómo levantar solo MongoDB con Docker si no se quiere instalar localmente) en [`backend/README.md`](./backend/README.md) y [`frontend/README.md`](./frontend/README.md).

## Variables de entorno

### Backend (`backend/.env`, ver `backend/.env.example`)

| Variable         | Descripción                                                            | Default (Docker)                                                              |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `PORT`           | Puerto del servidor Express                                            | `4000`                                                                        |
| `MONGO_URI`      | Cadena de conexión a MongoDB (usuario/contraseña + `authSource=admin`) | `mongodb://liga:liga_dev_password@mongo:27017/liga_da_tutti?authSource=admin` |
| `JWT_SECRET`     | Secreto para firmar/verificar los JWT — **cambiar en producción**      | `liga-da-tutti-dev-secret-change-me`                                          |
| `JWT_EXPIRES_IN` | Expiración de los JWT                                                  | `1d`                                                                          |
| `CORS_ORIGIN`    | Origen permitido por CORS (URL del frontend)                           | `http://localhost:5173`                                                       |

### Frontend (`frontend/.env`, ver `frontend/.env.example`)

| Variable       | Descripción                                                     | Default                     |
| -------------- | --------------------------------------------------------------- | --------------------------- |
| `VITE_API_URL` | URL base de la API (con prefijo `/api`), resuelta en build time | `http://localhost:4000/api` |

## Usuarios de prueba

Creados por `npm run seed` (o `docker compose exec backend npm run seed`):

| Email          | Contraseña | Rol      |
| -------------- | ---------- | -------- |
| admin@liga.com | admin123   | `admin`  |
| juan@liga.com  | juan123    | `common` |
| maria@liga.com | maria123   | `common` |

También se puede registrar una cuenta nueva desde `/register` (queda con rol `common`).

## Entidades y modelo de datos

Cuatro entidades relacionadas, modeladas con Mongoose:

- **User**: `email`, `password` (hash bcrypt), `name`, `role` (`admin` | `common`).
- **Team**: `name`, `dt`, `logoUrl` (imagen subida vía `multer`, opcional), `createdBy` → `User`.
- **Tournament**: `name`, `createdBy` → `User`.
- **Match**: `localTeam`/`visitorTeam` → `Team`, `tournament` → `Tournament` (opcional, ausencia = amistoso), `date`, `stadium`, `status`, `localGoals`/`visitorGoals`, `goals[]`/`cards[]` (subdocumentos de goleadores y tarjetas por jugador), `createdBy` → `User`.

## Endpoints principales

Ver el detalle completo (incluyendo permisos por endpoint) en [`backend/README.md`](./backend/README.md#endpoints). Resumen:

| Recurso      | Rutas                                                                 | Autenticación                                                      |
| ------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Auth         | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Login/registro públicos                                            |
| Equipos      | CRUD en `/api/teams`                                                  | Alta: cualquier autenticado · Edición: dueño o admin · Baja: admin |
| Torneos      | CRUD en `/api/tournaments`                                            | Mismo criterio que Equipos                                         |
| Partidos     | CRUD en `/api/matches`                                                | Alta: cualquier autenticado · Edición/baja: dueño o admin          |
| Estadísticas | `GET /api/stats`                                                      | Admin: global o cualquier torneo · Common: solo torneos propios    |

## Capturas de pantalla

Ver [`frontend/README.md`](./frontend/README.md#capturas-de-pantalla).

## Deploy

- Frontend: `<link a Vercel>`
- Backend: `<link a Render/Railway>` (conectado a MongoDB Atlas o docker)

## Arquitectura y decisiones de diseño

- **Backend**: arquitectura en capas (`config`, `controllers`, `models`, `routes`, `middleware`, `schemas`), validación de payloads con `zod`, manejo de errores centralizado (`middleware/errorHandler.js`), autorización en dos niveles (rol + ownership por recurso).
- **Frontend**: screaming architecture por feature de negocio (`app`, `features/*`, `shared`, `infrastructure`), estado global con Zustand, formularios con React Hook Form.
- **Docker**: cada subproyecto (`backend/`, `frontend/`) tiene su propio `Dockerfile` y `docker-compose.yml` (se puede levantar de forma independiente); el `docker-compose.yml` de esta carpeta los combina con `include:` para levantar todo el stack con un solo comando, sin duplicar definiciones.

Ver el detalle completo en cada README de subproyecto.

## 🔗 Links

<a href="https://www.linkedin.com/in/juandebandi/"><img alt="LinkedIn" title="LinkedIn" src="https://custom-icon-badges.demolab.com/badge/-LinkedIn-231b2e?style=for-the-badge&logoColor=F8D866&logo=LinkedIn"/></a>
<a href="https://juandebandi.dev/"><img alt="Portfolio" title="Portfolio" src="https://custom-icon-badges.demolab.com/badge/-|Portfolio-1F222E?style=for-the-badge&logoColor=F8D866&logo=link-external"/></a>
<a href="mailto:juudinidev@gmail.com">
<img src="https://custom-icon-badges.demolab.com/badge/-Email-231b2e?style=for-the-badge&logoColor=F8D866&logo=gmail" alt="Email">
</a>
