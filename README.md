# Morchelapp (develop)

Frontend de administración del sistema de reconocimiento de hongos. Esta rama contiene la versión de desarrollo lista para pruebas e integración.

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+ (incluido con Node)
- Backend corriendo (API) en `http://localhost:5000`

## Configuración inicial

Instalar dependencias:

```sh
npm install
```

## Ejecutar en desarrollo

```sh
npm run dev
```

La app quedará disponible en la URL que indique la consola (por defecto `http://localhost:5173`).

## Construcción para producción

```sh
npm run build
```

## Vista previa de producción

```sh
npm run preview
```

## Notas

- El frontend consume la API mediante el proxy de Vite (`/api/*` → `http://localhost:5000/*`).
- Si el backend usa otra URL/puerto, ajusta la configuración en `vite.config.js`.
