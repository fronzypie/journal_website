import { NextResponse } from 'next/server'

export async function GET() {
  // This endpoint is intentionally restrictive. Enable temporarily by
  // setting ENABLE_ENV_DEBUG=true in the server environment (or .env.local)
  // and then call this route to check whether the service role key is present.
  if (process.env.ENABLE_ENV_DEBUG !== 'true') {
    return NextResponse.json({ error: 'Env debug disabled' }, { status: 403 })
  }

  const present = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  return NextResponse.json({ serviceRoleKeyPresent: present })
}
