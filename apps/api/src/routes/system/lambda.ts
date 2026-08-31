import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { systemDomain } from "./index";

export const handler = createDomainLambdaHandler(systemDomain);
