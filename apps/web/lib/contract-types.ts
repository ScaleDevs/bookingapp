import type {
  InferRouterContractInputs,
  InferRouterContractOutputs,
  RouterContract,
} from "@orpc/contract";
import type { JsonifiedValue } from "@orpc/openapi";

/** Jsonified procedure outputs matching the OpenAPI client return types. */
export type ContractOutputs<T extends RouterContract> = {
  [K in keyof InferRouterContractOutputs<T>]: JsonifiedValue<
    InferRouterContractOutputs<T>[K]
  >;
};

/** Procedure inputs as defined on the contract (not jsonified). */
export type ContractInputs<T extends RouterContract> =
  InferRouterContractInputs<T>;
