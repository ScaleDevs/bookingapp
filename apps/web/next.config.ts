import type { NextConfig } from "next"
import { baseApiUrl } from "./lib/constant"

const nextConfig: NextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/api/:path*",
                    destination: baseApiUrl + "/api/:path*",
                },
            ];
        }
        return [];

    },
}


export default nextConfig
