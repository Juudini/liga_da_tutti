# Liga da Tutti ⚽

Aplicación web para gestionar los partidos y estadísticas de una liga de fútbol barrial.

## Integrantes

- Juan Debandi

## Descripción

Liga da Tutti es una plataforma de gestión deportiva para ligas de fútbol amateur. Permite a los organizadores cargar y administrar partidos, y al administrador visualizar estadísticas y la tabla de posiciones de la liga.

## Temática

Liga de fútbol barrial con equipos locales, fixture de partidos y tabla de posiciones.

## Usuarios y Roles

| Email            | Contraseña | Rol           |
| ---------------- | ---------- | ------------- |
| admin@liga.com   | admin123   | Administrador |
| juan@barrio.com  | juan123    | Organizador   |
| maria@barrio.com | maria123   | Organizador   |

- **Administrador:** accede al panel de control con estadísticas globales y tabla de posiciones.
- **Organizador (common):** accede al fixture, puede crear, editar, cancelar y eliminar los partidos que él mismo organizó.

## Instrucciones para levantar el proyecto

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor
pnpm dev
```

Requiere Node.js 18+ y pnpm.

## Funcionalidades principales

- Login y logout con validación de credenciales
- Rutas protegidas según autenticación y rol
- Fixture con filtros por estado (programados, finalizados, cancelados)
- Filtro "Solo mis partidos" para el organizador
- Crear, editar, cancelar y eliminar partidos (solo el creador)
- Detalle de partido con equipos, marcador y estadio
- Panel de admin con estadísticas globales y tabla de posiciones(solo puede visualizar estadisticas, ya que cada usuario es dueño de su partido)
- Datos persistidos en localStorage

## Captura de pantalla

### Login

![Login](/src/assets/screen_login.png)

### Admin Dashboard

![Admin Dashboard](/src/assets/screen_admin.png)

### Usuario - home

![Usuario - home](/src/assets/screen_common.png)

### Usuario - organizar

![Usuario - organizar](/src/assets/screen_organizer.png)

## Tecnologías

- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Context API + hooks
- Datos locales en JSON
