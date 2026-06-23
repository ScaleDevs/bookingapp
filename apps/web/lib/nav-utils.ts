export function isNavLinkActive(pathname: string, href: string) {
  if (!href || href === "#") return false

  const path = pathname.replace(/\/$/, "") || "/"
  const link = href.replace(/\/$/, "") || "/"

  if (link === "/dashboard") {
    return path === "/dashboard"
  }

  return path === link || path.startsWith(`${link}/`)
}
