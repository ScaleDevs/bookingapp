import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { organizationDomain } from "./index";

export const handler = createDomainLambdaHandler(organizationDomain);
