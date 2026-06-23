import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"
import { getBaseApiUrl } from "./constant";

export const authClient = createAuthClient({
  baseURL: getBaseApiUrl(),
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    organizationClient(),
  ],
});