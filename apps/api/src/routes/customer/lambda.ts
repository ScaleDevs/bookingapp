import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { customerDomain } from "./index";

export const handler = createDomainLambdaHandler(customerDomain);
