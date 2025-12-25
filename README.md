# Rise Stock

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-orange?logo=buymeacoffee)](https://buymeacoffee.com/iangelmanuel)

Aplicación web para gestión de inventario, ventas y usuarios construida con Next.js 16 (App Router), React 19, TypeScript, Prisma 7 y Tailwind CSS 4.

## Características

- Autenticación con NextAuth (credenciales) y protección de rutas (grupos auth/no-auth).
- Gestión de inventario de prendas (colecciones, variantes por talla, imágenes con Cloudinary).
- Gestión de ventas con estados personalizados: Pending, Cooking, Ready, Sending, Pending Payment, Completed, Cancelled, Paused.
- UI moderna con componentes Radix UI y patrones shadcn.
- Base de datos PostgreSQL con Prisma 7, migraciones versionadas y seeding. Prisma usa `@prisma/adapter-pg` y el cliente se genera en `generated/prisma/client`.
- Validaciones con Zod v4 utilizando `z.uuid()` para los identificadores y reglas estrictas por dominio.

## Versiones clave

- Next.js: 16.1.1
- React / React DOM: 19.2.3
- Prisma: 7.2.0 (con `@prisma/adapter-pg`)
- Zod: 4.2.1
- NextAuth: 5.0.0-beta.28

## Requisitos

- Node.js 20+
- pnpm 9+
- PostgreSQL (variable `DATABASE_URL`)
- Credenciales de Cloudinary (si usas subida de imágenes)

## Configuración del entorno

1. Clona el repositorio:
   ```bash
   git clone https://github.com/iangelmanuel/rise-stock.git
   cd rise-stock
   ```
2. Instala dependencias:
   ```bash
   pnpm install
   ```
3. Variables de entorno: crea un archivo `.env.local` en la raíz con al menos:

   ```env
   # Base de datos
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"

   # NextAuth (usa al menos una de estas según tu configuración)
   NEXTAUTH_SECRET="cambia-esta-clave"
   NEXTAUTH_URL="http://localhost:3000"
   # Alternativas usadas en NextAuth v5
   AUTH_SECRET="cambia-esta-clave"
   AUTH_URL="http://localhost:3000"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""
   ```

4. Aplica migraciones y genera cliente Prisma (Prisma 7):
   ```bash
   pnpm prisma migrate deploy
   pnpm prisma generate
   ```
5. Sembrar datos (opcional):
   ```bash
   pnpm seed
   ```
6. Levanta el entorno de desarrollo:
   ```bash
   pnpm dev
   ```

## Scripts disponibles

- `pnpm dev`: servidor de desarrollo Next.js (Turbopack).
- `pnpm build`: compila la app para producción.
- `pnpm start`: ejecuta la app compilada.
- `pnpm lint`: lint con ESLint.
- `pnpm prettier`: formatea con Prettier.
- `pnpm prettier:check`: comprueba formateo.
- `pnpm seed`: ejecuta `prisma/seed.ts`.

## Estructura del proyecto

- `app/`: rutas App Router (secciones `auth` y `no-auth`).
- `src/`: acciones del dominio, componentes, hooks, validaciones (Zod), utilidades.
- `prisma/`: `schema.prisma`, migraciones y semillas.
- `public/`: assets estáticos.

## Desarrollo

- Asegúrate de que `DATABASE_URL` apunta a una base PostgreSQL accesible.
- Si cambias el esquema Prisma, crea una migración:
  ```bash
  pnpm prisma migrate dev --name descripcion-cambio
  ```
- Tailwind v4 y PostCSS ya están configurados.

## Despliegue

- Compatible con plataformas que soporten Next.js 16 (Vercel, Docker, etc.).
- Configura las variables de entorno del apartado de configuración y ejecuta `pnpm build`.

## Contribuir

Lee `CONTRIBUTING.md` para guías de estilo, flujo de trabajo y normas.

## Apoya el proyecto

Si este proyecto te es útil, puedes invitarme a un café:

- Buy Me a Coffee: https://buymeacoffee.com/iangelmanuel

## Seguridad

Si encuentras un problema de seguridad, revisa `SECURITY.md` para el proceso de reporte responsable.

- Vulnerabilidad previa en React/Next solventada mediante actualización a las versiones indicadas en este README.

## Licencia

Este proyecto está licenciado bajo PolyForm Noncommercial 1.0.0. Permitido para desarrollo y aprendizaje, prohibido uso comercial. Consulta `LICENSE` para más detalles.
