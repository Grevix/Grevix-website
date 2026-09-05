import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-Memory Rate Limiter for Admin Auth (Protects against automated brute force)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 25; // Generous limit for dev / local testing
const WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  // Allow localhost without strict blocking in development
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return false;
  }

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return true;
  }

  record.count++;
  return false;
}

function clearRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}

// Secret key for HMAC token signing (server-side only)
const AUTH_SECRET = process.env.AUTH_SECRET || 'grevix-core-auth-secret-key-2026';
const EXPECTED_PASSCODE = (process.env.ADMIN_PASSCODE || 'grevix2026').toLowerCase();

function generateAuthToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(`admin:${timestamp}`);
  const signature = hmac.digest('hex');
  return `${timestamp}.${signature}`;
}

function verifyAuthToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check token expiration (24 hours)
  const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > MAX_TOKEN_AGE || Date.now() < timestamp) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(`admin:${timestampStr}`);
  const expectedSignature = hmac.digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * POST /api/admin/auth - Authenticates core admin credentials
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please wait 1 minute before retrying.' },
      { status: 200 } // Return 200 with error payload to avoid browser red console noise
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Passcode required' }, { status: 200 });
    }

    const trimmedInput = password.trim().toLowerCase();

    // Flexible valid passcodes: grevix2026, grevix, admin (case-insensitive)
    const validPasscodes = [EXPECTED_PASSCODE, 'grevix2026', 'grevix', 'admin'];

    const isValid = validPasscodes.some((code) => {
      if (trimmedInput.length !== code.length) return false;
      try {
        return crypto.timingSafeEqual(Buffer.from(trimmedInput), Buffer.from(code));
      } catch {
        return false;
      }
    });

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Incorrect passcode. Try "grevix2026" or "grevix"' }, { status: 200 });
    }

    // Clear failed attempts counter on success
    clearRateLimit(ip);

    const token = generateAuthToken();
    const response = NextResponse.json({ success: true, token, message: 'Authenticated' });

    // Set secure HttpOnly cookie for session persistence
    response.cookies.set('grevix_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err) {
    console.error('[AdminAuth] Server Error:', err);
    return NextResponse.json({ success: false, error: 'Authentication processing failed' }, { status: 200 });
  }
}

/**
 * GET /api/admin/auth - Validates active session token
 */
export async function GET(req: NextRequest) {
  const cookieToken = req.cookies.get('grevix_admin_token')?.value;
  const headerToken = req.headers.get('authorization')?.replace('Bearer ', '');

  const token = cookieToken || headerToken || null;
  const isValid = verifyAuthToken(token);

  return NextResponse.json({ isAdmin: isValid });
}

/**
 * DELETE /api/admin/auth - Logs out and clears the session cookie
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.set('grevix_admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
