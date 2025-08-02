import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()

  return NextResponse.json(
    {
      message: "pong",
      timestamp,
      server: "vercel",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString()

  return NextResponse.json(
    {
      message: "pong",
      timestamp,
      server: "vercel",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}
