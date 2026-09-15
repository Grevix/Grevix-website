/**
 * supabaseService.js
 * Server-side Supabase integration using the SERVICE ROLE KEY.
 * This key has full bypass of Row Level Security — NEVER expose it to the client.
 * All tables have RLS enabled with "No public access" policies,
 * so only this server-side service (with service role key) can read/write data.
 */

// Automatically load .env file if present
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of envLines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch (e) {}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahpvlurewprpqbopfyrt.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

// Initialize Supabase admin client (service role — bypasses RLS)
let supabase = null;

function getSupabaseAdmin() {
  if (!supabase) {
    if (!SUPABASE_SERVICE_KEY) {
      console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY not set — using URL only.');
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return supabase;
}

// ─────────────────────────────────────────────
// JOIN APPLICATIONS — store "interested in joining" submissions
// ─────────────────────────────────────────────

/**
 * Save a join application to Supabase.
 * Table: join_applications (id, email, github, interest, status, ip, submitted_at)
 * @returns {Promise<{success: boolean, isDuplicate: boolean, field?: string}>}
 */
async function saveJoinApplication({ email, github, interest, ip }) {
  const sb = getSupabaseAdmin();
  try {
    const { error } = await sb.from('join_applications').insert([{
      email: email.trim().toLowerCase(),
      github: github.trim(),
      interest: interest.trim(),
      status: 'Received',
      ip: ip || null
    }]);

    if (error) {
      // Unique constraint violation = duplicate
      if (error.code === '23505') {
        const field = error.message.includes('github') ? 'github' : 'email';
        return { success: false, isDuplicate: true, field };
      }
      console.error('[Supabase] saveJoinApplication error:', error.message);
      return { success: false, isDuplicate: false, error: error.message };
    }

    return { success: true, isDuplicate: false };
  } catch (err) {
    console.error('[Supabase] saveJoinApplication exception:', err.message);
    return { success: false, isDuplicate: false, error: err.message };
  }
}

// ─────────────────────────────────────────────
// AMBASSADOR PROOF SUBMISSIONS — store proof image + metadata
// ─────────────────────────────────────────────

/**
 * Upload a proof screenshot to Supabase Storage (private bucket: ambassador-proofs).
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} ambassadorCode - e.g. GRVX001
 * @param {string} filename - original filename
 * @param {string} mimeType - e.g. image/png
 * @returns {Promise<{success: boolean, path?: string, url?: string, error?: string}>}
 */
async function uploadProofScreenshot(fileBuffer, ambassadorCode, filename, mimeType) {
  const sb = getSupabaseAdmin();
  try {
    const safeCode = (ambassadorCode || 'UNKNOWN').replace(/[^A-Za-z0-9]/g, '');
    const ts = Date.now();
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const storagePath = `proofs/${safeCode}/${ts}_${safeFilename}`;

    const { error } = await sb.storage
      .from('ambassador-proofs')
      .upload(storagePath, fileBuffer, {
        contentType: mimeType || 'image/png',
        upsert: false
      });

    if (error) {
      console.error('[Supabase] uploadProofScreenshot error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, path: storagePath };
  } catch (err) {
    console.error('[Supabase] uploadProofScreenshot exception:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Save ambassador proof submission metadata to Supabase.
 * Table: ambassador_proof_submissions (id, ambassador_code, screenshot_path, message, ip, submitted_at)
 */
async function saveProofSubmission({ ambassadorCode, screenshotPath, message, ip }) {
  const sb = getSupabaseAdmin();
  try {
    const { error } = await sb.from('ambassador_proof_submissions').insert([{
      ambassador_code: (ambassadorCode || '').toUpperCase().trim(),
      screenshot_path: screenshotPath || null,
      message: (message || '').trim() || null,
      ip: ip || null
    }]);

    if (error) {
      console.error('[Supabase] saveProofSubmission error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Supabase] saveProofSubmission exception:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get all ambassador proof submissions (admin only).
 */
async function getAllProofSubmissions() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('ambassador_proof_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Get all join applications (admin only).
 */
async function getAllJoinApplications() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('join_applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Save an ambassador code registration to Supabase table: ambassadors
 */
async function saveAmbassador({ code, name, email, ip }) {
  const sb = getSupabaseAdmin();
  try {
    const { data, error } = await sb.from('ambassadors').insert([{
      code: code.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ip: ip || null
    }]).select();

    if (error) {
      console.error('[Supabase] saveAmbassador error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] saveAmbassador exception:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Check if ambassador email is already in Supabase
 */
async function getAmbassadorByEmail(email) {
  const sb = getSupabaseAdmin();
  try {
    const { data, error } = await sb
      .from('ambassadors')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Get all registered ambassadors from Supabase (admin only)
 */
async function getAllAmbassadorsFromSupabase() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('ambassadors')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

module.exports = {
  saveJoinApplication,
  uploadProofScreenshot,
  saveProofSubmission,
  getAllProofSubmissions,
  getAllJoinApplications,
  saveAmbassador,
  getAmbassadorByEmail,
  getAllAmbassadorsFromSupabase
};
