import Plausible from "plausible-tracker";

const domain = "czechibank.ostrava.digital";
const apiHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || "https://plausible.ff0000.cz";

// Initialize Plausible tracker with domain from environment variables
const plausible = Plausible({
  domain,
  trackLocalhost: process.env.NODE_ENV !== "production",
  apiHost,
});

// Export the main tracking functions
export const { trackEvent, trackPageview } = plausible;

/**
 * Track API endpoint calls
 * This implementation handles server-side tracking
 *
 * @param path - API endpoint path
 * @param method - HTTP method (GET, POST, etc.)
 * @param status - HTTP status code
 * @param duration - Request duration in milliseconds
 */
export async function trackApiCall(
  path: string,
  method: string,
  status: number,
  duration?: number,
  userAgent?: string,
) {
  // Create a serialized object for Plausible tracking
  const eventData = {
    name: "api_call",
    url: `https://${domain}${path}`,
    domain,
    props: {
      path,
      method,
      status: status.toString(),
      ...(duration !== undefined && { duration: duration.toString() }),
    },
  };

  // In a server environment, we need to make a direct fetch to Plausible
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "test" || !domain) {
      return Promise.resolve();
    }
    // Make a direct API call to Plausible
    return await fetch(`https://plausible.ff0000.cz/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent || "node-fetch/1.0",
        "X-Forwarded-For": "127.0.0.1",
        "X-Debug-Request": "true",
      },
      body: JSON.stringify(eventData),
    })
      .then(async (res) => {
        return res;
      })
      .catch((error) => {
        console.error("[Plausible] Error tracking API call to Plausible:", error);
        return Promise.resolve(); // Don't let tracking errors affect the application
      });
  }
}

export function getApiEndpointName(path: string): string {
  return path;
}
