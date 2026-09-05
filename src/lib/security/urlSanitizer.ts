/**
 * URL Sanitization and Validation Utilities
 * Defends against Stored DOM XSS (javascript:, data:, vbscript:) and Open Redirects.
 */

const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

/**
 * Sanitizes a URL for safe usage in href / src attributes.
 * Returns '#' if the URL contains dangerous protocols or malformed syntax.
 */
export function sanitizeUrl(rawUrl: string | undefined | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '#';
  }

  const trimmed = rawUrl.trim();

  // Allow relative URLs starting with / (internal navigation)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Allow anchor links
  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  // Check for dangerous protocol strings (case-insensitive and whitespace-stripped)
  const normalized = trimmed.replace(/\s+/g, '').toLowerCase();
  for (const protocol of BLOCKED_PROTOCOLS) {
    if (normalized.startsWith(protocol)) {
      console.warn(`[Security Warning] Blocked malicious URL with protocol "${protocol}":`, trimmed);
      return '#';
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return parsed.toString();
    }
    return '#';
  } catch {
    // If it's a domain-only string like "grevix.org" or "github.com/..."
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return '#';
  }
}

/**
 * Validates whether an input URL is safe and valid for form submission.
 */
export function validateExternalUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmed = url.trim();
  const normalized = trimmed.replace(/\s+/g, '').toLowerCase();

  for (const protocol of BLOCKED_PROTOCOLS) {
    if (normalized.startsWith(protocol)) {
      return { isValid: false, error: `Protocol "${protocol}" is unsafe and prohibited.` };
    }
  }

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are permitted.' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Malformed URL format.' };
  }
}
