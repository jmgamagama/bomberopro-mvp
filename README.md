# BomberoPro / MIRA

Aplicación de entrenamiento para oposiciones de bombero basada en práctica activa,
repetición espaciada y simulacros.

## Desarrollo local

Requisitos:

- Node.js 22
- npm

Instala las dependencias y arranca Vite:

```bash
npm ci
npm run dev
```

La interfaz puede ejecutarse en modo local sin credenciales para trabajar en
componentes, accesibilidad y pruebas.

## Despliegue con backend

Vercel usa `npm run build:deploy`, que exige `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY` antes de generar el frontend. Configúralas para cada
entorno que despliegues, incluidos los previews. Utiliza la clave pública anon
o publicable; nunca una clave secret/service_role en variables `VITE_*`.

La comprobación detecta valores ausentes, URLs incompatibles y claves de servidor
conocidas; no demuestra que las credenciales sean válidas ni que las migraciones,
RPC o autenticación funcionen. Verifica esos puntos con un smoke test conectado.
`npm run build` sigue disponible para compilar la interfaz local sin backend.

## Validación

Antes de abrir un pull request:

```bash
npm run lint
npm run build
npm run test
```

El workflow `Quality Gate` ejecuta las mismas comprobaciones en cada pull request y
en los pushes a `main`.

## Documentación

- [Estado del proyecto](docs/ESTADO_PROYECTO.md)
- [Decisiones de arquitectura](docs/architecture-decisions.md)
- [Contrato de integración con Supabase](docs/supabase-contract.md)
- [Integración del pipeline de preguntas](docs/pipeline-integration.md)
