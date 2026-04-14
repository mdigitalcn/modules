# mdigitalcn modules

8+ headless business logic modules for the mdigitalcn ecosystem. Framework-agnostic model layer with optional React integration.

Not published to npm — consumed via the [mdigitalcn CLI](https://github.com/mdigitalcn/cli).

## Architecture

Each module follows a model/view split:

```
module/
  model/       # Types, constants, API clients, TanStack Query hooks
  view/        # React providers, guards, context
```

The `model/` layer has no React dependency and can be used in any TypeScript project. The `view/` layer provides React integration on top.

## Modules

| Module | Description |
|--------|-------------|
| `auth` | Authentication — login, register, session, JWT refresh, OAuth |
| `crm` | CRM — contacts, leads, deals, pipeline, activities |
| `ecommerce` | Ecommerce — catalog, cart, orders, payments, inventory |
| `messaging` | Messaging — threads, messages, real-time, notifications |
| `hrm` | HRM — employees, roles, leave, org chart |
| `settings` | App settings — profile, billing, team, API keys, preferences |
| `notifications` | Push and in-app notifications — read/unread, preferences |
| `analytics` | Analytics — events, sessions, funnels, reports |

## Add to your project

```bash
mdigitalcn module list
mdigitalcn module add auth
mdigitalcn module add crm ecommerce
mdigitalcn module info messaging
```

The CLI copies source files into your project and installs peer dependencies automatically.

## Peer dependencies

```json
{
  "@tanstack/react-query": "^5.0.0",
  "axios": "^1.0.0",
  "zod": "^3.0.0"
}
```

## Development

```bash
pnpm install
pnpm storybook
```

## License

MIT
