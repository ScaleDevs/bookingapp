import * as v from "valibot";

import { nullableStringSchema } from "../shared/schema";

export const organizationSchema = v.object({
  id: v.string(),
  name: v.string(),
  slug: v.string(),
  logo: nullableStringSchema,
});
