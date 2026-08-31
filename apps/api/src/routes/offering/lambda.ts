import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { offeringDomain } from "./index";

export const handler = createDomainLambdaHandler(offeringDomain);
