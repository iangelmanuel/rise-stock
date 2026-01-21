# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

## [0.2.1] - 2026-01-21

- Funcionalidad añadida para colocar mas imagenes por producto y que se suban a la nube correctamente.

## [0.2.0] - 2025-12-24

- Actualización de dependencias principales: Next.js 16.1.1, React/React DOM 19.2.3, Prisma 7.2.0 (con `@prisma/adapter-pg`), Zod 4.2.1 y NextAuth 5.0.0-beta.28.
- Migración a la configuración de Prisma 7 con adaptador PostgreSQL y cliente generado en `generated/prisma/client`.
- Validaciones ajustadas a Zod v4 usando `z.uuid()` para identificadores.
- Vulnerabilidad reportada en versiones previas de React/Next mitigada mediante actualización.
- Documentación revisada y alineada con el stack actual.

## [0.1.1] - 2025-10-28

- Añadidas de nuevas columnas en la base de datos.
  - Columna de `isActive` en la tabla de usuarios.
  - Columna de `discount` en la tabla de ventas.
- Implementación de migraciones para actualizar la base de datos.
- Implementación de la funcionalidad para evitar el ingreso de usuarios inactivos.
- Añadidas de funciones para formatear descuentos y totales en las ventas.
- Corrección de errores menores en la documentación.
- Correción de datos de totales y descuentos por venta.

## [0.1.0] - 2025-08-13

- Inicialización de documentación, licencias y CI.
