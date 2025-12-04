import { createClient } from '@supabase/supabase-js';

/**
 * 서버 측에서 사용하는 Supabase 클라이언트
 * Service Role Key를 사용하여 서버 측 작업 수행
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default createServiceClient;