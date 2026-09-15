/**
 * supabaseService.js
 * Server-side Supabase integration using the SERVICE ROLE KEY.
 * This key has full bypass of Row Level Security — NEVER expose it to the client.
 * All tables have RLS enabled with "No public access" policies,
 * so only this server-side service (with service role key) can read/write data.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nmmqkcttoanoldculylr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbXFrY3R0b2Fub2xkY3VseWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTQ5NTE0MCwiZXhwIjoyMTA1MDcxMTQwfQ.N_Do4zjZ5Ri7_XdyWFF2SKuQbU3OLUEGJg4pw4V5Zd0';

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

module.exports = {
  saveJoinApplication,
  uploadProofScreenshot,
  saveProofSubmission,
  getAllProofSubmissions,
  getAllJoinApplications
};
