import type { DomainName } from "./manifest";
import type { SharedApp } from "./types";

/**
 * A self-contained business (or auth) domain. A domain owns its own routes
 * and internal implementation details (oRPC, better-auth, or otherwise) and
 * is responsible only for mounting itself onto the shared app it is given.
 *
 * It must not assume how it is being run (local dev vs. per-domain Lambda),
 * and it must not reach into deployment concerns (API Gateway, SST, etc.).
 */
export interface DomainDefinition {
  /** Must match a key in `DOMAIN_MANIFEST` — keeps app code and infra in sync. */
  name: DomainName;
  /** Mounts this domain's routes onto the shared app. */
  register: (app: SharedApp) => void;
}

/** Identity helper that gives domain definitions a consistent, typed shape. */
export function defineDomain(definition: DomainDefinition): DomainDefinition {
  return definition;
}
