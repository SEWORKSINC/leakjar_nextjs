import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getDecryptedApiKey, getUserApiKeys } from '@/lib/api-keys';

/**
 * GET /api/v1/keys/[keyId]/decrypt - Get decrypted API key
 * This endpoint should be protected and only used for display purposes
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    // Await params as required by Next.js 15
    const { keyId } = await params;

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all user's API keys to verify ownership
    const userApiKeys = await getUserApiKeys(user.id);
    const keyExists = userApiKeys.some(key => key.id === keyId);

    if (!keyExists) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 404 }
      );
    }

    // Get decrypted key
    const decryptedKey = await getDecryptedApiKey(keyId);

    if (!decryptedKey) {
      return NextResponse.json(
        { error: 'Unable to decrypt API key' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      key: decryptedKey
    });

  } catch (error) {
    console.error('Decrypt API key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}