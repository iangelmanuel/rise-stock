# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

### [0.3.1] - 2026-02-15

- Implementación de React Email para la plantilla de correo electrónico de contacto, mejorando la estructura y el estilo del correo.
- Corrección de errores menores en la plantilla de correo electrónico de contacto.
- Mejoras en la estructura y estilo del correo electrónico para una mejor legibilidad.
- Actualización de dependencias para mantener la seguridad y estabilidad del proyecto.
- Corrección de retorno de mensaje de la API de `error: ""` a `message: ""`.

### [0.3.0] - 2026-02-14

- Implementación de variable de entorno para el archivo `.env.template` para la clave de Resend.
- Instalación de Resend para el envío de correos electrónicos a través de la API de contacto.
- Sistema de correo cuando se recibe un mensaje a través de la API de contacto, utilizando Resend para enviar correos electrónicos con una plantilla personalizada.
- Template de correo electrónico creado para mostrar la información del mensaje recibido de manera clara y profesional.
- Actualización de dependencias y mejoras en la funcionalidad de la API de contacto.
- Cambio de importación del archivo de `route.ts` de products con "@/lib/prisma" a "@/lib/prisma.config" para reflejar la nueva estructura de Prisma 7.

## [Unreleased]

- Mejora en la validación de datos para la API de contact.
- Sincronización con la base de datos y ajustes en el esquema Prisma.
- Corrección de `schema.prisma` para reflejar cambios recientes en la base de datos.
- Adición de nueva funcionalidad para la API de contacto.

## [Unreleased]

- Corrección de errores menores en respuesta de la API de newsletter.

## [Unreleased]

- Retornar a una versión antigua de `Rechart` debido a problemas con la versión y compatibilidad del proyecto.

## [Unreleased]

- Consoles logs quitados de archivos de API y acciones.

## [0.2.2] - 2026-01-26

- Implementación de tablas y el schema principal de contacto y newsletter.
- Implementación de API de contacto y newsletter para la página principal.
- Corrección de actualización de Prisma 7 con su archivo de configuración `prisma.config.ts`.

## [Unreleased] - 2026-01-21

- Añadida de funcionalidad de la API para consultas en el E-Commerce (Rise Store).

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
