export const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000";

export const getBaseApiUrl = () => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
        return "";
    }

    return baseApiUrl;
};