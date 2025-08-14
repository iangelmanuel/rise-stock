# Guía de Contribución

Gracias por tu interés en contribuir a Rise Stock.

## Flujo de trabajo

1. Crea un fork y una rama descriptiva: `feature/nombre-corto`.
2. Instala dependencias y configura `.env.local`.
3. Ejecuta `pnpm lint` y `pnpm prettier:check` antes de abrir el PR.
4. Asegúrate de que `pnpm build` pasa en local.
5. Abre un Pull Request siguiendo la plantilla.

## Estilo de código

- TypeScript estricto, hooks de React correctamente tipados.
- ESLint + Prettier obligatorios.
- Ordena imports con `@trivago/prettier-plugin-sort-imports`.

## Base de datos

- Cambios en el esquema Prisma requieren migración: `pnpm prisma migrate dev --name <cambio>`.
- Incluye notas en el PR sobre migraciones.

## Commits

- Prefiere Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `perf:`.

## Seguridad

- No incluyas secretos ni dumps de base de datos.
- Para vulnerabilidades, usa el proceso en `SECURITY.md`.
