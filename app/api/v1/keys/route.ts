import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import {
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
  CreateApiKeyRequest
} from '@/lib/api-keys';

/**
 * GET /api/v1/keys - Get user's API keys
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's API keys
    const apiKeys = await getUserApiKeys(user.id);

    // Remove key_hash from response for security
    const sanitizedKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      last_used: key.last_used,
      expires_at: key.expires_at,
      is_active: key.is_active,
      created_at: key.created_at,
      updated_at: key.updated_at
    }));

    return NextResponse.json({
      keys: sanitizedKeys,
      total: sanitizedKeys.length
    });

  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/keys - Create new API key
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateApiKeyRequest = await request.json();

    // Validate request
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      );
    }

    if (body.name.length > 100) {
      return NextResponse.json(
        { error: 'API key name must be less than 100 characters' },
        { status: 400 }
      );
    }

    // Check user's current API key limit
    const existingKeys = await getUserApiKeys(user.id);
    const activeKeys = existingKeys.filter(key => key.is_active);

    // Basic limits (could be made more sophisticated based on subscription)
    if (activeKeys.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum number of API keys reached (5 per user)' },
        { status: 429 }
      );
    }

    // Create new API key
    const newKey = await createApiKey(user.id, {
      name: body.name.trim(),
      expires_at: body.expires_at || null
    });

    return NextResponse.json({
      success: true,
      key: newKey
    }, { status: 201 });

  } catch (error) {
    console.error('Create API key error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/keys - Delete API key (keyId in request body)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    if (!body.keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // Delete API key
    await deleteApiKey(user.id, body.keyId);

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    });

  } catch (error) {
    console.error('Delete API key error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}