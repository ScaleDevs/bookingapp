import "../../utils/env";
import { createDomainLambdaHandler } from "../../architecture/lambda";
import { bookingDomain } from "./index";

export const handler = createDomainLambdaHandler(bookingDomain);
