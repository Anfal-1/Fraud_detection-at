import { NextResponse } from "next/server"

export async function GET() {
  const timestamp = new Date().toISOString()

  return NextResponse.json(
    {
      status: "ok",
      timestamp,
      server: "tahseen-api",
      latency: Math.random() * 50 + 10, // Simulate server processing time
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}

export async function POST() {
  return GET() // Handle POST requests the same way
}
