# LinkedIn Message Generator Server

Este es un servidor backend desarrollado con NestJS que genera mensajes personalizados para LinkedIn.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd linkedin-message-generator-server
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecución

Para desarrollo (con recarga automática):
```bash
npm run start:dev
```

Para producción:
```bash
npm run build
npm run start:prod
```

El servidor se ejecutará por defecto en `http://localhost:3000`

## Scripts Disponibles

- `npm run start:dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el proyecto
- `npm run start:prod`: Inicia el servidor en modo producción
- `npm run test`: Ejecuta los tests
- `npm run lint`: Ejecuta el linter
