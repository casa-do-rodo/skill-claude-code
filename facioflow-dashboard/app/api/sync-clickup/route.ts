import { NextResponse } from "next/server";

export async function POST() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-clickup`;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return NextResponse.json(
      { success: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurado em .env.local" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
