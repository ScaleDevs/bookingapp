import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { blockedTimeDomain } from "./index";

export const handler = createDomainLambdaHandler(blockedTimeDomain);
