# Web

The Next.js frontend for the Sports Club booking platform. It serves the public site and operator dashboard (offerings, reservations, customers, blocked schedules, settings) and talks to `apps/api` over type-safe tRPC.

### Main Stack

- **Next.js** – React framework for optimal performance and developer experience.
- **SST** – For full-stack application deployment and serverless infrastructure management.
- **better-auth** – Authentication management (please add config as needed).
- **Zustand** – Modern, minimal state management library.
- **shadcn/ui** – UI component library for high-quality, customizable components.

---

## Getting Started

### Development

This project uses [pnpm](https://pnpm.io/) as the preferred package manager.

To start the local development server:

```bash
pnpm dev
```

This will run Next.js on your localhost.

---

### Production & Deployments

Deployments are managed using [SST](https://sst.dev/) for simplicity and scalability.

To deploy:

- The template uses a simple SST construct:

  ```ts
  new sst.aws.Nextjs("MyWeb");
  ```

- To deploy to your AWS environment, run:

  ```bash
  pnpm sst:deploy
  ```

---

## UI Components

shadcn/ui components are included. To add new components, you can run:

```bash
npx shadcn@latest add button
```

Components are placed in the `components` directory.

Usage example:

```tsx
import { Button } from "@/components/ui/button";
```

---

## Customization

Feel free to customize and extend this template for your specific booking application needs! For authentication and complex state, refer to the [better-auth](https://github.com/better-auth/better-auth) and [zustand](https://github.com/pmndrs/zustand) documentation.

---

## Important: Update `tsconfig.json` Paths

Whenever you clone this template for a new project, **be sure to update the path aliases in `tsconfig.json`** so they correctly point to your backend project.

By default, some `tsconfig.json` paths (like `@db`, `@services`, `@utils`) may reference a backend directory relative to the original repository structure:

```json
"paths": {
  "@db": ["../base-reservation-be/src/db/index.ts"],
  "@db/*": ["../base-reservation-be/src/db/*"],
  "@services/*": ["../base-reservation-be/src/services/*"],
  "@utils/*": ["../base-reservation-be/src/utils/*"]
}
```

> **After cloning the template, update these so they reflect your backend's actual location in your new project.**  
> If these aren't updated, your code will fail to compile or import backend modules properly.

---
