# Satellite Monorepo

Building a second brain for next generation makers.

## Prerequisites

- Node.js >= 18
- [Bun](https://bun.sh) (latest version)

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Start development:

```bash
bun dev
```

3. Build all packages:

```bash
bun run build
```

## Workspace Structure

- `apps/backend` - Backend API server
- `apps/frontend` - Next.js frontend application
- `apps/extension` - Browser extension
- `apps/march-app` - Electron desktop application

## Development

Each workspace can be developed independently:

```bash
# Start frontend development
cd apps/frontend
bun dev

# Start backend development
cd apps/backend
bun dev

# Start electron app development
cd apps/march-app
bun dev
```

## Build

To build all packages:

```bash
bun run build
```

To build a specific package:

```bash
cd apps/<package>
bun run build
```
