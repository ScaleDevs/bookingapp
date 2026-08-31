import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { offeringScheduleDomain } from "./index";

export const handler = createDomainLambdaHandler(offeringScheduleDomain);
