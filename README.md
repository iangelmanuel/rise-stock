# Pasos para inicializar el proyecto

## 1. Instalar las dependencias

```bash
pnpm i
```

## 2. Revisar las variables de entorno que requiere el proyecto

- Crear un archivo `.env` en la raíz del proyecto y agregar las variables de entorno necesarias. Puedes usar el archivo `.env.template` como referencia.

## 3. Inicializar la configuración de prisma

```bash
pnpm dlx prisma generate
```

```bash
pnpm dlx prisma migrate dev --name init
```

```bash
pnpm dlx prisma db seed
```

## 4. Iniciar el servidor

```bash
pnpm dev
```
