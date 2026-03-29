export function getBaseUrl(request: Request) {
    const forwardedProto =
        request.headers.get("x-forwarded-proto")
    const forwardedHost =
        request.headers.get("x-forwarded-host")

    if (forwardedProto && forwardedHost) {
        return `${forwardedProto}://${forwardedHost}`
    }

    const host = request.headers.get("host")
    if (host) {
        return `${request.url.startsWith("https") ? "https" : "http"}://${host}`
    }

    return new URL(request.url).origin
}