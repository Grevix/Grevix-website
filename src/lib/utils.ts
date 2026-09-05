import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes URLs to prevent XSS and malicious protocol injection (e.g., javascript:, data:, vbscript:).
 * Only permits valid http:, https:, mailto: protocols, or safe relative internal paths.
 */
export function sanitizeUrl(url: string | null | undefined, fallback: string = '#'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Allow safe relative paths
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    return trimmed;
  }

  // Allow anchor links
  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, 'https://grevix.org');
    const protocol = parsed.protocol.toLowerCase();

    // Whitelist safe protocols
    if (['http:', 'https:', 'mailto:'].includes(protocol)) {
      // If relative URL was passed, return it as original string
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
        return trimmed;
      }
      return parsed.pathname + parsed.search + parsed.hash;
    }

    // Reject dangerous schemes like javascript:, data:, vbscript:, file:
    console.warn(`[Security] Blocked unsafe URL protocol: ${protocol}`);
    return fallback;
  } catch {
    return fallback;
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const target = new Date(isoString).getTime();
    if (isNaN(target)) return "Upcoming";

    const now = Date.now();
    const diffMs = target - now;

    if (diffMs <= 0) return "Concluded";

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays > 0) {
      const remHrs = diffHrs % 24;
      return `${diffDays}d ${remHrs}h left`;
    }
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m left`;
  } catch {
    return "Upcoming";
  }
}
