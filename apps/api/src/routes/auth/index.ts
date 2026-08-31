import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { auth } from "../../utils/auth";

const { basePath } = DOMAIN_MANIFEST.auth;

export const authDomain = defineDomain({
  name: "auth",
  register(app) {
    app.on(["POST", "GET"], `${basePath}/*`, (c) => auth.handler(c.req.raw));
  },
});
