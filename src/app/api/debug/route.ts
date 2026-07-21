import { NextResponse } from "next/server";

export async function GET() {
  const envDebug = process.env.ENABLE_ENV_DEBUG === "true";

  if (!envDebug) {
    return NextResponse.json(
      { error: "Debug endpoint is disabled. Set ENABLE_ENV_DEBUG=true in your environment to enable it." },
      { status: 403 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    supabaseUrlPresent: Boolean(supabaseUrl),
    supabaseAnonKeyPresent: Boolean(supabaseAnonKey),
    serviceRoleKeyPresent: Boolean(serviceRoleKey),
    nodeEnv: process.env.NODE_ENV,
  });
}
