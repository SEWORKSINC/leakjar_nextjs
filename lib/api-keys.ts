import { createClient } from '@/lib/supabase-server';
import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  encrypted_key?: string;
  encryption_iv?: string;
  encryption_tag?: string;
  last_used: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateApiKeyRequest {
  name: string;
  expires_at?: string; // Optional expiration date
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  key: string; // Raw key (only returned once)
  expires_at: string | null;
  created_at: string;
}

export interface ApiKeyUsage {
  requests_today: number;
  requests_month: number;
  rate_limit_per_minute: number;
}

// Encryption key from environment - ensure it's exactly 32 characters for AES-256
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_KEY || 'default-key-32-chars-long-pad!!';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

/**
 * Get 32-byte encryption key
 */
function getEncryptionKey(): Buffer {
  const key = Buffer.from(ENCRYPTION_KEY, 'utf8');

  // Ensure key is exactly 32 bytes
  if (key.length < 32) {
    // Pad with zeros if too short
    const paddedKey = Buffer.alloc(32);
    key.copy(paddedKey);
    return paddedKey;
  } else if (key.length > 32) {
    // Truncate if too long
    return key.slice(0, 32);
  }

  return key;
}

/**
 * Encrypt API key for storage
 */
function encryptApiKey(key: string): { encrypted: string; iv: string; tag: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, getEncryptionKey(), iv);

  let encrypted = cipher.update(key, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

/**
 * Decrypt API key for display
 */
function decryptApiKey(encrypted: string, iv: string, tag: string): string {
  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    getEncryptionKey(),
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generate a new API key with secure random string
 */
export function generateApiKey(): string {
  const prefix = 'lj_live_'; // lj_ for LeakJar
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  // Generate 32 random characters
  for (let i = 0; i < 32; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return prefix + randomString;
}

/**
 * Hash API key for secure storage
 */
export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/**
 * Verify API key format
 */
export function isValidApiKeyFormat(key: string): boolean {
  // Expected format: lj_live_32chars
  const apiKeyRegex = /^lj_live_[a-zA-Z0-9]{32}$/;
  return apiKeyRegex.test(key);
}

/**
 * Create a new API key for user
 */
export async function createApiKey(
  userId: string,
  request: CreateApiKeyRequest
): Promise<CreateApiKeyResponse> {
  const supabase = await createClient();

  // Generate API key
  const rawKey = generateApiKey();
  const keyHash = hashApiKey(rawKey);

  try {
    // Encrypt the API key for storage
    const { encrypted, iv, tag } = encryptApiKey(rawKey);

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        name: request.name,
        key_hash: keyHash,
        encrypted_key: encrypted,
        encryption_iv: iv,
        encryption_tag: tag,
        encryption_method: ENCRYPTION_ALGORITHM,
        expires_at: request.expires_at || null,
        is_active: true
      })
      .select('id, name, expires_at, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to create API key: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      key: rawKey, // Only return raw key once
      expires_at: data.expires_at,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Create API key error:', error);
    throw error;
  }
}

/**
 * Get user's API keys
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch API keys: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get API keys error:', error);
    throw error;
  }
}

/**
 * Delete an API key
 */
export async function deleteApiKey(userId: string, keyId: string): Promise<void> {
  const supabase = await createClient();

  try {
    // Ensure user owns the key before deleting
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('user_id', userId); // Security check

    if (error) {
      throw new Error(`Failed to delete API key: ${error.message}`);
    }
  } catch (error) {
    console.error('Delete API key error:', error);
    throw error;
  }
}

/**
 * Update last used timestamp for API key
 */
export async function updateApiKeyLastUsed(keyId: string): Promise<void> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('api_keys')
      .update({
        last_used: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', keyId);

    if (error) {
      // Don't throw error for last_used update as it's not critical
      console.warn('Failed to update last_used:', error.message);
    }
  } catch (error) {
    console.warn('Update last_used error:', error);
  }
}

/**
 * Find API key by hash
 */
export async function findApiKeyByHash(keyHash: string): Promise<ApiKey | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to find API key: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Find API key error:', error);
    return null;
  }
}

/**
 * Get decrypted API key by ID (for display purposes)
 * Note: This only works for keys created after encryption was implemented
 */
export async function getDecryptedApiKey(keyId: string): Promise<string | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('encrypted_key, encryption_iv, encryption_tag')
      .eq('id', keyId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Failed to fetch encrypted key:', error);
      return null;
    }

    // Check if key has encryption data
    if (!data.encrypted_key || !data.encryption_iv || !data.encryption_tag) {
      console.log('Key was created before encryption - cannot retrieve original key');
      return null;
    }

    return decryptApiKey(data.encrypted_key, data.encryption_iv, data.encryption_tag);
  } catch (error) {
    console.error('Decrypt API key error:', error);
    return null;
  }
}

/**
 * Get API usage statistics for user
 */
export async function getApiKeyUsage(userId: string): Promise<ApiKeyUsage> {
  const supabase = await createClient();

  try {
    // Get current billing period start and end
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get user's subscription plan for rate limits
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    // Get or create usage record for current month
    const { data: usageData } = await supabase
      .from('usage_history')
      .select('api_calls')
      .eq('user_id', userId)
      .eq('billing_period_start', startOfMonth.toISOString())
      .single();

    // Get today's API calls (approximate from recent audit logs)
    const { count: todayCount } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'api_call')
      .gte('created_at', startOfToday.toISOString());

    const todayApiCalls = todayCount || 0;
    const monthlyApiCalls = usageData?.api_calls || 0;

    // Rate limits based on user role/plan
    let rateLimit = 1000; // Default free tier
    if (profile?.role === 'ADMIN') {
      rateLimit = 10000;
    } else if (profile?.role === 'PRO') {
      rateLimit = 5000;
    }

    return {
      requests_today: todayApiCalls,
      requests_month: monthlyApiCalls,
      rate_limit_per_minute: rateLimit
    };
  } catch (error) {
    console.error('Get API usage error:', error);
    // Return default values on error
    return {
      requests_today: 0,
      requests_month: 0,
      rate_limit_per_minute: 1000
    };
  }
}