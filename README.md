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
