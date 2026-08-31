import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { authDomain } from "./index";

export const handler = createDomainLambdaHandler(authDomain);
